# Deactivate Speed Kit

If you for what ever reason want to deactivate Speed Kit on your site you can go to your dashboard's settings page. Scroll down and you'll find the deactivate section. You can toggle Speed Kits status here. When deactivated Speed Kit will no longer 
touch and accelerate any requests.

For a single browser session you can deactivate Speed Kit for testing purposes with the following line in the developer console:
    
    navigator.serviceWorker.controller.postMessage({type: "disconnect"});
    
To activate again use:

    navigator.serviceWorker.controller.postMessage({type: "connect"});
