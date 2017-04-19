# CRUD

Each entity has some basic methods for persisting and retrieving its data. This pattern is known as *data access 
objects* (DAO) or *active records* and is common practice in persistence frameworks.

## Create

After creating a new object, the object can be persisted to Baqend with an `insert()` call. The insert call ensures
that the object always get its own unique id by generating a new one if none was provided.

```js
var todo = new DB.Todo({id: 'Todo1', name: 'My first Todo'});
//we can use the object id right now
console.log(todo.id) //'Todo1' 

todo.insert().then(function() {
  console.log(todo.version); //1
});
```

## Read

If an object is persisted it can be loaded by its id (aka primary key). This method is very handy with custom (i.e. 
non-generated) ids.
```js
DB.Todo.load('Todo1').then(function(todo) {
  console.log(todo.name); //'My first Todo'  
});
```

If an object is loaded from the Baqend all its attributes, collections and embedded objects will be loaded, too.
References to other entities will not be loaded by default. You can, however, specify an optional `depth`-parameter to indicate how deep referenced entities should be loaded:
```js
DB.Todo.load('Todo1', {depth: 1}).then(function(todo) {
  // With 'depth: 1' all directly referenced objects will be loaded.
});
```

When you load the same object a second time, the object will be loaded from the local cache. This ensures that you
always get the same object instance for a given object id.

```js
DB.Todo.load('Todo1').then(function(todo1) {
  DB.Todo.load('Todo1').then(function(todo2) {
    console.log(todo1 === todo2); //true
  });
});
```

## Update

After having loaded an instance and having done some modifications, you usually want to write the modifications back to
Baqend.
```js
todo.name = 'My first Todo of this day';
return todo.update();
```

The `update()` method writes your changes back to Baqend, if no one else has already modified the object. To detect
concurrent object modifications, each entity has a version. Every time changes are written back to Baqend the 
versions will be matched. If the version in the Baqend differs form the provided version, the object was modified by 
someone else and the changes will be rejected, since the object is outdated, i.e. a concurrent modification occurred.
 This is called *optimistic concurrency control*: changes are performed locally and then sent to the server and only 
 in the rare event of a consistency violation the change operation is rejected.
```js
todo.name = 'My first Todo of this day';
return todo.update().then(function() {
  //the todo was successfully persisted
}, function(e) {
  //the update was rejected. Do we want to reapply our changes?
});
```

<div class="note"><strong>Note:</strong>  When you try to update an already deleted object, it will also be treated as a concurrent modification and the
update will be rejected.</div>

There are also some situations where we would like to omit this behaviour and force a write of our changes. To do so the force option can be passed to the `update` method. Be aware that this *last-writer-wins*-scheme may result in lost updates.
```js
todo.name = 'My first Todo of this day';
  //force the update and potentially overwrite all concurrent changes
return todo.update({force: true}).then(function() {
  //the todo was successfully persisted
});
```

Each object also automatically keeps track of its creation time and the last time it was updated in form of <a href="#primitives">DateTime</a> fields. Both of these fields are maintained automatically and are read only, i.e. you can not change them yourself.
```js
todo.name = 'My first Todo of this day';
return todo.update().then(function(updatedTodo) {
  console.log(updatedTodo.createdAt);
  console.log(updatedTodo.updatedAt);
};
```

## Delete

You can delete an object by calling its `delete()` method. It will delete the entity from Baqend and drop the entity
from the local cache.

```js
todo.delete().then(function() {
  //the object was deleted
}, function() {
  //a concurrent modifications prevents removal
});
```

Just like the `update()` method, `delete()` matches the local version with the version in the Baqend and 
deletes the object only if the version is still up-to-date.

Again, you can pass the force option to bypass the version check.
```js
todo.delete({force: true});
```

## Save

As you have seen in the previous examples you can `insert()` new objects and `update()` existing objects. If it is
irrelevant if the object is already persisted to the Baqend just use the `save()` method. This either performs  an 
update or an insert, depending on the current state of the object.

```js
var todo = new DB.Todo({id: 'Todo1', name: 'My first Todo'});
todo.save().then(function() { //inserts the object
  todo.name = 'My first Todo of this day';
  todo.save(); //updates the object
});
```

## Concurrency with Optimistic Saving

Without the explicit `force` flag, updates and saves can fail due to concurrent operations performed on the same object. With the òptimisticSave` method you can conveniently specify the retry logic to apply, if the update fails. Even under high concurrency one writer will always succeed so that the system still makes progress.

Under the hood, this pattern of optimistic concurrency control relies on version numbers of the objects and conditional HTTP requests that only apply changes when the underlying object has not been changed.

```js
var todo = new DB.Todo.load("myTodo");
todo.optimisticSave(function(todo, abort) {
  //this method may get called multiple times
  if(todo.participants.length > 10) { 
    //you can specify when to stop reytring
    abort();
  }
  todo.participants.push("Johnny"); //apply a change --> will be saved automatically
});
```

<div class="tip"><strong>Tip:</strong> Optimistic saving is particularly useful for server-side code (<a href="#modules">modules</a>) that updates objects and may be invoked concurrently.</div>

## Load / Refresh

Sometimes you want to ensure, that you have the latest version of an previously loaded entity, for example before 
performing an update. In that case you can use the `load({refresh: true})` method of the entity to get the latest 
version from Baqend. 
```js
//updates the local object with the most up-to-date version
todo.load({refresh: true}).then(function() { 
  todo.name = 'My first Todo of this day';   
  todo.save(); //updates the object
});
```

While performing an insert or update, you can also refresh the object after performing the operation. To do so you 
can pass the `refresh` flag to the `insert()`, `update()` or `save()` method.
```js
todo.save({refresh: true}).then(...); //refreshing the object after saving it
```    

This option is very useful if you have a [Baqend Code](#baqend-code) update handler which performs additional 
server-side modifications on the entity being saved. By passing the `refresh` flag you enforce that the modification will
 be loaded from the Baqend after the entity has been saved. 
