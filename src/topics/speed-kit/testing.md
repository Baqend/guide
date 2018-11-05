# Trying Out Speed Kit Locally

You can find out how Speed Kit behaves on your website without actually deploying it on your server. This is particularly useful when you are trying out a new Speed Kit configuration, for example. This section describes how to do it. 


<div class="warning"><strong>no high-performance setup:</strong> 
Please note that Speed Kit's performance uplift in the local testing/debugging setup cannot be compared with its performance uplift in production. Since you are the only Speed Kit user when testing it on your machine, Speed Kit does not use CDN caching like it would in a real-world deployment.
</div>

In the following, we will describe how to launch your local browser under Linux in such a way that it uses Speed Kit on the [Baqend Guide](https://www.baqend.com/guide/):

1. **Configure Proxy**: Configure a special proxy for your website: 
Open your hosts file (e.g. with `sudo vim /etc/hosts`) and add the following line:  
`18.196.93.254 baqend.com/guide/`

2. **Start a Fresh Chrome:** Next, start an instance of the Chrome browser with an empty user data directory in such a way that certificate errors are ignored. To this end, type the following into the shell:  
`google-chrome --user-data-dir="/tmp" --ignore-certificate-errors`

3. **Create a Speed Kit config**: Press F12 to open the developer tools, open the console tab, and type the following into the browser console in order to create a bare bone Speed Kit config for the test website:  

        let config = `{
                        appName: 'makefast',
                        userAgentDetection: false,
                        whitelist: [
                          {
                            host: [
                              /baqend\.com$/,
                              'code.jquery.com',
                              'fonts.googleapis.com',
                              'fonts.gstatic.com'
                            ]
                          },
                          {
                            url: 'code.jquery.com/jquery-1.12.1.min.js'
                          }
                        ]
                      }`;
<div class="tip"><strong>Auto-generated config:</strong> When you run a <a href="https://test.speed-kit.com/" target="_blank">speed test for your website</a>, you will find an auto-generated config in the advanced settings below the search panel.</div>

4. **Encode Config as String**: Now encode the config as a string by typing the following into your browser console:

        let encodedConfig = encodeURIComponent(`${config}`);
This string is hardly readable for a human, but ideal for encoding the Speed Kit config into a URL as we will be using it in the next step.  

5. **Generate Installation Link**: 
To enable Speed Kit for your fresh Chrome browser, you need to visit a specific link. To generate this link, type the following into your browser's console and press enter:  

        `https://www.baqend.com/guide/install-speed-kit?config=${encodedConfig}`

6. **Open website**: now open the generated URL in your special Chrome instance in order to install Speed Kit's Service Worker with the config. The installation link should look something like this:  

        https://www.baqend.com/guide/install-speed-kit?config=%7B%20appName%3A%20%27makefast%27%2C%20userAgentDetection%3A%20false%2C%20whitelist%3A%20%5B%20%7B%20host%3A%20%5B%20%2Fbaqend.com%24%2F%2C%20%27code.jquery.com%27%2C%20%27fonts.googleapis.com%27%2C%20%27fonts.gstatic.com%27%20%5D%20%7D%2C%20%7B%20url%3A%20%27code.jquery.com%2Fjquery-1.12.1.min.js%27%20%7D%20%5D%20%7D

7. **Try Different Configs**: You can repeat this procedure with different Speed Kit configurations to try out what works best for your website. Since the Service Worker may behave in unexpected ways once installed, we recommend starting with a fresh Chrome user directory every time. (So just delete the `/tmp` directory before starting from scratch.)

<div class="warning"><strong>no dynamic Blocks:</strong> Please note that the above-describe procedure does not cover Dynamic Blocks, yet. Please <a href="mailto:support@baqend.com">contact support</a> for additional instructions on how to try out a Speed Kit config with Dynamic Blocks.</div>