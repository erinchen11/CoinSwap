const CoinSwap = artifacts.require('CoinSwap');
const Token = artifacts.require('Token');

module.exports = async function (deployer) {
    // deploy Token
    await deployer.deploy(Token)
    const token = await Token.deployed()
    // deploy CoinSwap
    await deployer.deploy(CoinSwap, token.address);
    const coinSwap = await CoinSwap.deployed();

    // 把所有的token都從 合約Token轉到合約CoinSwap
    await token.transfer(coinSwap.address, '1000000000000000000000000');
}