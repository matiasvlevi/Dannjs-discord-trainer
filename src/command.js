const Command = require('./commandBoard');
const command = new Command();
const fs = require('fs');
const dataset = require('easy-mnist').makeBatch(100, { empty: true });

// Add all commands here


command.add('hello', () => {
  return 'hello';
});

let index = 0;
command.add('train', (batches) => {
  if (index + batches >= dataset.traindata.length) {
    index = 0;
    nn.epoch++;
  }
  let emptyInput = new Array(784).fill(0);
  let emptyOutput = new Array(10).fill(0);
  emptyOutput.push(1);
  let sum = 0;
  for (let i = 0; i < batches; i++) {
    for (let j = 0; j < dataset.traindata[index].batch.length; j++) {
      console.log(nn.loss)
      nn.backpropagate(
        dataset.traindata[index].batch[j].image,
        dataset.traindata[index].batch[j].label
      );
      sum += nn.loss;
    }
    for (let i = 0; i < 5; i++) {
      nn.backpropagate(
        emptyInput,
        emptyOutput
      );
      sum += nn.loss;
    }
    index++;
  }
  let avgloss = sum / (batches * (dataset.traindata[index].batch.length + 5));
  let nbfiles = 0;

  let path = './models/';

  nbfiles = fs.readdirSync(path).length;

  let name = 'Dann-model-' + nbfiles + '.json';

  fs.writeFileSync(path + name, JSON.stringify(nn.toJSON()), 'utf8');
  return 'Training complete | Average loss: ' + avgloss + ' Model\'s epoch: ' + nn.epoch;
});

command.add('models', () => {
  let path = './models/';
  let files = fs.readdirSync(path);
  let str = ''
  for (let i = 0; i < files.length; i++) {
    str += files[i] + '\n';
  }

  return str;
});


command.add('getModel', (n) => {
  let path = './models/';
  let nbfiles = fs.readdirSync(path).length || n;
  let name = 'Dann-model-' + nbfiles + '.json';
  channel.send("Here is the latest model.", {
    files: [
      path + name,
    ]
  });
});

// -----------------

module.exports = command;