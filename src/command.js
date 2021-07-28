const Command = require('./commandBoard');
const command = new Command();


// Add all commands here


command.add('hello', () => {
  return 'hello';
});

command.add('train', (e) => {
  // for (let i = 0; i < e; i++) {
  //   nn.train();
  // }
});

// -----------------

module.exports = command;