const Command = require('./commandBoard');
const command = new Command();
const fs = require('fs');
const dataset = require('easy-mnist').makeBatch(100, { empty: true });
const {exec} = require('child_process');
const test = require('./test');
// Add all commands here

const messageAsync = async (x) => {
  await channel.send('\`\`\`\n' + x + '\`\`\`');
  return;
}

const message = (x) => {
  channel.send('\`\`\`\n' + x + '\`\`\`');
  return;
}
command.add('hello', () => {
  return 'hello';
});

let index = 0;
command.add('train', async (batches) => {
  let emptyInput = new Array(784).fill(0);
  let emptyOutput = new Array(10).fill(0);
  emptyOutput.push(1);
  let sum = 0;
  let start_time = new Date().getTime();
  let total_passed = 0;
  for (let i = 0; i < batches; i++) {

    for (let j = 0; j < dataset.traindata[index].batch.length; j++) {
      
      nn.backpropagate(
        dataset.traindata[index].batch[j].image,
        dataset.traindata[index].batch[j].label
      );
      console.log(nn.loss)
      sum += nn.loss;
    }
    for (let i = 0; i < 5; i++) {
      nn.backpropagate(
        emptyInput,
        emptyOutput
      );
      sum += nn.loss;
    }
    if (index >= dataset.traindata.length-1) {
      
      let batches_left = batches - index;

      let accuracy = Math.round(test(dataset.testdata)*100000)/1000;
      await messageAsync('['+total_passed+'/'+batches+'] Completed epoch ' + nn.epoch + ' with an accuracy of ' + accuracy + '%');
      nn.epoch++;
  
      // Save model
      let path = './models/';
      let nbfiles = fs.readdirSync(path).length;
      let name = 'Dann-model-' + nbfiles + '.json';
      fs.writeFileSync(path + name, JSON.stringify(nn.toJSON()), 'utf8');
      index = 0;
    } else {
      index++;
    }
    total_passed++;
  }
  let end_time = new Date().getTime();
  let time = ((end_time - start_time)/1000)/60;
  let seconds = Math.round((time % 1) * 60);
  let minutes = Math.round(time);
  let avgloss = sum / (batches * (dataset.traindata[0].batch.length + 5));


  // Save model
  let path = './models/';
  let nbfiles = fs.readdirSync(path).length;
  let name = 'Dann-model-' + nbfiles + '.json';
  fs.writeFileSync(path + name, JSON.stringify(nn.toJSON()), 'utf8');

  message('Completed ['+ total_passed+'/'+batches+'] batches | Average loss: ' + avgloss + ' | Current epoch: ' + nn.epoch + ' | Train time: ' + minutes + ' min ' + seconds + ' sec');
  return;
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
  let nbfiles = n || fs.readdirSync(path).length-1;
  let name = 'Dann-model-' + nbfiles + '.json';
  channel.send("Here is the latest model.", {
    files: [
      path + name,
    ]
  });
  return undefined;
});

command.add('cmd',function(){
  str = '';
  console.log(arguments[0])
  for (let i = 0; i < arguments.length; i++) {
    str += arguments[i] + ' ';
  }
  exec(str, (err, out, errmsg)=>{
    if (err) {
      message(errmsg);
    } else {
      message(out);
    }
  });
},['vLev'])

// -----------------

module.exports = command;