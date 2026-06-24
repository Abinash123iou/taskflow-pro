# API Design

Base URL

/api

---

## Get All Tasks

GET /tasks

Response

200 OK

[
  {
    "id":1,
    "title":"Task",
    "status":"Pending"
  }
]

---

## Create Task

POST /tasks

Request

{
  "title":"Build Dashboard",
  "description":"Create dashboard page using React",
  "status":"Pending"
}

Response

201 Created

{
  "message":"Task created successfully"
}

---

## Update Task Status

PUT /tasks/:id

Request

{
  "status":"Completed"
}

Response

200 OK

{
  "message":"Task updated successfully"
}

---

## Delete Task

DELETE /tasks/:id

Response

200 OK

{
  "message":"Task deleted successfully"
}