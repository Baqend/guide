# Page Speed Analyzer

The [Page Speed Analyzer](http://makefast.app.baqend.com/) is a testing tool that gives you an impression of
how **Baqend Speed Kit** influences the performance of your website:
It always compares baseline performance without Speed Kit (left) against the same website accelerated by Speed Kit (right). 
To this end, the analyzer runs a series of tests against your website and an accelerated version; finally, it reports how much of an edge Speed Kit would give you over your current tech stack. 

<img src="../page-speed-analyzer.png" style="width:100%;">

<div class="tip">
    <strong>Tip:</strong>
    Customize the analyzer to your desired test situation by switching the location of the client or choosing whether
    to cache or not. You can also provide a comma-separated list of domain patterns to tell Speed Kit which requests it
    should handle.
</div>

## Quantifiable Metrics

To compare both website versions, the analyzer uses [Google's PageSpeed Insights API](https://developers.google.com/speed/docs/insights/v1/getting_started)
and private instances of [WebPagetest](https://sites.google.com/a/webpagetest.org/docs/private-instances).
It collects the following metrics:

- **Domains:** Number of unique hosts referenced by the page.
- **Resources:** Number of HTTP resources loaded by the page.
- **Response Size:** Number of uncompressed response bytes for resources on the page.
- **Speed Index:** Represents how quickly the page rendered the user-visible content.
- **Time To First Byte:** Measures the amount of time between creating a connection to the server and downloading the contents.
- **DOMContentLoaded:** Represents the time when the initial HTML document has been completely loaded and parsed, without waiting for external resources.
- **FullyLoaded:** Measures the time from the start of the initial navigation until there was 2 seconds of no network activity after Document Complete.
- **Last Visual Change:** Represents the last point in the test when something visually changed on the screen.

## Video Proof

In addition to the metrics listed above, the Page Speed Analyzer takes a **performance video** of both website versions to visualize Speed Kit's performance edge. 
Through this side-by-side comparison of performance with and without Speed Kit, you don't have to rely on the numbers alone! 

## Continuous Monitoring

If you are using Speed Kit already, the analyzer shows you what Speed Kit is currently doing for your performance: 
On the left, you see how your website would perform after removing Speed Kit; on the right, you see a test of your current website. 
Thus, you can use the analyzer to **validate** Speed Kit's worth. But you can also try out new configurations to **improve** your existing Speed Kit configuration!