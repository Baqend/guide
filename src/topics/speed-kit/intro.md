# Speed Kit: Intro
In this section, we describe how to speed up your website with Baqend Speed Kit with 5 easy steps. For a more high-level introduction, see our [overview section](../speed-kit).


Watch this short video to learn how Speed Kit can help you make fast page loads your competitive advantage:

<p align="center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/lPGSFpiKBpg?rel=0&amp;showinfo=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</p>

 <ol class="getting-started-list">
<li>
###Configure Speed Kit
In your account simply enter **your site's URL** as well as all **whitelisted and blacklisted domains**, respectively.
All requests to whitelisted domains are rerouted to Baqend while requests to blacklisted domains will not be speeded up.
A common example of blacklisted domains are those of tracking or ad services.

<img src="../configure-speed-kit.png" style="width:60%;">
</li>
<li>
###Integrate code snippet
Insert the **generated code snipped** into the header of your **index.html**.
This snipped registers the service worker that will speed up your requests.

<img src="../integrate-speed-kit.png" style="width:100%;">
</li>
<li>
###Download Service Worker
[Download](https://www.baqend.com/speed-kit/latest/) the latest Service Worker script from baqend.
</li>
<li>
###Host Service Worker
In order to provide the Service Worker with its full functionality, it needs to have the [root
scope](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers).
Thus, the Service Worker should be hosted in your root directory.
If you are able to do so, the default case is yours. 
If for whatever reason this is not possible, we provide
you some implementation options here:
####WordPress
Use our <a href="../wordpress/">WordPress Plugin</a>.
####Apache
Option 1: Rewrite the request url for the service worker to the actual location:
```sh
# Add the following lines to your httpd.conf file
# replace <location> with the actual location of the service worker
RewriteEngine On
RewriteRule ^/sw.js$ <location>
```
Option 2: Customize the service workers registration path by still giving it root scope
```sh
# Add the following lines to your httpd.conf file
<Files "sw.js">
Header Set Service-Worker-allowed "/"
</Files>
# Find this line in your code snipped: "navigator.serviceWorker.register('sw.js')"
# and change it like this:
navigator.serviceWorker.register(<enter your service worker path>, {scope: '/'})
```
####Nginx
Option 1: Rewrite the request url for the service worker to the actual location:
```sh
# Add the following lines to the suitable server or location block in your nginx.conf file
# replace <location> with your actual service worker location
rewrite ^(/sw.js)$ <location> last;
```
Option 2: Customize the service workers registration path by still giving it root scope
```sh
# Add the following lines to your httpd.conf file
# and replace <location> with your service worker location
location  = /<location> {
add_header 'service-worker-allowed' '/';
}
# Find this line in your code snipped: "navigator.serviceWorker.register('sw.js')"
# and change it like this:
navigator.serviceWorker.register(<enter your service worker path>, {scope: '/'})
```
</li>
<li>
###Enjoy Performance
Speed Kit will automatically make your website faster.
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
    padding-top: 45px;
    position: relative;
    z-index: 1;
}

.getting-started-list>li {
    position: relative;
    border-left: 2px solid #1967CC;
    padding: 0 0 30px 50px;
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