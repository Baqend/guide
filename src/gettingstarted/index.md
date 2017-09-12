## Quickstart
Follow this 5 minute quickstart, to setup a new web project with Baqend. We will build a simple message wall.

 <ol class="getting-started-list">
<li>
###Create a Baqend Account
To build a new application, first [create a Baqend account](http://dashboard.baqend.com/). Type in a name for your new application and a dedicated server instance will be deployed and hooked up to our global caching infrastructure (typically in 20 seconds).
</li>
<li>
###Download Boilerplate Web Project
We'll start with [this empty HTML5 Bootstrap project](https://github.com/Baqend/quick-starter/archive/master.zip) (or <a href="http://www.initializr.com" target="_blank">configure a custom one</a>). Unzip it, to get the following folder structure:
<pre>
**index.html**          <-- here we will put some HTML to accept input data
js
    **main.js**         <-- your application logic hooked up to Baqend
    vendor          <-- JavaScript libraries
css
    main.css        <-- our style
    bootstrap.css   <-- [Bootstrap](http://getbootstrap.com/) style
img, fonts          <-- assets
</pre>
In a few steps your app will look like this:

<img src="textwall.png" style="width:60%;">
</li>
<li>
###Install Baqend
To install Baqend to the application (alreay included in the zip you downloaded), just add the CDN-hosted Baqend SDK
at the end of the `<body>` section of the index.html using your favourite IDE (e.g. [WebStorm](https://www.jetbrains.com/webstorm/))
or text editor (e.g. [Sublime](https://www.sublimetext.com/3)):
```html
<script src="https://www.baqend.com/js-sdk/latest/baqend.min.js"></script>
```
Other installation methods (e.g. npm) are explained [on Github](https://github.com/Baqend/js-sdk/blob/master/README.md).
</li>
<li>
###Connect to the Cloud
In the `main.js`, add the following lines to connect to Baqend Cloud:

```js
DB.connect("<your-app-name>", function() {
	showMessages();
});
```
The callback is invoked when the connection is established. We will use that to display the message wall in `showMessages`, but first we need some data.
</li>
<li>
###Define the Data Model
In the [dashboard](https://dashboard.baqend.com/apps) enter your App and create a new table named `Message` in the **Data** menu on the left. In the schema tab that is now open, add three attributes:
<table class="table">
<tr><th>Attribute Name</th><th>Type</th></tr>
<tr><td>name</td><td>String</td></tr>
<tr><td>message</td><td>String</td></tr>
<tr><td>date</td><td>DateTime</td></tr>
</table>
Now go to the **Data** tab and click **Add** to insert a dummy message to the database.

To learn more about data modeling in Baqend, see the [Schema and Types documentation](/#schema-and-types).
</li>
<li>
###Save Data
Now, let's enhance the `index.html` with an input for name and message as well as post button. Replace all the code starting before `<div class="jumbotron">` just until the `<hr>` with this:

```html
<div class="jumbotron">
  <form onsubmit="leaveMessage(this.name.value, this.message.value);
  this.reset(); return false;" class="form-inline text-center container">
  <input class="form-control" name="name" placeholder="Name">
  <input class="form-control" name="message" placeholder="Message">
  <button type="submit" class="btn btn-primary">Leave Message</button>
</form>
</div>
<div class="container"><div class="row" id="messages"></div>
```
So when hitting enter or the button, our `leaveMessage` function is called. Let's add it to `main.js`:

```js
function leaveMessage(name, message) {
    //Create new message object
	var msg = new DB.Message();
	//Set the properties
	msg.name = name;
	msg.message = message;
	msg.date = new Date();
	//Insert it to the database
	msg.insert().then(showMessages);
}
```
So now we insert a new message, whenever the HTML form is submitted.

See the [**C**reate **R**ead **U**pdate **D**elete documentation](/#crud) to learn more about saving and loading data.
</li>
<li>
###Query Data
Now, let's display the stored data. To show the 30 newest messages, ordered by time stamp perform a simple query:

```js
function showMessages() {
  DB.Message.find()
    .descending("date")
    .limit(30)
    .resultList()
    .then(function(result) {
        var html = "";
        result.forEach(function(msg) {
            html += '<div class="col-md-4"><h2>';
            html += msg.name + '</h2><p>' + msg.message + '</p></div>';
        });
        document.getElementById("messages").innerHTML = html;
    });
}
```
At this point the application is fully working. Just open the `index.html` in the browser to use your app. If something is not working, press `F12` to see any error messages.

Queries allow you do complex filtering and sorting, see the [Query Docs](/#queris). All data loaded from Baqend Cloud is served with low latency from a global CDN.
</li>
<li>
###Protect Your Data
By default, public access to the `Message` table is allowed. Let's restrict that to only allow *inserts*, *reads* and *queries* but disallow any *updates* and *deletes*. Go to the **ACL** (Access Control Lists) tab in the dashboard and revoke delete and update rights from the Public role.

Access rights can be granted and denied both at table level and at object level. This is explained in detail in the [User, Roles and Permissions documentation](/#users-roles-and-permissions).

Baqend has full SSL support. If you want the Baqend connection to be SSL-encrypted by default, add `true` as the second parameter of the `DB.connect` call.
</li>
<li>
###Add User Registration and Login
If you would like your users to login into your application, that's easy. Your app has a predefined `User` table and the Baqend SDK comes with built-in ways to register and log in users:

```js
DB.User.register('john.doe@example.com', 'pwd').then(function() {
  //Now we are logged in
  console.log(DB.User.me.username); //'john.doe@example.com'
});
//When coming back, just log in:
DB.User.login('john.doe@example.com', 'pwd').then(...)
```

You can enable and customize email verification in the settings page of the dashboard. To support OAuth logins (e.g. "Login with Facebook"), setup OAuth as [described in the User docs](/#oauth-login), then you can simply call `DB.User.loginWithFacebook`.



</li>
<li>
###Install the Baqend CLI and Deploy

Install the [Baqend CLI](http://www.baqend.com/guide/#baqend-cli) globally with ([node.js and npm](https://nodejs.org/en/download/) is required):

```sh
$ npm install -g baqend
```

Deploy your first app version by typing:

```sh
$ baqend deploy --file-dir . <your-app-name>
```

View it online by visiting your app domain `<your-app-name>.app.baqend.com`.

</li>
<li>
###Start Building
You can use the app you just created as a baseline for a real app. To explore Baqend's other features:
<ul>
    <li>Take the [Interactive Tutorial](http://www.baqend.com/#tutorial)</li>
    <li>Read the [Developer Guide](/), to learn about server-side code &amp; validations, push notifications, logging, etc.</li>
    <li>Read the [JavaScript API Docs](/)</li>
    <li>Play with the Interative REST API: [Open Your App](https://dashboard.baqend.com) and go to *API Explorer*</li>
    <li>If you're starting from scratch, have a look at frontend bootstraping tools: [Initializr](http://www.initializr.com/) (used here), [HTML5 Boilerplate](https://html5boilerplate.com/), [Bootstrap](http://getbootstrap.com/), [Yeoman](http://yeoman.io/) and popular frontend frameworks: [Ionic](http://ionic.io/), [AngularJS](https://angularjs.org/), [React](https://facebook.github.io/react/), [Ember](http://emberjs.com/)</li>
</ul>
</li>
</ol>

<style>
.getting-started-list {
    list-style: none;
    counter-reset: cnt;
    margin-left: 0;
    margin-top: 40px;
}

.getting-started-list ul li{
    padding: 10px 0;
}

.getting-started-list h3 {
    margin-top: -116px;
    position: relative;
    z-index: 1;
}

.getting-started-list>li {
    position: relative;
    border-left: 2px solid #1967CC;
    padding: 0 0 60px 50px;
    /* disable collapsed margin */
    display: inline-block;
    width: 100%;
}

.getting-started-list>li:last-child {
    border: none;
}

.getting-started-list>li:before {
    counter-increment: cnt;
    content: counter(cnt);
    position: absolute;
    left: -18px;
    border-radius: 50%;
    background-color: #FFFFFF;
    display: block;
    width: 35px;
    height: 35px;
    line-height: 31px;
    color: #1967CC;
    border: 2px solid #1967CC;
    text-align: center;
    font-size: 21px;
}
</style>
