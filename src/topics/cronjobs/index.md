
## Cron Jobs: Scheduled Code Execution

You can schedule any Baqend Module for execution by adding an entry to the `jobs.Definition` collection. 
This can be done in two ways:

- **code**: Save and you Cron job object:
```js
job = new DB['jobs.Definition']();
job.save();
```
            
- **dashboard**: Simply enter the dashboard, click on `jobs` in the menu on the left and then click on `Definition`. You are now looking at all **cron jobs** that are defined for your app. To start a job, click `add` and provide the job parameters.

<div class="note"><strong>Delayed scheduling from node server:</strong> Please note that jobs created by a Baqend Code module (i.e. by the <code>node</code> role) will be scheduled with a delay, while jobs inserted by any other user (e.g. through the dashboard) will be scheduled immediately. If there already is an active job, the node-related delay will be up to 10 minutes; for the first job you activate, though, the delay can be up to 24 hours.</div>

### Scheduling Parameters

The following parameters are permitted:

- **module**: the name of the *Baqend Code module* to execute. The job will call the `run` method on your module (or `call` as a fallback; see below for [details](#defining-a-cron-job)).
- **cronpattern**: a custom scheduling rule that determines when your code will be executed; see below for [usage details](#cron-patterns).
- **startsAt**: the moment of the first execution; jobs will start immediately by default. 
- **expiresAt** (optional): the moment at which the job is stopped.
- **nextExecution** (read-only): On every execution, this value will automatically be updated; the new value represents the next point in time at which the job will be executed.

To verify that your job is running all right, check the `jobs.Status` collection. Your job will write one of the following status values into the collection whenever it is executed:

- `EXECUTING`: The job is currently executing.
- `SUCCESS`: The job was executed without a problem.
- `ERROR`: There was an exception while executing the job.
- `ABORTED`: The job could not be started, for example because you did not provide a module. 

### Cron Patterns

A **cron job pattern** may contain the following:
 
- *asterisks* (`*`; executes *every* second, *every* minute etc.),
- *numbers* (e.g. `3`), 
- *hash* (i.e. `H` to use any valid value from the corresponding value range), 
- *ranges* (e.g. `1-6` or `1-3,5`), 
- and *steps* (e.g. `*/2`).

<div class="note"><strong>Cron patterns based on <u>seconds</u>:</strong> We use a third-party library for code scheduling which uses <em>seconds</em> as smallest time unit. See their docs for more details on the supported <a href="https://github.com/kelektiv/node-cron#available-cron-patterns" target="_blank">cron job patterns</a>.</div>

Our cron job patterns adhere to the below structure:

```text
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    |
│    │    │    │    │    └ day of week (0 - 6)
│    │    │    │    └───── month (0 - 11)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, optional)
```

Here are a few examples for patterns and possible use cases:

- `H */10 * * * *`: Perform a healthcheck every 10 minutes.
- `0 */10 * * * *`: Perform a healthcheck every 10 minutes, at the beginning of the minute *sharp*.
- `* */10 * * * *`: Perform a healthcheck on each second during every 10th minute.
- `0 0 20 * * 1-5`: Run a backup every weekday (Monday through Friday), at 8 PM.
- `0 30 12 * * 1,3,5`: Email statistics to your CTO every Monday, Wednesday and Friday, at 12:30 PM.

<div class="warning"><strong>Asterisk (<code>*</code>) and hash (<code>H</code>) semantics:</strong>
Be cautious when using <code>*</code> in your patterns, because it translates to execution on <em>every</em> tick. 
If you don't care about the concrete value (e.g. the specific second), use <code>H</code>; it will be replaced with a random value. 
For illustration, consider the following patterns:
<ul>
	<li><code><u>0</u> */10 * * * *</code>: Perform a task on the <u>1st second</u> of every 10th minute.</li>
	<li><code><u>H</u> */10 * * * *</code>: Perform a task on <u>any second</u> of every 10th minute.</li>
	<li><code><u>*</u> */10 * * * *</code>: Perform a task on the <u>every second</u> of every 10th minute.</li>
</ul>
</div>

### Defining Behavior

On execution, a cron job will call the `run` method exported by the referenced Baqend code module. 
If there is no `run` method, the `call` method will be invoked.
If neither of those methods is exported, your job will not execute (status: `ABORTED`).
The code is executed as an anonymous user with `node` role permissions.
The following example shows how to define and export code for a cron job: 

```js
exports.run = function(db, jobsStatus, jobsDefinition) {
  return new Promise(function(resolve, reject) {
    // ... just doin' my job!
  });
};
```

You can also **abort job execution** when an error occurs. 
Your code will still be executed on the next regular occasion, but the current execution will be interrupted and an error message will be logged in the corresponding status object:

```js
exports.run = function(db, jobsStatus, jobsDefinition) {
  return new Promise(function(resolve, reject) {
      // ... do something useful
    if (thereIsAProblem) {
      throw new Abort('There was a problem!');
    }
  });
};
```

In order to execute asynchronous tasks, you can also return a **promise** in your job code: 
Your job will be in status `EXECUTING`, until the returned promise is either resolved (status: `SUCCESS`) or rejected (`ERROR`).

There are three function **parameters**:

- `db`: a database reference.
- `jobsStatus`: the status object representing the current job execution. You can extend the schema of the job status collection by custom attributes for enhanced status semantics.
- `jobsDefinition`: the object representing your job. Having access to this object can be useful, for example to deactivate the job when some condition is met. (To this end, just set *expiresAt* attribute to some point in the past.)

<div class="warning"><strong>Do not save</strong> <code>jobsStatus</code> <strong>or</strong> <code>jobsDefinition</code><strong>:</strong>
Both the job's status and definition will implicitly be saved after job execution. 
Your job code may modify both, but saving them will interfere with our mechanism for failsafe execution! 
</div>
