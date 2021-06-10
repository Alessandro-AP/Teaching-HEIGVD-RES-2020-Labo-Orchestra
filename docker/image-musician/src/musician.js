/**
 * @author Alessandro Parrino, Dylan Canton
 * @since  1.0.0
 * @file   Define the Musician application in Lab Orchestra
 */

//Musician's UUID
const {v4: uuidv4} = require ('uuid');
//Using a standard Node.js module to work with UDP
var udp = require('dgram');
//Create socket for UDP datagram
var socket = udp.createSocket ('udp4');

//Information for sending the datgram
const PORT = 2205;
const MULTICAST_ADDR = "235.255.20.20";

//Map for instruments and their respective sound
const SOUNDS = new Map();
SOUNDS.set("piano", "ti-ta-ti");
SOUNDS.set("trumpet", "pouet");
SOUNDS.set("flute", "trulu");
SOUNDS.set("violin", "gzi-gzi");
SOUNDS.set("drum", "boum-boum");

//Send interval for datagrams
const TIME_INTERVAL = 1000;

//Create a musician with no sound (empty)
let Musician = {
    uuid: uuidv4(),
    sound: "empty"
}

/**
 * Check if the instrument is valid
 * @param instrument The instrument for check
 */
function validMusician(instrument){
    if(!(SOUNDS.has(instrument))){
        console.log("The instrument isn't found !");
        process.exit(-1);
    }
    Musician.sound = SOUNDS.get(instrument);
}

/**
 * Sending message with musician's informations in JSON format
 * @param musician Musician to send
 */
function sendMsg(){
    const MSG = JSON.stringify(Musician);
    socket.send(MSG, 0, MSG.length, PORT, MULTICAST_ADDR, function(error) {
        if(error){
            console.log("Error when sending JSON data !");
            process.exit(-1);
        }else{
            console.log(MSG + " sending to " + MULTICAST_ADDR + ":" + PORT);
        }
    });
}

//Get instrument in argument and execute application
const INSTRUMENT = process.argv[2];
validMusician(INSTRUMENT);
setInterval(sendMsg, TIME_INTERVAL);