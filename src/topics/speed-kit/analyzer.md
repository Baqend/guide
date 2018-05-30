# Measuring Page Speed

Speed Kit accelerates your website – but by how much?  
In this section, we answer common questions regarding Speed Kit and web performance:

1. **Actual Speedup** (Speed Kit already active): How much faster is Speed Kit making my website?  
*TL;DR*: You can measure page load time with [your own browser](#measuring-in-the-browser) or with the [Page Speed Analyzer](#the-page-speed-analyzer).

2. **Possible Speedup** (Speed Kit *not* active): How much faster will Speed Kit make my website?  
*TL;DR*: Have the Page Speed Analyzer generate a [performance report](#how-to-generate-a-performance-report) for your website to find out!

3. **Measuring the Uplift**: Why do some performance tests not [capture Speed Kit's uplift](#measuring-speed-kits-performance-uplift)?  
*TL;DR*: Common testing tools do not fully support Service Workers, the technology underneath Speed Kit. 

If you want to read more on web performance in general, check out our <a href="https://medium.baqend.com/the-technology-behind-fast-websites-2638196fa60a" target="_blank">in-depth web performance survey</a>. 


## When is a Website Fast?

Users find your website rather slow or fast, depending on when the first relevant content is displayed or when they can start interacting with it, e.g. by clicking buttons or filling data into forms. While these aspects of web performance are easy to grasp intuitively, user-perceived page speed is not as easy to measure objectively. 

However, there are metrics designed to capture how fast a page load *feels* by tracking **visual completeness**. 
As shown below, these metrics are computed from an actual video analysis of a browser loading the website:

<img src="../user-perceived-speed.gif" alt="The Speed Index and the First Meaningful Paint (FMP) are metrics that capture how slow or fast a website feels." style="width:85%; display: block; margin-left: auto; margin-right: auto;">

As illustrated above, the **First Meaningful Paint (FMP)** is the moment at which the user gets to see important information for the first time, e.g. headline and text in a blog or search bar and product overview in a webshop. 
The FMP is typically measured as the moment at which the viewport experiences the *greatest visual change*.  

The **Speed Index (SI)** represents the average time until a visible element appears on-screen. It corresponds to the area above the dashed line in the illustration above  —  a small SI corresponds to a fast website.


## Measuring in the Browser

The Speed Index or the First Meaningful Paint are hard to measure without specialized tooling. However, there are various other metrics that you can easily measure yourself, with nothing but your web browser.  
Here is a video that shows how you can measure *DOMContentLoaded* and *FullyLoaded* (a.k.a. *Load*, see [below](#quantifiable-metrics)):

<img src="../performance-measurement-browser.gif" alt="The Speed Index and the First Meaningful Paint (FMP) are metrics that capture how slow or fast a website feels." style="width:85%; display: block; margin-left: auto; margin-right: auto;">

To take measurements with your own browser, just do the following:

1. Open a **Browser** like Chrome (used in the video) or Firefox
2. Open the **Developer Tools** by pressing *F12*
3. Navigate to the **Network Tab** to see all resources that are transferred on page load
4. **Look** at the numbers: At the bottom of the browser window, you can read how long it took until *DOMContentLoaded* (192 ms) and *Load* (873 ms), respectively. 

## Speed Kit: On vs. Off

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


## The Page Speed Analyzer

The [**Page Speed Analyzer**](https://test.speed-kit.com/) also does a side-by-side comparison of your website with and without Speed Kit. However, it does more than what you can do with your browser:

1. **Performance Report**: The analyzer gives you various metrics and even waterfall diagrams for your page load.
2. **Optimization Hints**: The analyzer provides suggestions on how to improve web performance for your website.
3. **User-Centric**: The analyzer measures the *Speed Index* and the *First Meaningful Paint* (see [above](#when-is-a-website-fast)). 
4. **Possible Speedup**: The analyzer tells you how much faster your website will be, if you activate Speed Kit.
5. **Video Comparison**: The analyzer captures the page load, so that you can literally see the effect that Speed Kit has.

### Measurement Setup

In principle, the analyzer loads your website multiple times to **contrast performance with and without Speed Kit**: 

<img src="../analyzer-measurement.png" alt="Baqend's page speed test setup simulates a real user visit." style="width:60%; display: block; margin-left: auto; margin-right: auto;">

Once you enter your website's URL, the analyzer starts two different Chrome browsers to load your website: One loads the version *with Speed Kit* and the other loads your website *without Speed Kit*. We did not implement the measurements ourselves, though. Instead, we use the **open-source** testing framework [**WebPagetest**](https://www.webpagetest.org/). 

### Measuring Speed Kit's performance uplift

**Common performance tools** like Pingdom typically do not install Service Workers before taking a performance measurement – or they do not even support them to begin with. Since Speed Kit is built on Service Workers, though, these tools cannot measure any acceleration for good reason: **Without its Service Worker, Speed Kit is not active**. 

The **Page Speed Analyzer**, in contrast, makes sure that Service Workers are installed before the test. Thus, the measurement reflects performance for a user who has already been on your website once before (e.g. visited a specific product page in your shop once last year), but has never visited the page under test. It is important to note, that the analyzer is using **cold caches** for the performance test. 

### How to Generate a Performance Report

To find out how you can improve your website's page load times, provide the analyzer with your URL and hit *enter*. It will then execute a performance test against your website and generate both *optimization hint* and a *performance report*.

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

### Advanced Usage

If you are using Speed Kit already, the analyzer shows you what Speed Kit is currently doing for your performance: 
On the left, you see how your website would perform after removing Speed Kit; on the right, you see a test of your current website. 
Thus, you can use the analyzer to **validate** Speed Kit's worth. But you can also try out new configurations to **improve** your existing Speed Kit configuration!

<div class="tip">
    <strong>Tip:</strong>
    Customize the analyzer to your desired test situation by switching the location of the client or choosing whether
    to cache or not. You can also provide a comma-separated list of domain patterns to tell Speed Kit which requests it
    should handle.
</div>
