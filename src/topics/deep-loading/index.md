# Persistence and Deep Loading

The Baqend SDK internally tracks the state of all living entity instances and their attributes. If an attribute of an 
entity is changed, the entity will be marked as dirty. Only dirty entities will be send back to the Baqend while calling
`save()` or `update()`. Also the collections and embedded objects of an entity will be tracked the same way and mark the 
owning entity as dirty on modifications. The big advantage of this dirty tracking is that when you apply deep saving 
to persist object graphs, only those objects that were actually changed are transferred. This saves performance and 
bandwidth.
```js
db.Todo.load('Todo1').then(function(todo) {
  todo.save(); //will not perform a Baqend request since the object is not dirty   
});
```

## Deep Loading

As described in the [References](../schema#references) chapter, references between entities will be handled differently 
from embedded objects or collections. The referenced objects will not be loaded with the referencing entity by default.
```js
//while loading the todo, the reference will be resolved to the referenced entity
db.Todo.load('7b2c...').then(function(firstTodo) {
  console.log(firstTodo.name); //'My first Todo'
  console.log(firstTodo.doNext.name); //will throw an object not available error
});
```

In a more complex scenario you may have references in a collection. These references won't be be loaded by default 
neither.
```js
db.Todo.load('7b2c...').then(function(firstTodo) {  
  //will throw an object not available error
  console.log(firstTodo.upComingTodos[0].name); 
});
``` 

To load dependant objects, you can pass the `depth` option while loading the entity. The depth option allows to 
set a reference-depth which will automatically be loaded. A depth value of `0` (the default) just loads the entity. 
```js
db.Todo.load('7b2c...', {depth: 0}).then(function(firstTodo) {   
  //will throw an object not available error
  console.log(firstTodo.doNext.name); 
  //will still throw an object not available error
  console.log(firstTodo.upComingTodos[0].name); 
});
```

A depth value of `1` loads the entity and one additional level of references. This also includes references in 
collections and embedded objects.
```js
db.Todo.load('7b2c...', {depth: 1}).then(function(firstTodo) {
  console.log(firstTodo.doNext.name); //'My second Todo'
  console.log(firstTodo.upComingTodos[0].name); //'My second Todo'  
  //will throw an object not available error
  console.log(firstTodo.doNext.doNext.name); 
  //will still throw an object not available error
  console.log(firstTodo.upComingTodos[0].upComingTodos[0].name); 
});
```

Setting the depth value to `2` resolves the next level of references and so on. You can set the depth option to `true` to
load all references by reachability. But be aware of that is dangerous for large object graphs. 

## Deep Loading with Queries

Deep loading also works for query results obtained via `resultList` and `singleResult`:

```js
db.Todo.find().resultList({depth: 1}, function(result) {
  result.forEach(function(todo) {
    console.log(todo.doNext.name);
  });
});
```

In that case all referenced objects in all objects loaded by the query are fetched, too.

## Cached Loads

Each EntityManager instance has an instance cache. This instance cache is used while loading objects and resolving 
references. When an entity is loaded it is stored into this instance cache and will always be returned when the same 
instance is requested. This ensures that you will always get the same instance for a given object id. That means 
object equality is always guaranteed for objects having the same ids. 
```js
db.Todo.load('MyFirstTodo', {depth: 1}).then(function(firstTodo) {
  db.Todo.load('MySecondTodo').then(function(secondTodo) {
    //true, object equality is guaranteed by the DB instance cache
    console.log(firstTodo.doNext == secondTodo); 
  });  
});
```

## Deep Saving

As with deep loading, you can also save referenced entities with the referencing entity by passing the depth option.
 If you call `save()` without any options, only the entity itself will be saved, but not any referenced entity. This is the 
same behaviour as passing `depth` with the value `0`.
```js
var firstTodo = new db.Todo({name: 'My first Todo'});
var secondTodo = new db.Todo({name: 'My second Todo'});

firstTodo.doNext = secondTodo;
firstTodo.save(); //will save firstTodo, but not the secondTodo
```

By passing the depth option with a value of `1` the entity and all its direct referenced entities will be saved.
```js
var thirdTodo = new db.Todo({name: 'My third Todo'});

firstTodo.doNext = secondTodo;
secondTodo.doNext = thirdTodo;
//will save firstTodo and secondTodo, but not the thirdTodo
firstTodo.save({depth: 1});
```

And again increasing the `depth` value to `2` will save all direct referenced entities and all entities which are 
referenced by those referenced entities. You can also pass `depth` with `true` to save all dirty entities by 
reachability.

