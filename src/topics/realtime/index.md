# Real-Time Queries

Baqend does not only feature powerful queries, but also real-time mechanisms that **keep query results up-to-date** while the underlying database is under constant change. Baqend Real-Time Queries come in two flavors:

+ **Self-maintaining queries** (`.resultStream()`): You'll get the complete (updated) result whenever it changes.
+ **Event stream queries** (`.eventStream()`): You'll receive an event message for every database write that affects 
your query.

Calling `.eventStream()` or `.resultStream()` on a query object opens a 
[websocket](https://developer.mozilla.org/de/docs/WebSockets) connection to Baqend, registers a real-time query and 
returns an [RxJS observable](http://reactivex.io/documentation/observable.html). This observable provides you with an 
instant update to your query whenever a relevant change occurs.  

The following sections describe both real-time query types in detail. For information on the underlying messaging 
protocol, see our [Websocket API Docs](../../websockets/).

<div class="warning"><strong>Real-Time SDK:</strong> 
To use real-time features, you must include RxJS.
</div>

## Self-Maintaining Queries

Baqend Self-Maintaining Queries behave **exactly like regular queries**, but with one important distinction: They **update themselves** and thus never become stale. You will receive both the current result once upfront and the updated result whenever a regular query would return a different result than before.

All you have to do is use <code>result<b><u>Stream</u></b>()</code> instead of <code>result<b><u>List</u></b>()</code> for your queries. 

### Going Real-Time: <code>result<b><u>List</u></b>()</code> vs. <code>result<b><u>Stream</u></b>()</code>

To shed more light on the difference between regular and real-time queries, consider the following example: Imagine you and your colleagues are collaborating on a shared todo list that is frequently updated. And let's say you want to keep an eye on the 10 most urgent open tasks by the following query:

```js
var query = db.Todo.find()
              .matches('name', /^My Todo/)
              .ascending(status)
              .ascending('deadline')
              .limit(10);
```

With a regular query that does not update itself (<code>result<b><u>List</u></b>()</code>), you would have to evaluate the query again and again to make sure you don't miss any updates:

```js
//Maintaining a result with purely pull-based queries is tedious:
query.resultList(result => console.log(result));
//...
//Did something change?
query.resultList(result => console.log(result));
//...
//Let's check again...
query.resultList(result => console.log(result));
//...
//Don't do this! Use real-time queries instead!
```

This pattern is obviously inefficient and introduces staleness to your critical data. Using a self-maintaining query, on the other hand, there is **no need to actively refresh the result**. You simply replace <code>result<b><u>List</u></b>()</code> by <code>result<b><u>Stream</u></b>()</code> and &mdash; that's it: 

```js
// will print the result once upfront and whenever it changes:
query.resultStream(result => console.log(result));
```

With the above code, the top-10 list is not only printed to console once (as it would be with a regular query), but every time &mdash; and *immediately* &mdash; when a task enters the top-10, is updated within the top-10 or leaves the top-10. 

### Observables and Subscriptions

To harness the expressiveness of real-time queries, the Baqend client SDK uses the [**observer pattern**](https://en.wikipedia.org/wiki/Observer_pattern). This section explains the basic concepts in the context of Baqend Real-Time Queries. For a more generic approach, have a look at other resources such as the [RxJS manual](http://reactivex.io/rxjs/manual/overview.html).

Every real-time query produces a **stream** (i.e. a sequence of query updates) that is represented by an abstraction called **observable**. An observable maintains a list of so-called **observers**, each of which is a collection of callback functions. Whenever new data becomes available in the stream, the observable notifies each observer, so that they can apply their callback functions to the new data. To add a new observer to an observable, one has to create a **subscription**. This subscription can be canceled (*unsubscribed*) to remove its respective observer from the observable. 

In a nutshell, you have to subscribe to an observable and provide a few callback functions in order to define application behavior. In particular, you can define the following three callback functions for a real-time query:

+ **`next`**: *What to do when an update arrives in the stream?*  
For self-maintaining queries, this callback function receives the complete updated query result. For [event stream queries](#event-stream-queries), it receives individual change events.
+ **`error`** (optional): *What to do when there is an error?*  
This callback receives a server-side error, for example when you issue a real-time query with insufficient access rights. 
+ **`complete`** (optional): *What to do when the network connection is closed?*  
*Self-maintaining queries* will transparently reconnect by default (see [`reconnect`](#options) option), so this handler can usually be ignored for them. *Event stream queries*, on the other hand, do not support automatic reconnects: They will just silently stop working when disconnected, unless a `complete` function is provided.

<div class="note"><strong>Note:</strong> 
On an <code>error</code> or <code>complete</code> event, the corresponding subscription will automatically be <b>canceled</b>. 
</div> 

The simplest way to create a subscription is to just provide the `next` handler as an argument to `.resultStream()` as illustrated in the last section. As a return value, you get the **subscription** object that you can use to unsubscribe later:

```js
// start:
var subscription = query.resultStream(result => console.log(result)); 
// ...
// stop:
subscription.unsubscribe(); 
```

But you can, of course, provide all three handlers in the same fashion:

```js
var onNext = result => console.log(result);
var onError = err => console.log(err); // optional
var onComplete = () => console.log('I am offline!'); // optional

var subscription = query.resultStream(onNext, onError, onComplete);
```

The above code is equivalent to first creating an observable and then subscribing to it:

```js
var stream = query.resultStream(); // observable
var subscription = stream.subscribe(onNext, onError, onComplete); 
```

However, if you first create a `stream` observable, you can create multiple subscriptions on top of it:

```js
// one single observable:
var stream = query.resultStream(); 

// Multiple subscriptions on the same observable:
var subscription = stream.subscribe(onNext);
var otherSubscription = stream.subscribe(otherOnNext);
```

#### Error Handling

On error, your subscription will automatically be canceled, but you can provide a custom error handler function that is executed whenever something goes wrong:

```js
var onNext = event => console.log(event);
var onError = error => console.log(error);
var subscription = stream.subscribe(onNext, onError);
//...
// A serverside error produces the following output:
//
// {
//   "id":"919ed4a1-9492-497c-af38-8c1aed29bb27",
//   "reason":"Query Not Supported",
//   "message":"Offset + limit may not exceed 500, but offset already was 500."
// }
```

Every error event has the following attributes:

- **id**: the subscription ID
- **reason**: the name of the problem
- **message:** a more elaborate problem description that should point you towards the problem.

### Options

By design, self-maintaining queries are straightforward to use and do not require you to configure anything. However, you can customize behavior by providing an `options` argument as first parameter to the `resultStream` function.  
Currently, there is only one parameter:

- **reconnect** (default: `-1`): determines how often the self-maintaining query is resubscribed after connection loss (negative values indicating infinite retries).  
By default, a self-maintaining query will be resubscribed and the full initial result will be delivered again whenever the websocket connection drops. Since the full query result (and not just changed objects) is transmitted on subscription, **reconnecting can impose significant communication overhead** for large result sets. To shield against this kind of performance leak, you can specify a non-negative integer to override this behavior. In this case, you should also provide a [`complete`](#observables-and-subscriptions) handler which is going to be called after the number of reconnect tries has been exhausted.


## Event Stream Queries

Calling `.eventStream()` on a query object creates an observable that encapsulates all data modifications relevant to your query. But in contrast to a self-maintaining query, an event stream query will not give you a full-blown result on every change, but instead an event notification describing what exactly happened.  

<div class="note"><strong>Note:</strong> 
If you haven't already, you should read the guide section on <b><a href="#observables-and-subscriptions">observables and subscriptions</a></b> as an introduction on how to work with Baqend's real-time API.
</div>

You can create an event stream observable like this:

```js 
var query = db.Todo.find().matches('name', /^My Todo/);
var stream = query.eventStream(); // observable
```

To make your code react to result changes, you can subscribe to the observable and provide a function that is called for every incoming change event:

```js
var subscription = stream.subscribe(event => console.log(event));
```

As with self-maintaining queries, you can also provide functions to handle errors and connection problems:

```js
var onNext = event => console.log(event);
var onError = err => console.log(err); // optional
var onComplete = () => console.log('I am offline!'); // optional

var subscription = stream.subscribe(onNext, onError, onComplete);
```

And of course, you can also skip creating the observable and directly subscribe to an event streaming query:


```js
var subscription = query.eventStream(onNext, onError, onComplete);
```

To cancel your subscription and thus stop receiving events from an event stream query, just unsubscribe:

```js
subscription.unsubscribe();
```

In order to activate event stream updates for a query, all you have to do is register it as an event stream query and provide a function to execute for every received change event:

```js
var query = db.Todo.find()
              .matches('name', /^My Todo/)
              .ascending('deadline')
              .limit(20);
var subscription = query.eventStream()
              .subscribe(event => console.log(event));
//...
new db.Todo({name: 'My Todo XYZ'}).insert(); // insert data
//...
// The insert produces the following event:
//{
//  "matchType":"add",
//  "operation":"insert",
//  "data":{"name":"do groceries",...},
//  "date":"2016-11-09T12:42:31.322Z"
//  "initial":true,
//  "index":1
//}
```

Once subscribed to a stream, you will get an event for every database entity in the initial result set (i.e. every entity matching at subscription time) and for every entity that enters the result set, leaves the result set or is updated while in the result set.

Every event can carry the following information:

- **id**: the subscription ID
- **date**: server-time from the instant at which the event was generated.
- **initial:** a boolean value indicating whether this event reflects the matching status at query time (`true`) or a recent change data change (`false`).
- **index** (for sorting queries only): the position of the matching entity in the ordered result (`undefined` for non-matching entities).
- **data:** the database entity this event was generated for, e.g. an entity that just entered or left the result set. (For self-maintaining queries, this attribute carries the updated result.)
- **matchType:** indicates how the transmitted entity relates to the query result.
Every event is delivered with one of the following match types:
    + `'add'`: the entity entered the result set, i.e. it did not match before and is matching now.
    + `'change'`: the entity was updated, but remains a match.
    + `'changeIndex'` (for sorting queries only): the entity was updated and remains a match, but changed its position within the query result.
    + `'remove'`: the entity was a match before, but is not matching any longer.
    + `'match'`: the entity matches the query (subsumes `'add'`, `'change'` and `'changeIndex'`). You will only receive this match type, if you explicitly request it.
- **operation:** the operation by which the entity was altered (`'insert'`, `'update'` or `'delete'`; `'none'` if unknown or not applicable).  
For an example where neither `'insert'`, `'update'` nor `'delete'` can reasonably be applied to an event, consider how the last one in a top-10 query result is pushed out when a new contender enters the top-10: While one event represents the insertion of the new contender itself, another event represents the entity leaving the result which was neither inserted, updated nor deleted. Consequently, Baqend would deliver this event with a `'none'` operation.



### Options

By default, you receive the initial result set and all events that are required to maintain it. However, the optional argument for the `.eventStream([options])` function lets you restrict the kind of event notifications to receive by setting the appropriate attribute values:

- **initial** (default: `true`): whether or not you want to receive the initial result set. If set to `true`, every entity matching the query at subscription time will be delivered with match type `add`, irrespective of whether and which restrictions you impose on operations and match types (see the other options). If set to `false`, you will only receive an event when something changes.
- **matchTypes** (default: `['all']`): The default gives you all events with the most specific match type (`'add'`, `'change'`, `'changeIndex'` or `'remove'`). If you are only interested in a specific subset of match types, you can specify any combination of them to listen for.
If you do not care about the difference between new and updated items, you can also use match type `'match'`. This will yield the same events as the combination of `'add'`, `'change'` and `'changeIndex'`, but the match type of the received events will always be `'match'`.
- **operations** (default: `['any']`): By default, events will not be sorted out based on their operation, but you can choose any combination of `'insert'`, `'update'`, `'delete'` and `'none'` to narrow down the kind of matches you receive. 

<div class="note"><strong>Note:</strong> 
You can only restrict the event stream by <b>either match type or operation</b>, but not both.
</div>

<div class="warning"><strong>Complex semantics:</strong> 
Filtering events by <b>operation</b> does not work as straightforward as you might think at first glance. So before using this feature, be sure to read the parameter description above and the <a href="#example-subscription-and-events">example</a> below.
</div>

### Event Stream Simple Queries

*Simple queries* are queries that just return all entities in a collection, no filtering involved. While event stream simple queries can be very useful (for example to monitor all operations on the collection), they can produce vast amounts of events for collections that have many members or are updated very often. Therefore, you should be *particularly* careful to only subscribe to events you really want to be bothered with when using event stream simple queries.

For instance, if you are interested in all todo lists and only want to be notified as *new* lists are created, you could subscribe to the following stream:

```js
var stream = db.Todo.find().eventStream({operations: 'insert'});// initial result is delivered by default
```

If, on the other hand, you only care for the creation of new todo lists and not for the ones that are already in the database, you should not request the initial result set:

```js
var stream = db.Todo.find().eventStream({initial: false, operations: 'insert'});
```

### Event Stream Filter Queries

Like regular filter queries, *event stream filter queries* allow you to select entities based on their attribute values by applying [filters](../queries/#filters).

You can, for instance, have the database send you an event for every todo list that is *created* with a name that matches a particular pattern:

```js
var stream = db.Todo.find()
               .matches('name', /^My Todo/)
               .eventStream({initial: false, operations: 'insert'});
```

It is important to note, however, that the above query will only tell you when a new todo list matches your query *on insert*; it will *not* produce an event when an already-existing list is renamed to match your pattern, because that would happen by `update` (while the stream is targeting `insert` operations only).

If you are really looking for an event stream query that gives you new matches irrespective of the triggering operation, you should work with `matchTypes` and leave `operations` at the default:

```js
var stream = db.Todo.find()
               .matches('name', /^My Todo/)
               .eventStream({initial: false, matchTypes: 'add'});// operations: ['any'] by default
```

To get the full picture, you can also request the initial result upfront. Initial matches are always delivered with match type `add`:

```js
var stream = db.Todo.find()
               .matches('name', /^My Todo/)
               .eventStream({matchTypes: 'add'});// initial: true by default
```

Of course, you can combine several predicates using `and`, `or` and `nor`. The following query keeps you up-to-date on all todo lists that are active and match one pattern or have already been marked as done and match another pattern:

```js
var queryBuilder = db.Todo.find();
var condition1 = queryBuilder
  .matches('name', /^My Todo/)
  .equal('active', true);

var condition2 = queryBuilder
  .matches('name', /^Your Todo/)
  .equal('done', true);

var stream = queryBuilder
               .or(condition1, condition2)
               .eventStream();
```

### Event Stream Sorting Queries

All features described so far are also available for *event stream sorting queries*, i.e. queries that contain `limit`, `offset`, `ascending`, `descending` or `sort`.
Events stream sorting queries are great to maintain ordered results such as high-score rankings or prioritized todo lists.

The following generates events for your top-20 todo lists, sorted by urgency, name and status:

```js
var stream = db.Todo.find()
               .matches('name', /^My Todo/)
               .ascending('deadline')
               .ascending('name')
               .descending('active')
               .limit(20)
               .eventStream();
```

Entities that sort identically are **implicitly ordered by ID**. Thus, a query without explicit ordering will result in more or less random order by default as IDs are generated randomly:

```js
var stream = db.Todo.find()
               .matches('name', /^My Todo/)
               .limit(20)// no order provided? Implicitly ordered by ID!
               .eventStream();
```

**The `limit` clause is optional** and a query without limit will be registered with the maximum permitted limit: `offset + limit <= 500` must always hold. In other words, `limit` can never assume values greater than `500 - offset`. Correspondingly, queries with an `offset` of more than 499 are illegal.  
Since the maximum limit is implicitly enforced, the following three event stream queries are registered identical:

```js
var implicitLimit = db.Todo.find()
               .matches('name', /^My Todo/)
               .ascending('deadline')
               .offset(5)
               .eventStream(); // implicit limit: 495 (= 500 - offset)
               
var explicitLimit = db.Todo.find()
               .matches('name', /^My Todo/)
               .ascending('deadline')
               .offset(5)
               .limit(495) // explicit limit
               .eventStream();
               
var cappedLimit = db.Todo.find()
               .matches('name', /^My Todo/)
               .ascending('deadline')
               .offset(5)
               .limit(500) // limit is capped to 495, so that offset + limit <= 500
               .eventStream();
```

An event stream sorting query with `offset` maintains an ordered result, hiding the first few items from you. However, the first index in a sorted query result is always `0`, irrespective of whether it is specified with `offset` or not. Accordingly, events for the following subscription will carry `index` values in the range between `0` and `9`:

```js
var stream = db.Todo.find()
               .matches('name', /^My Todo/)
               .ascending('deadline')
               .ascending('name')
               .descending('active')
               .offset(5)// skip the first 5 items
               .limit(10)// only return the first 10 items
               .eventStream();
```

With respect to efficiency, the same rules apply to event stream and regular (i.e. non-streaming) queries: Enforcing order on huge results is expensive and sorting queries should therefore be avoided when filter queries would do as well.

<div class="note"><strong>Note:</strong> Currently, event stream sorting queries are <em>always executed as anonymous queries</em>, i.e. they will only give you data that is publicly visible. To retrieve data protected by object ACLs, you have to either forgo real-time (use a plain sorting query) or ordering (use a real-time query without <code>limit</code>, <code>offset</code>, <code>ascending</code> and <code>descending</code>).
</div>

### Example: Subscription and Events

For an example of how an event stream query behaves, consider the following example where two users are working concurrently on the same database. <span class="user1">User 1</span> subscribes to an event stream sorting query and listens for the result and updates, whereas <span class="user2">User 2</span> is working on the data.

**Timestamp 0:** <span class="user1">User 1</span> and <span class="user2">User 2</span> are connected to the same database.

**Timestamp 1:** <span class="user2">User 2</span> inserts `todo1`:
```js
var todo1 = new db.Todo({name: 'My Todo 1'});
todo1.insert();

//actual result: [ todo1 ]
```

**Timestamp 2:** <span class="user1">User 1</span> subscribes to an event stream query and immediately receives a match event for `todo1`:
```js
var stream = db.Todo.find()
    .matches('name', /^My Todo/)
    .ascending('name')
    .descending('active')
    .limit(3)
    .eventStream();
subscription = stream.subscribe((event) => {
  console.log(event.matchType + '/'
    + event.operation + ': '
	+ event.data.name + ' is now at index '
	+ event.index);
});
// ... one round-trip later
//'add/none: My Todo 1 is now at index 0'
```

**Timestamp 3:** <span class="user2">User 2</span> inserts `todo2`:
```js
var todo2 = new db.Todo({name: 'My Todo 2'});
todo2.insert();

//actual result: [ todo1, todo2 ]
```

**Timestamp 4:** <span class="user1">User 1</span> receives a new event for `todo2`:
```js
//'add/insert: My Todo 2 is now at index 1'
```

**Timestamp 5:** <span class="user2">User 2</span>: inserts `todo3`:
```js
var todo3 = new db.Todo({name: 'My Todo 3'});
todo3.insert();

//actual result: [ todo1, todo2, todo3 ]
```

**Timestamp 6:** <span class="user1">User 1</span> receives a new event for `todo3`:
```js
//'add/insert: My Todo 3 is now at index 2'
```

**Timestamp 7:** <span class="user2">User 2</span> updates `todo3` in such a way that its position in the ordered result changes:
```js
todo3.name = 'My Todo 1b (former 3)';
todo3.update();

//actual result: [ todo1, todo3, todo2 ]
```

**Timestamp 8:** <span class="user1">User 1</span> is notified of this update through an event that delivers the new version of `todo3`. The fact that `todo3` had already been a match and just changed its position in the result is encoded in the event's match type `changeIndex`:
```js
//'changeIndex/update: My Todo 1b (former 3) is now at index 1'
```

**Timestamp 9:** <span class="user2">User 2</span> inserts `todo0` which sorts before all other items in the result and therefore is assigned index `0`:
```js
var todo0 = new db.Todo({name: 'My Todo 0'});
todo0.insert();

//entities in DB: [ todo0, todo1, todo3 ], todo2
//                 <--- within limit --->
```
Because of the `.limit(3)` clause, only the first three of all four matching entities are valid matches and the last one — currently `todo2` — is *pushed beyond limit* and therefore leaves the result.

**Timestamp 10:** <span class="user1">User 1</span> receives two events that correspond to the two relevant changes to the result:
```js
//'remove/none: My Todo 2 is now at index undefined'
//'add/insert: My Todo 0 is now at index 0'
```

**Timestamp 11:** <span class="user2">User 2</span> updates `todo3` again, so that it assumes its original name:
```js
todo3.name = 'My Todo 3';
todo3.update();

//entities in DB: [ todo0, todo1, todo2 ], todo3
//                 <--- within limit --->
```
Through this update, `todo2` and `todo3` swap places.

**Timestamp 12:** <span class="user1">User 1</span> receives the corresponding events:
```js
//'remove/update: My Todo 3 is now at index undefined'
//'add/none: My Todo 2 is now at index 2'
```

**Timestamp 13:** <span class="user2">User 2</span> deletes `todo3`:
```js
todo3.delete();

//entities in DB: [ todo0, todo1, todo2 ]
```
Note that the deleted entity was not part of the result set.

**Timestamp 14:** <span class="user1">User 1</span> no match, because deleting `todo3` had no effect on the query result.
```js
//nothing happened
```

User 1 starts receiving the initial result directly after subscription (Timestamp 2). From this point on, any write operation performed by User 2 is forwarded to User 1 — as long as it's affecting the subscribed query's result. Changes to non-matching items have no effect in the eyes of User 1 (Timestamps 13/14).

Be aware that operation-related semantics are rather complex for sorting queries: For example, `insert` and `update` operations may trigger an item to *leave* the result (Timestamps 9/10 and 11/12). Similarly (even though not shown in the example), an `add` event can be triggered by a `delete` when an item enters the result set from beyond limit. When triggered by an operation on a different entity, an event may even be delivered with no operation at all (Timestamps 10 and 12).

<div class="tip"><strong>Tip:</strong>
Bottom line, be careful when filtering the event stream of a sorted query by operation!
</div>


## Advanced Features: RxJS

The Baqend Real-Time SDK is shipped with [basic support for ES7 Observables](https://github.com/tc39/proposal-observable), so that you can use it without requiring external dependencies.
To leverage the full potential of Baqend's real-time query engine, though, we recommend using it in combination with the feature-rich RxJS client library.

In the following, we give you some references and a few examples of what you can do with RxJS and Baqend Real-Time Queries.

### RxJS: The ReactiveX JavaScript Client Library

Since the [RxJS documentation is great and extensive](http://reactivex.io/tutorials.html), we do not go into detail on our client library, but rather provide a few references to get you started:

- [What is ReactiveX?](http://reactivex.io/intro.html)
- [What is an observable?](http://reactivex.io/documentation/observable.html)
- [Operators: What can I do with an observable?](http://reactivex.io/documentation/operators.html)
- [Which operator do I need for ...?](http://xgrommx.github.io/rx-book/content/which_operator_do_i_use/instance_operators.html)

### Real-Time Aggregations

Another neat use case for event stream queries is to compute and maintain aggregates in real-time.
Similar to result set maintenance, the basic idea is to keep all relevant information in an *accumulator* and to recompute and output the updated aggregate value whenever an event is received.

#### Count

One of the simpler aggregates over a collection of entities is the *cardinality* or *count*, i.e. the number of entities in the collection. The following code will compute and maintain the cardinality of the query result:

```js
var maintainCardinality = (counter, event) => {
  if (event.matchType === 'add') {// entering item: count + 1
    counter++;
  } else if (event.matchType === 'remove') {// leaving item: count - 1
    counter--;
  }
  return counter;
};

var subscription = stream.scan(maintainCardinality, 0)// update counter
                     .subscribe(value => console.log(value));// output counter
```

The current number of entities in the result set will be printed to the console whenever a change occurs.

<div class="tip"><strong>Tip:</strong>
Count maintenance is a good example where it makes sense to not subscribe to the default match types (<code>['all']</code>), because you are actually only interested in <code>add</code> and <code>remove</code> events: To restrict the events you will receive to those that really matter, register the event stream query with <code>.eventStream({matchTypes: ['add', 'remove']})</code>.
</div>

#### Average

Now to a more complex example: Let's say you are interested in the **average number of activities** of each of the todo lists matching your query.

```js
var initialAccumulator = {
  contributors: {},// individual activity counts go here
  count: 0,// result set cardinality
  sum: 0,// overall number of activities in the result
  average: 0// computed as: sum/count
};
```

The accumulator is not just an integer, but an object with several values: For maximum precision, we maintain the overall number of activities (`sum`) and result cardinality (`count`) separately and compute the `average` fresh on every event. We remember the number of activities for every individual entity in a map (`contributors`); this is necessary, because otherwise we would not have a clue by how much to decrement `sum` when an entity is updated or leaves the result set.

```js
var maintainAverage = (accumulator, event) => {
  var newValue = event.matchType === 'remove' ? 0 : event.data.activities.length;
  var oldValue = accumulator.contributors[event.data.id] || 0;//default: 0

  if (newValue !== 0) {// remember new value
    accumulator.contributors[event.data.id] = newValue;
  } else {// forget old value
    delete accumulator.contributors[event.data.id];
  }
  accumulator.sum += newValue - oldValue;
  accumulator.count += event.matchType === 'remove' ? -1 : event.matchType === 'add' ? 1 : 0;
  accumulator.average = accumulator.count > 0 ? accumulator.sum / accumulator.count : 0;
  return accumulator;
};
```

The maintenance function extracts the current number of activities (`newValue`) from the incoming event and the former value (`oldValue`) from the `contributors` map in the accumulator. Depending on whether the incoming entity contributes to the average or not, it either stores the new value in the map or removes the old value. Finally, `sum` and `count` are updated and the average is computed and stored as `accumulator.average`.

Since we are only interested in the average value, we add another step to extract it from the accumulator via the `map` operator:

```js
var subscription = stream.scan(maintainAverage, initialAccumulator)//update counter
                           .map(accumulator => accumulator.average)//extract average
                           .subscribe(value => console.log(value));//output counter
```

## Limitations

The real-time feature is available for all queries with the following limitations:

- Currently, *real-time sorting queries only return public data*, even when executed with admin privileges; to retrieve private data, use regular (i.e. non-streaming) sorting queries or real-time queries that do not contain `limit`, `offset`, `ascending`, `descending` or `sort`.
- Geospatial queries (`withinSphere`, `withinPolygon`) are currently not available for real-time
