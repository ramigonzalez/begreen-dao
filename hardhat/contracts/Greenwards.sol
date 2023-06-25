// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface BeGreen {
    function resetAndUpdateLogic(address user) external;

    function ownerOf(uint256 tokenId) external view returns (address);

    function totalSupply() external view returns (uint256);

    function accumulatedWaste(
        address user
    ) external view returns (uint256[2] calldata);

    function totalAccumulatedWaste() external view returns (uint256);

    function resetTotalAccumulatedWaste() external;
}

contract Greenwards is ERC20, Ownable {
    constructor() ERC20("Greenwards", "GWD") {}

    mapping(address => uint) private shares;
    address public beGreen;

    function mint(uint256 amount) public onlyOwner {
        BeGreen beGreenInterface = BeGreen(beGreen);
        uint256 totalNFTHolders = beGreenInterface.totalSupply();
        uint256 totalAccumulatedWaste = beGreenInterface
            .totalAccumulatedWaste();

        for (uint256 i = 0; i < totalNFTHolders; ++i) {
            address holder = beGreenInterface.ownerOf(i);
            _mint(
                holder,
                (amount * beGreenInterface.accumulatedWaste(holder)[0]) /
                    totalAccumulatedWaste
            );
            beGreenInterface.resetAndUpdateLogic(holder);
        }

        beGreenInterface.resetTotalAccumulatedWaste();
    }

    function setBeGreen(address _beGreen) public onlyOwner {
        beGreen = _beGreen;
    }
}
