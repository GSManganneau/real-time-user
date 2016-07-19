
//import
var http = require("http");
var express = require ('express');
var bodyParser = require('body-parser');
var app = express ();
var app_bis = express();
var EventEmitter = require('events').EventEmitter;
var log = function(String){
    console.log(String)
} ;

//zookeeper connection and consumer declaration
var kafka = require('kafka-node');
var Consumer = kafka.Consumer;
//var Producer = kafka.Producer;
var addressZookeeper = '10.254.2.157:2180';
var Client = kafka.Client;
var client = new Client(addressZookeeper);
var Offset = kafka.Offset;


//topics settings
var topics = [
        {topic: 'xdr', partition: 0}
    ],
    options = { autoCommit: false, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024*1024 };




//List of Events
var dataEvent = new EventEmitter();


// listenned ports
var port1 = 3000;



//settings ports
var serverForWeb =http.createServer(app);
serverForWeb.listen(port1,'0.0.0.0', function() {
    console.log('Server for web listening on port ' + port1);
});



//io definition
var io = require('socket.io').listen(serverForWeb);
//event connection

io.sockets.on('connection', function (socket) {


    console.log('Un client est connecté !');

    dataEvent.on('received',function (message) {

        socket.emit('data',message.value);

    });


});


//routes definitions
app.get('/', function(req, res) {
  res.render('accueil.ejs');
});
//static file public
app.use(express.static('style'));

//create topic


//create consumer
var consumer = new Consumer(client, topics, options);
var offset = new Offset(client);

consumer.on('message', function (message) {
    dataEvent.emit('received',message)
});

consumer.on('error', function (err) {
log(err);
});

/*
 * If consumer get `offsetOutOfRange` event, fetch data from the smallest(oldest) offset
 */
consumer.on('offsetOutOfRange', function (topic) {
    topic.maxNum = 2;

    offset.fetch([topic], function (err, offsets) {
        var min = Math.min.apply(null, offsets[topic.topic][topic.partition]);
        consumer.setOffset(topic.topic, topic.partition, min);
    });
});

    client.on('error',function (error) {
        console.log(error);
    })



