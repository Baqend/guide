#!["Logo"](/img/bootstrap-baqend.svg) Bootstrap Baqend Starter Kit

With [this starter project](https://github.com/Baqend/bootstrap-starter) you can easily build application based on:

- [Bootstrap](http://getbootstrap.com/) for a responsive, easy-to-use frontend
- [Baqend](http://www.baqend.com/) for hosting the application, storing data, managing users and executing server-side logic
- [Handlebars](http://handlebarsjs.com/) for templating and arranging your HTML in the client
- [Less](http://lesscss.org/) for powerfull CSS styling
- [Gulp](http://gulpjs.com/) for building, deploying and live-reloading

## How to use it

    $ git clone git@github.com:Baqend/bootstrap-starter.git
    $ cd bootstrap-starter
    $ npm install

Afterwards, run

    $ gulp

...for a local server with live-reloading anytime you change a file: [http://localhost:5000](http://localhost:5000)

If gulp cannot be found, you need to install it globally with `npm install -g gulp` or if you do not want to install gulp globally `npm run gulp`. If you do not have npm installed, [get it here](https://nodejs.org/en/).

## Connect to Baqend

By default this start connects to `toodle` the instance of the [Baqend tutorial](http://www.baqend.com/#tutorial). To change this go to app > js > main.js and change

```javascript
var app = 'toodle';
DB.connect(app);
```

to match your Baqend app. If you do not have one yet, start [one for free](https://dashboard.baqend.com/register).

The [Baqend guide](http://www.baqend.com/guide/) explains everything else you need to know.

## Deploy

You can easily deploy to Baqend via the command line, by installing it globally with `npm install -g baqend`. Then:

    $ gulp dist
    $ baqend login
    $ baqend deploy -f dist your-app-name

Your app is now published and available, exposing your `index.html` the URL `your-app-name.app.baqend.com`.

If you do not have `baqend` installed globally, you can also use the local version of Baqend:

    $ npm run dist -- build
    $ npm run baqend -- login
    $ npm run baqend -- -f dist your-app-name

**Note:** for now, you need an account registered via email, not via OAuth. If you do not have one, invite your email account via the *Collaboration* tab in the dashboard and use that account for the Baqend CLI.

## Example Tooling for developing with this project

1. Install [Webstorm](https://www.jetbrains.com/webstorm/).
2. Fork [this Github project](https://github.com/Baqend/bootstrap-starter) to have your own repository.
3. Clone your project via `git clone git@github.com:<your cloned repo>` and import that project folder via "File > New > Project from Existing Sources".
3. **Or:** use the dialog "File > New > Project from Version Control > Github" instead.
5. You can either use the Gulp plugin to run tasks or use the commands (e.g. `npm run gulp`) in the terminal.
6. Run gulp default (resp. `npm run gulp`) and navigate to [http://localhost:5000](http://localhost:5000) to see that it works.
