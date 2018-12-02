'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {dialogflow} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

'use strict';
const bodyParser = require('body-parser')
var request = require("request").defaults({ family: 4 });
var rp = require("request-promise");

//process server data
var kieserver_host = "http://d398ff79.ngrok.io"
var kieserver_url = kieserver_host+"/kie-server/services/rest/server"
var container="pizzapizza-processes-kjar"
var process_id= "pizzapizza-processes-kjar.ordering"

// ... app code here

// Import the Dialogflow module from the Actions on Google client library.

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});



// Handle the Dialogflow intent named 'order pizza'.
// The intent collects a parameter named 'flavor'.
app.intent('order pizza', (conv, {flavor,address}) => {
    console.log("1. Starting. Url called: "+kieserver_url+"/containers/"+container+"/processes/"+process_id+"/instances");
    
    var order_id; 
 
    var start_process_options = {
        method: 'POST',
        headers: {
            "content-type": "application/json",
            "Authorization": "Basic a2llc2VydmVyOmtpZXNlcnZlcjEh"
        },
        uri: kieserver_url+"/containers/"+container+"/processes/"+process_id+"/instances",
        body:{
            "order":{
                "Order":{
                    "flavor": flavor,
                    "address": address
                    }
                }
            },
        json: true // Automatically stringifies the body to JSON
    };
    


    var process_instance_id;
    
    const asyncProcessStart = () => new Promise(resolve => {
        
        console.log("Async Process Start");
        
        rp(start_process_options)
        .then(function (parsedBody) {
            // POST succeeded...
            console.log("3. Sucess on starting process on kie server. Body: "+parsedBody);
                        sleep(1000);

            process_instance_id = parsedBody;
            resolve(process_instance_id);
        })
        .catch(function (err) {
            // POST failed...
            console.log("Error on kie server request: "+err);
        })
        
    });

    const asyncObtainVariableValues = (pid) => new Promise(resolve => {
        var get_process_variable_options = {
            method: 'GET',
            headers: {
                "content-type": "application/json",
                "Authorization": "Basic a2llc2VydmVyOmtpZXNlcnZlcjEh"
            },
            uri: kieserver_url+"/containers/"+container+"/processes/instances/"+pid+"/variables",
        };

        console.log("Obtaining Variable Values ");
        
        rp(get_process_variable_options)
        .then(function (parsedBody) {
            // POST succeeded...
            console.log("Sucess on obtaining variables from kie server. Body: "+parsedBody);
            sleep(1000);

            //  parsedBody will be the process variables map name = value
            resolve(JSON.parse(parsedBody));
        })
        .catch(function (err) {
            // POST failed...
            console.log("Error on kie server request: "+err);
        });
        
    });

    var obj = asyncProcessStart()
        .then( function(result) {
                    order_id = result;
                    return asyncObtainVariableValues(order_id)
        }).then( function(variables) {
            var orderDetails = variables["order"]["org.kvarela.model.Order"];
            conv.close('Thanks for contacting Pizza Pizza!'+
                        ' Your '+ orderDetails.flavor +' pizza '+ 
                        ' was ordered and will be delivered at ' + orderDetails.address +
                        ' at '+orderDetails.time+' minutes'+
                        ' and will cost '+orderDetails.price+ ' bucks.'+
                        '. Your order number is '+ order_id +'. ');
        });
    
    console.log(" Ending... ");
    
    return obj;

});

/*
{
  "initiator" : "kieserver",
  "order" : {
  "org.kvarela.model.Order" : {
    "address" : "ipanema",
    "flavor" : "chocolate",
    "phone" : null,
    "price" : 30.0,
    "time" : 15,
    "discount" : null
  }
}
} */

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
