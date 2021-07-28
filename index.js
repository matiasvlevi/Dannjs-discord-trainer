// dotenv values
let dotenv = require('dotenv');
let settings = dotenv.config().parsed;

// Dannjs neural network library
require('dannjs');

// Discord bot
const Discord = require('discord.js');
const client = new Discord.Client();

// Create the neural network
let ai = new Dann(784, 11);
ai.addHiddenLayer(256, 'leakyReLU');
ai.addHiddenLayer(128, 'leakyReLU');
ai.addHiddenLayer(32, 'leakyReLU');
ai.makeWeights();
ai.setLossFunction('mse');
// Store as global variable
global.nn = ai;

// Command database
const Command = require('./src/command');

//let channel;
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  Command.help();
  //channel = client.channels.cache.get(settings.CHANNEL_ID);
});

client.on('message', (msg) => {
  Command.handle(msg);
})

client.login(settings.TOKEN);