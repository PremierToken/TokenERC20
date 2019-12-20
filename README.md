# Premier Token

## Requirements

- [Node.js](https://nodejs.org/download/release/latest-v10.x/): `>=10.0.0 <12.0.0`
- [Yarn](https://yarnpkg.com/en/docs/install): `>=1.19.0`

## Usage

### Compile contracts

```sh
yarn build
```

After running, contract information &mdash; including ABI &mdash; will be available at the `artifacts/` directory.

The build process also generates TypeScript typings for the contracts using `typechain`. They are available at `types/`.

### Run tests

```sh
yarn test
```

To run tests within a specific file:

```sh
yarn test <file_path>
```

### Deploy contracts

```sh
yarn deploy --network <network_name> --contract-name <contract_name> [<constructor_arg_1> [<constructor_arg_2> [...]]]
```

Contract address and transaction ID will be shown on screen.

### Verify contract with Etherscan

```sh
yarn verify-contract --contract-name <contract_name> --address <contract_address> [<constructor_arg_1> [<constructor_arg_2> [...]]]'
```
