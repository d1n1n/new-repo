import { ethers } from "ethers";

const contractAddress = "0x819790897b6C4b9AcDBB0984c79641e84710A948"; // Replace with your contract address
const abi =[
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "manager",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "members",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "winner",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "join",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "payable",
      "type": "function",
      "payable": true
    },
    {
      "inputs": [],
      "name": "getBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getWinner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];
let provider = null;
export const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
        alert("Please install MetaMask!");
        return null;
    }

    try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

        if (!accounts || accounts.length === 0) {
            throw new Error("No accounts found.");
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        return signer;
    } catch (error) {
        console.error("MetaMask connection error:", error);
        alert("MetaMask connection error: " + error.message);
        return null;
    }
};

export const getContact = (signer) =>{
    return new ethers.Contract(contractAddress,abi,signer);
}

export const enterLottery = async()=>{
    const signer = await connectWallet();
    if(!signer) return;

    const contract = getContact(signer);

    try {
        
      
        const tx = await contract.join({
          value: ethers.utils.parseEther("1.0"), // Send 1 ETH
        });
        await tx.wait();
        console.log("Transaction completed!");
      } catch (error) {
        console.error("Contract interaction error:", error);
      }
}


export const getLotteryBalance = async()=>{
    const signer = await connectWallet();
    if(!signer) return;

    const contract = getContact(signer);

    try {
        const result = await contract.getBalance(); // Example for reading
        console.log("Lottery balance:", ethers.formatEther(result));
      } catch (error) {
        console.error("Contract interaction error:", error);
      }
}


export const getMyBalance = async()=>{
    const signer = await connectWallet();
    if(!signer) return;

    const contract = getContact(signer);

    try {
        const result =provider.getBalance(signer.getAddress()); // Example for reading
        console.log("My balance:", ethers.formatEther(result));
      } catch (error) {
        console.error("Contract interaction error:", error);
      }
}