import Miner from './miner.js';

const miners = Array(3).fill(null).map(m => new Miner());
miners.forEach(m => m.start());

console.log(miners);

setInterval(() => {
  miners.forEach(m => m.editLastBlock(Date.now()));
}, 1000);
