pragma solidity ^0.5.0;

import './Token.sol';
contract CoinSwap {
    string public name = "CoinSwap Instant Exchange";
    Token public token;
    // creat buy token function
    uint public rate = 100;

    event TokenPurchased (
        address account,
        address token,
        uint amount,
        uint rate
    );

    event TokenSold (
        address account,
        address token,
        uint amount,
        uint rate
    );
    // store the token address to the state variable called token.
    constructor(Token _token) public{
        token = _token;
    }

    function buyTokens() public payable{
        // calculate the number of tokens to buy
        uint tokenAmount = msg.value * rate;

        // check the token in contract is enough
        require(token.balanceOf(address(this)) >= tokenAmount);
        // transfer toke to buyer
        token.transfer(msg.sender, tokenAmount);

        emit TokenPurchased(msg.sender, address(token), tokenAmount, rate);

    }

    function sellTokens(uint _amount) public {
        // check user has enough token to sell
        require(token.balanceOf(msg.sender) >= _amount); 
        // calculate the amount of Ether to redeem
        uint etherAmount = _amount / rate;
        // check EthSwap has enough Ether to sell
        require(address(this).balance >= etherAmount);
        // start sell
        // we use transferFrom function to transfer the token to EthSwap contract
        // not use transfer function but transferFrom,
        // because need to call approval function
        token.transferFrom(msg.sender, address(this), _amount);
        // transfer Ether to user
        msg.sender.transfer(etherAmount);
        // emit event
        emit TokenSold(msg.sender, address(token), _amount, rate);

    }



} 