var events = require("events");
var util = require("util");
var request = require("request");
var api = require("./apiHelper");
var certificates = require("./certificate");
var rMQTT = require("./rMQTT");
var bunyan = require('bunyan');
var log = bunyan.createLogger({name: 'relayr'});

log.level('trace');

function Relayr(app){

    var app_id = app;
    events.EventEmitter.call(this);
    var mqtt = new rMQTT();
    var self = this;

    mqtt.on('data', function(topic, msg){
        self.emit('data', topic, msg);
    });
    mqtt.on('connect', function(){
        self.emit('connect');
    });
    mqtt.on('close', function(){
        self.emit('close');
    });

    this.mqtt = mqtt;
    this.channels = {};
    log.debug("Relayr created");
}
util.inherits(Relayr, events.EventEmitter);

var listeners = [];

Relayr.prototype.user = api.user;
Relayr.prototype.devices = api.devices;
Relayr.prototype.device = api.device;
Relayr.prototype.command = api.command;

Relayr.prototype.connections = api.channels;
Relayr.prototype.disconnect = api.deleteChannel;
Relayr.prototype.deviceModel = function (token, dev_id, callback) {
    this.device(token, dev_id, function (err, dev) {
        log.info("erm", err, dev);
        if (err) {
            callback(err);
        } else {
            api.deviceModel(token, dev.model.id, callback);
        }
    });

};

Relayr.prototype.unsubscribe = function(token, dev_id){
    api.deleteChannel(token, this.channels[dev_id].channelId, function(err) {
        if (err) {
            log.error("unable to delete channel for %s", token, err); 
        } else {
            log.info("channel deleted");
        }
    
    });
};

Relayr.prototype.connect = function(token, dev_id){
    var mqtt = this.mqtt;
    var channels = this.channels;
    log.debug("connecting");

    certificates.check(function () {
        log.info("creating channel for %s:%s", token, dev_id); 
        api.createChannel(token, dev_id, function(err,data){

            if (err) {
                log.error("unable to create channel for %s:%s", token, dev_id, err);
            } else {
                log.info("created channel for %s:%s", token, dev_id);
                mqtt.connect(data);
                channels[dev_id] = data;
            }
        });
    });
};


module.exports = Relayr;

