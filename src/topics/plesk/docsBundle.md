<!-- Plesk Start -->
#  How It Works

On this page, we explain how Speed Kit makes your website faster. In more detail, you can learn

1. *which* [market leaders ](#built-for-market-leaders) are accelerated by Speed Kit,
2. *what* [Speed Kit](#speed-kit) does to accelerate your website,
3. *how* you can [install & configure](#installation-configuration) does to accelerate your website,
4. *which* metrics are measured by the the [Page Speed Analyzer](#page-speed-analyzer), and
5. *who* [the people behind Speed Kit](#who-we-are) are.

See our [in-depth technical survey](https://medium.baqend.com/the-technology-behind-fast-websites-2638196fa60a#d876) for details on Speed Kit and the technology it is built on.

## Built for Market Leaders

Join more than 6,000 websites that load instantly:

<img src="../plesk_customer_logos.png" style="width:85%; display: block; margin-left: auto; margin-right: auto;">

## Speed Kit

To accelerate content delivery, Speed Kit intercepts requests made by the browser and reroutes them: 
Instead of loading content from your original Plesk website, the browser fetches data from Speed Kit's superfast 
caching infrastructure. The following schematic illustrates this procedure.

<img src="../speedkit_plesk.svg" style="width:85%; display: block; margin-left: auto; margin-right: auto;">

Whenever a user is visiting a your website, Speed Kit launches a **Service Worker**, a process running concurrently to the
main thread of execution in your browser. This Service Worker intercepts and reroutes browser requests according to
**speedup policies** (whitelist, blacklist, etc.) that you can define: Speed Kit thus makes sure that your users get the
cached, accelerated copy instead of fetching content from the original slower source.

To avoid stale data, we purge outdated copies of your content in our caches. Behind the curtains, we use **machine
learning** to identify those copies as fast as possible. But you can also use Speed Kit's **refresh API** to refresh
your content periodically (default), manually, or programmatically by calling special API endpoints.

# Installation & Configuration

To activate Speed Kit for your website, just click the "Install Speed Kit" button in the "Overview" tab. This initiates
a check of Speed Kit's **prerequisites**:

- If you do not have a vacant Speed Kit license, you will be asked to upgrade your plan.
- If your website is not secured with SSL, you will be guided through the process of setting it up.

If both these requirements are satisfied, Speed Kit will be switched on and the button will change its label to
"Configure Speed Kit". As long as Speed Kit is active for your website, clicking the button will lead you to the config
panel where you can optimize Speed Kit for your website.

## WordPress Plugin

If your website is a WordPress website, the **Speed Kit WordPress Plugin** will be installed in your word press installation:
Speed Kit is already making your faster and you do not have to configure anything. However, you can do so any time by
clicking on the "Configure Speed Kit" button.

## Custom Websites

If you have a non-WordPress website, you need to click on the "Configure Speed Kit" button once again to enter the
**Speed Kit Dashboard**. Here, you will be guided through the process of setting Speed Kit up for your website.
In more detail, you will be asked to do the following:
1. Include a **code snippet** into your website (the Speed Kit Service Worker).
2. Define **speed up policies** to tell Speed Kit which requests to accelerate and which requests to leave alone.

# Page Speed Analyzer

The **Page Speed Analyzer** is a testing tool that gives you an impression of how Baqend Speed Kit influences the
performance of your website: It always compares baseline performance without Speed Kit (left) against the same website
accelerated by Speed Kit (right). To this end, the analyzer runs a series of tests against your website and against an
accelerated version; finally, it reports how much of an edge Speed Kit would give you over your current tech stack.

<img src="../page-speed-analyzer.png" style="width:85%; display: block; margin-left: auto; margin-right: auto;">


### Quantifiable Metrics

To compare both website versions, the analyzer uses [Google's PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v1/getting_started)
and private instances of [WebPagetest](https://sites.google.com/a/webpagetest.org/docs/private-instances).
It collects the following metrics:

* **Speed Index** &amp; **First Meaningful Paint**: Represent <a href="https://medium.baqend.com/the-technology-behind-fast-websites-2638196fa60a#7990" target="_blank">how quickly</a> the page rendered the user-visible content.
* **Domains**: Number of unique hosts referenced.
* **Resources**: Number of HTTP resources loaded.
* **Response Size**: Number of compressed response bytes for resources.
* **Time To First Byte (TTFB)**: Represents the time between connecting to the server and receiving the first content.
* **DOMContentLoaded**: Represents the time after which the initial HTML document has been completely loaded and parsed, without waiting for external resources.
* **FullyLoaded** (a.k.a. *Load*): Represents the time until all resources are loaded, including activity triggered by JavaScript. (Measures the time until which there was 2 seconds of no network activity after Document Complete.)
* **Last Visual Change**: Represents the time after which the final website is visible (no change thereafter).

# Who We Are

<a href="https://www.baqend.com" target="_blank">Baqend</a> develops a cloud service that uses innovative caching
algorithms to minimize loading times of websites. Publishers, shops, startups, and SMEs all face the challenge of
competing with giants such as Amazon, Facebook, and Google. Baqend provides them with a technical platform to not only
catch up with the market leaders, but to turn page speed into their competitive advantage. Baqend is based in Hamburg, Germany.

<!-- Plesk End -->
