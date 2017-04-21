# Caching

## How Baqends Caching works

Baqend uses a combination of CDN and client caching using a Bloom filter-based data structures called **Cache-Sketch**. This enables Baqend-based applications to use not only CDN caches but also expiration-based caches  —  in most cases the browser cache  —  to cache any _dynamic_ data.

### Caching everything, not just assets

The tricky thing when using such caches is that you must specify a cache lifetime (TTL) when you first deliver the data from the server. After that you do not have any chance to kick the data out. It will be served by the browser cache up to the moment the TTL expires. For static assets it is not such a complex thing, since they usually only change when you deploy a new version of your web application. Therefore, you can use cool tools like [gulp-rev-all](https://github.com/smysnk/gulp-rev-all) and[grunt-filerev](https://github.com/yeoman/grunt-filerev) to hash the assets. By renaming the assets at deployment time you ensure that all users will see the latest version of your page while using caches at their best

But wait! What do you do with all the data which is loaded and changed by your application at runtime? Changing user profiles, updating a post or adding a new comment are seemingly impossible to combine with the browsers cache, since you cannot estimate when such updates will happen in the future. Therefore, caching is just disabled or very low TTLs are used.

![How does the browser cache work](normal-caching.png)

#### Baqend’s Cache-Sketch

We have researched and developed a solution where we can check the staleness of any data before we actually fetch them. At the begin of each user session the `connect`call fetches a very small data structure called a Bloom filter, which is a highly compressed representation of a set. Before making a request, the SDK first checks this set to know if it contains an entry for the resource we fetch. An entry in the set indicates that the content was changed in the near past and that the content may be stale. In such cases the SDK bypasses the browser cache and fetches the content from the nearest CDN edge server. In all other cases the content is served directly from the browsers cache. Using the browser cache saves network traffic, bandwidth and is rocket-fast.

In addition, we ensure that the CDN always contains the most recent data, by instantly purging data when it becomes stale.

![Sketch of the Bloomfilter Cache](cache-sketch.png)

The [Bloom filter](http://de.slideshare.net/felixgessert/bloom-filters-for-web-caching-lightning-talk) is a probabilistic data structure with a tunable false positive rate, which means that the set may Indicate containment for objects which were never added. This is not a huge problem since it just means the we first revalidate the freshness of an object before we serve it from the browsers cache. Note that the false positive rate is very low and it is what enables us to make the footprint of the set very small. For an example we just need 11Kbyte to store 20,000 distinct updates.

There is lot of stream processing (query match detection), machine learning (optimal TTL estimation) and distributed coordination (scalable Bloom filter maintenance) happening at the server side. If you’re interested in the nitty-gritty details have a look at this [paper](https://www.baqend.com/paper/btw-cache.pdf) or [these slides](http://de.slideshare.net/felixgessert/talk-cache-sketches-using-bloom-filters-and-web-caching-against-slow-load-times) for a deep-dive.

<div class="note"><strong>Note:</strong> Caching is active for all CRUD operations by default. Query Caching is currently in beta, if you would like to test it please contact <a href="mailto:support@baqend.com">support@baqend.com</a>.</div>


## Configuring Freshness

Any new page load will always return the newest data (a fresh Bloom filter is fetched). While the app is running you can allow a configurable maximum staleness to make optimal use of the browser cache. This does not mean that you will actually see any outdated content, it just provides you with an upper bound that is never exceeded.

There are two settings affecting Bloom filter freshness that can be configured in the dashboard:

 - *Maximum CDN staleness*: this is the staleness bound for all new clients (i.e. that have not cached a Bloom fitler, yet). The default setting is to only do micro-caching of 1 second. This incurs 1 second of staleness at the maximum and protects the server from excessive load under high user volumes.
 - *Maximum total staleness*: defines the maximum staleness seen by the client (CDN staleness + client cache staleness). Internally the client makes sure to update the Bloom filter, when it gets too old.

<div class="tip"><strong>Tip:</strong> You can increase both staleness settings, if your application is under very heavy load. This saves you requests and prevents scalability bottlenecks if you are in the free tier.</div>

If you want to override the total staleness in individual clients, you can set it manually:

```js
DB.configure({
    staleness : 10
}).connect().then(...);
```

For individual operations you can optionally bypass the cache to get **strong consistency** (linearizability):

```js
//To get the newest version via the id
var todo = DB.Todo.load("myTodo", {refresh : true });

//To update a known instance to the latest version
todo.load({refresh : true });
```

## Local Objects

You can request already loaded objects using the `local` flag. It will try to give you an instance you have already loaded and only load it, if it's not present:
```js
//If we have seen "myTodo" in the code we will get exactly that instance
DB.Todo.load("myTodo", {local : true }).then(...);

//local is the default for the instance method
todo.load().then(...);

//This is also useful to see your own unsaved changes, irrespective of updates from other users
todo.done = true;
DB.Todo.load("myTodo", {local : true }).then(function() {
    console.log(todo.done); // true
});
```
