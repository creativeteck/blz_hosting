const config = require('config');
const TextEncoder = require("util").TextEncoder;
const TextDecoder = require("util").TextDecoder;
const bluzelle = require('@bluzelle/sdk-js').bluzelle;
const tar = require('tar');
const fs = require("fs");
const path = require("path");

const defaultLease = { minutes: 0, seconds: 0, years: 0, hours: 1, days: 0 };
const encoder = new TextEncoder();
const decoder = new TextDecoder();

class RepoService {
    constructor() {
        this.uuid = "website_111";
    }

    async init() {
        this.sdk = await bluzelle({
            mnemonic: config.mnemonic,
            url: config.blz_url,
            maxGas: 100000000,
            gasPrice: 0.002
        });
    }

    streamToString(stream) {
        const chunks = [];
        return new Promise((resolve, reject) => {
            stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
            stream.on('error', (err) => reject(err));
            stream.on('end', () => resolve(Buffer.concat(chunks).toString('hex')));
        })
    }

    async push(folder, tag) {
        var has_key = await this.has_key(tag);
        var stream = tar.c({ gzip: true, sync: true }, [folder]);

        const data = await this.streamToString(stream);

        if (has_key) {
            await this.sdk.db.tx.Update({
                creator: this.sdk.db.address,
                uuid: this.uuid,
                key: tag,
                value: encoder.encode(data),
                lease: defaultLease,
                metadata: new Uint8Array()
            });
        } else {
            await this.sdk.db.tx.Create({
                creator: this.sdk.db.address,
                uuid: this.uuid,
                key: tag,
                value: encoder.encode(data),
                metadata: new Uint8Array(),
                lease: defaultLease
            });
        }

    }


    // pull bluzelle with uuid tag to folder
    async pull(tag, folder) {
        const temp_file = "my_temp_file.tgz";
        var response = await this.sdk.db.q.Read({ uuid: this.uuid, key: tag });

        var data = decoder.decode(response.value);
        data = Buffer.from(data, "hex");
        fs.writeFileSync(temp_file, data);

        if (!fs.existsSync(folder)){
            fs.mkdirSync(folder);
        }
        await fs.createReadStream(path.resolve(__dirname) + "/../" + temp_file).pipe(tar.x({ gzip: true, strip: 1, C: folder }));
        fs.unlinkSync(path.resolve(__dirname) + "/../" + temp_file);
    }

    async has_key(tag) {
        try {
            var response = await this.sdk.db.q.Read({ uuid: this.uuid, key: tag });
            return true;
        } catch (err) {
            return false;
        }
    }

}

module.exports = {
    RepoService
};
