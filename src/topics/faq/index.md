# Frequently Asked Questions

In this continuously growing section, we answer common questions on Baqend.

#### Question not found?
Here are a few resources additional resources to get help:

- [Stackoverflow Baqend](https://stackoverflow.com/questions/tagged/baqend)
- The rest of the [Baqend guide](https://www.baqend.com/guide/)
- [Baqend on Github](https://github.com/Baqend)
- The <a href="javascript:Tawk_API.maximize();">Chat</a> on the bottom of this page
- Email Support at [support@baqend.com](support@baqend.com)

## Security, Privacy and Data Protection

Here we list questions related to data privacy and security as well as the Baqend's counter-measures to data loss.

### How am I protected from data loss?

To minimize the risk of data loss through hardware failure, Baqend stores all your data in a **threefold replicated** cluster spanning multiple availability zones in Frankfurt, Germany. To also shield you against human or other errors that may result in data loss, Baqend makes periodic backups which you can import into any off-the-shelf MongoDB database.

Baqend automatically creates weekly backups for Indie apps and daily backups for higher plans, every morning at 6 AM (UTC).
Every backup is a downloadable MongoDB dump archive located in the `baqend_backups/` file directory.
The used backup storage will be charged like normal file storage.
By default, the MongoDB backups will be retained for 30 days before they are removed.
If you prefer a custom retention period, contact us via email at [support@baqend.com](mailto:support@baqend.com) or via chat.

### Where is my data stored?

Currently, all your Baqend data (database records, files, configurations, etc.) is stored in our Amazon Web Services data center in **Frankfurt, Germany**. If required we can set up agreements on commissioned data processing (in Germany Auftragsdatenverarbeitung). Your data is never transferred to another data center without your consent. Using Baqend's [Access Control System](https://www.baqend.com/guide/topics/user-management/#permissions) you can define on a fine-granular level, which data is visible to whom and who has the rights to edit things.

### How can I export and backup my data?

Baqend automatically creates weekly backups for Indie apps and daily backups for higher plans. You can download and transfer these backups to any location. Additionally, you can download/export all your files and tables at any time for each folder and each table.

### How does Baqend protect and secure my data?

To protect your data and make everything as safe as possible, we rely on the Amazon AWS data center in Frankfurt, Germany. AWS offers the most advanced and secure cloud solution available in the industry.

We also support **TLS** by default to secure your connections to our service.

### Does Baqend offer agreements on commissioned data processing?

If you have to store personal data and need to sign a **data processing agreement** to be data protection compliant (e.g. ADV), please contact us and we will set up a contract.


## Service and Business

Here we list questions related to the Baqend service offering itself.

### Do you support hosting Baqend on other cloud providers/infrastructures?

With [**Platform Enterprise**](https://www.baqend.com/enterprise.html), we explicitly support hosting and maintaining private Baqend deployment on your particular infrastructure, e.g.:

Other Cloud Providers than AWS
Private Clouds (e.g. OpenStack)
Hosting Providers
Custom Enterprise Infrastructure
This can be particularly interesting if you have to fulfill special regulatory or data protection requirements that prevent deployment on Amazon Web Services (our current default provider).


### Do you provide implementation assistance?

Yes, for larger projects we provide support for implementing websites and/or mobile applications on Baqend. In particular, if you have complex performance and data management needs, we can assist in designing data models and queries to achieve great scalability and performance. With our partners, we do offer full-stack development & consulting to provide the best end user experience over the full frontend-to-backend path.

To discuss details, please contact sales@baqend.com or call +49 40 60940539.


### How do I know that when I build my app, websites or business on Baqend it will still be there in the future?

That is, of course, a valid question and we would like to address it. The first perspective is the technical side:

We are one of the only BaaS providers that has a [Community Edition](https://www.baqend.com/features.html#download) which allows running Baqend and its database on premises. You can completely migrate your cloud-based Baqend application and continue running it on your own hardware, should Baqend ever go out of business. The only limitation is that you have to manage the infrastructure yourself, scalability above 20K requests per second is harder and we cannot automate performance optimization.

Also, we try to keep vendor lock-in minimal. We create nightly backups of your data that you can import in a self-hosted MongoDB. We have APIs and a dashboard for exporting the data, schema, and code of everything that makes up your app. All the Baqend code of your app relies on the Node.js ecosystem and can be ported to any environment that can run Node servers (e.g., Heroku or AWS).

Additionally, in our enterprise plan, we can provide source code escrow agreements and other terms that explicitly handle the case of how we hand over the Baqend technology if Baqend Cloud is discontinued. Baqend Enterprise can be deployed on private clouds and provides the same performance and scalability as Baqend Cloud.

The second perspective is our growth plans for Baqend:
On the business side, we are not headed for a fast exit and have already turned down acquisition offers. We are strongly focused on the product and business development and favor an IPO in many years over selling to a large tech company. Europe and in particular Germany are a lot different from the US in terms of startup life cycles. Companies are less geared towards exits and more focused on long-term, continuous improvement, and sustainable growth.


## Technical

Here we list questions related to technical concerns.


### I have legacy system X, do you offer an integration?

There are many possible ways to integrate your existing system into Baqend. The best way to combine your legacy system with Baqend is to use [Speed Kit](https://www.baqend.com/speedkit.html).

