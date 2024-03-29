<!-- Plesk Start -->
# FAQ – Frequently Asked Questions

In the following, you can find questions that other customers had in the past.

- [What are whitelist and blacklist for?](#what-are-whitelist-and-blacklist-for)
- [How can I deactivate Speed Kit?](#how-can-i-deactivate-speed-kit)
- [What will happen, if the Speed Kit infrastructure becomes unavailable?](#what-will-happen-if-the-speed-kit-infrastructure-becomes-unavailable)
- [What kind of systems is Speed Kit compatible with?](#what-kind-of-systems-is-speed-kit-compatible-with)
- [How does installation work and how long does it take?](#how-does-installation-work-and-how-long-does-it-take)
- [What is the difference between Speed Kit and traditional content delivery networks (CDNs)?](#what-is-the-difference-between-speed-kit-and-traditional-content-delivery-networks-cdns)
- [How is Speed Kit different from other performance plug-ins?](#how-is-speed-kit-different-from-other-performance-plug-ins)
- [I have outdated content on my website – what now?](#i-have-outdated-content-on-my-website-what-now)
- [Speed Kit has not accelerated my website according to my favorite speed testing tool – why is that?](#speed-kit-has-not-accelerated-my-website-according-to-my-favorite-speed-testing-tool-why-is-that)
- [Why do I need SSL for Speed Kit?](#why-do-i-need-ssl-for-speed-kit)
- [Where can I learn more about Speed Kit?](#where-can-i-learn-more-about-speed-kit)

## What are whitelist and blacklist for?

With whitelist and blacklist, you can specify which requests should be handled by Speed Kit (whitelist) and which
requests should always be directed against the original source (blacklist).

Speed Kit will only accelerate the requests that match your **whitelist** and leave all other requests untouched. 
The other way around, Speed Kit will not handle a request that matches the **blacklist**, even if it also matches the whitelist.

### Syntax

The white- and blacklist accept the following kinds of matching expressions:

- **prefix string**: If you provide a string, requests only match when there path starts with the given string. For example,`"example.com"` matches requests to `example.com/blog` and `example.com/products`, but not requests to `static.example.com`.
- **Regex**: You can also match the request path with regular expressions. For example, `/checkout$/` matches requests to `example.com/checkout` and `other-example.com/shop/checkout`, but not requests to `example.com/user`.
- **OR-combined array**: You can also specify an array of expressions whenever only one of several conditions must hold. For example, `['static.example.com', /example.com\/checkout$/]` matches any request whose path starts with `static.example.com` or ends with `example.com/checkout`.

## How can I deactivate Speed Kit?

In the "Overview" tab, simply click the "Disable" button on the far right. Speed Kit will be disabled immediately.
You can switch it back on any time.

## What will happen, if the Speed Kit infrastructure becomes unavailable?

Don't worry! Speed Kit will disable itself automatically, when there is any kind of error or outage. Thus, your website
will behave as usual – only without acceleration. In the background, Speed Kit will perform health checks and reenable
itself again as soon as the problem has been resolved.

## What kind of systems is Speed Kit compatible with?

Speed Kit can be used with any website, since you can customize which requests should be accelerated and which should
remain untouched. For example, the payment process should not be handled by Speed Kit. For customizations like these,
you have to specify [white- and blacklists](#what-are-whitelist-and-blacklist-for) accordingly.

## How does installation work and how long does it take?

For a **WordPress** website, Speed Kit can be installed with a single click of a button.

For **custom websites** or websites which have a lot of dynamic content (e.g. **shop websites**), setup usually takes 
longer due to the integration with the [Dynamic Fetcher](https://www.baqend.com/guide/topics/speed-kit/personalized/#how-to-use-it).
With the help of your professional developer and the Speed Kit documentation a customized config needs to be created.
Configuring Speed Kit for a dynamic website, needs to be done by a professional developer.

For details, check out our **installation guide**.

## What is the difference between Speed Kit and traditional content delivery networks (CDNs)?

With Speed Kit, you get all the advantages of a CDN; in fact, Speed Kit uses a CDN under the hood. In addition, however,
you also get the following benefits:

- Your website becomes a **Progressive Web App** by default, i.e. users can keep using the website even if they lose their Internet connection temporarily.
- Speed Kit can **cache dynamic content** such as your HTML file or user comments in addition to static content such as stylesheets or images; you decide how often Speed Kit refreshes its copy!
- Speed Kit uses the **browser cache** which is located in the user's device: Thus, Speed Kit serves data even faster than common CDN caches.

## How is Speed Kit different from other performance plug-ins?

Similar to other WordPress plugins, Speed Kit uses CDN caching to make your website look faster. However, it also uses
the browser cache and a unique cache coherence algorithm to reduce loading times even more than competitors. 
In addition, Speed Kit provides the following advantages:

- **Smart browser caching**: While most performance plugins only rely on CDN caching, Speed Kit also uses the browser cache. Thus, cached data can be served without any latency at all!
- **Caches dynamic content without staleness**: Speed Kit automatically detects changes in your websites and then updates all caches in realtime. Thus, it is able to cache even dynamic data such as HTML files or JSON API responses.
- **Offline mode**: Speed Kit makes your website a Progressive Web App (PWA) out-of-the-box! In more detail, Speed Kit does not only cache data within the client device, but also keeps this cache up-to-date as content on your website changes. When disconnected from the network, Speed Kit then serves a copy of your content and reloads automatically when the connection comes back.

## I have outdated content on my website – what now?

There are three different mechanisms to keep Speed Kit's caches up-to-date:

- **WordPress auto-refresh**: The Speed Kit WordPress plugin automatically detects changes to your content and updates caches accordingly and in realtime. However, this does not work in combination with some WordPress plugins (and also not for non-WordPress websites). As fallback for these cases, Speed Kit features two additional refresh mechanisms (see below).
- **Periodic refresh**: By default, Speed Kit refreshes HTML files every 30 minutes and all other resources twice a day. However, you can customize periodical content refreshes by updating the existing policies or specifying new ones.
- **Manual refresh**: You can always trigger a refresh for all your content manually; it will be executed immediately, so that no stale data will be left whatsoever.

## Speed Kit has not accelerated my website according to my favorite speed testing tool – why is that?

Speed Kit is built on a new web technology: **Service Workers**. 
Speed Kit's service worker is activated when a user visits your website for the first time. 
Therefore, Speed Kit reaches its full potential *after* the first load &ndash; when the service worker is already ... well ... working. 

Most state-of-the-art speed tests (e.g. Pingdom and PageSpeed Insights), however, *do not support Service Workers*. 
In consequence, they measure your website with a deactivated Speed Kit. 
Those few frameworks that do support Service Workers only measure page speed on first visit; this is what *WebPagetest* does, for example. 
Since Speed Kit's service worker is being activated during first load, though, this measurement distorts the acceleration effect: 
Every page load *after* the first load will be much faster. 

To get a realistic impression of how fast Speed Kit makes your website, use the built-in **Page Speed Analyzer**. 
It uses WebPagetest under the hood, but measures performance *after* the service worker has been activated. 
Thus, this test result reflects the page load time experienced by a regular user. 

## Why do I need SSL for Speed Kit?

Speed Kit is built on Service Workers, a new technology that is currently entering all major web browsers. 
Since Service Workers can only be enabled on SSL-secured websites, Speed Kit is also only available when SSL is turned on.

*Okay, but why are Service Workers only available on SSL-secured websites then?*  
SSL-encrypted web communication (HTTPS) is considered preferable over non-encrypted communication (HTTP), because it protects sensitive information exchanged between client and server.  
In an effort to accelerate the adoption of HTTPS throughout the web, new browser features are often only made available for SSL-secured websites. 
Like HTTP/2 and many other features, Service Workers can therefore only be used when SSL is enabled for your website. 

## Where can I learn more about Speed Kit?

For all the details on Speed Kit and the technology it is built on, see our [in-depth technical survey](https://medium.baqend.com/the-technology-behind-fast-websites-2638196fa60a#d876). 

<!-- Plesk End -->
