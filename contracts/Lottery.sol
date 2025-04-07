// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Voting {
    struct Candidate {
        string name;
        uint votes;
    }

    mapping(address => bool) public hasVoted;
    mapping(uint => Candidate) public candidates;
    uint public candidateCount;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function addCandidate(string memory _name) public payable {
        require(msg.value == 0.1 ether, "Adding a candidate costs 0.1 ETH");
        candidates[candidateCount] = Candidate(_name, 0);
        candidateCount++;
    }

    function vote(uint _candidateIndex) public {
        require(!hasVoted[msg.sender], "You can only vote once!");
        require(_candidateIndex < candidateCount, "Invalid candidate index!");

        candidates[_candidateIndex].votes++;
        hasVoted[msg.sender] = true;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getWinner() public view returns (string memory) {
        require(msg.sender == owner, "Only the owner can determine the winner!");

        uint maxVotes = 0;
        uint winnerIndex = 0;

        for (uint i = 0; i < candidateCount; i++) {
            if (candidates[i].votes > maxVotes) {
                maxVotes = candidates[i].votes;
                winnerIndex = i;
            }
        }

        return candidates[winnerIndex].name;
    }
}
