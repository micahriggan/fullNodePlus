const ERC20StateProvider = require('../erc20/erc20');
const util = require('util');

function BATStateProvider() {
  ERC20StateProvider.call(this, 'BAT', '0x0d8775f648430679a709e98d2b0cb6250d2887ef');
}
util.inherits(BATStateProvider, ERC20StateProvider);

module.exports = BATStateProvider;
