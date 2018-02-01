#  How Speed Kit Works

Speed Kit hooks into existing websites and reroutes the requests to Baqend for a faster content delivery.
For a deeper understanding of how the Speed Kit works, the following graphic illustrates an overview of the underlying Speed Kit architecture. 

<img src="../speed-kit-architecture.png" style="width:100%;">

The left side of the graphic shows your website with the [latest Service Worker script](https://www.baqend.com/speed-kit/latest/)
installed.
As soon as the Service Worker is active, all HTTP requests matching your configuration (whitelist, blacklist etc.) are rerouted to Baqend. 
If the request has been rerouted to Baqend for the first time, the corresponding resources (Media, Text etc.) are pulled from your legacy system.
Otherwise, the resources are served directly by the server.
 
On the way to the client, resources are routed through the distributed Baqend caching infrastructure and get cached. 
Therefor requests rerouted by the Service Worker can be served with very low latency.
Whenever content changes, you call the [Baqend refresh content API](#refresh-content), so Baqend immediately fetches changed content. 
Baqend´s caching algorithms automatically update all caches in real-time (including users' browser caches).

