
1.  `POST /users/`: Create a new user.
    -   Request body: `{ "email": string }`
    -   Response body: `{ "_id": string, "email": string, "todos": [] }`
2.  `POST /users/login`: Log in a user.
    -   Request body: `{ "email": string }`
    -   Response:  `Email sent`
3.  `GET /users/:token/todos`: Get all todos for a user.
    -   Request parameters: `token` - JWT token for user authentication.
    -   Response body: `[{ "title": string, "description": string, "endDate": Date, "completed": boolean, "order": number, "_id": string }]`
4.  `POST /users/:token/todos`: Create a new todo for a user, sets timeout to send email before todo's end date  by 2h.
    -   Request parameters: `token` - JWT token for user authentication.
    -   Request body: `{ "todo": { "title": string, "description": string, "endDate": Date } }`
    -   Response body: `{ "_id": string, "name": string, "email": string, "password": string, "todos": [...] }`
5.  `PUT /users/:token/todos/:todoId`: Update a todo for a user.
    -   Request parameters: `token` - JWT token for user authentication, `todoId` - ID of the todo to update.
    -   Request body: `{ "todo": { "title": string, "description": string, "endDate": Date, "completed": boolean, "order": number } }`
    -   Response body: `{ "_id": string, "name": string, "email": string, "password": string, "todos": [...] }`
6.  `PUT /users/:token/todos/:todoId/toggle`: Toggle the completed status of a todo for a user.
    -   Request parameters: `token` - JWT token for user authentication, `todoId` - ID of the todo to toggle.
    -   Response body: `{ "_id": string, "name": string, "email": string, "password": string, "todos": [...] }`
7.  `DELETE /users/:token/todos/:todoId`: Delete a todo for a user.
    -   Request parameters: `token` - JWT token for user authentication, `todoId` - ID of the todo to delete.
    -   Response body: `{ "_id": string, "name": string, "email": string, "password": string, "todos": [...] }`
