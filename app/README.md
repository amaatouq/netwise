# Netwise

Open source project to tackle the problem of long development cycles required to
produce software to conduct multi-participant and real-time human experiments
online.

## Experiment development

Netwise was built with the experiement developer in mind. The `core` of Netwise
has been seperated from the `game`. The folder structure reflects this
organization method.

To develop a new game, you will only be interested in a couple of folders:

* imports/game
* public/game

All other folders contain `core` Netwise code, which you should not need to
change in the vast majority of cases.

## Deployment

There are many ways the app can be deployed. Netwise has no special dependencies
beyond normal Meteor requirements: Node.js + Mongo.

We will go through the deployment on one of the easiest solution using
`Meteor Galaxy`. But there are many other options so we recommend you take a
look at the Meteor Deploymeny Guide: https://guide.meteor.com/deployment.html

### Meteor Galaxy

This is simplest way to deploy. First, you will need a Meteor account, which
you can make at https://www.meteor.com. Then you'll need to log in on your
local machine with the `meteor login` command.

You will also need to create a Mongo database, self-hosted or by using a service
provider. There are many providers to choose from: Compose, MongoDB Atlas,
ObjectRocket... MLab offers a small free sandbox to try things out if you only
have very limited needs or want to just try things out: https://mlab.com/
(be careful, their free version comes with no garanties, make sure to
dump/backup your DB regularly).

Once your DB is configured, you should get a MongoDB configuration URL that
looks something like this:

```
mongodb://myuser:A6629E8B-F4D2-4EC1-ACE3-DF5AA9F2F9A6@43243gh43.mlab.com:6604/my-netwise-db
```

You should then create a settings.json file at the same level as this file and
add you Mongo URL config as follows:

```json
{
  "galaxy.meteor.com": {
    "env": {
      "MONGO_URL":
        "mongodb://myuser:A6629E8B-F4D2-4EC1-ACE3-DF5AA9F2F9A6@43243gh43.mlab.com:6604/my-netwise-db"
    }
  }
}
```

DO NOT COMMIT this file, it contains secrets that should not go into your git
repo.

\*.meteorapp.com domains are free to use with Galaxy, so you can simply choose
an available subdomain such as `my-netwise-app` (don't use this one), which will
give us the `my-netwise-app.meteorapp.com` domain name. Meteor will let you know
when you try to deploy if the domain is available. Finally just run the
following command with you settings file and your domain name:

```sh
DEPLOY_HOSTNAME=galaxy.meteor.com meteor deploy my-netwise-app.meteorapp.com --settings settings.json
```

Then you can go to https://galaxy.meteor.com/ to see the status of your
deployment.

You can redeploy the app with the same command. As long as it's up and running
you are paying by the hour. You can easily stop the app from the admin UI and
you are no longer billed. You can bring up the app for a few hours or days and
then just bring it back down when you're done to avoid paying to nothing.

To find out more about Meteor Galaxy deployments, see the guide:
http://galaxy-guide.meteor.com/index.html
