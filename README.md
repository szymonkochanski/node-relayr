# The Node.js relayr Library

Welcome to the relayr Node.js Library. The library allows you to access your WunderBar sensor data and the [relayr Cloud Platform](https://developer.relayr.io/documents/Welcome/Platform) functionality from apps built in Node.js.

This library isn't complete, but will grow to expose a lot more useful functionality.

## Installing the Library

To install the library simply type 

	npm install relayr


## Including the Library in your Project 

In order to include the module in your project simply add


	var Relayr = require('relayr');

## Using the Library  

### Retrieving App and Device Credentials 

Log in to your relayr account on the [Developer Dashboard](https://developer.relayr.io)

Access the [API Keys page](https://developer.relayr.io/dashboard/apps/myApps) in order to retrieve your `appId` and `appToken` 

	var app_id = "YOURAPPID";
	var token  = "YOURSENSORTOKEN";

Access the [Devices page](https://developer.relayr.io/dashboard/devices) in order to retrieve your `deviceId`

	var dev_id = "YOURDEVICEID";

### Initializing the Library


	var relayr = new Relayr(app_id);


### Connecting  Using the Credentials:

	relayr.connect(token, dev_id);


### Subscribing to a Data Channel

	relayr.on('data', function (topic, msg) {
	        console.log(topic + ":" + msg);
	}


### Sending a Command

	relayr.command(token, dev_id, 
	    {
	        path:"led", 
	        command:"led", 
	        value:true
	    }, 
	    function (err,code) {
	        console.log(err||code)
	    });


### Retrieving Information

User Information

	relayr.user(token, function (err, user) {
	    console.log(err || user);
	}


User's Devices Information

	relayr.devices(user_id, token, function (err, devices) {
	    console.log(err || devices);
	}


Individual Device Information

	relayr.deviceModel(token, dev_id, function (err, model) {
	    console.log(err || model);
	}


## Examples

Please have a look at the [Examples folder](https://github.com/relayr/node-relayr/tree/documentation/examples) for a few samples displaying the library's capabilities.

## Credits
Big thanks to ***BinaryMax*** for putting in the ground work for this library.

## License
MIT License
