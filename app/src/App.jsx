import { useEffect, useState } from 'react'
import { enterLottery, getMyBalance, getLotteryBalance, getWinner, getSigner } from "./blockchainUtils";

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [lotteryBalance, setLotteryBalance] = useState(0);

  // run code on startup
  useEffect(() => {
    showBalance();
  }, []);

  const handleConnect = async () => {
    const signer = await getSigner();
    if (signer) {
      const address = await signer.getAddress();
      setAccount(address);
    }
  };

  const showBalance = async () => {
    setBalance(await getMyBalance());
    setLotteryBalance(await getLotteryBalance());
  }
  const handleEnter = async () => {
    await enterLottery();
    showBalance();
  }
  const handleWinner = async () => {
    await getWinner();
    showBalance();
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Welcome to Lottery</h1>
      <p>Balance: {lotteryBalance} ETH</p>
      <div className="card">
        <button onClick={handleConnect}>
          {account ? `Connected: ${account}` : "Connect MetaMask"}
        </button>
        <button onClick={handleEnter}>
          Enter Lottery
        </button>
        <button onClick={handleWinner} style={{ backgroundColor: "lightgreen" }}>
          Get Winner
        </button>
      </div>
      <p>Account Balance: {Math.round(balance)} ETH</p>
    </>
  )
}

export default App