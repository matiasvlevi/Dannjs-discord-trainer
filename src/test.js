function getAccuracy(x, y) {
  let sum = 0;
  for (let i = 0; i < x.length; i++) {
    if (y[i] === 0 || x[i] === 0) {
      sum += 0;
    } else {
      sum += y[i]/x[i];
    }
  }
  return sum/x.length;
}


module.exports = function test(data) {
  let acc = 0;
  let index = 0;
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[index].batch.length; j++) {
      let out = nn.feed(
        data[index].batch[j].image,
      );
      acc += getAccuracy(data[index].batch[j].label, out);
    } 
    index++;
  }
  let percent = Math.round((acc/(index*data[0].batch.length))*100000)/100;
  return percent;
}