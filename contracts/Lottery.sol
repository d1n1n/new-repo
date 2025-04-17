// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Lottery {
    address payable public winner;
    address payable[] public members;
    address public manager;

    constructor() {
        manager = msg.sender;
    }

    function join() public payable returns (bool) {
        require(msg.value == 1 ether, "Please pay 1 ETH for join!");
        members.push(payable(msg.sender));
        return true;
    }

    function getBalance() public view returns (uint) {
        //require(manager == msg.sender, "You cannot show the balance!");
        return address(this).balance;
    }

    function random() private view returns (uint) {
        return
            uint(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.difficulty, // Use block.difficulty in older versions
                        msg.sender
                    )
                )
            ) % members.length;
    }

    function getWinner() public returns (address) {
        require(manager == msg.sender, "You cannot roll the drum!");

        uint index = random();
        winner = members[index];
        winner.transfer(getBalance());
        members = new address payable[](0);
        return winner;
    }
}