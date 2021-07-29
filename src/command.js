const Command = require('./commandBoard');
const command = new Command();
const fs = require('fs');
const dataset = require('./dataset');
const {exec} = require('child_process');
const test = require('./test');
const delay = require('./delay');
const getNum = require('./getnum');
const log = require('./log');
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
      console.log('\x1b[8m'+' Loss: '+nn.loss + ' trained with an image of ' + getNum(dataset.traindata[index].batch[j].label))
      sum += nn.loss;
    }
    for (let i = 0; i < 5; i++) {
      nn.backpropagate(
        emptyInput,
        emptyOutput
      );
      sum += nn.loss;
    }
    setTimeout(function() {
      //your code to be executed after 1 second
    }, 100);
    if (index >= dataset.traindata.length-1) {
      
      let batches_left = batches - index;

      let accuracy = test(dataset.testdata);
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
    log('['+total_passed+'/'+batches+'] batches completed');
    // Let the system pause for a while after a batch
    await delay(100);
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

command.add('epoch',()=>{
  return 'Current epoch: ' + nn.epoch;
})

command.add('sample',(b = 0, i = 0) => {
  
  let image = dataset.traindata[b].batch[i].image;
  let label = dataset.traindata[b].batch[i].label;
  
  let out = nn.feed(image);
  out = out.map(x=>(Math.round(x*100)/1000));

  let str = 'Prediction: \n' +
  out.toString() + '\n'+
  'Truth:\n' +
  label.toString(); 

  return str;
})

command.add('test',()=>{
  let start_time = new Date().getTime();
  let acc = test(dataset.testdata);
  let end_time = new Date().getTime();
  let time = ((end_time - start_time)/1000)/60;
  let seconds = Math.round((time % 1) * 60);
  let minutes = Math.round(time);
  return 'Accuracy: ' + acc + '% | Test time: ' + minutes + ' min ' + seconds + ' sec';
})

command.add('getModel', (n) => {
  let path = './models/';
  let nbfiles = n || fs.readdirSync(path).length-1;
  let name = 'Dann-model-' + nbfiles + '.json';
  channel.send("\`\`\`\n model: \n\`\`\`", {
    files: [
      path + name,
    ]
  });
  return 'Serving file ' + name;
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