const abi = require('./erc20abi');
const Web3 = require('web3-eth');
const config = require('../../../config');
const mongoose = require('mongoose');
const Wallet = mongoose.model('Wallet');
const Storage = require('../../../services/storage');
const WalletAddress = mongoose.model('WalletAddress');

function ERC20StateProvider(chain, contractAddr){
  this.chain = chain;
  this.chain = this.chain.toUpperCase();
  this.config = config.chains[this.chain];
  this.contractAddr = contractAddr;
}

ERC20StateProvider.prototype.web3For = function(network) {
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
};


ERC20StateProvider.prototype.erc20For = function(network) {
  const web3 = this.web3For(network);
  const contract = new web3.Contract(abi, this.contractAddr);
  return contract;
};

ERC20StateProvider.prototype.streamAddressUtxos = function(network, address, stream, args) {
};

ERC20StateProvider.prototype.getBalanceForAddress = async function(network, address){
  const balance = await this.erc20For(network).methods.balanceOf(address).call();
  return [ { balance } ];
};

ERC20StateProvider.prototype.getBlock = async function(network, blockId){
  return;
};

ERC20StateProvider.prototype.streamTransactions = function(network, stream, args){

};

ERC20StateProvider.prototype.streamTransaction = async function (network, txId, stream){
  const transactions = [];
  stream.send(JSON.stringify(transactions));
};

ERC20StateProvider.prototype.createWallet = async function(network, name, pubKey, args){
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

ERC20StateProvider.prototype.getWallet = async function(network, walletId){
  let wallet = await Wallet.findOne({ _id: walletId }).exec();
  return Wallet._apiTransform(wallet);
};

ERC20StateProvider.prototype.streamWalletAddresses = function(network, walletId, stream){
  let query = { wallet: walletId };
  Storage.apiStreamingFind(WalletAddress, query, stream);
};

ERC20StateProvider.prototype.getWalletAddresses = function(network, walletId){
  let query = { wallet: walletId };
  return WalletAddress.find(query);
};

ERC20StateProvider.prototype.updateWallet = async function(network, walletId, addresses) {
  return WalletAddress.updateCoins({chain: this.chain, _id: walletId, network},  addresses);
};

ERC20StateProvider.prototype.streamWalletTransactions = function(network, walletId, stream, args) {
};

ERC20StateProvider.prototype.getWalletBalance = async function(network, walletId) {
  let addresses = await this.getWalletAddresses(network, walletId);
  let addressBalancePromises = addresses.map(({ address }) => this.getBalanceForAddress(network, address));
  let addressBalances = await Promise.all(addressBalancePromises);
  let balance = addressBalances.reduce((prev, cur) => prev + Number.parseInt(cur[0].balance), 0);
  return [{ balance }];
};

ERC20StateProvider.prototype.streamWalletUtxos = function(network, walletId, stream, args) {
};

/*
 *ERC20StateProvider.prototype.broadcastTransaction = async function(network, tx) {
};
*/

module.exports = ERC20StateProvider;
