# REST API


It's recommended to use one of Baqend's SDKs to develop your application, but for advanced use cases it also possible to 
directly request the [HTTP REST API](https://dashboard.baqend.com/swagger-ui/?url=https%3A%2F%2Fapp-starter.app.baqend.com%2Fv1%2Fspec#/crud).

This section describes roughly how to use our API. 
To see all endpoints have a look at [the swagger documentation](https://dashboard.baqend.com/swagger-ui/?url=https%3A%2F%2Fapp-starter.app.baqend.com%2Fv1%2Fspec#/crud).

To ensure backward compatibility, all endpoints start with an API version number. The current version is **v1**: `https://<app-name>.app.baqend.com/v1` 

## Sections

The REST API is split up into eleven different categories. In most cases, it's sufficient to have a more in-depth 
look at the following three groups: *CRUD (**C**reate, **R**ead, **U**pdate, **D**elete)*, *query* and *user*.

* [CRUD](https://dashboard.baqend.com/swagger-ui/?url=https%3A%2F%2Fapp-starter.app.baqend.com%2Fv1%2Fspec#/crud): The CRUD API offers the ability to save, load, update and delete objects in the database. 
  Each in the schema defined class has a separate endpoint: `https://<app-name>.app.baqend.com/v1/db/<class-name>`
* [query](https://dashboard.baqend.com/swagger-ui/?url=https%3A%2F%2Fapp-starter.app.baqend.com%2Fv1%2Fspec#/query): To load multiple objects of one class, you can write a [MongoDB query](https://docs.mongodb.com/manual/tutorial/query-documents/) and
  can be executed by sending a GET-request with URI component encoded GET-parameters to `https://<app-name>.app.baqend.com/v1/db/<class-name>/query`.
  The available parameters are: `q` (MongoDB query), `count` (integer), `sort` ([MongoDB sort](https://docs.mongodb.com/manual/reference/method/cursor.sort/)), `start` (integer)
* [user](https://dashboard.baqend.com/swagger-ui/?url=https%3A%2F%2Fapp-starter.app.baqend.com%2Fv1%2Fspec#/query): 
  The user API enables the use of authentication and authorization. It offers the ability to register and login users, change passwords and usernames.
  

## CRUD

### Authentication

Baqend uses a token-based authentication mechanism. [Register and login requests](#user-management) 
return the header `baqend-authorization-token`. The value of this header is the authorization token, which must be 
attached as the `authorization` header to [permission protected](topics/user-management/#permissions) 
CRUD requests: `authorization: BAT <token>`

CRUD requests may return a renewed token in the `baqend-authorization-token` header. This token must be used for 
further requests.

### Create

A POST-request with a JSON to `https://<app-name>.app.baqend.com/v1/db/<class-name>` creates a new object of the type
`class-name` and returns the created object with additional fields like *updatedAt*, *createdAt*, and *id*.
The following example creates an object for the class *Message* with the string attribute *text*.

Request Type: `POST`

Request URL: `https://<app-name>.app.baqend.com/v1/db/Message`

Request Headers:
```` 
accept: application/json
content-type: application/json
````

Request Body:  
````js
{
  "text":"Test Message"
}
````

Response Body: 
````js
{
	"id": "/db/Message/0d2c40a1-54f4-4838-9f3e-48bbe6d82eb9",
	"version": 1,
	"acl": null,
	"createdAt": "2018-01-12T10:51:52.681Z",
	"writeSet": null,
	"updatedAt": "2018-01-12T10:51:52.681Z",
	"text": "Test Message"
}
````

cURL: `curl -X POST "https://<app-name>.app.baqend.com/v1/db/Message" -H "accept: application/json" -H "Content-Type: application/json" -d "{\"text\": \"Test Message\"}"`

### Read

To load an object, execute a GET-request to `https://<app-name>.app.baqend.com/v1<id>`
The `id` is the field `id` in the JSON which will be returned after creating an object.

Request Method: `GET`

Request URL: `https://<app-name>.app.baqend.com/v1/db/Message/0d2c40a1-54f4-4838-9f3e-48bbe6d82eb9`

Request Headers:
```` 
accept: application/json
````

Respone Body:
````
{
	"id": "/db/Message/0d2c40a1-54f4-4838-9f3e-48bbe6d82eb9",
	"version": 1,
	"acl": null,
	"createdAt": "2018-01-12T10:51:52.681Z",
	"writeSet": null,
	"updatedAt": "2018-01-12T10:51:52.681Z",
	"text": "Test Message"
}
````

cURL: `curl -X GET "https://<app-name>.app.baqend.com/v1/db/Message/0d2c40a1-54f4-4838-9f3e-48bbe6d82eb9" -H "accept: application/json"`

### Update

To update a Object execute a PUT-request with the updated JSON to `https://<app-name>.app.baqend.com/v1<id>`. 
The `id` is the field `id` in the JSON which will be returned after creating an object. If you only want to update
the object, when the version on the server has not been changed, set the `if-match` header to your current version.

Request Method: `PUT`

Request URL: `https://<app-name>.app.baqend.com/v1/db/Message/0d2c40a1-54f4-4838-9f3e-48bbe6d82eb9`

Request Headers:
```` 
accept: application/json
content-type: application/json
if-match: 1
````

Request Body:
````js
{
  "text": "New Message", 
  "id": "/db/Message/0d2c40a1-54f4-4838-9f3e-48bbe6d82eb9"
}
````

Respone Body:
````
{
	"id": "/db/Message/0d2c40a1-54f4-4838-9f3e-48bbe6d82eb9",
	"version": 2,
	"acl": null,
	"createdAt": "2018-01-12T12:30:47.933Z",
	"writeSet": null,
	"updatedAt": "2018-01-12T12:50:15.928Z",
	"text": "New Message"
}
````

cURL: `curl -X PUT "https://<app-name>.app.baqend.com/v1/db/Message/0d2c40a1-54f4-4838-9f3e-48bbe6d82eb9" -H "accept: application/json" -H "If-Match: 2" -H "Content-Type: application/json" -d "{\"text\":\"New Message\", \"id\": \"/db/Message/93a8c50d-a9d7-476f-af16-338487f9a3d2\"}"`

### Delete

Execute a DELETE-request to `https://<app-name>.app.baqend.com/v1<id>` to delete the object with id `<id>`.
If you only want to delete the object, when the version on the server has not been changed, set the `if-match` header to your current version.

Request Method: `DELETE`

Request URL: `https://<app-name>.app.baqend.com/v1/db/Message/0d2c40a1-54f4-4838-9f3e-48bbe6d82eb9`

Request Headers:

````
if-match: 1
````

cURL: `curl -X DELETE "https://<app-name>.app.baqend.com/v1/db/Message/0d2c40a1-54f4-4838-9f3e-48bbe6d82eb9" -H "accept: application/json" -H "If-Match: 1"`

## User Management

To use Baqend's [user management system](/topics/user-management/) you have to use the user API. It offers the ability
to register and login users.

Baqend uses a token-based authentication mechanism. Register and login requests return the header `baqend-authorization-token`.
The value of this header is the authorization token, which must be attached as the `authorization` header to ACL protected CRUD requests:
`authorization: BAT <token>`

### Register

To register a user execute a POST-request to `https://<app-name>.app.baqend.com/v1/db/User/register`. If you've
defined more fields in the user schema, you can pass additional data to the user object in the request body.

Request Method: `POST`

Request URL: `https://<app-name>.app.baqend.com/v1/db/User/register`

Request Headers:
```` 
accept: application/json
content-type: application/json
````

Request Body:
````
{
  "password": "secret",
  "login": true,
  "user": {
    "username": "name"
  }
}
````

Response Headers: 
````
baqend-authorization-token: <token>
````

Response Body:
````
{
  "id": "/db/User/30",
  "version": 1,
  "acl": {
    "read": {
      "/db/User/30": "allow"
    },
    "write": {
      "/db/User/30": "allow"
    }
  },
  "createdAt": "2018-01-12T17:05:55.334Z",
  "writeSet": null,
  "updatedAt": "2018-01-12T17:05:55.334Z",
  "username": "name",
  "inactive": null
}
````

cURL: `curl -X POST "https://<app-name>.app.baqend.com/v1/db/User/register" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"password\": \"secret\", \"login\": true, \"user\": { \"username\": \"name\" }}"`

### Log-In

To log in a previously registered user, you must POST the username and password to `https://<app-name>.app.baqend.com/v1/db/User/login`.
Die response will contain the corresponding user object.

Request Method: `POST`

Request URL: `https://<app-name>.app.baqend.com/v1/db/User/login`

Request Headers:
```` 
accept: application/json
content-type: application/json
````

Request Body: 
````
{ 
  "username": "name", 
  "password": "secret" 
}
````

Response Headers:
````
baqend-authorization-token: <token>
````

Response Body:
````
{
	"id": "/db/User/30",
	"version": 1,
	"acl": {
		"read": {
			"/db/User/30": "allow"
		},
		"write": {
			"/db/User/30": "allow"
		}
	},
	"createdAt": "2018-01-12T17:05:55.334Z",
	"writeSet": null,
	"updatedAt": "2018-01-12T17:05:55.334Z",
	"username": "name",
	"inactive": null,
}
````

cURL: `curl -X POST "https://<app-name>.app.baqend.com/v1/db/User/login" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"password\": \"secret\", \"username\": \"name\" }"`


## Query

To query the data of one class you can write a [MongoDB query](https://docs.mongodb.com/manual/tutorial/query-documents/), 
which can be executed by sending a GET-request with 
[URI component encoded](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) 
GET-parameters to `https://<app-name>.app.baqend.com/v1/db/<class-name>/query`.

The available parameters are:

* `q`: [MongoDB query](https://docs.mongodb.com/manual/tutorial/query-documents/) URI component encoded
* `count` (integer): Defines how many objects will be returned. The default and maximum are 500.
* `sort`: ([MongoDB sort](https://docs.mongodb.com/manual/reference/method/cursor.sort/)) URI component encoded
* `start` (integer): You can skip objects at the beginning of query result by setting this to a number > 0

The following example uses the MongoDB query `{ "text": "New Message" }` and sorts the result by the createdAt field `{ "createdAt": -1 }`

Request Method: `GET`

Request URL: `https://<app-name>.app.baqend.com/v1/db/Message/query?q=%7B%22text%22%3A%22New%20Message2%22%7D&sort=%7B%22createdAt%22%3A-1%7D`

Request Headers:
```` 
accept: application/json
````

Response Body: 
````
[{
	"id": "/db/Message/93a8c50d-a9d7-476f-af16-338487f9a3d2",
	"version": 6,
	"acl": null,
	"createdAt": "2018-01-12T12:30:47.933Z",
	"writeSet": null,
	"updatedAt": "2018-01-16T11:34:09Z",
	"text": "New Message"
}, {
	"id": "/db/Message/7033cbae-3bb4-48df-8065-25b8effdb098",
	"version": 2,
	"acl": null,
	"createdAt": "2018-01-12T10:50:55.45Z",
	"writeSet": null,
	"updatedAt": "2018-01-16T11:34:07.292Z",
	"text": "New Message"
}]
````

cURL: `curl "https://<app-name>.app.baqend.com/v1/db/Message/query?q=%7B%22text%22%3A%22New%20Message%22%7D&sort=%7B%22createdAt%22%3A-1%7D"`