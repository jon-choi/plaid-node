// var express = require('node_modules/express/lib/express');
// var plaid = require('node_modules/plaid/index');

// define(function (require) {
//     var express = require('node_modules/express/lib/express');
// });
// define(function (require) {
//     var plaid = require('node_modules/plaid/index');
// });

var requirejs = require('requirejs');
requirejs.config({nodeRequire: require});

requirejs(['express', 'plaid'], function (express, plaid) {
    var app = express();

    var plaidClient = new plaid.Client(process.env.PLAID_CLIENT_ID,
                                       process.env.PLAID_SECRET,
                                       plaid.environments.tartan);

    app.post('/authenticate', function(req, res) {
      var public_token = req.body.public_token;

      // Exchange a public_token for a Plaid access_token
      plaidClient.exchangeToken(public_token, function(err, res) {
        if (err !== null) {
          // Handle error!
        } else {
          // This is your Plaid access token - store somewhere persistent
          // The access_token can be used to make Plaid API calls to
          // retrieve accounts and transactions
          var access_token = res.access_token;
          console.log(access_token);

          plaidClient.getAuthUser(access_token, function(err, res) {
            if (err !== null) {
              // Handle error!
            } else {
              // An array of accounts for this user, containing account
              // names, balances, and account and routing numbers.
              var accounts = res.accounts;
              console.log(accounts);

              // Return account data
              res.json({accounts: accounts});
            }
          });
        }
      });
    });
});
