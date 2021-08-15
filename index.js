// dotenv values
let dotenv = require('dotenv');
let settings = dotenv.config().parsed;

// Discord bot
const Discord = require('discord.js');
const client = new Discord.Client();

const makeDann = require('./src/ai');
const fs = require('fs');

// Dannjs neural network library
require('dannjs');
let filesnb = fs.readdirSync('./models/').length;
let ai;
if (filesnb === 0) {
  ai = makeDann();
} else {
  let name = 'Dann-model-' + (filesnb - 1) + '.json';
  let model = JSON.parse(fs.readFileSync('./models/' + name, 'utf8'));
  console.log('Loaded ' + name + ' model')
  ai = Dann.createFromJSON(model);
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