import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Navbar from './Navbar';
import Token from '../abis/Token.json';
import CoinSwap from '../abis/CoinSwap.json';

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  // check web3 provider
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('No ethereum provider be detected, suggest to use metamask')
    }
  }

  // get data from blockchain
  async loadBlockchainData() {
    const web3 = window.web3
    // get account info
    const accounts = web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const ethBalance = await web3.eth.getBalance(this.state.account)
    this.setState({ ethBalance })

    // get token info
    //const abi = Token.abi
    const networkid = await web3.eth.net.getID()
    const TokenData = Token.networks[networkid]
    if (TokenData) {
      //const address = Token.networks[networkid].address
      const token = new web3.eth.Contract(Token.abi, TokenData.address)
      //console.log(token)
      this.setState({ token })
      let tokenBalance = await token.method.balanceOf(this.state.account).call()
      this.setState({ tokenBalance: tokenBalance.toString() })
    } else {
      window.alert('Token contract not deploy to detected network')
    }
    // const address = Token.networks[networkid].address
    // const token = new web3.eth.Contract(abi, address)
    // console.log(token)

    // get CoinSwap info
    const CoinSwapData = CoinSwap.networks[networkid]
    if (CoinSwapData) {
      const coinSwap = new web3.eth.Contract(CoinSwap.abi, CoinSwapData.address)
      this.setState({ coinSwap })
    } else {
      window.alert('CoinSwap contract not deploy to detected network')
    }

    // Whenever the contracts are finished loading, 
    // we set React's state to loading = false. 
    // We'll show a loader any time the app is loading, 
    // and we want to hide it whenever these contracts have loaded.
    this.setState({ loading: false })
  }

  // initial state
  constructor(probs) {
    super(probs)
    this.state = {
      account: '',
      token: {},
      coinSwap: {},
      ethBalance: '0',
      tokenBalance: '0',
      loading: true
    }
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">

                <h1>Hello, World!</h1>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;