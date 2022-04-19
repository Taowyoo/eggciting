// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "./@rarible/royalties/contracts/impl/RoyaltiesV2Impl.sol";
import "./@rarible/royalties/contracts/LibPart.sol";
import "./@rarible/royalties/contracts/LibRoyaltiesV2.sol";

contract NFT is
    ERC721EnumerableUpgradeable,
    OwnableUpgradeable,
    RoyaltiesV2Impl
{
    using CountersUpgradeable for CountersUpgradeable.Counter;
    CountersUpgradeable.Counter private _tokenIdTracker;
    bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;

    function initialize() public initializer {
        __ERC721_init("TestEggNFT", "EggNFT");
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return
            "https://bafybeid5vki6m7cefh2m36nk666vcq3uvufc2ept36ljja5dj5fpwdtk5y.ipfs.nftstorage.link/metadata/";
    }

    function mint(address to) public onlyOwner {
        // We cannot just use balanceOf to create the new tokenId because tokens
        // can be burned (destroyed), so we need a separate counter.
        _mint(to, _tokenIdTracker.current());
        _tokenIdTracker.increment();
    }

    /**
     * @dev Rarible works by using an on-chain OrderMatcher, which internally queries the token for secondary sales royalties,
     *      here we mimic the interface, so that the Rarible DAO gets the right information!
     * @param _tokenId The id of token to be set royalties
     * @param _royaltiesReceipientAddress The address where royalties will be paied to
     * @param _percentageBasisPoints The Percentage is given in percentage basis points. That means, 2.5% is 250
     */
    function setRoyalties(
        uint256 _tokenId,
        address payable _royaltiesReceipientAddress,
        uint96 _percentageBasisPoints
    ) public onlyOwner {
        LibPart.Part[] memory _royalties = new LibPart.Part[](1);
        _royalties[0].value = _percentageBasisPoints;
        _royalties[0].account = _royaltiesReceipientAddress;
        _saveRoyalties(_tokenId, _royalties);
    }

    function royaltyInfo(uint256 _tokenId, uint256 _salePrice)
        external
        view
        returns (address receiver, uint256 royaltyAmount)
    {
        LibPart.Part[] memory _royalties = royalties[_tokenId];
        if (_royalties.length > 0) {
            return (
                _royalties[0].account,
                (_salePrice * _royalties[0].value) / 10000
            );
        }
        return (address(0), 0);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721EnumerableUpgradeable)
        returns (bool)
    {
        if (interfaceId == LibRoyaltiesV2._INTERFACE_ID_ROYALTIES) {
            return true;
        }
        if (interfaceId == _INTERFACE_ID_ERC2981) {
            return true;
        }
        return super.supportsInterface(interfaceId);
    }
}
