# Deactivate Speed Kit

This section describes the different ways to deactivate Speed Kit.

## Global Deactivation

In order to deactivate Speed Kit for all users, log into the dashboard and  enter the *Status* section (on the left). 
Here, you see a red **Disable Speed Kit** button on the top right – click it, and Speed Kit will immediately deactivate itself. 
From this moment on, Speed Kit will not handle any traffic for any user, until it is reactivated. 

You can turn Speed Kit back on any time by clicking the same button; it is now green and labeled **Enable Speed Kit**. 

## Session-Local Deactivation

To disable Speed Kit for your current browser session (e.g. for testing purposes), open the developer console in your browser and type the following:
    
    navigator.serviceWorker.controller.postMessage({type: "disconnect"});
    
Speed Kit is now disabled for your current session, but still functional for all other users. 

To activate Speed Kit again, type the following into your console:

    navigator.serviceWorker.controller.postMessage({type: "connect"});
