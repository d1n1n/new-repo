import { ethers } from "ethers";

const contractAddress = "0x954cE5c579Eb27100b68065443F7DcA289bf6b1a"; // Replace with your contract address
const abi = [
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

const getProvider = () => {
    if (!window.ethereum) {
        alert("Please install MetaMask!");
        return null;
    }
    return new ethers.BrowserProvider(window.ethereum);
};

export const getSigner = async () => {
    try {
        return await getProvider()?.getSigner();
    } catch (error) {
        console.error("MetaMask connection error:", error);
        return null;
    }
};

export const getContract = async () => {
    const signer = await getSigner();
    return signer ? new ethers.Contract(contractAddress, abi, signer) : null;
};

const withContract = async (action) => {
    const contract = await getContract();
    if (!contract) return;
    try {
        return await action(contract);
    } catch (error) {
        console.error("Contract interaction error:", error);
    }
};

export const enterLottery = async () => {
    await withContract(async (contract) => {
        const tx = await contract.join({ value: ethers.parseEther("1.0") });
        await tx.wait();
        console.log("Transaction completed!");
    });
};

export const getLotteryBalance = async () => {
    return withContract(async (contract) => {
        const balance = await contract.getBalance();
        return ethers.formatEther(balance);
    });
};

export const getMyBalance = async () => {
    const provider = getProvider();
    const signer = await getSigner();
    const balance = await provider.getBalance(signer.getAddress());
    return ethers.formatEther(balance);
};


export const getWinner = async () => {
    return withContract(async (contract) => {
        const tx = await contract.getWinner();
        tx.wait();
        console.log(tx);

    });
};

