# base-node-api-server
A starter project for creating a simple NodeJS API server. Uses express. 

This basic Node API server uses the Express framework to build out a basic rest API in a maintainable way. The 'backend' is mocked out using the Faker library.

Code Design:


REST Concepts:

Eash REST route corresponds with a Noun. For example: "cars". In this case the cars route would be:


| Method | Route        | Action                                          | Return Status        | Return Type          |
|--------|--------------|-------------------------------------------------|----------------------|----------------------|
| GET    | /v1/cars     | Retrieve list of cars                           | 200 OK               | Array                |
| GET    | /v1/cars/:id | Retrieve specific car matching id               | 200 OK               | Object               |
| POST   | /v1/cars     | Creates a new car                               | 201 Created          | Object (new car)     |
| PUT    | /v1/cars/:id | Updates car with matching id (replace)          | 200 OK / 201 Created | Object (updated car) |
| PATCH  | /v1/cars/:id | Partially updates car with matching id (modify) | 200 OK               | Object (updated car) |
| DELETE | /v1/cars/:id | Deletes car with matching id                    | 204 No Content       | N/A                  |

- 201 Created responses will also have the  location header set to point to where the new resource can be found.
- PUT requests may also create new resoures. In such a case the ID will be ignored and it will treated as a POST

We choose not to envelope our responses. Instead we should embrace headers for passing meta data such as pagination. 
For example we do not do this:

{
  "data" : {
    "id" : abcd,
    "name" : "Alex",
    "occupation" : "Developer"
  }
}

More Resources:
HTTP/1.1: https://tools.ietf.org/html/rfc7231#section-4.3
PATCH: https://tools.ietf.org/html/rfc5789

Defining Relationships:



Return types:

Errors:

{
  "code" : 1234,
  "message" : "Something bad happened :(",
  "description" : "More details about the error here"
}

{
  "code" : 1024,
  "message" : "Validation Failed",
  "errors" : [
    {
      "code" : 5432,
      "field" : "first_name",
      "message" : "First name cannot have fancy characters"
    },
    {
       "code" : 5622,
       "field" : "password",
       "message" : "Password cannot be blank"
    }
  ]
}


To Do: 
[] Basic CRUD on multiple resources. 
[] Input validation (security, types) -> express-validator
[] Unit Test
[] Deploy to Docker
[] Integrate with Travis for CI/CD to docker hub
[] JWT Authorization. Use third party OAuth as Authentication
[] Document API with Swagger / something else
[] Acess logging with morgan
[] Additional logging to files .... Winston?
[] Use import vs require
[] Compression, CORS, CSRF, Rate Limiting, SSL Only
[] Generate new resource via template?
[] .editorConfig
[] Mongo Backend via model changes (fork this)



Compression: https://www.npmjs.com/package/compression
CSRF: https://www.npmjs.com/package/csurf
