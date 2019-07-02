#  How Speed Kit Works

To accelerate content delivery, Speed Kit intercepts requests made by the browser and reroutes them: 
Instead of loading content from the original source, the browser fetches data from Baqend's fast infrastructure.  
The following schematic illustrates how Speed Kit works. 

<img src="../how-it-works.PNG" style="width:85%; display: block; margin-left: auto; margin-right: auto;">

To activate Speed Kit, you simply include a code snippet into your website which we generate for you. 
Whenever a user is visiting your website, the snippet then launches the Speed Kit [**Service Worker**](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API), a process running concurrently to the main thread of execution in your browser. 
As soon as the Service Worker is active, all HTTP requests matching your [speedup policies](../whiteblacklisting) (whitelist, blacklist etc.) are rerouted to Baqend. 
If we have a cached copy of the requested resource (Media, Text etc.), it is served superfast; if the resource is requested for the first time from our caches, it is served as fast as the origin allows – but will be cached and fast from there on.

To avoid stale data, Speed Kit's caches have to be updated whenever your content changes. 
For this purpose, we provide a convenient the [refresh API](../refreshing) that allows you to update all caches (including the browser caches which is located on the user's device). 
This can be done both in *realtime* and in *scheduled* fashion. 

For additional details on Speed Kit and the technology it is built on, see our [in-depth technical survey](https://medium.baqend.com/the-technology-behind-fast-websites-2638196fa60a#d876). 
