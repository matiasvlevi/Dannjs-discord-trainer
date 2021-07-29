// dotenv values
let dotenv = require('dotenv');
let settings = dotenv.config().parsed;

// Discord bot
const Discord = require('discord.js');
const client = new Discord.Client();

const fs = require('fs');

// Dannjs neural network library
require('dannjs');
let filesnb = fs.readdirSync('./models/').length;
let ai;
if (filesnb === 0) {
  // Create the neural network
  ai = new Dann(784, 11);
  ai.addHiddenLayer(256, 'leakyReLU');
  ai.addHiddenLayer(128, 'leakyReLU');
  ai.addHiddenLayer(32, 'leakyReLU');
  ai.makeWeights(-1, 1);
  ai.lr = 0.0000001;
} else {

  let name = 'Dann-model-' + (filesnb - 1) + '.json';
  let model = JSON.parse(fs.readFileSync('./models/' + name, 'utf8'));
  console.log('Loaded ' + name + ' model')
  ai = Dann.createFromJSON(model);
  ai.lr = 0.0000001;
}
// Store as global variable
global.nn = ai;

// Command database
const Command = require('./src/command');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  Command.help();

  global.channel = client.channels.cache.get(settings.CHANNEL_ID);
});

client.on('message', (msg) => {
  Command.handle(msg);
})

client.login(settings.TOKEN);