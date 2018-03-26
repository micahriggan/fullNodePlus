const Web3 = require('web3-eth');
const web3Client = new Web3('http://localhost:8545');

function ETHStateProvider(chain){
  this.chain = chain || 'ETH';
  this.chain = this.chain.toUpperCase();
}

ETHStateProvider.prototype.getAddressUtxos = async function(network, address, stream, args) {
};

ETHStateProvider.prototype.getBalanceForAddress = async function(network, address){
  const balance = await web3Client.getBalance(address);
  return [ { balance } ];
};

ETHStateProvider.prototype.getBalanceForWallet = async function(walletId){
};

ETHStateProvider.prototype.getBlock = async function(network, blockId){
  return web3Client.eth.getBlock(blockId);
};

ETHStateProvider.prototype.getTransactions = async function(network, stream, args){

};

ETHStateProvider.prototype.getTransaction = async function (network, txId, stream){
  const transaction = web3Client.getTransaction(txId);
  const transactions = transaction !== null ? [transaction] : [];
  stream.write(JSON.stringify(transactions)).end();
};

ETHStateProvider.prototype.createWallet = async function(network, name, pubKey, args){
};

ETHStateProvider.prototype.getWallet = async function(network, walletId){
};

ETHStateProvider.prototype.getWalletAddresses = async function(network, walletId, stream){
};

ETHStateProvider.prototype.updateWallet = async function(network, walletId, addresses) {
};

ETHStateProvider.prototype.getWalletTransactions = async function(network, walletId, stream, args) {
};

ETHStateProvider.prototype.getWalletBalance = async function(network, walletId) {
};

ETHStateProvider.prototype.getWalletUtxos = async function(network, walletId, stream, args) {
};

/*
 *ETHStateProvider.prototype.broadcastTransaction = async function(network, tx) {
};
*/

module.exports = ETHStateProvider;
