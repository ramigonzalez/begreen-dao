// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BeGreen is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    // index 0 for current accumulated waste before greenwards airdrop
    // once airdropped, current goes to total accumulated waste in index 1
    // and index 0 is reset to 0
    mapping(address => uint256[2]) public accumulatedWaste;
    uint256 public totalAccumulatedWaste;
    address public greenwards;
    mapping(uint256 => string) levelsURI;

    constructor() ERC721("BeGreen", "BG") {
        levelsURI[
            2
        ] = "https://silver-sound-gamefowl-947.mypinata.cloud/ipfs/QmYVbQLNNGxQ8QaabFBtuFrU8KHmcPRUfDBQvrN4czMZBV?_gl=1*1kd1uk8*rs_ga*MTMxMjk0MzE1Ny4xNjg3NjM5NzY2*rs_ga_5RMPXG14TE*MTY4NzY0MjQ2Ni4yLjEuMTY4NzY0MjUxMi4xNC4wLjA";
        levelsURI[
            3
        ] = "https://silver-sound-gamefowl-947.mypinata.cloud/ipfs/QmQTHdtyBpLjPfRQqsJcXRBo4uFzL18tQjLACB7AXLVxMd?_gl=1*pu5xp*rs_ga*MTMxMjk0MzE1Ny4xNjg3NjM5NzY2*rs_ga_5RMPXG14TE*MTY4NzY0NzU2My4zLjEuMTY4NzY0NzY3MC42MC4wLjA";
    }

    function depositWaste(address user, uint256 amount) public onlyOwner {
        accumulatedWaste[user][0] += amount;
        totalAccumulatedWaste += amount;
        if (
            accumulatedWaste[user][1] >= 100 && accumulatedWaste[user][1] < 1000
        ) {
            _setTokenURI(tokenOfOwnerByIndex(user, 0), levelsURI[2]);
        } else if (accumulatedWaste[user][1] >= 1000) {
            _setTokenURI(tokenOfOwnerByIndex(user, 0), levelsURI[3]);
        }
    }

    function setGreenwards(address _greenwards) public onlyOwner {
        greenwards = _greenwards;
    }

    function resetAndUpdateLogic(address user) public {
        require(msg.sender == greenwards);
        accumulatedWaste[user][1] += accumulatedWaste[user][0];
        accumulatedWaste[user][0] = 0;
        if (
            accumulatedWaste[user][1] >= 100 && accumulatedWaste[user][1] < 1000
        ) {
            _setTokenURI(tokenOfOwnerByIndex(user, 0), levelsURI[2]);
        } else if (accumulatedWaste[user][1] >= 1000) {
            _setTokenURI(tokenOfOwnerByIndex(user, 0), levelsURI[3]);
        }
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function resetTotalAccumulatedWaste() public {
        require(msg.sender == greenwards);
        totalAccumulatedWaste = 0;
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
