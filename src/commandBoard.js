// dotenv values
let dotenv = require('dotenv');
let settings = dotenv.config().parsed;

class Command {
  constructor() {
    this.list = [];
  }
}

Command.prototype.add = function(command, action, perms) {
  this.list.push({
    command: command,
    action: action,
    permissions: perms || []
  });
}


Command.prototype.help = function() {
  console.log('')
  console.log('List of available commands: ');
  for (let i = 0; i < this.list.length; i++) {
    console.log('   ' + (i + 1) + '-  ' + this.list[i].command);
  }
  console.log('')
}

Command.allow = function (perm, author) {
  for (let i = 0; i< perm.length; i++) {
    if (perm[i] === author) {
      return true;
    }
  }
  return false;
}

Command.parse = function(text) {
  let noPrefix = text.split(settings.PREFIX)[1];
  let content = noPrefix.split(' ');
  let command = content[0];
  let args = content.slice(1, content.length) || [];
  return { command: command, arguments: args };
}

Command.prototype.handle = function(msg) {
  // Only use one channel
  if (msg.channel.id == settings.CHANNEL_ID) {
    // Set string content
    let text = msg.content;
    // If starts by prefix, iterate through command list
    if (text[0] === settings.PREFIX) {
      // Parse user prompt
      let content = Command.parse(text);
      let user_prompt = content.command;
      // Iterate through list of commands
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].command === user_prompt) {
          let result;
          let action = this.list[i].action;
          const isAsync = action.constructor.name === "AsyncFunction";
          if (this.list[i].permissions.length === 0 || Command.allow(this.list[i].permissions, msg.author.username)) {
            // Run the action referenced
            if (isAsync) {
              action.apply(1, content.arguments);       
            } else {
              result = action.apply(1, content.arguments);       
            }
                 
          } else {
            console.log(msg)
            result = 'You do not posses the rights to this command... ';
          }
          // Send result
          if (typeof result !== 'string') {
            result = JSON.stringify(result);
          }
          if (result !== undefined) {
            msg.channel.send('\`\`\`\n' + result + '\`\`\`');
          }
        }
      }
    } else if (
      text[0] === '`' &&
      text[1] === '`' &&
      text[2] === '`' &&
      text[3] === 'j' &&
      text[4] === 's'
    ) {
      let content = text.replace(/\`\`\`js/gm, '').replace(/\`\`\`/gm, '');
      let oldlog = console.log;

      // Replace console.log by a similar function logging both in the console and in the discord channel
      const hybridlog = (t) => {
        if (msg.channel !== undefined) {
          let discord_code = '\`\`\`\n';
          let print = discord_code + t + discord_code;
          let type_t = typeof t;
          if (type_t === 'string') {
            if (t.replace(/ /gm, '').length > 0) {
              msg.channel.send(print);
            }
          } else {
            msg.channel.send(print.toString());
          }
        }
        oldlog(' In discord channel: ' + t);
      };
      console.log = hybridlog;
      try {
        eval(content)
      } catch (e) {
        //hybridlog(e);
        channel.send('\`\`\`\n' + e + '\`\`\`\n');
      }
      console.log = oldlog;
    }
  }
}

module.exports = Command;