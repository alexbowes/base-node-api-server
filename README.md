# base-node-api-server
A starter project for creating a simple NodeJS API server. Uses express. 

Most 'starter' node api packages are extremely simple. They allow one to quickly get a REST resource up and running with little regard for code design, testing, maintainability, serviceability, or security. 

This basic Node API server aims to be a starter pack for developers with some understanding of Node already. It uses the Express framework to build out a basic rest API in a maintainable way. Logging, error handling, unit testing and integration testing are all built in. The 'backend' is mocked out using the [faker](https://www.npmjs.com/package/faker) library.

## Code Design:

- **Models** encapsulate the data. Each model exposes methods that allow retrieval and manipulation of data. Models are expected to return promises. Application exceptions and status codes are not exposed at this level. 
- **Controllers** expose the application logic for the models. Controller methods interact with request and response objects, perform validation, and return errors with correct status codes. Controllers should be able to be unit tested without creating a server. 
- **Routes** expose controller methods to API paths. Separating this from the controller logic allows for unit testing controllers directly without a server as well as more control over exposure of controller methods (good for Dark Code)
- **Errors** encapsulate HTML errors with associates status codes. This keeps all error handling consistent. 

## REST Concepts:

### Naming:
All routes should be a Noun. For consistency, any route that can return more than one object should be Plural. For example, 'cars', 'users', and 'transactions'.

### Versioning:
For simple apps, versioning can be done via a header. For apps that plan on exposing an API to a wider audience, major API versions should be specified by the URI path. For this, all routes are part of the v1 path.

[More Info](https://stackoverflow.com/questions/389169/best-practices-for-api-versioning)

### Defining route methods:

| Method | Route        | Action                                          | Return Status        | Return Type          |
|--------|--------------|-------------------------------------------------|----------------------|----------------------|
| GET    | /v1/cars     | Retrieve list of cars                           | 200 OK               | Array                |
| GET    | /v1/cars/:id | Retrieve specific car matching id               | 200 OK               | Object               |
| POST   | /v1/cars     | Creates a new car                               | 201 Created          | Object (new car)     |
| PUT    | /v1/cars/:id | Updates car with matching id (replace)          | 200 OK / 201 Created | Object (updated car) |
| PATCH  | /v1/cars/:id | Partially updates car with matching id (modify) | 200 OK               | Object (updated car) |
| DELETE | /v1/cars/:id | Deletes car with matching id                    | 204 No Content       | N/A                  |

201 Created responses will also have the location header set to point to where the new resource can be found.

Specifics: 
- HTTP/1.1: https://tools.ietf.org/html/rfc7231#section-4.3
- PATCH: https://tools.ietf.org/html/rfc5789

### Response enveloping:
For most API's, enveloping a response is not required. Returning the data directly is simpler and results in a smaller payload. More complicated cases like pagination and linking can be done with headers. Optionally a parameter can be used to wrap the response in an envelope (this should be done with a middleware).

With envelope:

```json
{
  "code": 200,
  "data" : {
    "id" : "abcd",
    "name" : "Alex",
    "occupation" : "Developer"
  }
}
```

Without envelope:
```json
{  
  "id" : "abcd",
  "name" : "Alex",
  "occupation" : "Developer"
}
```

### Errors:
Errors with a single point of failure (like 500, 404) should have the following response format:

```json
{
  "name": "Requested resource was not found.",
  "statusCode" : 404,
  "errorCode" : "ec3fde78-8c59-49ed-a64b-b73343740b21",
  "description" : "Unable to find user with id e9783af7-8de5-4486-84e8-d37c8212f9e3"
}
```


```json
{
  "name": "Request is not valid.",
  "code" : 400,
  "errorCode" : "ec3fde78-8c59-49ed-a64b-b73343740b22",
  "errors" : [
    {
      "param": "id",
      "msg": "id is not valid format",
      "value": "e9783af7-8de5-4486-84e8-d37c82"
    },
    {
       //another error
    }
  ]
}
```

The errorCode is a generated UUID unique to each error instance that can be searched for in the logs for traces. Traces should never be exposed to the API or UI since they may contain sensitive data and expose information about the code that can be used by hackers to find vulnerabilities. 


## Logging

### Application Logs

All direct logging in the application should be handled by the logger class which wraps the [Winston](https://www.npmjs.com/package/winston) library. By default winston is configured to write to daily rotated files for all environments and to Console for the developer environment. For clustered environments you should consider setting up ELK and using a [Winston Logstash plugin](https://www.npmjs.com/package/winston-logstash).

### Access Logs

All requests are logged by using [Morgan](https://www.npmjs.com/package/morgan). Logs are rotated daily.

## Testing

### Unit testing

Unit tests should be very fast and large in number. They test the input and output of individual model and controller methods. Use mocking and Spies where necessary. Tests are located in the tests folder inside the controllers and models directories. Uses Mocha + Chai + Sinon.

To run unit tests:
```shell
npm test
```

### Integration testing

Integration tests verify correct routes. This is still a work in progress. Currently uses Supertest + Mocha + Chai

To run integration tests:
```shell
npm run integration-test
```

## Features
 
### Complete
- Basic CRUD with a mock resource. 
- Input validation
- Unit testing
- Access logging with Morgan
- Application logging to files with Winston
- Compression, CORS, Http header security with [Helmet](https://www.npmjs.com/package/helmet)
- *.editorConfig* for consistent code style

### Todo
- SSL Only
- Rate Limiting
- Deploy to Docker
- Integrate with Travis for CI/CD to docker hub
- JWT Authorization. Use third party OAuth as Authentication
- Document API with Swagger / something else
- Move to using import vs require
- handle NODE_ENV correctly

