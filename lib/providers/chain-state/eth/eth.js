const Web3 = require('web3-eth');
const config = require('../../../config');
const mongoose = require('mongoose');
const Wallet = mongoose.model('Wallet');
const Storage = require('../../../services/storage');
const WalletAddress = mongoose.model('WalletAddress');

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

ETHStateProvider.prototype.streamAddressUtxos = function(network, address, stream, args) {
};

ETHStateProvider.prototype.getBalanceForAddress = async function(network, address){
  const balance = await this.web3For(network).getBalance(address);
  return [ { balance } ];
};

ETHStateProvider.prototype.getBlock = async function(network, blockId){
  return this.web3For(network).getBlock(blockId);
};

ETHStateProvider.prototype.streamTransactions = function(network, stream, args){

};

ETHStateProvider.prototype.streamTransaction = async function (network, txId, stream){
  const transaction = await this.web3For(network).getTransaction(txId);
  const transactions = transaction !== null ? [transaction] : [];
  stream.send(JSON.stringify(transactions));
};

ETHStateProvider.prototype.createWallet = async function(network, name, pubKey, args){
  if (typeof name !== 'string' || !network) {
    throw 'Missing required param';
  }
  return Wallet.create({
    chain: this.chain,
    network,
    name,
    pubKey,
    path: args.path
  });
};

ETHStateProvider.prototype.getWallet = async function(network, walletId){
  let wallet = await Wallet.findOne({ _id: walletId }).exec();
  return Wallet._apiTransform(wallet);
};

ETHStateProvider.prototype.streamWalletAddresses = function(network, walletId, stream){
  let query = { wallet: walletId };
  Storage.apiStreamingFind(WalletAddress, query, stream);
};

ETHStateProvider.prototype.getWalletAddresses = function(network, walletId){
  let query = { wallet: walletId };
  return WalletAddress.find(query);
};

ETHStateProvider.prototype.updateWallet = async function(network, walletId, addresses) {
  return WalletAddress.updateCoins({chain: this.chain, _id: walletId, network},  addresses);
};

ETHStateProvider.prototype.streamWalletTransactions = function(network, walletId, stream, args) {
};

ETHStateProvider.prototype.getWalletBalance = async function(network, walletId) {
  let addresses = await this.getWalletAddresses(network, walletId);
  let addressBalancePromises = addresses.map(({ address }) => this.web3For(network).getBalance(address));
  let addressBalances = await Promise.all(addressBalancePromises);
  let balance = addressBalances.reduce((prev, cur) => prev + Number.parseInt(cur), 0);
  return [{ balance }];
};

ETHStateProvider.prototype.streamWalletUtxos = function(network, walletId, stream, args) {
};

/*
 *ETHStateProvider.prototype.broadcastTransaction = async function(network, tx) {
};
*/

module.exports = ETHStateProvider;
