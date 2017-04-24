# Hosting

With the hosting feature you can serve your website (html, css, js, images) right from your Baqend cloud instance while using your own domain.

### Public File Access

All assets stored in the **www** root folder can be accessed under your app domain (`<appName>.app.baqend.com`) as in the following examples:


 <div class="table-wrapper"><table class="table">
  <tr>
    <th>Folder (`parent`)</th>
    <th>File Name (`name`)</th>
    <th>Public Url</th>
  </tr>
  <tr>
    <td>www</td>
    <td>index.html</td>
    <td>&lt;appName&gt;.app.baqend.com/</td>
  </tr>
  <tr>
    <td>www</td>
    <td>about.html</td>
    <td>&lt;appName&gt;.app.baqend.com/about.html</td>
  </tr>
  <tr>
    <td>www/images</td>
    <td>logo.jpg</td>
    <td>&lt;appName&gt;.app.baqend.com/images/logo.jpg</td>
  </tr>
</table></div>


<div class="tip">
  <strong>Tip:</strong>
  Baqend hosting works great with <b>static site generators</b> like <a target="_blank" rel="nofollow" href="https://jekyllrb.com/">Jekyll</a>, <a target="_blank" rel="nofollow" href="https://gohugo.io/">Hugo</a>, <a target="_blank" rel="nofollow" href="http://octopress.org/">Octopress</a>, or <a target="_blank" rel="nofollow" href="https://hexo.io/">Hexo</a>. You can start completely static or even import data from CMS like Wordpres.
  Later you can gradually add dynamic parts using the Baqend SDK. From the first static blog post to a highly dynamic site, everything will be cached and accelerated by Baqend.
</div>


### Deployment

To deploy your assets you can either use the file explorer in the Baqend dashboard (e.g. drag-and-drop files and folders) or for an easy, automated deployment user the [**Baqend CLI**](/#baqend-cli).

### Custom Domains

To serve your website under your own domain you have to create a dns entry and register the custom domain in your Baqend dashboard:

1. Log into the account at your domain provider and add a CNAME rule like the following to your DNS entries:

    `www.yourdomain.com. IN CNAME <appName>.app.baqend.com.`

    **Note**: You should not use a top level domain as a CNAME, since many DNS providers do not support it. Instead use a sub domain
such as **www.**yourdomain.com. In addition you should ensure that no other DNS-entry is set for the used domain.

2. Log into your Baqend dashboard and open your app settings. In the Hosting section simply add your custom domain `www.yourdomain.com` and click the save button. Your domain will now be registered at the CDN. Instead of `<appName>.app.baqend.com` you can now use `www.yourdomain.com`.

Consult your DNS provider's instructions to configure the CNAME record for your domain name. The steps to add a CNAME record will vary for each registrar's control panel interface.

If you cannot find your provider's CNAME configuration instructions, Google maintains instructions for [most major providers](https://support.google.com/a/topic/1615038). 



<div class="note"><strong>Note:</strong> The registration of your domain as well as your dns-entry can take a few minutes until they are accessable. If you have trouble configuring your CNAME records, contact us at <a href="maito:support@baqend.com">support@baqend.com.</a></div>
 <div class="note"><strong>Note:</strong> If you can't use a subdomain and want to directly use an <b>apex/naked-domain</b> (such as <code>exmaple.com</code>, without <code>www</code>) 
you should create four <b>A records</b> which point to our Anycast IP addresses:

```
yourdomain.com. IN A 151.101.2.8
yourdomain.com. IN A 151.101.66.8
yourdomain.com. IN A 151.101.130.8
yourdomain.com. IN A 151.101.194.8
```

</div>

### Single Page Apps

#### History API

If you use the <b>History API</b> of your single page app framework (like Angular2 or React), you need to host your <code>index.html</code> also as <code>404.html</code>. This leaves you with the two identical files:
<div class="table-wrapper"><table class="table">
  <tr>
    <th>Folder (`parent`)</th>
    <th>File Name (`name`)</th>
    <th>Public Url</th>
  </tr>
  <tr>
    <td>www</td>
    <td>index.html</td>
    <td>&lt;appName&gt;.app.baqend.com/</td>
  </tr>
  <tr>
    <td>www</td>
    <td>404.html</td>
    <td>Every URL where no file is hosted</td>
  </tr>
</table></div>
This is in order to make sure that ever entrypoint into the app uses the code from your <code>index.html</code>.

If a user for example directly opens a URL like <code>http://yourapp.com/products/42</code> this request needs to be handled by the single page app because there is no hosted HTML file under <code>/www/products/42.html</code>.
The <code>404.html</code> is returned whenever no hosted file is found for a URL (like <code>http://yourapp.com/products/42</code>). By hosting the same code in both your <code>index.html</code> and <code>404.html</code> all entrypoints will be correctly handled.

### SSL Hosting

All data accessed over the Baqend SDK is SSL encrypted by enforcing encryption at [connect](../setup#connect-your-app-to-baqend). 
If you need SSL encryption for your hosted assets too please contact us ([support@baqend.com](mailto:support@baqend.com?subject=SSL%20Hosting)),
as this feature is not automated yet.
