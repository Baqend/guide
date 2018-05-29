# Measuring Page Speed

In this section, you can learn how page speed is perceived by users and how you can measure it using just your browser. 
We also explain how Baqend's Page Speed Analyzer works and how you can use it to generate a detailed performance analysis of your website. 

If you want to read more on web performance, check out our <a href="https://medium.baqend.com/the-technology-behind-fast-websites-2638196fa60a#7990" target="_blank">in-depth web performance survey</a> for additional information. 


## User-Perceived Performance

For users, your website appears to be rather slow or fast, depending on when the first relevant content is displayed or when they can start interacting with it, e.g. by clicking buttons or filling data into forms. While these aspects of web performance are easy to grasp intuitively, user-perceived page speed is not as easy to measure objectively. 

However, there are metrics designed to capture how fast a page load *feels* by tracking **visual completeness**. As shown below, these metrics are computed from actual video analysis of a browser loading the website:

<img src="../user-perceived-speed.gif" alt="The Speed Index and the First Meaningful Paint (FMP) are metrics that capture how slow or fast a website feels." style="width:85%; display: block; margin-left: auto; margin-right: auto;">

As illustrated above, the **First Meaningful Paint (FMP)** is the moment at which the user gets to see important information for the first time, e.g. headline and text in a blog or search bar and product overview in a webshop. To make the FMP objectively measurable, the it is typically defined as the moment at which the viewport experiences the *greatest visual change*.  

The **Speed Index (SI)** represents the average time until a visible element appears on-screen. It corresponds to the area above the dashed line in the illustration above  —  a small SI corresponds to a fast website.


### Measuring page load time with your browser

There are various metrics that are commonly used to measure page Speed (see [below](#quantifiable-metrics) for examples). You can matter some of them easily yourself, with nothing but your web browser.  
Here is a video that shows how we can measure *DOMContentLoaded* and *FullyLoaded* (a.k.a. *Load*):

<img src="../performance-measurement-browser.gif" alt="The Speed Index and the First Meaningful Paint (FMP) are metrics that capture how slow or fast a website feels." style="width:80%; display: block; margin-left: auto; margin-right: auto;">

To take measurements with your own browser, just do the following:

1. Open a **Browser** like Chrome (used in the video) or Firefox
2. Open **Developer Tools** by pressing *F12*
3. Navigate to the **Network Tab** to see all resources that are transferred on page load
4. **Look** at the numbers: At the bottom of the browser window, you can read how long it took until *DOMContentLoaded* and *Load*, respectively. 

## Measuring Speed Kit: side-by-side comparison



## Baqend's test setup

To enable more advanced analytics on large scale, we at Baqend developed

<img src="../analyzer-measurement.png" alt="Baqend's page speed test setup simulates a real user visit." style="width:85%; display: block; margin-left: auto; margin-right: auto;">


## Page Speed Analyzer

To produce detailed performance reports and sophisticated optimization hints, we have developed our own performance measurement tool based on the open-source tool [WebPagetest](https://www.webpagetest.org/): Baqend’s **[Page Speed Analyzer](https://test.speed-kit.com/)** measures your web performance and gives you suggestions where there is room for improvement.

<img src="../page-speed-analyzer.png" style="width:85%; display: block; margin-left: auto; margin-right: auto;">

The analyzer always compares baseline performance without Speed Kit (left) against the same website accelerated by Speed Kit (right). 
To this end, the analyzer runs a series of tests against your website without Speed Kit and an accelerated version with Speed Kit (as explained [above](#baqends-test-setup)); finally, the analyzer reports how much of an edge Speed Kit would give you over your current tech stack. 

<div class="tip">
    <strong>Tip:</strong>
    Customize the analyzer to your desired test situation by switching the location of the client or choosing whether
    to cache or not. You can also provide a comma-separated list of domain patterns to tell Speed Kit which requests it
    should handle.
</div>

### Quantifiable Metrics

To compare both website versions, the analyzer uses [Google's PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v1/getting_started)
and private instances of [WebPagetest](https://sites.google.com/a/webpagetest.org/docs/private-instances).
It collects the following metrics:

* **Speed Index** &amp; **First Meaningful Paint**: Represent how quickly the page rendered the user-visible content (see [above](#user-perceived-performance)).
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