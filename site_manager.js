const config = require('config');
const TextEncoder = require("util").TextEncoder;
const TextDecoder = require("util").TextDecoder;
const bluzelle = require('@bluzelle/sdk-js').bluzelle;

const defaultLease = {minutes: 0, seconds: 0, years: 0, hours: 1, days: 0};
const encoder = new TextEncoder();
const decoder = new TextDecoder();


(async () => {
const sdk = await bluzelle({
        mnemonic: config.mnemonic, 
        url: config.blz_url,
        maxGas: 100000000, 
        gasPrice:  0.002 		 
});

var uuid = Date.now().toString();
var response = await sdk.db.tx.Create({
            creator: sdk.db.address,
            uuid,
            key: 'myKey',
            value: encoder.encode('myValue'),
            metadata: new Uint8Array(),
            lease: defaultLease
        });
console.log(response);
response = await sdk.db.q.Read({uuid: uuid, key: 'myKey'});
var output = decoder.decode(response.value);
console.log(output);

response = await sdk.db.tx.Update({
            creator: sdk.db.address,
            uuid,
            key: 'myKey',
            value: encoder.encode('secondValue'),
            lease: defaultLease,
            metadata: new Uint8Array()
        });
console.log("udpate:", response);
response = await sdk.db.q.Read({uuid: uuid, key: 'myKey'});
output = decoder.decode(response.value);
console.log(output);


})();

