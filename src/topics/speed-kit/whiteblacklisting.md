# Speedup Policies

In this section, we describe how you can specify which browser requests should be accelerated by Speed Kit and which should remain untouched. 

## Static Resources

Speed Kit accelerates browser requests by serving cached copies of the original data.  
This works best on requests for **static resources**, because they do not change often and thus can remain inside the caches for longer. 
In the Speed Kit config, you can define **whitelist rules** to identify requests to these resources: 
Only whitelisted requests will be sped up by Speed Kit, while all other requests will be directed against the original data source. 


**Good candidates** for white listing are:

- images
- fonts
- scripts
- CDN-accelerated content

A simple whitelist could look like this:

```js
whitelist: [
    { url: [ 'www.static.something.com', 'www.example.com', 'www.subdomain.example.com'] }
]
```


## Uncacheable Resources

To prevent data staleness and other undesirable side effects, Speed Kit should *never* handle content that is **inherently uncacheable**. 
Therefore, you should avoid white listing third-party services such as analytics, ads, or tracking pixels. 
For additional flexibility, however, you can also *explicitly exclude* some requests from the whitelist: 
**Blacklisted** requests will not be accelerated, even if they match a whitelist rule. 

Blacklisting resources can be appropriate, for example, when your website is mostly static and only has few specific portions that are on cacheable. 
For example, the Speed Kit configuration for a mostly static shop website might look like this:

```js
whitelist: [
    { url: [ 'shop.mostlystatic.com' ] }
],
blacklist: [
    { url: [ 'shop.mostlystatic.com/account/', 'shop.mostlystatic.com/checkout/'] }
]
```

However, you do not have to blacklist these URLs. The way our rule system works is that when there is no whitelist nor blacklist
every request is rerouted. As soon as the whitelist gets more restrictive, like in the example above, only requests that match this filter
are touched by Speed Kit. So a simple way to put this is that you can decide if you want to tell us implicitly which sites not to touch by defining a
whitelist or explicitly by defining a blacklist. 

For details on how to accelerate user-specific content (e.g. product recommendations), see our section on [**personalized content**](../personalized). 

## Syntax

The white- and blacklists in the Speed Kit config will accept paths as well as regex expressions and even [complex rules](../api#SpeedKitRule). 
All list entries are OR-whatever, so that a request will be blacklisted

To configure the whitelist and blacklist Baqend provides you with [SpeedKitRule](../api#SpeedKitRule).
With this syntax you are able to formulate complex rules for an individual whitelist and blacklist.
For example, imagine your website loads some images over the third-party domain `img.example-cdn.com`. 
In general, you want all resources whose content type is image to be served via Speed Kit.
For this case, a valid whitelist could look like this:

```js
whitelist: [
    { contentType: 'image' }
]
```

You could extend this case in a way, that you only want static content to be rerouted. For that see the example below: 
```js
whitelist: [
    {
        // Your Domain and all Subdomains via Regex
        host: [
            'www.baqend.com',
            'baqend.com',
            /.*\.baqend\.com/
        ],
        contentType: [
            'document',
            'image',
            'style',
            'script',
            'font'
        ]        
    }    
]
```

## Examples

Further examples can be found in our [Configuration Examples](../api#Configuration-Examples).
