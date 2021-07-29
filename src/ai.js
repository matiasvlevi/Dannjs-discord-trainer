require('dannjs');
module.exports = function () {
    // Create the neural network
    let ai = new Dann(784, 11);
    ai.addHiddenLayer(256, 'leakyReLU');
    ai.addHiddenLayer(128, 'leakyReLU');
    ai.addHiddenLayer(32, 'leakyReLU');
    ai.makeWeights(-1, 1);
    ai.lr = 0.000000001;
    return ai;
}