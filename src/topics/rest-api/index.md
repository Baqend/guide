# REST API


It's recommended to use one of Baqend's SDKs to develop your application, but for advanced use cases it also possible to 
directly send requests against the [HTTP REST API](https://dashboard.baqend.com/swagger-ui/?url=https%3A%2F%2Fapp-starter.app.baqend.com%2Fv1%2Fspec#/crud).

This section contains high-level instructions on how to use our REST API. 
For a comprehensive list of all endpoints, have a look at [the swagger documentation](https://dashboard.baqend.com/swagger-ui/?url=https%3A%2F%2Fapp-starter.app.baqend.com%2Fv1%2Fspec#/crud).

To ensure backward compatibility, all endpoints start with an API version number. The current version is **v1**: `https://<app-name>.app.baqend.com/v1` 

## Sections

The REST API is split up into eleven different categories. For most cases, however, it's sufficient to have a more in-depth look at the following three groups:

* [CRUD](https://dashboard.baqend.com/swagger-ui/?url=https%3A%2F%2Fapp-starter.app.baqend.com%2Fv1%2Fspec#/crud) (**C**reate, **R**ead, **U**pdate, **D**elete): The CRUD API offers the ability to save, load, update, and delete objects in the database. 
  Each class defined in the schema has a separate endpoint: `https://<app-name>.app.baqend.com/v1/db/<class-name>`
* [query](https://dashboard.baqend.com/swagger-ui/?url=https%3A%2F%2Fapp-starter.app.baqend.com%2Fv1%2Fspec#/query): To load multiple objects of one particular class, you can execute a [MongoDB query](https://docs.mongodb.com/manual/tutorial/query-documents/) by sending a GET request with URI component encoded GET parameters to `https://<app-name>.app.baqend.com/v1/db/<class-name>/query`. 
The response will contain the query result. 
  The available parameters are: `q` (MongoDB query), `count` (integer), `sort` ([MongoDB sort](https://docs.mongodb.com/manual/reference/method/cursor.sort/)), `start` (integer)
* [user](https://dashboard.baqend.com/swagger-ui/?url=https%3A%2F%2Fapp-starter.app.baqend.com%2Fv1%2Fspec#/user): 
  The user API enables authentication and authorization. It offers the ability to register and login users, change passwords, and usernames.
  

## CRUD

### Authentication

Baqend uses a token-based authentication mechanism. [Register and login requests](#user-management) 
return the header `baqend-authorization-token`. The value of this header is the authorization token, which must be 
attached as the `authorization` header to [permission-protected](topics/user-management/#permissions) 
CRUD requests: `authorization: BAT <token>`

CRUD requests may return a renewed token in the `baqend-authorization-token` header. If this happens, the renewed token must be used for all subsequent requests.

### Create

A POST request with a JSON payload sent to `https://<app-name>.app.baqend.com/v1/db/<class-name>` will create a new object of type
`class-name`; it will return the created object with additional metadata fields like *updatedAt*, *createdAt*, and *id*.
The following example creates an object for the class *Message* with the string attribute *text*.

Request type: `POST`

Request URL: `https://<app-name>.app.baqend.com/v1/db/Message`

Request headers:
```` 
accept: application/json
content-type: application/json
````

Request body:  
````js
{
  "text":"Test Message"
}
````

Response body: 
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

To load a particular object, send a GET request to `https://<app-name>.app.baqend.com/v1<id>`. 
Here, the `<id>` value corresponds to the `id` value in the JSON representation of an object (e.g. as returned after creating an object).

Request method: `GET`

Request URL: `https://<app-name>.app.baqend.com/v1/db/Message/0d2c40a1-54f4-4838-9f3e-48bbe6d82eb9`

Request headers:
```` 
accept: application/json
````

Respone body:
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

To update the object with ID `<id>`, send a PUT request with the updated JSON to `https://<app-name>.app.baqend.com/v1<id>`. 
If you set the `if-match` header to your current version of the object, the update will only be executed if this version is still up-to-date. 
Thus, you can prevent accidentally overwriting changes made by others. 

Request method: `PUT`

Request URL: `https://<app-name>.app.baqend.com/v1/db/Message/0d2c40a1-54f4-4838-9f3e-48bbe6d82eb9`

Request headers:
```` 
accept: application/json
content-type: application/json
if-match: 1
````

Request body:
````js
{
  "text": "New Message", 
  "id": "/db/Message/0d2c40a1-54f4-4838-9f3e-48bbe6d82eb9"
}
````

Response body:
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

To delete the object with ID `<id>`, send a DELETE request to `https://<app-name>.app.baqend.com/v1<id>`.
As with updates, you can also prevent accidentally deleting changes made by others: 
To this end, set the `if-match` request header to your current version of the object; thus, the object will only be deleted if your object version is still up-to-date. 

Request method: `DELETE`

Request URL: `https://<app-name>.app.baqend.com/v1/db/Message/0d2c40a1-54f4-4838-9f3e-48bbe6d82eb9`

Request headers:

````
if-match: 1
````

cURL: `curl -X DELETE "https://<app-name>.app.baqend.com/v1/db/Message/0d2c40a1-54f4-4838-9f3e-48bbe6d82eb9" -H "accept: application/json" -H "If-Match: 1"`

## User Management

To use Baqend's [user management system](/topics/user-management/), you have to use the user API. It offers the ability
to register and login users.

Baqend uses a token-based authentication mechanism. Register and login requests return the header `baqend-authorization-token`.
The value of this header is the authorization token, which must be attached as the `authorization` header to ACL-protected CRUD requests:
`authorization: BAT <token>`

### Register

To register a user, send a POST request to `https://<app-name>.app.baqend.com/v1/db/User/register`. If you've
defined more fields in the user schema, you can pass additional data to the user object in the request body.

Request method: `POST`

Request URL: `https://<app-name>.app.baqend.com/v1/db/User/register`

Request headers:
```` 
accept: application/json
content-type: application/json
````

Request body:
````
{
  "password": "secret",
  "login": true,
  "user": {
    "username": "name"
  }
}
````

Response headers: 
````
baqend-authorization-token: <token>
````

Response body:
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

### Login

To login a registered user, send a POST request with the username and password to `https://<app-name>.app.baqend.com/v1/db/User/login`.
The response will contain the corresponding user object.

Request method: `POST`

Request URL: `https://<app-name>.app.baqend.com/v1/db/User/login`

Request headers:
```` 
accept: application/json
content-type: application/json
````

Request body: 
````
{ 
  "username": "name", 
  "password": "secret" 
}
````

Response headers:
````
baqend-authorization-token: <token>
````

Response body:
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

To query the data of one class, you can write a [MongoDB query](https://docs.mongodb.com/manual/tutorial/query-documents/) via  
GET request to `https://<app-name>.app.baqend.com/v1/db/<class-name>/query`. 
You will receive the query result in the response body. 
Note that GET parameters have to be [URI component encoded](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent). 

The available parameters are:

* `q`: [MongoDB query](https://docs.mongodb.com/manual/tutorial/query-documents/) URI component encoded
* `count` (integer): Defines how many objects will be returned at most. The default and maximum are 500.
* `sort`: ([MongoDB sort](https://docs.mongodb.com/manual/reference/method/cursor.sort/)) URI component encoded
* `start` (integer): You can skip objects at the beginning of query result by setting this to a number > 0. The default is 0.

The following example request will return all Message objects with text equal to `"New Message"` (query: `{ "text": "New Message" }`), newest first (sort: `{ "createdAt": -1 }`).

Request method: `GET`

Request URL: `https://<app-name>.app.baqend.com/v1/db/Message/query?q=%7B%22text%22%3A%22New%20Message2%22%7D&sort=%7B%22createdAt%22%3A-1%7D`

Request headers:
```` 
accept: application/json
````

Response body: 
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