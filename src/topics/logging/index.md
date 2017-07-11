# Logging

As required by many apps, we provide an easy to use logging API to log data out of your app. Additionally the Baqend dashboard shows
access logs which contain all the resources requested by your users.

App logs and Access logs are accessible through the Baqend dashboard. 
App logs will be kept forever and Access logs will be removed after **10 days** due to privacy terms. 

In addition, you can view, query and manage the permissions of the logs like any other data you persist to Baqend. 
But you can't modify the schema, the logged data nor the permissions of update and delete operations.

<div class="note"><strong>Note:</strong> When querying logs you must always use a date predicate, otherwise you will only get the last 5 minutes of 
the logs.</div>

## App Logging

The Baqend SDK provides a powerful logging API. 

- You can use the logging API to remote log events and errors which happen at your user's side.
- You can log events and errors in Baqend code. Uncaught errors and rejected promises in baqend code will automatically 
  be logged as errors.

Logging from the browser:

```js
//Use the debug level while developing. 
//You can then easily disable all logs by just removing this line
DB.log.level = 'debug'; 

DB.log.debug('A simple debug message', {test: 'some test data'})
DB.log.info('A simple message that always be logged');
```

The SDK provides a simple log method which takes a log level, a message, arguments and an optional data object.
In addition, the SDK logs the current date and the logged in user.

Logging from Baqend Code:

```js
exports.call = function(db, data, req) {
    //Use the debug level while developing. 
    //You can then easily disable all logs by just removing this line
    db.log.level = 'debug'; 
    
    db.log.debug('A simple debug message', {test: 'some test data'})
    db.log.info('A simple message that always be logged');  
}
```


### Log Levels
You can use multiple log levels to categorize your logs. You can use one of the predefined logging levels 
`trace`, `debug`, `info`, `warn`, `error`. Log levels can later be used to filter logs.

```js
DB.log('debug', 'A simple debug message');
```

If you do not provide a log level, the log level becomes `info`.

For easier usage the log method also expose additional log methods for each log level:

```js
DB.log.trace('A simple trace message');
DB.log.debug('A simple debug message');
DB.log.info('A simple info message');
DB.log.warn('A simple warn message');
DB.log.error('A simple error message');
```

By default only `error`, `warn` and `info` logs are activated. If you want to use `debug` or `trace` logs or maybe deactivate one of the other levels you can specify the minimum log level to track like this:
```js
DB.log.level = 'debug'; // to track all logs except for 'trace'
DB.log.level = 'warn'; // to track only 'warn' and 'error'
```

### Log Arguments

It is easy to include dynamic data into the log message. 
You can use placeholder in your log message which will be replaced by the additional passed values.
The can use the placeholders `%s` for strings, `%d` for numbers and `%j` for a JSON conversion before the values are 
included in the log message.
 
```js
DB.log('debug', 'The value %d is greater then %d', 10, 5);
//logs the message 'The value 10 is greater then 5'
```

Often you want to log additional data, which should not be converted to a string and included in the log message itself. 
All the log methods allow one additional argument as the last argument. 
The argument should be a JSON like object and will be logged in addition to the log message. 

```js
DB.log('debug', 'The value %d is greater then %d', 10, 5, {val1: 10, val2: 5});
//logs the message 'The value 10 is greater then 5'
//and the data {val1: 10, val2: 5}
```

You can also use the log level helper methods:
```js
DB.log.debug('The value %d is greater then %d', 10, 5, {val1: 10, val2: 5});
```

<div class="note"><strong>Note:</strong> App logs can be inserted by everyone by default, to restrict log insertion you can change the insert permission
of the AppLog class in the dashboard.</div>

## Access Logs

Access logs will be automatically collected whenever a resource of your app is accessed through a fastly server. 

The following data will be collected by us:

- date - The UTC date of the access
- ip - The IP address of the user
- method - The HTTP Method, one of (HEAD, GET, POST, PUT, DELETE, OPTIONS)
- server - The server who has generated the log entry, indicates the fastly pop location by default
- url - The URL of the resource that is requested
- status - The returned response status of the Baqend server
- download - The amount of data transferred to the client (includes head and body payload)
- upload - The amount of data transferred from the client (includes head and body payload)
- latency - The latency to handle the actual request measured by the fastly server 
- cacheHit - Indicates if the request was directly served by the fastly server without contacting Baqend (Cache HIT)
