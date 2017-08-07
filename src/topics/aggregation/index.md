# Aggregation

With aggregation you can perform a variety of operations on your data, e.g. group values from multiple documents together or transform your data and compute new values.

The Baqend SDK is using the [MongoDB Aggregation Framework](https://docs.mongodb.com/manual/core/aggregation-pipeline/) for data aggregation. This Framkework is modeled on the concept of a pipeline, which consists of multiple stages that process and transform your data and pass it to the next stage successively.

## Stages
Each stage performs an operation on the input data. After processing the operation, the result serves as input for the next stage.
 For all possible stage operations see the [MongoDB Aggregation Pipeline Operators](https://docs.mongodb.com/manual/reference/operator/aggregation/).

The Baqend SDK feature an aggregation builder (similar to the [Query Builder](../queries)).

An aggregation stage is added via the `addstage` method.
```js
DB.Todo.aggregate().addStage({
  $match : { "activities.start": { "$lte": { "$date": new Date().toISOString() } }
}).addStage({
  $group : { _id: $done, count: { $sum: 1} }
}).result((result) => {
  console.log(count);
});
```
The above aggregation first filters all todos, which contain an activity in its activities list that has been started before the current date, and then group and count them by their "done" state.



<div class="note"><strong>Note:</strong> The stage operators '$out' and '$lookup' are not supported.</div>



## Result

You can retrieve the aggregation result using the `result` method.
The result is given as a list of objects, whose structure is dependend on your aggregation. So the objects do not represent the schema on which the aggregation is processed.


```js
DB.Todo.aggregate().addStage({
  $group : { _id: $done, count: { $sum: 1} }
}).result((result, error) => {
  if(error) {
    console.error(error);
  } else {
    console.log(result);
  } 
});
```


