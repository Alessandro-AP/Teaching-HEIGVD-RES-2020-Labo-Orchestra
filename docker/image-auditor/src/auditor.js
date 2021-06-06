/**
 * @author Alessandro Parrino, Dylan Canton
 * @since  1.0.0
 * @file   Define the Musician application in Lab Orchestra
 */

// Using a standard Node.js module to work with TCP
const net = require('net'); 
// Using a standard Node.js module to work with UDP
const dgram = require('dgram'); 
// Create socket UDP
const socket = dgram.createSocket('udp4');
// Include moment.js module for current date
const moment = require('moment');

// Information for sending the datagram
const MULTICAST_ADDR = "235.255.20.20";
const PORT = 2205;

// Map of musician => {uuid : Musician(uuid,instrument,currentDate)}
const musicians = new Map();
// Musician's time out
const DOWNTIME = 5;

//Map for sounds and their respective instruments
const INSTRUMENTS = new Map();
INSTRUMENTS.set('ti-ta-ti', 'piano');
INSTRUMENTS.set('pouet', 'trumpet');
INSTRUMENTS.set('trulu', 'flute');
INSTRUMENTS.set('gzi-gzi', 'violin');
INSTRUMENTS.set('boum-boum', 'drum');



/**
 * TCP server: once a TCP connection is established 
 * we check that the musicians are still active, 
 * we send the list of musicians in the form of a json
 */

const server = net.createServer(function (socket) {
  var message = [];

  musicians.forEach((musician) => {
    if (moment(Date.now()).diff(musician.activeSince, 'seconds') <= DOWNTIME) 
      message.push(musician);
    else 
      musicians.delete(musician);
  });


  socket.write(`${JSON.stringify(message, null, '\t')}\n`);
  socket.end();
});

//Sets listening port
server.listen(PORT);

/**
 * Join the multicast group
 */
socket.bind(PORT, () => {
  console.log(`Listening on port ${PORT}`);
  socket.addMembership(MULTICAST_ADDR);
});

// Structure for musicitian
function Musician(id, instrument, currentDate) {
  this.uuid = id;
  this.instrument = instrument;
  this.activeSince = currentDate;
}

/**
 * Listens to a message (UDP) containing a musician in json format, 
 * each message is added to the list of musicians.
 */
socket.on('message', function (msg) {
  const json = JSON.parse(msg);
  musicians.set(json.uuid, new Musician(json.uuid, INSTRUMENTS.get(json.sound), new Date()));
});


