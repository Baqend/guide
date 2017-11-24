# WordPress Plugin

Baqend has special support for **WordPress** with a custom plugin that allows you to run your WordPress blog blazingly fast on Baqend.


## Install the Plugin

Installing the Baqend WordPress Plugin is as easy as doing the following steps. 

### From the WordPress Plugin Directory

1. In your WordPress's admin, hover over “Plugins” in the left menu and hit “Add New”.
2. There, enter “Baqend” in the plugin search box.
3. You will see a list of search results which should include the Baqend plugin. Click on the “Install Now” button to install the plugin.
4. After installing the plugin you will be prompted to activate it. Click on the “Activate Plugin” link.
5. The Baqend plugin is now installed and can be found on the left menu.

### Upload Manually

Download the official **Baqend plugin** from [the WordPress plugin directory](https://wordpress.org/plugins/baqend/) or from [our website](https://www.baqend.com/wordpress-plugin/latest/baqend.zip) 
and install it in your blog's plugin administration view (typically located under *http://your-wordpress.blog/wp-admin/plugin-install.php*).
 

## Prepare Your Baqend App

If you have not already, [register at Baqend](https://dashboard.baqend.com/register) and create your app with a name of your choice.
When your app is ready, go to “Settings” in the navigation and find the “Custom Domain” settings in the “Hosting” section.
Add your domain and follow the DNS setup instructions.


## Configure Your WordPress Plugin

Once your Baqend app is prepared, go to the admin page of your WordPress blog and head over to the Baqend settings (located under *http://your-wordpress.blog/wp-admin/admin.php?page=baqend_settings*).
There, enter the credentials you use to login with Baqend.

![Select an app](select-app.png)

You can now choose the app you wish to use for the plugin. 
Click on “Select App” and your plugin will be configured for Baqend.

If you want to change the Baqend account, head over to the *Account* tab and click on “Log Out”.

Now, you can choose *Speed Kit* to use for your WordPress blog:

- Use [Speed Kit](#speed-kit) if you want to accelerate your existing WordPress blog and handle scalability on your own.
  This is easy to use and you will be set-up and done in seconds!
- Use [Hosting](#hosting) if you want to create a static, scalable and high-performing copy of your blog hosted on Baqend.
  We will take care of scaling your copy as request amounts are emerging.
  You will not have dynamic features like comments or likes on your blog, though.

## Speed Kit

The WordPress plugin makes using [Baqend Speed Kit](/topics/speed-kit) a breeze.
Simply head over to the *Speed Kit* tab and check *enabled* next to *Speed Kit Integration*.

![Enable Speed Kit](speed-kit-enable.png)

Now, you have several options to configure Speed Kit for you:

* **Whitelist URLs**
    - Only the websites given in this list will be handled by Speed Kit.
* **Blacklist URLs**
    - All websites given in this list will be ignored by Speed Kit.
* **Bypass cache on cookie**
    - If a page contains one of the cookies given in this list, Speed Kit will ignore the given page. The cookies are given as prefixes.
* **Allowed content types**
    - Only the given content types will be handled by Speed Kit.
* **Automatic update interval**
    - Automatically triggers a revalidation of Speed Kit.

Click “Save Settings” once you are ready.


## Hosting

The WordPress plugin makes it easy using [Baqend Hosting](/topics/hosting), too.
Enable Hosting by going into the Account tab and checking “Show Hosting settings”.

Now, when you go to the Hosting tab, you have several options to configure Speed Kit for you:

* **Additional URLs to process**
    - Here you can add additional URLs separated by new lines which will also be checked when collecting your blog contents.
* **URLs which should be excluded**
    - When these URLs occur during the content collecting, they will not be uploaded to Baqend.
* **URL type to use on Baqend**
    - Choose between relative or absolute URLs to be used in your hosted copy. 
* **Destination scheme**
    - The HTTP scheme being used by your hosted copy. This is either HTTPS or HTTP.
* **Destination host**
    - The HTTP host where your hosted copy will be deployed at. This is normally your domain name.
* **Working directory**
    - This is the working directory in which all files are collected temporarily.

Click “Save Settings” once you are ready.
