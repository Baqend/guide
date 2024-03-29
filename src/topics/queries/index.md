# Queries

To retrieve objects by more complex criteria than their id, queries can be used. They are executed on Baqend and
return the matching objects.
The Baqend SDK features a [query builder](https://www.baqend.com/js-sdk/latest/query.Builder.html) that creates
[MongoDB queries](http://docs.mongodb.org/manual/tutorial/query-documents/) under the hood. It is possible
 to formulate native MongoDB queries, but using the query builder is the recommend way: it is far more readable and
 does all the plumbing and abstraction from MongoDB obscurities.

## `resultList`, `singleResult` and `count`
The simplest query is one that has no filter criterion and thus returns all objects.
The actual result is retrieved via the `resultList` method.
```js
db.Todo.find().resultList((result) => {
  result.forEach((todo) => {
    console.log(todo.name); //'My first Todo', 'My second Todo', ...
  });
});
```

You can also use the `depth`-parameter to query the entities to a specified depth just like for normal [reads](../crud/#read).


To find just the first matching object, use the `singleResult` method.
If there is no result, it will give you null.
```js
db.Todo.find().singleResult((todo) => {
  if (!todo) {
    // No todo available…    
  } else {
    console.log(todo.name); //'My first Todo'    
  }
});
```

Both `resultList` and `singleResult` [support deep loading](../deep-loading#deep-loading-with-queries) to also load references.

If you just need the number of matching objects, use the `count` method.
```js
db.Todo.find().count((count) => {
  console.log(count); //'17'
});
```

## Filters
Usually queries are employed to exert some kind of filter. The query builder supports lots of different
[filters](https://www.baqend.com/js-sdk/latest/query.Filter.html),
that can be applied on entity attributes. By default chained filters are *and*-combined.
```js
db.Todo.find()
  .matches('name', /^My Todo/)
  .equal('active', true)
  .lessThanOrEqualTo('activities.start', new Date())
  .resultList(...)
```

The above query searches for all todos, whose name starts with `'My Todo'`, are currently active and contain an
activity in its activities list that has been started before the current date.

Note that all valid MongoDB attribute expressions can be used as a field name in a filter, in particular
path-expressions such as 'activities.start'.

If you are familiar with [MongoDB queries](http://docs.mongodb.org/manual/tutorial/query-documents/), you can
use the `where` method to describe a query in MongoDB's JSON format. An equivalent query to the above one would look
like this:
```js
db.Todo.find()
  .where({
    "name": { "$regex": "^My Todo" },
    "active": true,
    "activities.start": { "$lte": { "$date": new Date().toISOString() }}
  })
  .resultList(...)
```

The following table list all available query filters and the types on which they can be applied:

<div class="table-wrapper"><table class="table">
  <thead>
  <tr>
    <th colspan="3" style="border: none">Filter method</th>
  </tr>
  <tr>  
    <th width="25%">
      MongoDB equivalent
    </th>
    <th width="20%">Supported types</th>
    <th>Notes</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>equal('name', 'My Todo')</code></td>
  </tr>
  <tr>
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/eq/">$eq</a></td>
    <td>All types</td>
    <td>Complex types like embedded objects only match if their complete structure matches.</td>
  </tr>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>notEqual('name', 'My Todo')</code></td>
  </tr>
  <tr>  
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/ne/">$neq</a></td>
    <td>All types</td>
    <td>Complex types like embedded objects only match if their complete structure matches.</td>
  </tr>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>greaterThan('total', 3)</code></td>
  </tr>
  <tr>  
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/gt/">$gt</a></td>
    <td>Numbers, Dates, Strings</td>
    <td><code>gt()</code> is an alias</td>
  </tr>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>greaterThanOrEqualTo('total', 3)</code></td>
  </tr>
  <tr>  
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/gte/">$gte</a></td>
    <td>Numbers, Dates, Strings</td>
    <td><code>ge()</code> is an alias</td>
  </tr>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>lessThan('total', 3)</code></td>
  </tr>  
  <tr>  
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/lt/">$lt</a></td>
    <td>Numbers, Dates, Strings</td>
    <td><code>lt()</code> is an alias</td>
  </tr>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>lessThanOrEqualTo('total', 3)</code></td>
  </tr>
  <tr>  
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/lte/">$lte</a></td>
    <td>Numbers, Dates, Strings</td>
    <td><code>le()</code> is an alias</td>
  </tr>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>between('total', 3, 5)</code></td>
  </tr>
  <tr>  
    <td>-</td>
    <td>Numbers, Dates, Strings</td>
    <td>It is equivalent to <code>gt('total', 3).lt('total', 5)</code></td>
  </tr>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>in('total', 3, 5[,...])</code></td>
  </tr>
  <tr>  
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/in/">$in</a></td>
    <td>All types</td>
    <td>
        For primitive fields <strong>any</strong> of the given values have to match the field value.
        On set and list fields <strong>at least one</strong> value must be contained in the collection in order for the
        filter to match.
    </td>
  </tr>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>notIn('total', 3, 5[,...])</code></td>
  </tr>
  <tr>  
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/nin/">$nin</a></td>
    <td>All types</td>
    <td>
      On primitive fields <strong>none</strong> of the given values must match the field value.
      On set and list fields <strong>none</strong> of the given values must to be contained in the collection in order
      for the filter to match.
    </td>
  </tr>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>isNull('name')</code></td>
  </tr>
  <tr>  
    <td>-</td>
    <td>All types</td>
    <td>Checks if the field has no value; equivalent to <code>equal('name', null)</code></td>
  </tr>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>isNotNull('name')</code></td>
  </tr>
  <tr>  
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/exists/">$exists</a></td>
    <td>All types</td>
    <td>
      Checks if the field has a value; equivalent to <code>where({ "name": { "$exists": true, "$ne": null } })</code>
    </td>
  </tr>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>containsAny('activities', activity1, activity2 [,...])</code></td>
  </tr>
  <tr>  
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/in/">$in</a></td>
    <td>List, Set, JsonArray</td>
    <td>Checks if the collection contains any of the given elements</td>
  </tr>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>containsAll('activities', activity1, activity2 [,...])</code></td>
  </tr>
  <tr>  
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/all/">$all</a></td>
    <td>List, Set, JsonArray</td>
    <td>Checks if the collection contains all of the given elements</td>
  </tr>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>mod('total', 5, 3)</code></td>
  </tr>
  <tr>
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/mod/">$mod</a></td>
    <td>Number</td>
    <td>The field value divided by divisor must be equal to the remainder</td>
  </tr>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>matches('name', /^My [eman]{4}/)</code></td>
  </tr>
  <tr>  
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/regex/">$regex</a></td>
    <td>String</td>
    <td>
      The regular expression must be anchored (starting with <code>^</code>); ignore case and global flags are not
      supported.
    </td>
  </tr>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>size('activities', 3)</code></td>
  </tr>
  <tr>  
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/size/">$size</a></td>
    <td>List, Set, JsonArray</td>
    <td>Matches if the collection has the specified size.</td>
  </tr>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>near('location', &lt;geo point&gt;, 1000)</code></td>
  </tr>
  <tr>  
    <td><a href="http://docs.mongodb.org/manual/reference/operator/query/nearSphere/">$nearSphere</a></td>
    <td><a href="../schema/#primitives">GeoPoint</a></td>
    <td>
      The geo point field has to be within the maximum distance in meters to the given GeoPoint.
      Returns from nearest to furthest.<br>
      You need a Geospatial Index on this field, to use this kind of query. Read the query index section for more details.
    </td>
  </tr>
  <tr>
    <td colspan="3" style="border-top: none; padding-top: 20px"><code>withinPolygon('location', &lt;geo point list&gt;)</code></td>
  </tr>
  <tr>  
    <td><a href="https://docs.mongodb.com/manual/reference/operator/query/geoWithin/">$geoWithin</a></td>
    <td><a href="../schema/#primitives">GeoPoint</a></td>
    <td>
      The geo point of the object has to be contained within the given polygon.
      You need a Geospatial Index on this field, to use this kind of query. Read the <a href="../queries#query-indexes">query indexes</a> section
      for more details.
    </td>
  </tr>
  </tbody>
</table></div>

<div class="note"><strong>Note on Chaining:</strong> When chaining expressions that rely on the same MongoDB operator, only the most recently called expression will take effect. For example, <code>isNotNull</code> and <code>notEqual</code> both rely on MongoDB's <code>$ne</code> operator, so that the following two query builders will produce the exact same query:
<ol>
	<li><code>db.Test.notEqual('test', '')</code></li>
	<li><code>db.Test.isNotNull('test').notEqual('test', '')</code></li>
</ol>
In the second builder, <code>notEqual</code> overrides the effect of <code>isNotNull</code>, so that the resulting query will match records where the <code>test</code> attribute is <code>null</code>.
</div>

You can get the current GeoPoint of the User with <code>db.GeoPoint.current()</code>. This only works with an HTTPS connection.

References can and should be used in filters. Internally references are converted to ids
 and used for filtering. To get all Todos owned by the currently logged-in user, we can simply use the User instance
 in the query builder:

```js
db.Todo.find()
  .equal('owner', db.User.me) //any other User reference is also valid here
  .resultList(...)
```

<div class="note"><strong>Note:</strong> <code>db.user.me</code> refers to the currently logged-in User instance. To learn more about users and the
login process see the <a href="../user-management/#users-roles-and-permissions">User, Roles and Permission chapter</a>.</div>

## Sorting

It is possible to sort the query result for one or more attributes. The query builder can be used to specify
which attributes shall be used for sorting. Let's sort our query result by name:
```js
db.Todo.find()
  .matches('name', /^My Todo/)
  .ascending('name')
  .resultList(...)
```

If you use more than one sort criterion, the order of the result reflects the order in which the sort methods were
called. The following query will list all active tasks before the inactive ones and sort the tasks by their name in
ascending order.
```js
db.Todo.find()
  .matches('name', /^My Todo/)
  .ascending('name')
  .descending('active')
  .resultList(...)
```

When calling `descending('active')` before `ascending('name')` the result is sorted by name and
then by active flag, which is only relevant for multiple todos having the same name.

You can also set the sort criteria with the MongoDB [orderby](http://docs.mongodb.org/manual/reference/operator/meta/orderby/)
syntax by using the `sort()` method. An equivalent expression to the above is this:
```js
db.Todo.find()
  .matches('name', /^My Todo/)
  .sort({"name": 1, "active": -1})
  .resultList(...)
```

## Offset and Limit
On larger data sets you usually don't want to load everything at once. Its often reasonable to instead page through the
query results. It is therefore possible to skip objects and limit the result size.
```js
var page = 3;
var resultsPerPage = 30;

db.Todo.find()
  .matches('name', /^My Todo/)
  .ascending('name')
  .offset((page - 1) * resultsPerPage)
  .limit(resultsPerPage)
  .resultList(...)
```

<div class="note"><strong>Note:</strong> An offset query on large result sets yields [poor query performance](http://use-the-index-luke
.com/sql/partial-results/fetch-next-page). Instead, consider using a filter and sort criteria to navigate through
results.</div>

For instance if you implement a simple pagination, you can sort by id and can get the data of the next
page by a simple greaterThen filter. As the id always has an index this results in good performance regardless of the
 query result size.
```js
var pageId = '00000-...';
var resultsPerPage = 30;

db.Todo.find()
  .matches('name', /^My Todo/)
  .greaterThan('id', pageId)
  .ascending('id')
  .limit(resultsPerPage)
  .resultList(function(result) {
    pageId = result[result.length - 1];  
  })
```

But often you want to sort your result by another attribute (e.g. `createdAt`). When you sort by an attribute which
by itself is not unique you must combine it with a unique attribute (e.g. `id`).

```js
//initialize default values
var resultsPerPage = 30;
var lastObject = {id: '', createdAt: new Date(0)};

//later page through the pages by the following query
var qb = db.Todo.find();
qb.or(qb.equal('createdAt', lastObject.createdAt).greaterThan('id', lastObject.id), qb.greaterThan('createdAt', lastObject.createdAt))
     .ascending('createdAt')
     .ascending('id')
     .limit(resultsPerPage)
     .resultList(function(result) {
        //track last seen object
        lastObject = result[result.length - 1];
        console.log(result);
      });
```

*Explanation:* By combining the results of the query which fetches all remaining entities where the `createdAt` is equal to our last seen `createdAt`
plus all ids which are greater than the last seen `id` we make our result unique when `createdAt` has the same value on
multiple entities. That guarantees a unique order for none unique attributes.

## Composing Filters by `and`, `or` and `nor`

Filters are joined with `and` by default. In more complex cases you may want to formulate a query with one or more
[and](http://docs.mongodb.org/manual/reference/operator/query/and/),
[or](http://docs.mongodb.org/manual/reference/operator/query/or/) or
[nor](http://docs.mongodb.org/manual/reference/operator/query/nor/)  expressions.
For such cases the initial `find()` call returns a
[Query.Builder](https://www.baqend.com/js-sdk/latest/query.Builder.html) instance. The builder provides
additional methods to compose filter expressions.

The following query finds all todos which the logged-in user is not currently working on and all todos which aren't
done yet:
```js
var queryBuilder = db.Todo.find();
var condition1 = queryBuilder
  .matches('name', /^My Todo/)
  .equal('active', false);

var condition2 = queryBuilder
  .matches('name', /^Your Todo/)
  .equal('done', false);

queryBuilder.or(condition1, condition2)
  .ascending('name')
  .resultList(...)
```

## Query Indexes
Indexes on fields that are frequently queried can massively impact the overall query performance. Therefore our Dashboard
provides a very comfortable way to create custom indexes on fields. It is always an tradeof on which fields you should
create an index. A good index should be created on fields that contains many distinct values. But to many indexes on the
same class can also reduce the write throughput. If you like to read more about indexes we currently use, visit the mongo
[indexes docs](https://docs.mongodb.org/manual/indexes/).

To create an Index open the schema view of the class and use the *Index* or *Unique Index* button to create an index.
Currently we support three types of indexes:

**Index:** A simple index which contains a single field used to improve querys which filters the specified field.

**Unique Index:** A index that requires uniqueness of the field values. Inserting or updating objects that violates the
 unique constraint will be rejected with an ObjectExists error.

**Geospatial Index:** This index can be created on GeoPoint fields and is required for `near` and `withinPolygon` query
filters. This Index is created on GeoPoint fields by using the *Index* Button.
