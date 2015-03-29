# Duverger [![Build Status](https://travis-ci.org/habdelra/duverger.svg?branch=master)](https://travis-ci.org/habdelra/duverger)

This README outlines the details of collaborating on this Ember application.

A short introduction of this app could easily go here.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM) and [Bower](http://bower.io/)

## Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`

## Running / Development

* `ember server`
* Visit your app at http://localhost:4200.

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

#### Setting up Heroku
Our app is hosted on Heroku. To get started create a Heroku account using your email address, and then download the Heroku toolbelt, which you can find here: https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up
* Add the following remote repositories to your `<project>/.git/config` file:
```
[remote "production"]
        url = https://git.heroku.com/duverger.git
        fetch = +refs/heads/*:refs/remotes/production/*
[remote "staging"]
        url = https://git.heroku.com/duverger-staging.git
        fetch = +refs/heads/*:refs/remotes/staging/*
 ```

* Login to heroku from the command line: 
```
$ heroku login
```


We have two heroku apps setup:

1. `duverger` this is the production application instance. The git remote name for this instance is `production`.
2. `duverger-staging` this is the staging application instance. The git remove name for this instance is `staging`.

#### Performing a Deploy
To deploy the master branch to staging issue the following command (you may have to use the `-f` option if a force push is required):
```
$ git push staging master
```

To deploy a named branch to staging issue the following command (you may have to use the `-f` option if a force push is required):
```
$ git push staging my-branch:master
```

To deploy the master branch to production issue the following command (you may have to use the `-f` option if a force push is required):
```
$ git push production master
```

To deploy the release branch to production issue the following command (you may have to use the `-f` option if a force push is required):
```
$ git push production my_release_name:master
```

#### Starting up the instance
If the heroku instance is not running, you can can start it manually.

Start the production instance by typing this:
```
$ heroku ps:scale web=1 --app duverger
```

Start the staging instance by typing this:
```
$ heroku ps:scale web=1 --app duverger-staging
```

## Further Reading / Useful Links

* ember: http://emberjs.com/
* ember-cli: http://www.ember-cli.com/
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

