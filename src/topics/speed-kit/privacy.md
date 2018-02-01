# Baqend Data Privacy

In this section, we describe our policies for handling customer data.

##General
<strong>Server Location</strong><br>
Baqend stores data exclusively on the AWS data center located in Frankfurt, Germany.

<strong>EU Data Security</strong><br>
Baqend has a valid Data Processing Addendum with Amazon Web Services and can therefore also close data processing 
agreements with customers. IP addresses of requests are stored for 10 days. Storing of IP addresses can be deactivated 
on request.

<strong>Further Information</strong><br>
[More details on Baqend's infrastructure](https://medium.baqend.com/how-to-develop-a-backend-as-a-service-from-scratch-lessons-learned-a9fac618c2ce)

##Speed Kit 
<strong>Sensitive User Information</strong><br>
By default, Speed Kit will not process any cookies, credentials, or other personally identifiable information from the
accelerated site and therefore never see any sensitive user information. No cookies or credentials from users are stored
on Baqend’s servers.

This behavior is furthermore guaranteed by standard browser security as Speed Kit employs its own domain by default and 
is therefore not allowed access to cookies of other domains, including also the domain of the accelerated site. 

If a website sends sensitive information through URL parameters or HTTP headers, these resources can and should be 
blacklisted in Speed Kit in order not to process or store these metadata.

<strong>What Data is handled by Speed Kit?</strong><br>
Speed Kit handles all website requests that are explicitly whitelisted for it. It is recommended to whitelist only
public sections of the page and to exclude private ones like login or payment areas because as outlined above Speed Kit
will not handle user authentication, credentials or cookies.

The blacklist feature makes it very easy to exclude private areas of the site from Speed Kit. Speed Kit does not process
or store user-generated content, as POST, PUT, and DELETE requests are always processed by the original site.
