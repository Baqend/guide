# Refreshing Content

Speed Kit serves a copy of your web content. 
To prevent users from seeing outdated content, Speed Kit therefore needs to refresh after any change on your website. 

This section describes how to configure the two main aspects of refreshing content:

- **What to refresh?**  
You have various options to [specify the content](#content-specification) to be refreshed.
- **When to refresh?**  
You can trigger a [real-time refresh](#real-time-refreshing) to update Speed Kit caches *immediately*.  
You can [schedule refreshes](#scheduled-refreshing) to update Speed Kit caches periodically. 

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


<!--  

## Real-Time Refreshing

The ideal way to refresh your cached content is to call our REST API directly from your system whenever there is a change on your website. 
The REST endpoint is `https://<your-app-name>.app.baqend.com/v1/asset/revalidate` and you need a [user access token](../rest-api/#authentication) to be sent with the POST request. 
For now, to get this token, you have to log into your Baqend App on our [dashboard](https://dashboard.baqend.com) and open your browser's developer console. 
Use the developer console to call `DB.token` to receive your token. Now you have to add an authorization header to your request which looks like this:

    authorization: BAT <your-token>
    
<div class="note">
    <strong>Note:</strong>
    The token is only valid for 24 hours. The process to get a long-life user access token will change soon and thus become significantly more comfortable. As soon as this update is implemented, we will inform every customer and update this section.
</div>


## Scheduled Refreshing

In order to manually trigger a Speed Kit refresh, you have to create a custom refresh job first. 
To this end, visit the "Refresh Content" section in your [dashboard's](https://dashboard.baqend.com) and click on "Create new Job". 
When creating a refresh job, you have the following options in the dashboard:

1. By default, all content will be refreshed.
As first you can choose which kind of content should be affected by the appropriate filter.
Therefore a list of possible content types (HTML, CSS, JavaScript, etc.) is provided to you.
The second option allows you to specify the URL´s to be handled by the refresh filter.
These URL's can be entered in a specific way like `https://www.baqend.com` or by using a prefix like `https://www.baqend.com/assets/*` (refresh all files under `https://www.baqend.com/assets/`).

After you have finished configuring your refresh job, you can run it.
A status in the dashboard informs you if the refresh was successful.
Refresh filters that have already been executed are saved in your history and can be run again at any time.

Our
-->