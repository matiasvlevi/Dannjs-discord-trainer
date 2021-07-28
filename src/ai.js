require('dannjs');

let ai = new Dann(784, 11);
ai.addHiddenLayer(256, 'leakyReLU');
ai.addHiddenLayer(128, 'leakyReLU');
ai.addHiddenLayer(32, 'leakyReLU');
ai.makeWeights();
ai.setLossFunction('mse');

global.nn = ai;