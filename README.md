# Cloud-Based Notes App

This is a simple cloud-based notes application built with AWS services (Lambda, API Gateway, DynamoDB, and S3) and a basic HTML/JS frontend.

## Technologies Used

- AWS Lambda (4 functions):
  - createNote (POST)
  - deleteNote (DELETE)
  - getNoteById (GET)
  - getNotes (GET)
- Amazon DynamoDB
  - Table: Notes
  - Stores: NoteID, Title, Content, CreatedAt, FileURL
- Amazon S3
  - Bucket: cloud-based-notes-app
  - Stores image files associated with notes
- API Gateway
  - REST API created with the resource: /notes
  - Methods: GET, POST, DELETE, GET {id}

## Setup Details

### 1. DynamoDB

- Table name: Notes
- Primary key: NoteID (string)
- Items created via createNote Lambda function

```json
Example item structure:
{
  "NoteID": "uuid",
  "Title": "Some title",
  "Content": "Note content",
  "CreatedAt": "timestamp",
  "FileURL": "https://.../image.jpg"
}
```

### 2. S3

- Bucket name: cloud-based-notes-app
- Stores uploaded images from the frontend
- Only image files are accepted and displayed via <img> in the UI
- Files are uploaded with:
  - Proper content-type (e.g., image/png)
  - ACL: public-read
  - Content-Disposition: inline

### 3. Lambda

Each function is written in Node.js using the AWS SDK.

- createNote: Uploads image to S3 and stores note in DynamoDB
- deleteNote: Deletes the note and image (if present)
- getNoteById: Returns one note
- getNotes: Returns all notes

CORS NOTE:  
I faced issues with CORS. Even after enabling CORS in API Gateway, it didn't work fully until I added this in every Lambda response:

headers: {
  "Access-Control-Allow-Origin": "*"
}

### 4. API Gateway

- Resource: /notes
- Methods: GET, POST, DELETE, GET /{id}
- All methods use Lambda proxy integration
- CORS was enabled manually in each method and required the header above to work correctly

## User Interaction

- The app uses an HTML frontend with embedded JavaScript (notes.js)
- Users can:
  - View notes with optional image thumbnails
  - Create notes with a title, content, and optional image
  - Delete notes

The form uses a file input restricted to image types:

<input type="file" id="file" accept="image/*" />

On submission:
- The image is read as Base64
- The content is sent via POST to the API Gateway endpoint
- The backend stores the note and image, and the frontend reloads the list

## IAM Notes

Ensure your Lambda execution role has the following permissions:

- S3:
  - s3:PutObject
  - s3:GetObject
  - s3:DeleteObject
- DynamoDB:
  - dynamodb:PutItem
  - dynamodb:GetItem
  - dynamodb:Scan
  - dynamodb:DeleteItem

## API Base URL

https://3sj4ujk124.execute-api.us-east-2.amazonaws.com/prod/notes

This endpoint serves all the GET, POST, and DELETE operations for notes.
