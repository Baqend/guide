# WordPress Plugin

Baqend has special support for **WordPress** with a custom plugin that allows you to run your WordPress blog blazingly fast on Baqend.


## Install the Plugin

Installing the Baqend WordPress Plugin is as easy as doing the following steps. 

1. In your WordPress's admin, hover over “Plugins” in the left menu and hit “Add New”.
2. There, enter “Baqend” in the plugin search box.
3. You will see a list of search results which should include the Baqend plugin. Click on the “Install Now” button to install the plugin.
4. After installing the plugin you will be prompted to activate it. Click on the “Activate Plugin” link.
5. The Baqend plugin is now installed and can be found on the left menu.


## Prepare Your Baqend App

Your Baqend app will be created automatically, but you can log in and out in the *Account* tab.


## Configure Your WordPress Plugin

Once your Baqend app is prepared, go to the admin page of your WordPress blog and head over to the Baqend settings (located under *http://your-wordpress.blog/wp-admin/admin.php?page=baqend_speed_kit*).
There, enter the credentials you use to login with Baqend.

![Select an app](select-app.png)

You can now choose the app you wish to use for the plugin. 
Click on “Select App” and your plugin will be configured for Baqend.

If you want to change the Baqend account, head over to the *Account* tab and click on “Log Out”.

Now, you can choose [Speed Kit](#speed-kit) to use for your WordPress blog.
Use Speed Kit if you want to accelerate your existing WordPress blog and handle scalability on your own.
This is easy to use and you will be set-up and done in seconds!


## Speed Kit

The WordPress plugin makes using [Baqend Speed Kit](https://www.baqend.com/guide/topics/speed-kit/) a breeze.
Simply head over to the *Settings* tab and check *enabled* next to *Speed Kit Integration*.

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

