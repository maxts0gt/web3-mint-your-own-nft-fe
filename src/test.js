import React, { useEffect, useState } from 'react';
import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import { ethers } from "ethers";
import myEpicNft from './utils/MyEpicNFT.json';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = '';
const TOTAL_MINT_COUNT = 50;

const App = () => {

  const [currentAccount, setCurrentAccount] = useState("");
  const checkIfWalletIsConnected = async () => {
    const {ethereum} = window;
    if(!ethereum){
      console.log("Make sure to conntec your Metamask wallet!");
      return;
    }else{
      console.log("We have ethereum object (Metamask connected)", ethereum);
    }
  const accounts = await ethereum.request({ method: 'eth_accounts' });
  if(accounts.lenght !== 0){
    const account = accounts[0];
    console.log("Autohized account is found:", account);
    setCurrentAccount(account);
  }else{
    console.log("No authorized account was found");
    }
  }

  //ConectWallet method
  const connectWallet = async () => {
    try{
      const {ethereum} = window;
      
      if(!ethereum) {
        alert("Get Metamask to connect!");
        return;
      }
      const accounts = await ethereum.request({method: "eth_requestAccounts"});
      console.log("Account connected!", accounts[0]);
      setCurrentAccount(accounts[0]);

    }catch(error){
      console.log(error);
    }
  }

  const askContractToMintNft = async () => {
  const CONTRACT_ADDRESS = "0xc8A4a102Ef8058348371aE28C16f3Ee9696F1488";
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.makeAnEpicNFT();

        console.log("Mining...please wait.")
        await nftTxn.wait();
        
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
}

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  const renderMintUI = () => (
    <div>
    <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
      Mint NFT
    </button><br /><br />
    <a href={`https://testnets.opensea.io/${currentAccount}`} style={{color:"white"}}>Check your NFTs</a>
    </div>
  )

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])
  /*
  * Added a conditional render! We don't want to show Connect to Wallet if we're already conencted :).
  */
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today. {currentAccount}
          </p>

          {
            currentAccount == undefined ? renderNotConnectedContainer() : renderMintUI()
          }

        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;