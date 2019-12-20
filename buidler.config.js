require('dotenv-safe/config');
const process = require('process');
const {usePlugin} = require('@nomiclabs/buidler/config');
const {defaultAccounts} = require('ethereum-waffle');

const {
  INFURA_API_KEY = '',
  PRIVATE_KEY = '',
  ETHERSCAN_API_KEY = '',
} = process.env;

usePlugin('buidler-typechain');
usePlugin('@nomiclabs/buidler-etherscan');

require('./tasks/accounts');
require('./tasks/deploy');

const config = {
  solc: {
    version: '0.5.12',
  },
  defaultNetwork: 'buidlerevm',
  networks: {
    locahost: {
      url: 'http://localhost:8545',
    },
    buidlerevm: {
      accounts: defaultAccounts.map(acc => ({
        balance: acc.balance,
        privateKey: acc.secretKey,
      })),
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [PRIVATE_KEY],
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    url: 'https://api-rinkeby.etherscan.io/api',
    apiKey: ETHERSCAN_API_KEY,
  },
  typechain: {
    outDir: 'types',
    target: 'ethers',
  },
};

module.exports = config;
