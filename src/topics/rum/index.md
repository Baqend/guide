Real User Monitoring (RUM)
==========================

**[Real user monitoring][1]** describes the process to analyze the performance
of your end-users.
With Speed Kit, we provide you with a JavaScript API that allows you to easily
transfer data to your favorite tracking software, such as **Google Analytics**,
**Yandex Metrica** or **mPulse**.


## Performance Metrics

Speed Kit provides you the following timings via the [global `SpeedKit` object][2]:

| Variable                                    | Description                                                         |
|:--------------------------------------------|:--------------------------------------------------------------------|
| `SpeedKit.lastNavigate.timings.handleStart` | The time at which Speed Kit starts to process the page              |
| `SpeedKit.lastNavigate.timings.handleEnd`   | The time at which Speed Kit finished to process the page            |
| `SpeedKit.lastNavigate.timings.cacheStart`  | The time at which Speed Kit accessed the cache                      |
| `SpeedKit.lastNavigate.timings.cacheEnd`    | The time at which Speed Kit received data from the cache            |
| `SpeedKit.lastNavigate.timings.fetchStart`  | The time at which Speed Kit started to fetch the page from the CDN  |
| `SpeedKit.lastNavigate.timings.fetchEnd`    | The time at which Speed Kit received the page from the CDN          |

## Usage with Google Analytics
Use the global <code>SpeedKit</code> object to send Service Worker performance
metrics to Google Analytics. When you add
[custom dimensions and metrics to your Google Analytics][3],
you can keep track of how Speed Kit handled and improved your user's perceived performance.

![Custom dimensions for Speed Kit in Google Analytics](ga-dimensions.png)

In this example, we added three custom dimensions: <em>Speed Kit was enabled</em>,
<em>Speed Kit has served</em> and <em>Speed Kit had a cache hit</em> with the
scope set to “Hit” to our Google Analytics.
After adding these custom dimensions, we can now send values for them using
the <code>ga</code> function. This looks like the following:

```js
(function(i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r;
  i[r] = i[r] || function() {
        (i[r].q = i[r].q || []).push(arguments)
      }, i[r].l = 1 * new Date();
  a = s.createElement(o),
      m = s.getElementsByTagName(o)[0];
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-XXXXXXXX-Y', 'auto');

// Set the custom dimensions' values
ga('set', 'dimension1', SpeedKit.lastNavigate.enabled);
ga('set', 'dimension2', SpeedKit.lastNavigate.served);
ga('set', 'dimension3', SpeedKit.lastNavigate.cacheHit);

ga('send', 'pageview');
```

You can use these dimensions to compare the performance with Speed Kit
(`dimension2 === true`) to the performance without (`dimentsion2 === false).
  
Additional to the dimension, you can track custom metrics to capture more details.
In the following example, we added 6 custom metrics to Google Analytics for
the six performance metrics sent by Speed Kit. We then pass the loaded values
to the <code>ga</code> function:

```js
// Send Speed Kit performance metrics to Google Analytics
if (SpeedKit.lastNavigate.timings) {
  ga('set', 'metric1', SpeedKit.lastNavigate.timings.handleStart);
  ga('set', 'metric2', SpeedKit.lastNavigate.timings.handleEnd);
  ga('set', 'metric3', SpeedKit.lastNavigate.timings.cacheStart);
  ga('set', 'metric4', SpeedKit.lastNavigate.timings.cacheEnd);
  ga('set', 'metric5', SpeedKit.lastNavigate.timings.fetchStart);
  ga('set', 'metric6', SpeedKit.lastNavigate.timings.fetchEnd);
}
```


[1]: https://en.wikipedia.org/wiki/Real_user_monitoring
[2]: https://www.baqend.com/speed-kit/latest/#SpeedKitGlobal
[3]: https://support.google.com/analytics/answer/2709828
