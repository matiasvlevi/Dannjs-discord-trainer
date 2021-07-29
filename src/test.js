function getAccuracy(x, y) {
  let sum = 0;
  for (let i = 0; i < x.length; i++) {
    sum += Math.abs(x[i]-y[i]);
  }
  return 1 - (sum/x.length);
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
  return acc/(index*data[0].batch.length);
}