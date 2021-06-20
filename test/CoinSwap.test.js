const { assert } = require('chai');

const Token = artifacts.require('Token');
const CoinSwap = artifacts.require('CoinSwap');

require('chai').use(require('chai-as-promised')).should
var should = require('chai').should();

function tokens(n) {
    return web3.utils.toWei(n, 'ether')
}

contract('coinSwap', ([deployer, investor]) => {
    let token, coinSwap

    before(async () => {
        token = await Token.new()
        // after constructor in coinSwap.sol pass token address
        //coinSwap = await coinSwap.new()
        coinSwap = await CoinSwap.new(token.address)
        await token.transfer(coinSwap.address, tokens('1000000'))
    })

    describe('Token depolyment', async () => {
        it('contract has a name', async () => {
            const name = await token.name()
            assert.equal(name, 'Defi Token')
        })
    })

    describe('CoinSwap depolyment', async () => {
        it('contract has a name', async () => {
            const name = await coinSwap.name()
            assert.equal(name, 'CoinSwap Instant Exchange')
        })

        it('contract has tokens', async () => {
            let balance = await token.balanceOf(coinSwap.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })

    // test case for buyToken function
    describe('buyTokens ()', async () => {
        let result

        before(async () => {
            // purchase token before each example
            result = await coinSwap.buyTokens({ from: investor, value: web3.utils.toWei('1', 'ether') });
        })


        it('Allows user to instantly purchased tokens from coinSwap for a fixed price', async () => {
            // check the balance of investor after purchase token
            let investorBalance = await token.balanceOf(investor);
            assert.equal(investorBalance.toString(), tokens('100'));

            // check the balance of coinSwap after purchase token

            let coinSwapBalance
            coinSwapBalance = await token.balanceOf(coinSwap.address);
            assert.equal(coinSwapBalance.toString(), tokens('999900'));
            coinSwapBalance = await web3.eth.getBalance(coinSwap.address)
            assert.equal(coinSwapBalance.toString(), web3.utils.toWei('1', 'ether'))

            // check the log of event is correct.
            const event = result.logs[0].args
            assert.equal(event.account, investor);
            assert.equal(event.token, token.address);
            assert.equal(event.amount.toString(), tokens('100').toString());
            assert.equal(event.rate.toString(), '100');

        })
    })

    // Test case for sellToken function
    describe('sellTokens()', async () => {
        let result

        // set situation of sell token from investor to CoinSwap before test
        before(async () => {
            // investor must approve their tokens to be sold
            await token.approve(coinSwap.address, tokens('100'), { from: investor });
            // investor sell token to CoinSwap, assign the return value to result
            result = await coinSwap.sellTokens(tokens('100'), { from: investor });
        })

        it('Allows user to instantly tokens to coinSwap for a fixed price', async () => {
            // check the balance of investor after sell token by check result above.
            let investorBalance = await token.balanceOf(investor);
            assert.equal(investorBalance.toString(), tokens('0'));

            // check the balance of coinSwap after sell token

            let coinSwapBalance
            coinSwapBalance = await token.balanceOf(coinSwap.address);
            assert.equal(coinSwapBalance.toString(), tokens('1000000'));
            coinSwapBalance = await web3.eth.getBalance(coinSwap.address)
            assert.equal(coinSwapBalance.toString(), web3.utils.toWei('0', 'ether'))

            // check the log of event is correct.
            const event = result.logs[0].args
            assert.equal(event.account, investor);
            assert.equal(event.token, token.address);
            assert.equal(event.amount.toString(), tokens('100').toString());
            assert.equal(event.rate.toString(), '100');

            // Failure: user can't sell more token than they have
            await coinSwap.sellTokens(tokens('500'), { from: investor }).should.be.rejected;
        })


    })



})