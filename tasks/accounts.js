const {task, usePlugin} = require('@nomiclabs/buidler/config');
const {getWallets} = require('ethereum-waffle');

usePlugin('@nomiclabs/buidler-ethers');

function showAccountInformation(label, format, accounts) {
  const formattedAccounts = accounts.map(format);

  console.log(`${label}:\n`);
  for (const item of formattedAccounts) {
    console.log(item);
  }
  console.log('\n--------------------------------\n');
}

task(
  'accounts',
  'Prints the list of accounts',
  async ({addressesOnly, privateKeysOnly, silent}, {ethers}) => {
    const accounts = await getWallets(ethers.provider);

    if (!silent && !privateKeysOnly) {
      showAccountInformation('Addresses', ({address}) => address, accounts);
    }

    if (!silent && !addressesOnly) {
      showAccountInformation(
        'Private Keys',
        ({privateKey}) => privateKey,
        accounts
      );
    }

    return accounts;
  }
)
  .addFlag(
    'silent',
    'do not display any data (useful when combining with other tasks)'
  )
  .addFlag('addressesOnly', 'show only accounts addresses')
  .addFlag('privateKeysOnly', 'show only accounts private keys');
