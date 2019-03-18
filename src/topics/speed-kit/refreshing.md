# Refreshing Content

Speed Kit accelerates your website by serving a cached copy of your web content. 
To prevent users from seeing outdated content, Speed Kit therefore needs to refresh after any change on your website. 

This section describes how to configure the two main aspects of refreshing content:

- **When to refresh?**  
You can trigger a [real-time refresh](#real-time-refreshing-by-api-call) to update Speed Kit caches *immediately*.  
You can also [schedule refreshes](#scheduled-refreshing-via-dashboard) in the dashboard to update Speed Kit caches periodically or trigger them by hand. 
- **What to refresh?**  
You have various options to [specify the content](#content-specification) to be refreshed.



## Real-Time Refreshing By API Call

The ideal way to refresh your cached content is to call our REST API directly from your system whenever there is a change on your website. 
The REST endpoint is `https://<your-app-name>.app.baqend.com/v1/asset/revalidate` and you need a [user access token](../../rest-api/#authentication) to be sent with the POST request.  
Simply add an authorization header to your request. It looks like this:

    authorization: BAT <your-token>
    
### Example

The following shows an example request sent with [cURL](https://curl.haxx.se/):

```
curl 'https://<your-app-name>.app.baqend.com/v1/asset/revalidate' \
    -H 'accept: application/json' \
    -H 'authorization: BAT <your-user-token>' \
    -H 'content-type: application/json;charset=UTF-8' \
    --data-binary '{"contentTypes":["HTML","CSS","JavaScript"],"urls":["https://www.example.com/some-path","https://subdomain.your-CDN.net/static/build/styles/critical.css"]}' \
    --compressed
```

### Obtaining & Revoking the User Token

To get the user token required for the API call described above, do the following:

1. **Login**: log into your dashboard as root user
2. **Open console**: open the console of your browser 
3. **Request the token**:

        DB.User.me.requestAPIToken(console.log)
        
<div class="note">
    <strong>Note:</strong>
    The token will <strong>never expire</strong>, i.e. it is valid forever! You should revoke it, when it is no longer used.
</div>
    
### Revoking the User Token

In order to revoke it, log into your dashboard and open your console as [described above](#obtaining-revoking-the-user-token). Then, call the following:

        DB.User.revokeTokens(DB.User.me)




## Scheduled Refreshing Via Dashboard

To schedule a periodic refresh of your web content, visit the *Refresh Content* section in your [dashboard](https://dashboard.baqend.com) and click on *Create new Job*. 
Here you have the following options in the dashboard:

1. **Content**:  
By default, all content is refreshed. 
However, you can also define custom [content filters](#content-specification) to make your refresh routine more efficient. 
2. **URLs**:  
By default, your entire website will be refreshed. 
However, you can also make a more fine-great choice by specifying individual URLs (e.g. `https://www.baqend.com/guide/`) or URL prefixes (e.g. `https://www.baqend.com/guide/topics/*`).

3. **Schedule**:  
By default, your job is executed *once every hour*, but you can choose another interval if you like. 
You can also provide a [cron pattern](../cronjobs/#cron-patterns) to specify *arbitrary* schedules. 

To view the details of your refresh task, click on the **<i class="fa fa-pencil"></i> button** on the right. 

### Scheduled Execution

After you have finished configuring your refresh job, it will be run according to the interval you specified (e.g. every hour or once a day). 
For every job, you can see when the last execution was and when the next execution will be performed. 


### Manual Execution
You can also manually trigger a refresh by clicking the **<i class="fa fa-play"></i> button** on a particular row in the table or by clicking the **Refresh Everything NOW!** button at the top of the page. 
A status message will inform you when the refresh has been completed. 


## Content Specification

The refresh API takes a **filter object** as JSON to configure the refresh process. In case your filter object is an empty JSON object, we will just refresh all files on our system. If you are aware of which files have been changed, you can optimize the refresh process by providing specifications. 
To do so, use the following options:

* `contentTypes: string[]` – takes an array of comma-separated strings. Available types are:
    - document (HTML files) 
    - style (CSS files)
    - script (JavaScript files)
    - feed
    - audio
    - video
    - image
    - font
* `urls: string[]` - takes an array of comma-separated URLs or URL-Prefixes. Prefixes must end with an *.
* `query: {}` - takes a JSON object which represents a native MongoDB query. You can configure the following parameters within this object:
    - url
    - eTag
    - lastModified
    - contentType
    - mediaType

<div class="note">
    <strong>Note:</strong>
    See the MongoDB documentation for more information on <a href="https://docs.mongodb.com/manual/tutorial/query-documents/">MongoDB queries</a>.
</div>

### Examples

In the following, we provide some use cases and the corresponding filters:

- You want to refresh all HTML files:

        {
            "contentTypes": ["document"]
        }

- You want to refresh all URLs, which starts with `https://www.example.com/assets`:

        {
            "urls": ["https://www.example.com/assets*"]
        }
        
- You want to refresh your home page:
        
        {
            "urls": ["https://www.example.com", "https://www.example.com/"]
        }
        
- You want to configure your own advanced query to refresh files with a specific media type:
        
        {
            "query": {
                "mediaType": "text/plain"
            }
        }