// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721PresetMinterPauserAutoId {
    /// @dev Base token URI used as a prefix by tokenURI().
    string public baseTokenURI;

    constructor()
        ERC721PresetMinterPauserAutoId(
            "TestEggNFT",
            "EggNFT",
            "https://bafybeid5vki6m7cefh2m36nk666vcq3uvufc2ept36ljja5dj5fpwdtk5y.ipfs.nftstorage.link/metadata/"
        )
    {}
}
