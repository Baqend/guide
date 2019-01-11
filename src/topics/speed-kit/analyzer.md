Measuring Page Speed
====================

Speed Kit accelerates your website – but by how much?  
In this section, we answer common questions regarding Speed Kit and web performance:

1. **Actual Speedup** (Speed Kit already active): How much faster is Speed Kit making my website?  
*TL;DR*: You can measure page load time with the [Page Speed Analyzer](#the-page-speed-analyzer) or with external tools like <!--[Google Lighthouse](#measuring-with-google-lighthouse),--> [WebPagetest](#measuring-with-webpagtest) or [your own browser](#measuring-in-the-browser).

2. **Possible Speedup** (Speed Kit *not* active): How much faster will Speed Kit make my website?  
*TL;DR*: Have the Page Speed Analyzer generate a [performance report](#how-to-generate-a-performance-report) for your website to find out!

3. **Measuring the Uplift**: Why do some performance tests not [capture Speed Kit's uplift](#measuring-speed-kits-performance-uplift)?  
*TL;DR*: Some testing tools do not fully support Service Workers, the technology underneath Speed Kit. Some tools only need proper configuration (e.g. <!--[Google Lighthouse](#measuring-with-google-lighthouse) and--> [WebPagetest](#measuring-with-webpagtest)). 

If you want to read more on web performance in general, check out our <a href="https://medium.baqend.com/the-technology-behind-fast-websites-2638196fa60a" target="_blank">in-depth web performance survey</a>. 


When is a Website Fast?
-----------------------

Users find your website rather slow or fast, depending on when the first relevant content is displayed or when they can start interacting with it, e.g. by clicking buttons or filling data into forms. While these aspects of web performance are easy to grasp intuitively, user-perceived page speed is not as easy to measure objectively. 

However, there are metrics designed to capture how fast a page load *feels* by tracking **visual completeness**. 
As shown below, these metrics are computed from an actual video analysis of a browser loading the website:

![The Speed Index and the First Meaningful Paint (FMP) are metrics that capture how slow or fast a website feels.](user-perceived-speed.gif#video)

As illustrated above, the **First Meaningful Paint (FMP)** is the moment at which the user gets to see important information for the first time, e.g. headline and text in a blog or search bar and product overview in a webshop. 
The FMP is typically measured as the moment at which the viewport experiences the *greatest visual change*.  

The **Speed Index (SI)** represents the average time until a visible element appears on-screen. It corresponds to the area above the dashed line in the illustration above  —  a small SI corresponds to a fast website.


Measuring in the Browser
------------------------

The Speed Index or the First Meaningful Paint are hard to measure without specialized tooling. However, there are various other metrics that you can easily measure yourself, with nothing but your web browser.  
Here is a video that shows how you can measure *DOMContentLoaded* and *FullyLoaded* (a.k.a. *Load*, see [below](#quantifiable-metrics)):

<video autoplay="autoplay" loop="loop" alt="The Speed Index and the First Meaningful Paint (FMP) are metrics that capture how slow or fast a website feels." style="width:80%; display: block; margin-left: auto; margin-right: auto;">
  <source src="../performance-measurement-browser.mp4" type="video/mp4" />
</video>


To take measurements with your own browser, just do the following:

1. Open a **Browser** like Chrome (used in the video) or Firefox
2. Open the **Developer Tools** by pressing *F12*
3. Navigate to the **Network Tab** to see all resources that are transferred on page load
4. **Look** at the numbers: At the bottom of the browser window, you can read how long it took until *DOMContentLoaded* (192 ms) and *Load* (873 ms), respectively. 


Speed Kit: On vs. Off
---------------------

If your website already uses Speed Kit, you can easily verify that it is making things faster. 
In the following, we describe how to make a quick **side-by-side comparison** of your website with and without Speed Kit.

In principle, you simply have to navigate through your website with Speed Kit **enabled** — and then repeat the same navigation sequence with Speed Kit **disabled**.
Here is an example from one of our customers, showing website performance with disabled (left) and enabled (right) Speed Kit:

<video autoplay="autoplay" loop="loop" alt="The direct comparison shows that Speed Kit brings a significant performance boost for your website." style="width:80%; display: block; margin-left: auto; margin-right: auto;">
  <source src="../comparison_a-b.mp4" type="video/mp4" />
</video>

To disable Speed Kit (left video), you simply have to do the following:

1. Open the **Developer Tools** by pressing *F12*
2. Navigate to the **Application Tab**
3. Find the **Service Workers** section
4. **Disable Speed Kit** by checking the "Bypass for network" box; this makes sure that the Speed Kit service worker is not used.


Measuring Speed Kit's Performance Uplift
----------------------------------------

**Common performance tools** like Pingdom or GTmetrix typically do not install Service Workers before taking a performance measurement – or they do not even support them to begin with. Since Speed Kit is built on Service Workers, though, these tools cannot measure any acceleration for good reason: **Without its Service Worker, Speed Kit is not active**. 

The **Page Speed Analyzer** (see [below](#the-page-speed-analyzer)), in contrast, makes sure that Service Workers are installed before the test. Thus, the measurement reflects performance for a user who has already been on your website once before (e.g. visited a specific product page in your shop once last year), but has never visited the page under test. It is important to note, that the analyzer is using **cold caches** for the performance test. 

To capture Speed Kit's full performance uplift, a testing tool should first navigate to the homepage (to make sure that Speed Kit is installed and active) before navigating to another subsite to take the actual performance measurement.

<!-- 
### Measuring with Google Lighthouse

[Lighthouse](https://developers.google.com/web/tools/lighthouse/) is a website auditing tool by Google that also measures page speed. It awards a rating between 1 and 100 to the website under test depending on various performance metrics. In addition to performance measurements, Lighthouse also gives useful tips on how to improve performance.

If Speed Kit is already online on your site, you can use Lighthouse to measure Speed Kit's actual performance uplift. In order to do that, you need to install the Lighthouse CLI via `npm`:

```sh
npm install -g lighthouse
```

Since Speed Kit's Service Worker needs to be active in order to achieve and uplift, you 1st need to make sure that Lighthouse has a temporary directory to store browser data, for example a `tmp` folder in your home directory: 
```sh
# Create ~/tmp if not exists
mkdir ~/tmp
```

#### Measuring with Speed Kit <u>disabled</u>
To test baseline performance without Speed Kit, run the following commands and replace `www.baqend.com` with your own website and `bq-speedkit` with your Baqend app's name:

```sh
# Clear ~/tmp before test
rm -rf ~/tmp

# Run lighthouse for homepage, Speed Kit is blocked
lighthouse https://www.baqend.com/ --chrome-flags="--user-data-dir=/tmp" --disable-storage-reset --blocked-url-patterns=/bq-speedkit.app.baqend.com/

# Run lighthouse for sub page to test
lighthouse https://www.baqend.com/speedkit.html --chrome-flags="--user-data-dir=/tmp" --blocked-url-patterns=/bq-speedkit.app.baqend.com/ --disable-storage-reset --view
```

<div class="note"><strong>PBasic Authentication:</strong> 
If you are testing on a staging environment with basic authentication, you can add the authentication as a header like so:  
</br> 
<code>--extra-headers "Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ="</code>.
</div>

#### Measuring with Speed Kit <u>enabled</u>
To test the performance with Speed Kit in action, choose the same pages as before and run the following command. Again, replace `www.baqend.com` with your website:

```sh
# Clear ~/tmp before test
rm -rf ~/tmp

# Run lighthouse for homepage to install Speed Kit
lighthouse https://www.baqend.com/ --chrome-flags="--user-data-dir=/tmp" --disable-storage-reset

# Run lighthouse for sub page to test 
lighthouse https://www.baqend.com/speedkit.html --chrome-flags="--user-data-dir=/tmp" --disable-storage-reset --view
```

To see Speed Kit's performance uplift, simply compare measurements of both the runs.
-->

### Measuring with WebPagetest

[WebPagetest][1] is a well-known open-source tool for performance analysis. It is also the tool that our own performance test is based on (see [below](#the-page-speed-analyzer)). 
If Speed Kit is already online on your site, you can use WebPagetest to measure the performance uplift as it is experienced by real users.

For the test, go to [https://www.webpagetest.org/][1], open `Advanced Settings`, and choose the `Script` tab.
Here, you can enter an [advanced test script][2] and hit `Start Test` tun run them.
For our purposes, you can paste the following commands for the individual tests.

#### Measuring with Speed Kit <u>disabled</u>
To test baseline performance without Speed Kit, use the following test script and replace `www.baqend.com` with your own website and `bq-speedkit` with your Baqend app's name:

```wptscript
// Block the testing browser to access Speed Kit's CDN
blockDomains bq-speedkit.app.baqend.com

// Navigate to your website without logging to install the Service Worker
logData 0
navigate https://www.baqend.com

// Navigate to a page with logging and installed Service Worker
logData 1
navigate https://www.baqend.com/speedKit.html
```

<div class="note"><strong>PBasic Authentication:</strong> 
If you are testing on a staging environment with basic authentication, you can add the authentication as a header by adding the following line at the start of your script:  
</br> 
<code>setHeader Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=</code>.
</div>


#### Measuring with Speed Kit <u>enabled</u>
To test the performance with Speed Kit in action, choose the same pages as before and run the following test script. Again, replace `www.baqend.com` with your website:

```wptscript
// Navigate to your website without logging to install the Service Worker
logData 0
navigate https://www.baqend.com

// Navigate to a page with logging and installed Service Worker
logData 1
navigate https://www.baqend.com/speedKit.html
```

To see Speed Kit's performance uplift, simply compare measurements of both the runs.


The Page Speed Analyzer
-----------------------

The [**Page Speed Analyzer**](https://test.speed-kit.com/) also does a side-by-side comparison of your website with and without Speed Kit. However, it does more than what you can do with your browser:

1. **Performance Report**: The analyzer gives you various metrics and even waterfall diagrams for your page load.
2. **Optimization Hints**: The analyzer provides suggestions on how to improve web performance for your website.
3. **User-Centric**: The analyzer measures the *Speed Index* and the *First Meaningful Paint* (see [above](#when-is-a-website-fast)). 
4. **Possible Speedup**: The analyzer tells you how much faster your website will be, if you activate Speed Kit.
5. **Video Comparison**: The analyzer captures the page load, so that you can literally see the effect that Speed Kit has.

### Compares Performance With and Without Speed Kit

If **Speed Kit is active** on your website already, the analyzer deactivates Speed Kit for one of the two tests. 
If **Speed Kit is not active** on your website, the analyzer injects Speed Kit into your websites for one of the tests. 
Thus, you always get to know what Speed Kit currently does or could do for your web performance. 

### Measurement Setup

In principle, the analyzer loads your website multiple times to **contrast performance with and without Speed Kit**: 

<img src="../analyzer-measurement.png" alt="Baqend's page speed test setup simulates a real user visit." style="width:60%; display: block; margin-left: auto; margin-right: auto;">

Once you enter your website's URL, the analyzer starts two different Chrome browsers to load your website: One loads the version *with Speed Kit* and the other loads your website *without Speed Kit*. We did not implement the measurements ourselves, though. Instead, we use the **open-source** testing framework [**WebPagetest**][1]. You can access the **WebPagetest Waterfalls** by clicking *Show Details* below the video comparison and then clicking one of the links at the bottom of the overview (either *Without Speed Kit* or *With Speed Kit*, depending on the test run you are interested in). 

To make the setup as realistic as possible, we use the following configuration:

* **Server location** depends on the chosen test client location:
    * *Europe:*  Hetzner data center in Falkenstein/Vogtland
    * *US:* AWS data center US East (N. Virginia)
* **Network link** depends on the chosen client device:
    * *Desktop:* 20 Mbit/s with 0 ms additional latency
    * *Mobile:* 12 Mbit/s with 70 ms additional latency

### How to Generate a Performance Report

To find out how you can improve your website's page load times, provide the analyzer with your URL and hit *enter*. It will then execute a performance test against your website and generate both *optimization hint* and a *performance report*.

<img src="../page-speed-analyzer.png" style="width:85%; display: block; margin-left: auto; margin-right: auto;">

The analyzer always compares baseline performance without Speed Kit (left) against the same website accelerated by Speed Kit (right). 
To this end, the analyzer runs a series of tests against your website without Speed Kit and an accelerated version with Speed Kit (as explained above); finally, the analyzer reports how much of an edge Speed Kit would give you over your current tech stack. 


### Optimization Hints

Below the video comparison, the analyzer gives you a list of **performance best-practices** that your website already follows (checkmark) or that are currently not implemented (cross). 
You also get brief explanations on how the individual optimizations affect page performance and by how much Speed Kit will lift your performance with each of them (for example, see *request latency*): 

<img src="../optimization-hints.png" style="width:85%; display: block; margin-left: auto; margin-right: auto;">

Speed Kit will immediately solve all these issues for you: your website is **guaranteed to be state of the art**.

### Advanced Usage

By default, the analyzer simulates a desktop user located in Germany. However, you can change the default behavior through several parameters:

* **Mobile**: Whether or not the website should be loaded from a mobile browser (`true`) or a desktop browser (`false`, default).
* **Run from US**: Whether or not the website should be loaded from the United States (`true`) or from Germany (`false`, default).
* **Activity Timeout**: The time after the last network activity before a test is considered complete (see [WebPagetest docs](https://sites.google.com/a/webpagetest.org/docs/using-webpagetest/scripting#TOC-setActivityTimeout)). 
* **Speed Kit Config**: The detailed Config parameters for Speed Kit to allow you performance fine-tuning (see [Speed Kit API docs](../api). 


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


[1]: https://www.webpagetest.org/
[2]: https://sites.google.com/a/webpagetest.org/docs/using-webpagetest/scripting
