const API = 'https://3sj4ujk124.execute-api.us-east-2.amazonaws.com/prod/notes';

async function loadNotes() {
try {
    const res = await fetch(API);
    const notes = await res.json();
    const list = document.getElementById('notes');
    list.innerHTML = '';
    notes.forEach(note => {
        const div = document.createElement('div');
        div.className = 'note';
        if(!note.FileURL) {
            div.innerHTML = `<b>${note.Title}</b>
            <p>${note.Content}</p>
            <button onclick="deleteNote('${note.NoteID}')">Delete</button>`;
            list.appendChild(div);
        }else {
        div.innerHTML = `<b>${note.Title}</b>
            <p>${note.Content}</p>
            <a href="${note.FileURL || '#'}" target="_blank">
                <img src="${note.FileURL || 'placeholder.png'}" alt="Note Image" style="max-width: 200px; max-height: 200px;">
            </a>
            <button onclick="deleteNote('${note.NoteID}')">Delete</button>`;
        list.appendChild(div);
        }
    });
} catch (err) {
    console.error("Error loading notes:", err);
}
}

async function deleteNote(id) {
try {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    await loadNotes();
} catch (err) {
    console.error("Error deleting note:", err);
}
}

document.getElementById('noteForm').onsubmit = async (e) => {
e.preventDefault();
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const fileInput = document.getElementById('file');

const title = titleInput.value;
const content = contentInput.value;
let fileContent = null, fileName = null;

if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    fileName = file.name;
    const reader = new FileReader();
    reader.onload = async () => {
    try {
        fileContent = reader.result.split(',')[1];
        await fetch(API, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content, fileName, fileContent })
        });
        titleInput.value = '';
        contentInput.value = '';
        fileInput.value = '';
        await loadNotes();
    } catch (err) {
        console.error("Error creating note with file:", err);
    }
    };
    reader.readAsDataURL(file);
} else {
    try {
    await fetch(API, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, content })
    });
    titleInput.value = '';
    contentInput.value = '';
    fileInput.value = '';
    await loadNotes();
    } catch (err) {
    console.error("Error creating note without file:", err);
    }
}
};

loadNotes();