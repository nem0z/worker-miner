import { parentPort, workerData } from 'node:worker_threads';

import { mine } from './crypto.js';

//console.log('Loading miner ...');
const { block, difficulty } = workerData;

const { nonce } = mine(block, difficulty);

parentPort.postMessage({...block, nonce: nonce});
