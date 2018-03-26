const Web3 = require('web3-eth');
const config = require('../../../config');

function ETHStateProvider(chain){
  this.chain = chain || 'ETH';
  this.chain = this.chain.toUpperCase();
  this.config = config.chains[this.chain];
}

ETHStateProvider.prototype.web3For = function(network) {
  const networkConfig = this.config[network];
  const provider = networkConfig.provider;
  const portString = provider.port ? `:${provider.port}` : '';
  const connUrl = `${provider.protocool}://${provider.host}${portString}`;
  let ProviderType;
  switch(provider.protocool) {
    case 'wss': 
      ProviderType = Web3.providers.WebsocketProvider;
      break;
    default: 
      ProviderType = Web3.providers.HttpProvider;
      break;
  }
  return new Web3(new ProviderType(connUrl));
  //return new Web3(connUrl);
};

ETHStateProvider.prototype.getAddressUtxos = async function(network, address, stream, args) {
};

ETHStateProvider.prototype.getBalanceForAddress = async function(network, address){
  const balance = await this.web3For(network).getBalance(address);
  return [ { balance } ];
};

ETHStateProvider.prototype.getBalanceForWallet = async function(walletId){
};

ETHStateProvider.prototype.getBlock = async function(network, blockId){
  return this.web3For(network).eth.getBlock(blockId);
};

ETHStateProvider.prototype.getTransactions = async function(network, stream, args){

};

ETHStateProvider.prototype.getTransaction = async function (network, txId, stream){
  const transaction = this.web3For(network).getTransaction(txId);
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
