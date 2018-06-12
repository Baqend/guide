# Baqend Data Privacy

In this section, we describe our policies for handling customer data.

##General
<strong>Server Location</strong><br>
Baqend stores data exclusively on the AWS data centers located in Frankfurt, Germany.

<strong>EU Data Security</strong><br>
Baqend has a valid Data Processing Addendum with Amazon Web Services and can therefore also close data processing agreements with customers. 
IP addresses of our users are anonymized and stored for 10 days. Storing of IP addresses can be deactivated 
on request.

<strong>Further Information</strong><br>
For additional details on our data processing, we refer to our [overview of Baqend's infrastructure](https://medium.baqend.com/how-to-develop-a-backend-as-a-service-from-scratch-lessons-learned-a9fac618c2ce) and our [privacy policy](https://dashboard.baqend.com/privacy).

##Speed Kit 
<strong>GDPR-Compliance</strong><br>
By default, Speed Kit will not process any cookies, credentials, or other personally identifiable information from the accelerated site and therefore never *see any sensitive user information*. 
No cookies or credentials from users are stored on Baqend’s servers.  
Therefore, Speed Kit is <u>GDPR-compliant by default</u>. 

This behavior is furthermore guaranteed by standard browser security as Speed Kit employs its own domain by default and is therefore not allowed access to cookies of other domains, including also the domain of the accelerated site. 

If a website sends sensitive information through URL parameters or HTTP headers, these resources can and should be *blacklisted* in the Speed Kit config to make sure that these metadata are neither processed nor stored by Baqend.

<strong>What Data is handled by Speed Kit?</strong><br>
Speed Kit handles all website requests that are explicitly *whitelisted*. 
Therefore, it is recommended to whitelist only public sections of the page and to exclude private ones like login or payment areas to make sure that Speed Kit will not handle user authentication, credentials, or cookies (see above).

Through *blacklisting*, private areas of a whitelisted site can be excluded from Speed Kit's caching. Speed Kit does not process or store outbound requests: POST, PUT, and DELETE requests are always processed by the original site and never by Speed Kit or Baqend.
