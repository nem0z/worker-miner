import CryptoJS from 'crypto-js';

export const sha256 = (input) =>  CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);

export function mine(block, difficulty=4) {
    block.nonce = Math.floor(Math.random() * 10**9);;
    let hash = sha256(JSON.stringify(block));

    while(hash.slice(0, difficulty) !== Array(difficulty + 1).join('0')) {
        ++block.nonce;
        hash = sha256(JSON.stringify(block));
    }

    return { hash: hash, nonce: block.nonce };
}
