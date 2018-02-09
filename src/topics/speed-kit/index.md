# Speed Kit: Getting Started

Baqend Speed Kit is a **plug-in solution** to accelerate your website.  
By rerouting your web traffic through Baqend´s caching infrastructure, Speed Kit achieves a performance boost of typically **50-300%**. 

On this page, we explain what Speed Kit does and how you can use it. 
For a more high-level introduction to what Speed Kit is and why you should care, see our [Speed Kit intro](./intro/).

## In a nutshell

Before we go into the details, here are four reasons to try Speed Kit:

- **Free trial**: Trying out Speed Kit is associated with no cost at all – just use a [free account](https://dashboard.baqend.com/register). 
- **Verifiable speedup**: With our [Page Speed Analyzer](./analyzer), you can measure how much faster Speed Kit makes your website.
- **No vendor lock-in**: Speed Kit is an opt-in solution, i.e. you can remove it any time with one single click. 
- **Easy to use**: If you can copy and paste, you can install Speed Kit. It's even easier for [WordPress](../wordpress/) sites!

<!--  
<div class="tip"><strong>You stay in control:</strong> 
Speed Kit only makes your website faster and won't break anything. 
But don't take our word for it, you can <a href="./speed-kit/deactivation"><strong>opt out any time</strong></a>: 
To disable Speed Kit instantaneously, just click the status toggle in your dashboard. 
</div>
-->

### Setup Instructions

To activate Speed Kit for your website, you only have to follow these steps:

1. **Register a Speed Kit app**  
Create a [Baqend account](https://dashboard.baqend.com/register) and choose app type *Speed Kit*.
2. **Follow the instructions**  
You will be guided through the installation process by our step-by-step guide. In essence, you will do the following:
    1. *Define the domain* to accelerate.
    2. *Include a code snippet* into your website – we will generate it for you!
    3. *Define refresh policies* to make sure our caching infrastructure is always synchronized with your original content.

#### Even Simpler on WordPress!
To make your WordPress blog run blazingly fast, use the Speed Kit [**WordPress plug-in**](https://wordpress.org/plugins/baqend/).
Our [WordPress guide](../wordpress/) contains all the details on how to use it.

## Integration: Overview

When you install Speed Kit, we store a copy of your website on our globally distributed caching infrastructure: 
Speed Kit then makes your website fast by intercepting browser requests and serving them from the fast Baqend caches. 
As a result, your users see your content faster and your Web server is on the last pressure. 
Since we are serving a *copy of your content*, though, you have to specify two aspects of Speed Kit's behavior:

1. [**Speedup Policies**](./whiteblacklisting): *Which requests should Speed Kit accelerate and which should not?*  
Many resources are easily cacheable through Speed Kit (e.g. images, stylesheets, etc.), while some are not (e.g. ads). 
You can define regex expressions as well as domain whitelists and blacklists to tell Speed Kit exactly which request belongs to which category.
2. [**Refresh Policies**](./refreshing): *When should Speed Kit synchronize the Baqend caches with your original content?*  
There are two different ways to make sure that Speed Kit stays in-synch with your website: 
    1. *Cron job*: Speed Kit synchronizes itself in regular intervals.
    2. *Real-time push*: You proactively trigger synchronization, either manually or programmatically through API hooks in your tech stack. 

While Speed Kit works best with static content, it is also compatible with highly customized dynamic content; see our  guide section on [personalized content](./personalized) for more information. 
For details on the Speed Kit config parameters, see our docs on the [Speed Kit API](./api).



## Where Next?
To learn more about Speed Kit, check out the following resources:  

- [WordPress integration guide](../wordpress/): how to use Speed Kit for your WordPress site.
- [Page Speed Analyzer](./analyzer): measure how much of an edge Speed Kit gives you over your existing website!
- [How Speed Kit works](./how-it-works): a more in-depth description of how Speed Kit works.
- [Data Privacy](./privacy): our policies for handling your data.
