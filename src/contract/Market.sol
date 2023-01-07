// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "./classicChords.sol";
// import "./ERC5006.sol";

contract Market is Ownable,ReentrancyGuard, ERC1155Holder{

    uint256 rentCounter;
    uint256 listingPrice = 0 ether;
    address addressNft;
    classicChords nft;

    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;
    Counters.Counter private _itemsDeleted;
    Counters.Counter private _itemsRent;


    struct MarketItem{
        uint itemId;
        uint256 tokenId;
        uint quantity;
        uint256 price;
        address payable creator;
        address payable seller;
        address payable owner;
        uint64 expiry;
        uint recordId;
        bool isAvailableOnRent;
        bool isAvailableOnSell; 
        uint32 royaltyPr;        
    }


    mapping (uint256 => MarketItem) public marketItemsMapping;

  event MarketItemCreated (
    uint indexed itemId,
    uint256 indexed tokenId,
    uint32 quantity,
    address creator,
    address seller,
    address owner,
    uint256 price,
    uint64 expiry,
    uint recordId,
    bool isAvailableOnRent,
    bool isAvailableOnSell,                
    uint32 royaltyPr
  );

  event NFTSold(
    uint256 tokenId,
    address seller,
    address owner,
    uint256 price,
    uint256 quantity
  );

  event NFTRented(
    uint256 tokenId,
    address seller,
    address owner,
    uint256 price,
    uint256 quantity
  );


  event ProductListed(
    uint256 indexed itemId
  );

  event StreamCreated(
      uint indexed stremId,
      address indexed creator,
      string stramCode,
      string title,
      string description,
      bool premium
  );


    /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function setListingPrice(uint _listingPrice) public onlyOwner {
        listingPrice = _listingPrice;
    }
    
    /* Returns the token Contract Address of the contract */
    function getTokenContract() public view returns (address) {
        return addressNft;
    }

    function setTokenContract(address _tokenAddress) public onlyOwner {
        addressNft = _tokenAddress;
        nft = classicChords(addressNft);
    } 


    /* Places an item for sale or rent on the marketplace */
    function createMarketItem(
        uint256 _tokenId,
        uint32 _quantity,
        uint256 _price,
        bool _isAvailableOnRent,
        bool _isAvailableOnSell,
        uint64 _expiry,
        uint32 _royaltyPr
    ) public payable nonReentrant {
    require(_price > 0, "Price must be at least 1 wei");
    require(msg.value == listingPrice, "Price must be equal to listing price");

    _itemIds.increment();
    uint256 itemId = _itemIds.current();
    uint recordId;
    
    nft.transferFrom(msg.sender, address(this), _tokenId, _quantity);
    recordId = 0; 

    marketItemsMapping[itemId] =  MarketItem(
      itemId,
      _tokenId,
      _quantity,
      _price,
      payable(msg.sender),
      payable(msg.sender),
      payable(msg.sender),
      _expiry,
      recordId,
      _isAvailableOnRent,
      _isAvailableOnSell,
      _royaltyPr
    );

    emit MarketItemCreated(
      itemId,
      _tokenId,
      _quantity,
      payable(msg.sender),
      payable(msg.sender),
      payable(msg.sender),
      _price,
      _expiry,
      recordId,
      _isAvailableOnRent,
      _isAvailableOnSell,
      _royaltyPr
    );
  }


  function buyNft(uint _itemId,uint256 _tokenId, uint32 _quantity) public payable nonReentrant {
    MarketItem memory item = marketItemsMapping[_itemId];
    require(msg.value == _quantity*item.price, "Not enough balance to cover asking price");
    require(item.isAvailableOnSell, "Item is not available for Sell");
    require(item.quantity >= _quantity, "Quentity is not available");
    uint royalty = (item.royaltyPr * msg.value) / 100; 
    item.seller.transfer(msg.value-royalty);
    item.creator.transfer(royalty);
    nft.transferFrom(address(this), payable(msg.sender), _tokenId, _quantity);
    if(item.quantity == _quantity){
      item.owner = payable(msg.sender);
      item.isAvailableOnSell = false;
    }
    else{
      _itemIds.increment();
      uint256 newItemId = _itemIds.current();
      item.quantity = item.quantity - _quantity;
      marketItemsMapping[newItemId] =  MarketItem(
            newItemId,
            _tokenId,
            item.quantity,
            msg.value,
            item.creator,
            payable(address(0)),
            payable(msg.sender),
            0,
            0,
            false,
            false,
            0
          );
          emit MarketItemCreated(
              newItemId,
              _tokenId,
              uint32(item.quantity),
              item.creator,
              payable(address(0)),
              payable(msg.sender),
              msg.value,
              0,
              0,
              false,
              false,
              0
            );
    }
    _itemsSold.increment();
    emit NFTSold(_tokenId, item.seller, payable(msg.sender), msg.value,_quantity);
  }


    function rentNft(uint _itemId,uint256 _tokenId, uint32 _quantity) public payable nonReentrant {
        MarketItem memory item = marketItemsMapping[_itemId];
        require(msg.value == _quantity*item.price, "Not enough balance to cover asking price");
        require(item.isAvailableOnRent, "Item is not available for Rent");
        require(item.quantity >= _quantity, "Quentity is not available");
        // address payable buyer = payable(msg.sender);
        item.seller.transfer(msg.value);
        uint royalty = (item.royaltyPr * msg.value) / 100; 
        item.seller.transfer(msg.value-royalty);
        item.creator.transfer(royalty);

        uint recordId = nft.createUserRecord(address(this), msg.sender, _tokenId, _quantity, item.expiry);
        item.recordId = recordId;
        _itemsRent.increment();
        if(item.quantity == _quantity){
          item.owner = payable(msg.sender);
          item.isAvailableOnRent = false;
         }
      else{
        _itemIds.increment();
        uint256 newItemId = _itemIds.current();
        item.quantity = item.quantity - _quantity;
        marketItemsMapping[newItemId] =  MarketItem(
              newItemId,
              _tokenId,
              uint32(item.quantity),
              msg.value,
              item.creator,
              payable(address(0)),
              payable(msg.sender),
              item.expiry,
              recordId,
              false,
              false,
              0
            );
            emit MarketItemCreated(
                newItemId,
                _tokenId,
                uint32(item.quantity),
                item.creator,
                payable(address(0)),
                payable(msg.sender),
                msg.value,
                item.expiry,
                recordId,
                false,
                false,
                0
              );
        }
        _itemsSold.increment();
        emit NFTSold(_tokenId, item.seller, payable(msg.sender), msg.value,_quantity);
  }

    function revokeRent(uint256 _recordId) public {
        nft.deleteUserRecord(_recordId);
    }
    
    function balanceOf(address _userAddress, uint256 _recordId) public view returns(uint256){
        return nft.balanceOf(_userAddress, _recordId);
    }

    function frozenBalanceOf(address _userAddress, uint256 _tokenId) public view returns(uint256){
        return nft.frozenBalanceOf(_userAddress, _tokenId);
    }

    function usableBalanceOf(address _userAddress, uint256 _tokenId) public view returns(uint256){
        return nft.usableBalanceOf(_userAddress, _tokenId);
    }

    function getListedNfts() public view returns (MarketItem[] memory) {
    
    uint256 nftCount = _itemIds.current();
    uint256 unsoldNftsCount = nftCount - _itemsSold.current();

    MarketItem[] memory nfts = new MarketItem[](unsoldNftsCount);
    uint nftsIndex = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (marketItemsMapping[i + 1].isAvailableOnRent || marketItemsMapping[i + 1].isAvailableOnSell) {
        nfts[nftsIndex] = marketItemsMapping[i + 1];
        nftsIndex++;
      }
    }
    return nfts;
  }


  function getUserNfts(address _userAddress) public view returns (MarketItem[] memory) {
    uint nftCount = _itemIds.current();
    uint myNftCount = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (marketItemsMapping[i + 1].owner == _userAddress) {
        myNftCount++;
      }
    }

    MarketItem[] memory nfts = new MarketItem[](myNftCount);
    uint nftsIndex = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (marketItemsMapping[i + 1].owner == _userAddress) {
        nfts[nftsIndex] = marketItemsMapping[i + 1];
        nftsIndex++;
      }
    }
    return nfts;
  }


  function getUserListedNfts(address _userAddress) public view returns (MarketItem[] memory) {
    uint nftCount = _itemIds.current();
    uint myListedNftCount = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (marketItemsMapping[i + 1].seller == _userAddress && (marketItemsMapping[i + 1].isAvailableOnRent || marketItemsMapping[i + 1].isAvailableOnSell)) {
        myListedNftCount++;
      }
    }

    MarketItem[] memory nfts = new MarketItem[](myListedNftCount);
    uint nftsIndex = 0;
    for (uint i = 0; i < nftCount; i++) {
      if (marketItemsMapping[i + 1].seller == _userAddress && (marketItemsMapping[i + 1].isAvailableOnRent || marketItemsMapping[i + 1].isAvailableOnSell)) {
        nfts[nftsIndex] = marketItemsMapping[i + 1];
        nftsIndex++;
      }
    }
    return nfts;
  }
}