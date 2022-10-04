import { Worker } from 'node:worker_threads';
import { sha256 } from './crypto.js';

let thisBlock = {data: 'XXX'};
let thisWorker = null;

function editBlock(newData='XXX') {
  thisBlock.data = newData;
  thisWorker.terminate();
  mine(thisBlock)
    .then(res => console.log(res))
    .catch(err => console.error(err));
}

export default function mine(block, difficulty=4) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(
      './miner.js', {
      workerData : {
        block: block,
        difficulty: difficulty
      }
    });

    thisWorker = worker;

    worker.once('message', block => {
      const hash = sha256(JSON.stringify(block));
      if(hash.slice(0, difficulty) != difficulty*'0') return reject(false);
      return resolve({block: block, hash: hash});
    });

    worker.on('error', err => reject(`err : ${err}`));
    worker.on('exit', code => reject(`exit : ${code}`));
  });
}

mine(thisBlock)
  .then(res => console.log(res))
  .catch(err => console.error(err));

setTimeout(() => {
  editBlock('YYY');
}, 250);
