# Measuring Page Speed

In this section, you can learn how page speed is perceived by users and how you can measure it using just your browser. 
We also explain how Baqend's Page Speed Analyzer works and how you can use it to generate a detailed performance analysis of your website. 

If you want to read more on web performance, check out our <a href="https://medium.baqend.com/the-technology-behind-fast-websites-2638196fa60a#7990" target="_blank">in-depth web performance survey</a> for additional information. 


## When is a Website Fast?

Users find your website rather slow or fast, depending on when the first relevant content is displayed or when they can start interacting with it, e.g. by clicking buttons or filling data into forms. While these aspects of web performance are easy to grasp intuitively, user-perceived page speed is not as easy to measure objectively. 

However, there are metrics designed to capture how fast a page load *feels* by tracking **visual completeness**. 
As shown below, these metrics are computed from an actual video analysis of a browser loading the website:

<img src="../user-perceived-speed.gif" alt="The Speed Index and the First Meaningful Paint (FMP) are metrics that capture how slow or fast a website feels." style="width:85%; display: block; margin-left: auto; margin-right: auto;">

As illustrated above, the **First Meaningful Paint (FMP)** is the moment at which the user gets to see important information for the first time, e.g. headline and text in a blog or search bar and product overview in a webshop. 
The FMP is typically measured as the moment at which the viewport experiences the *greatest visual change*.  

The **Speed Index (SI)** represents the average time until a visible element appears on-screen. It corresponds to the area above the dashed line in the illustration above  —  a small SI corresponds to a fast website.


## Measure it Yourself!

The Speed Index or the First Meaningful Paint are hard to measure yourself. However, there are various other metrics that you can easily measure yourself, with nothing but your web browser.  
Here is a video that shows how you can measure *DOMContentLoaded* and *FullyLoaded* (a.k.a. *Load*, see [below](#quantifiable-metrics)):

<img src="../performance-measurement-browser.gif" alt="The Speed Index and the First Meaningful Paint (FMP) are metrics that capture how slow or fast a website feels." style="width:85%; display: block; margin-left: auto; margin-right: auto;">

To take measurements with your own browser, just do the following:

1. Open a **Browser** like Chrome (used in the video) or Firefox
2. Open the **Developer Tools** by pressing *F12*
3. Navigate to the **Network Tab** to see all resources that are transferred on page load
4. **Look** at the numbers: At the bottom of the browser window, you can read how long it took until *DOMContentLoaded* (192 ms) and *Load* (873 ms), respectively. 

## Enabled vs. Disabled: Verify Speed Kit's Impact

If your website already uses Speed Kit, you can easily verify that it is making things faster. 
In the following, we describe how to make a quick **side-by-side comparison** of your website with and without Speed Kit.

In principle, you simply have to navigate through your website with Speed Kit **enabled** — and then repeat the same navigation sequence with Speed Kit **disabled**.
Here is an example from one of our customers, showing website performance with disabled (left) and enabled (right) Speed Kit:

<img src="../comparison_a-b_optimized.gif" alt="The direct comparison shows that Speed Kit brings a significant performance boost for your website." style="width:80%; display: block; margin-left: auto; margin-right: auto;">

To disable Speed Kit (left video), you simply have to do the following:

1. Open the **Developer Tools** by pressing *F12*
2. Navigate to the **Application Tab**
3. Find the **Service Workers** section
4. **Disable Speed Kit** by checking the "Bypass for network" box; this makes sure that the Speed Kit service worker is not used.


## Page Speed Analyzer

The [**Page Speed Analyzer**](https://test.speed-kit.com/) also does a side-by-side comparison of your website with and without Speed Kit as you can do with your browser (see [above](#enabled-vs-disabled-verify-speed-kits-impact)). However, it does more than what you can do with your browser:

* The analyzer gives you a detailed **performance report** with waterfall diagrams for your page load and **optimization hints**, i.e. suggestions on how to improve your website's performance.
* The analyzer delivers **objective measurements** of metrics you can collect using your browser, but also of complex metrics like the *Speed Index* and the *First Meaningful Paint* (see [above](#when-is-a-website-fast)). 
* The analyzer gives you a **what-if analysis**: You do not have to activate Speed Kit for your website in order to find out what it can do for you.

<div class="tip">
    <strong>Tip:</strong>
    Customize the analyzer to your desired test situation by switching the location of the client or choosing whether
    to cache or not. You can also provide a comma-separated list of domain patterns to tell Speed Kit which requests it
    should handle.
</div>

<img src="../page-speed-analyzer.png" style="width:85%; display: block; margin-left: auto; margin-right: auto;">

The analyzer always compares baseline performance without Speed Kit (left) against the same website accelerated by Speed Kit (right). 
To this end, the analyzer runs a series of tests against your website without Speed Kit and an accelerated version with Speed Kit (as explained above); finally, the analyzer reports how much of an edge Speed Kit would give you over your current tech stack. 

### Quantifiable Metrics

To compare both website versions, the analyzer uses [Google's PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v1/getting_started)
and private instances of [WebPagetest](https://sites.google.com/a/webpagetest.org/docs/private-instances).
It collects the following metrics:

* **Speed Index** &amp; **First Meaningful Paint**: Represent how quickly the page rendered the user-visible content (see [above](#when-is-a-website-fast)).
* **Domains**: Number of unique hosts referenced.
* **Resources**: Number of HTTP resources loaded.
* **Response Size**: Number of compressed response bytes for resources.
* **Time To First Byte (TTFB)**: Represents the time between connecting to the server and receiving the first content.
* **DOMContentLoaded**: Represents the time after which the initial HTML document has been completely loaded and parsed, without waiting for external resources.
* **FullyLoaded** (a.k.a. *Load*): Represents the time until all resources are loaded, including activity triggered by JavaScript. (Measures the time until which there was 2 seconds of no network activity after Document Complete.)
* **Last Visual Change**: Represents the time after which the final website is visible (no change thereafter).

### Video Proof

In addition to the metrics listed above, the Page Speed Analyzer takes a **performance video** of both website versions to visualize Speed Kit's performance edge. 
Through this side-by-side comparison, you can literally **see the effect** that Speed Kit has.

### Continuous Monitoring

If you are using Speed Kit already, the analyzer shows you what Speed Kit is currently doing for your performance: 
On the left, you see how your website would perform after removing Speed Kit; on the right, you see a test of your current website. 
Thus, you can use the analyzer to **validate** Speed Kit's worth. But you can also try out new configurations to **improve** your existing Speed Kit configuration!


## How Does the Analyzer Measure?

In principle, the analyzer performs a **side-by-side comparison** of your page **with and without Speed Kit**: 

<img src="../analyzer-measurement.png" alt="Baqend's page speed test setup simulates a real user visit." style="width:85%; display: block; margin-left: auto; margin-right: auto;">

Once you enter your website's URL, the analyzer starts two different Chrome browsers to load your website: One loads the version *with Speed Kit* and the other loads your website *without Speed Kit*. We did not implement the measurements ourselves, though. Instead, we use the **open-source** testing framework [**WebPagetest**](https://www.webpagetest.org/). 

### The Most Realistic Performance Tool Yet

To simulate page load time for a **regular user**, the analyzer *loads the page twice* and measures the **second load**: Thus, our results reflect **every-day load time** as it will be experienced by a user who has already visited your site before. 
Other performance testing tools (e.g. Pingdom), in contrast, only measure the first load — which does not say anything about performance for regular visitors. 

### No Service Worker, No Speed Kit

Since Speed Kit is built on Service Workers, disabling Service Workers means disabling Speed Kit. Therefore, tests that do not use Service Workers are unable to measure Speed Kit's performance edge. 