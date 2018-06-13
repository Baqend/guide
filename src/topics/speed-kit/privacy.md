# Baqend Data Privacy

In this section, we describe our policies for handling customer data.

##General
<strong>Server Location</strong><br>
Baqend stores data exclusively on the AWS data centers located in Frankfurt, Germany.

<strong>EU Data Security</strong><br>
Baqend has a valid Data Processing Addendum with Amazon Web Services and can therefore also close data processing agreements with customers. 
Baqend only stores anonymized IP IPv4 addresses and deletes them after 10 days: 
In detail, thelast 8 bit of any user IP address is set to to zeros in memory, i.e. before touching disk. 
IPv6 addresses are not stored at all. 
Baqend will never persist a user's full IP address. 
Storing of IP addresses can be deactivated on request.

<strong>Further Information</strong><br>
For additional details on data storage and processing in Baqend, we refer to our [overview of Baqend's infrastructure](https://medium.baqend.com/how-to-develop-a-backend-as-a-service-from-scratch-lessons-learned-a9fac618c2ce) and our [privacy policy](https://dashboard.baqend.com/privacy).

##Speed Kit 
<strong>GDPR-Compliance</strong><br>
By default, Speed Kit will not process any cookies, credentials, or other personally identifiable information from the accelerated site. 
 Therefore, Speed Kit will *never see any sensitive user data*. 
Further, Baqend's servers neither process nor store cookies or credentials from Speed Kit users.  
Therefore, Speed Kit is <u>GDPR-compliant by default</u>. 

<strong>What Data is handled by Speed Kit?</strong><br>
Speed Kit *only accelerates GET requests* by caching their responses: POST, PUT, and DELETE requests are always processed by the original site and never processed or stored by Speed Kit or Baqend. 

Speed Kit handles all website requests that are explicitly *whitelisted*, excluding requests that are *blacklisted*. 
Therefore, it is recommended to whitelist only public sections of the page and to exclude sections that expose private data through GET requests (e.g. login, payment, user profile).  

Speed Kit is built on Service Workers which *cannot access third-party credentials or cookies* [by specification](https://fetch.spec.whatwg.org/#forbidden-header-name). 
