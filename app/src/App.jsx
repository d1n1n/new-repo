import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./App.css";

// Contract Details (Replace with your contract's deployed address & ABI)
const contractAddress = "0xYourContractAddressHere";
const contractABI = [
  // Paste the ABI from your compiled contract here
];

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [balance, setBalance] = useState("0");
  const [newCandidate, setNewCandidate] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    connectWallet();
  }, []);

  async function connectWallet() {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setAccount(address);

      const votingContract = new ethers.Contract(contractAddress, contractABI, signer);
      setContract(votingContract);

      // Fetch initial contract data
      loadCandidates(votingContract);
      loadBalance(votingContract);

      // Check if user is the contract owner
      const owner = await votingContract.owner();
      setIsOwner(owner === address);
    } else {
      alert("Please install MetaMask!");
    }
  }

  async function loadCandidates(contract) {
    const count = await contract.candidateCount();
    let tempCandidates = [];
    for (let i = 0; i < count; i++) {
      const candidate = await contract.candidates(i);
      tempCandidates.push({ name: candidate.name, votes: Number(candidate.votes) });
    }
    setCandidates(tempCandidates);
  }

  async function loadBalance(contract) {
    const contractBalance = await contract.getBalance();
    setBalance(ethers.formatEther(contractBalance));
  }

  async function addCandidate() {
    if (!newCandidate) return alert("Enter a candidate name!");
    try {
      const tx = await contract.addCandidate(newCandidate, { value: ethers.parseEther("0.1") });
      await tx.wait();
      setNewCandidate("");
      loadCandidates(contract);
      loadBalance(contract);
    } catch (error) {
      console.error(error);
      alert("Failed to add candidate.");
    }
  }

  async function vote(index) {
    try {
      const tx = await contract.vote(index);
      await tx.wait();
      loadCandidates(contract);
    } catch (error) {
      alert("Error: You may have already voted!");
    }
  }

  async function getWinner() {
    try {
      const winner = await contract.getWinner();
      alert(`Winner is: ${winner}`);
    } catch (error) {
      alert("Only the owner can see the winner!");
    }
  }

  return (
    <div className="App">
      <h1>Blockchain Voting System</h1>
      <p>Connected Account: {account || "Not connected"}</p>
      <p>Contract Balance: {balance} ETH</p>

      <h2>Add a Candidate</h2>
      <input
        type="text"
        value={newCandidate}
        onChange={(e) => setNewCandidate(e.target.value)}
        placeholder="Candidate Name"
      />
      <button onClick={addCandidate}>Add (0.1 ETH)</button>

      <h2>Candidates</h2>
      {candidates.length === 0 ? (
        <p>No candidates yet.</p>
      ) : (
        candidates.map((c, i) => (
          <div key={i}>
            <p>
              {c.name} - {c.votes} votes
            </p>
            <button onClick={() => vote(i)}>Vote</button>
          </div>
        ))
      )}

      {isOwner && <button onClick={getWinner}>Determine Winner</button>}
    </div>
  );
}

export default App;
