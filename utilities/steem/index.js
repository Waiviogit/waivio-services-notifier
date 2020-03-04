const steem = require('steem');
const bluebird = require('bluebird');
const { nodeUrls } = require('../../config');

bluebird.promisifyAll(steem.api);
steem.api.setOptions({ url: nodeUrls[ 1 ] });

const changeNodeUrl = () => {
    const index = nodeUrls.indexOf(steem.config.url);

    steem.config.url = index === nodeUrls.length - 1 ? nodeUrls[ 0 ] : nodeUrls[ index + 1 ];
    console.error(`Node URL was changed to ${ steem.config.url}`);
};

const getHeadBlockNum = async () => {
    try {
        return (await steem.api.getDynamicGlobalPropertiesAsync()).head_block_number;
    } catch (error) {
        changeNodeUrl();
        console.error(error);
    }
};

module.exports = { changeNodeUrl, getHeadBlockNum };
