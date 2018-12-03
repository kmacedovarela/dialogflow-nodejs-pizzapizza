# Pizza Pizza - Actions on Google 

# Intro 

This sample is used with [Pizza Pizza JBpm project](https://github.com/kmacedovarela/jbpm-pizzapizza). Order a pizza using Google Home assistant, and a new process will be created on JBpm to evaluate the price and time according to the rules defined.

# TLDR;

1. Import the pizza-order.zip to your [Actions on Google](https://console.actions.google.com) project using "Import from Zip" option;
1. Deploy node function on firebase

~~~

$ git clone git@github.com:kmacedovarela/dialogflow-nodejs-pizzapizza.git
$ cd dialogflow-nodejs-pizzapizza/functions
$ npm install -g firebase-tools
$ firebase login

// select you dialogflow project f.e
$ firebase use <project-id> 
$ npm install
$ firebase deploy

~~~

1. Go back to the Dialogflow console and select *Fulfillment* from the left navigation menu. Enable *Webhook*, set the value of *URL* to the `Function URL` from the previous step, then click *Save*.
1. Select *Integrations* from the left navigation menu and open the *Integration Settings* menu for Actions on Google.
1. Enable *Auto-preview changes* and Click *Test*. This will open the Actions on Google simulator.
1. Type `Talk to Mr. JBpm` in the simulator, or say `OK Google, talk to Mr. JBpm` to any Actions on Google enabled device signed into your developer account.

For more detailed information on deployment, see the [documentation](https://developers.google.com/actions/dialogflow/deploy-fulfillment).


## References and tutorial on google action (by google)
* Actions on Google documentation: [https://developers.google.com/actions/](https://developers.google.com/actions/).
* Build Actions for the Google Assistant (Level 2): https://codelabs.developers.google.com/codelabs/actions-2/index.html
