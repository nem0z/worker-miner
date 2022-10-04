import { Worker } from 'node:worker_threads';
import { sha256 } from './crypto.js';

export default class Miner {
  constructor() {
    this.blocks = [];
    this.lastBlock = {data: ['XXX']};
    this.worker = null;
  }

  editLastBlock(newData) {
    this.lastBlock.data.push(newData);
    this.worker.terminate();
    this.startMinning()
      .then(res => console.log(res))
      .catch(err => console.error(err));
  }

  startMinning(difficulty=5) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(
        './worker.js', {
        workerData : {
          block: this.lastBlock,
          difficulty: difficulty
        }
      });

      this.worker = worker;

      worker.once('message', block => {
        const hash = sha256(JSON.stringify(block));
        if(hash.slice(0, difficulty) != difficulty*'0') return reject(false);
        this.worker.terminate();
        return resolve({block: block, hash: hash});
      });

      worker.on('error', err => reject(`err : ${err}`));
      //worker.on('exit', code => reject(`exit : ${code}`));
    });
  }

  start() {
    this.startMinning()
      .then(res => console.log(res))
      .catch(err => console.error(err));
  }
}
