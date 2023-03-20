// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";



contract userStream {

    using Counters for Counters.Counter;

    Counters.Counter private _usersCount;
    Counters.Counter private _streamCount;

    address platformOwner;

   constructor(){
      platformOwner = msg.sender;
   }


    struct User{
      uint userId;
      address userAddress;
      string name;
      string description;  
      string profileImage;
      uint superChatEarned;
      uint superChatSpend;
    }

    struct Stream{
      uint stremId;
      string stramCode;
      string title;
      string description;
      bool premium;
      bool isLive;
      uint superChatEarned;
    }

    mapping (address => User) public userMapping;
    mapping (uint => User) public userIdToUser;
    mapping (uint => address) public streamIdToUser;
    mapping (uint => Stream) public streamIdToStream;
    mapping (string => Stream) public streamCodeToStream;

  event StreamCreated(
      uint indexed stremId,
      address indexed creator,
      string stramCode,
      string title,
      string description,
      bool premium
  );


  function registerUser(string memory _name, string memory _description, string memory _profileImage) public returns(uint256) {
    _usersCount.increment();
    uint256 userId = _usersCount.current();
    userIdToUser[userId] = User(
      userId,
      msg.sender,
      _name,
      _description,
      _profileImage,
      0,
      0
    );
    userMapping[msg.sender] = User(
      userId,
      msg.sender,
      _name,
      _description,
      _profileImage,
      0,
      0
    );

    return userId;
  }


  function updateUser(uint userId,string memory _name, string memory _description, string memory _profileImage) public view {
    User memory user = userIdToUser[userId];
    if(bytes(_name).length >= 0){
      user.name = _name;
    }
    if(bytes(_description).length >= 0){
      user.description = _description;
    }
    if(bytes(_profileImage).length >= 0){
      user.profileImage = _profileImage;
    }
  }



  function createStream(string memory _streamCode, bool _premium, string memory _title, string memory _description) public {
    _streamCount.increment();
    uint256 streamId = _streamCount.current();
    streamIdToStream[streamId] = Stream(
      streamId,
      _streamCode,
      _title,
      _description,
      _premium,
      true,
      0
    );
    streamIdToUser[streamId] = msg.sender;
    streamCodeToStream[_streamCode] = Stream(
      streamId,
      _streamCode,
      _title,
      _description,
      _premium,
      true,
      0
    );
    emit StreamCreated(
      streamId,
      msg.sender,
      _streamCode,
      _title,
      _description,
      _premium
    );
  }

  function getAllArtists() public view returns (User[] memory){
    User[] memory users = new User[](_usersCount.current());
    uint userIndex = 0;
    for (uint i = 0; i < _usersCount.current(); i++) {
        users[userIndex] = userIdToUser[i + 1];
        userIndex++;
    }
    return users;
  }


function sendSuperChat(uint _streamId) public payable {
    require(msg.value > 0, "Not enough amount!");
    uint _amount = msg.value;
    address payable _creator = payable(streamIdToUser[_streamId]);
    uint platformFee = msg.value*5/100;
    _creator.transfer(msg.value - platformFee);
    Stream storage _stream = streamIdToStream[_streamId];
    _stream.superChatEarned += _amount;
    userMapping[msg.sender].superChatSpend += _amount;
}


function withdraw() public {
  require(msg.sender==platformOwner, "Only owner can withdraw!");
  payable(msg.sender).transfer(address(this).balance);
}


}