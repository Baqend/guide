# Speed Kit

**Baqend Speed Kit** accelerate your existing website by rerouting the requests through Baqend´s caching infrastructure.
Thereby you gain a remarkable boost of performance to your website.

## Why Speed Kit?

Page load time is money. This is not only true for companies like Amazon that loose more than $1.3B in revenue per year,
if their website is a 10th of a second slower. It is also true for publishers, whose business model depends on a user 
experience that facilitates consumption of as much content as possible. However, many publishers have heterogenous and 
complex technology stacks that make it extremely hard to tackle performance, scalability, and page load time.
Novel browser technologies now offer a means of making web performance as simple as including a script. 

![Major Advantages](major-advantages.png)

Baqend has developed **Speed Kit** that directly hooks into an existing website and makes it **50-300% faster**.
Therefore, Speed Kit uses [Service Workers](https://developers.google.com/web/fundamentals/getting-started/primers/service-workers)
which come with a great **browser support (> 75%)** and automatically enable **offline mode** to your website.
Because it **works for any website**, it is the perfect solution for Publishers, Landing Pages, E-Commerce, and Agencies.

## Integrating Speed Kit
Follow these 5 steps to set up Baqend Speed Kit and speed up your website.

 <ol class="getting-started-list">
<li>
###Configure Speed Kit
In your account simply enter **your site's URL** as well as all **white- and blacklisted domains**, respectively. 
All requests to whitelisted domains are rerouted to Baqend while requests to blacklisted domains will not be speeded up. 
A common example of blacklisted domains are those of tracking or ad services.

<img src="configure-speed-kit.png" style="width:60%;">
</li>
<li>
###Integrate code snippet
Insert the **generated code snipped** into the header of your **index.html**. This snipped registers the service worker
that will speed up your requests.

<img src="integrate-speed-kit.png" style="width:100%;">
</li>
<li>
###Download Service Worker
[Download](https://www.baqend.com/speed-kit/latest/) the latest Service Worker script from baqend.
</li>
<li>
###Host Service Worker
In order to provide the service worker with its full functionality, it needs to have the root
scope. Thus, the service worker should be hosted in your root directory. 
</li>
</ol>

## How Speed Kit works

## Page Speed Analyzer

The [Page Speed Analyzer](http://makefast.app.baqend.com/) is a testing tool that gives you an impression of 
how **Baqend Speed Kit** influences the performance of your website. To this end, the analyzer runs a series 
of tests against your website and reports how your current backend stack delivers your website compared to 
a version using Speed Kit.

![Page Speed Analyzer](page-speed-analyzer.png)

For comparison, the analyzer collects the following metrics by using [Google's PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v1/getting_started)
and private instances of [WebPagetest](https://sites.google.com/a/webpagetest.org/docs/private-instances): 

- **Domains:** Number of unique hosts referenced by the page.
- **Resources:** Number of HTTP(S) resources loaded by the page.
- **Response Size:** Number of uncompressed responce bytes for resources on the page.
- **Speed Index:** Represents how quickly the page rendered the user-visible content.
- **Time To First Byte:** Measures the amount of time between creating a connection to the server and downloading the contents.
- **DOMContentLoaded:** Represents the time when the initial HTML document has been completely loaded and parsed, without waiting for external resources.
- **FullyLoaded:** Measures the time from the start of the initial navigation until there was 2 seconds of no network activity after Document Complete.
- **Last Visual Change:** Represents the last point in the test when something visually changed on the screen.


Additionally, the tool collects a **performance video** of both website versions to give a visual impression. 

<div class="tip">
    <strong>Tip:</strong>
    Customize the analyzer to your desired test situation by switching the location of the client or choosing whether
    to cache or not. You can also provide a comma-separated list of domain patterns to tell Speed Kit which requests it 
    should handle.
</div>

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
    margin-top: -110px;
    position: relative;
    z-index: -1;
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
