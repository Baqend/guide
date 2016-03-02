## Getting Started
Follow this 5 minute quickstart, to setup a new web project with Baqend. We will build a simple message wall.

 <ol class="getting-started-list">
<li>
###Create a Baqend account
To build a new application, first [create a Baqend account](http://dashboard.baqend.com/). You can type in a name for your new application and a new dedicated server instance will be deployed and hooked up to the caching infrastructure (typically in 20 seconds).
</li>
<li>
###Download Boilerplate Web Project
We'll start with [this empty HTML5 Bootstrap project](http://www.initializr.com/builder?boot-hero&html5shiv&simplehtmltag&izr-emptyscript&boot-css). Unzip it, to get the following folder structure:
<pre>
**index.html**          <-- here we will put some HTML to accept input data
js
    **main.js**         <-- our application logic hooked up to Baqend
    vendor          <-- JavaScript libraries
css
    main.css        <-- our style
    bootstrap.css   <-- [Bootstrap](http://getbootstrap.com/) style
img, fonts          <-- assets
</pre>
</li>
<li>
###Install Baqend
To install Baqend to the application, just add the CDN-hosted Baqend SDK in the `<head>` section of the index.html:
```html
<script src="http://www.baqend.com/js-sdk/latest/baqend.min.js"></script>
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
The callback is invoked when the connection is established. We will use that to display the message wall in `showMessages()`, but first we need some data.
</li>
<li>
###Defining the Data Model
In the [dashboard](https://dashboard.baqend.com/apps) enter the App and create a new table named `Message` in the *Data* menu on the left.
</li>
<li>
###Saving Data
bldslfsldf lsdflsd sdfs
</li>
<li>
###Querying Data
bldslfsldf lsdflsd sdfs
</li>
</ol>

<style>
.getting-started-list {
    list-style: none;
    counter-reset: cnt;
    margin-left: 0;
}

.getting-started-list {
    
}

.getting-started-list li {
    position: relative;
    border-left: 2px solid #1967CC;
    padding: 0 0 60px 50px;
    margin-bottom: -30px;
}

.getting-started-list li:last-child {
    border: none;
}

.getting-started-list li:before {
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