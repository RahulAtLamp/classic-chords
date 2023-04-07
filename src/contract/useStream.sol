pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract userStream {
    using Counters for Counters.Counter;

    Counters.Counter private _usersCount;
    Counters.Counter private _streamCount;
    Counters.Counter private _songRequestCount;

    address platformOwner;

   constructor(){
      platformOwner = msg.sender;
   }

    struct User {
        uint userId;
        address userAddress;
        string name;
        string description;  
        string profileImage;
        bool isArtist;
        uint totalEarning;
        uint superChatSpend;
        uint fees;
    }

    struct Stream {
        uint stremId;
        string stramCode;
        string title;
        string description;
        bool premium;
        bool isLive;
        uint totalEarning;
    }

    struct SongRequest {
      uint requestId;
      string name;
      string story;
      string cid;
      uint budget;
      address requestTo;
      address requestBy;
      bool isAccept;
      bool isGlobalRequest;
    }

    mapping (address => User) public userMapping;
    mapping (uint => User) public userIdToUser;
    mapping (uint => address) public streamIdToUser;
    mapping (uint => Stream) public streamIdToStream;
    mapping (string => Stream) public streamCodeToStream;
    mapping (uint => SongRequest) public songRequestIdToRequest;
    mapping (address => SongRequest[]) public addressToSongRequest;
    

    event StreamCreated(
        uint indexed stremId,
        address indexed creator,
        string stramCode,
        string title,
        string description,
        bool premium
    );

    function registerUser(string memory _name, string memory _description, string memory _profileImage, bool _isArtist, uint fees) public returns(uint256) {
        _usersCount.increment();
        uint256 userId = _usersCount.current();
        userIdToUser[userId] = User(
            userId,
            msg.sender,
            _name,
            _description,
            _profileImage,
            _isArtist,
            0,
            0,
            fees
        );
        userMapping[msg.sender] = User(
            userId,
            msg.sender,
            _name,
            _description,
            _profileImage,
            _isArtist,
            0,
            0,
            fees
        );

        return userId;
    }

    function updateUser(uint _userId, string memory _name, string memory _description, string memory _profileImage) public {
        require(_userId != 0, "Wrong userId");
        User storage _user = userIdToUser[_userId];
        _user.name = _name;
        _user.description = _description;
        _user.profileImage = _profileImage;
        userMapping[msg.sender] = User(
            _user.userId,
            _user.userAddress,
            _name,
            _description,
            _profileImage,
            _user.isArtist,
            _user.totalEarning,
            _user.superChatSpend,
            _user.fees
        );
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

//   function sendSuperChat(uint _streamId) public payable {
//     uint _amount = msg.value;
   
//     address payable _creator = payable(streamIdToUser[_streamId]);
//     _creator.transfer(_amount);
//     Stream storage _stream = streamIdToStream[_streamId];
//     _stream.totalEarning += _amount;
//     userMapping[msg.sender].superChatSpend += _amount;
// }

function sendSuperChat(uint _streamId) public payable {
    uint _amount = msg.value;
   
    address payable _creator = payable(streamIdToUser[_streamId]);
    uint platformFee = msg.value*5/100;
    _creator.transfer(msg.value - platformFee);
    Stream storage _stream = streamIdToStream[_streamId];
    _stream.totalEarning += _amount;
    userMapping[msg.sender].superChatSpend += _amount;
}

function requestSong(string memory _name, string memory _story, address _requestTo, bool _isGlobalRequest, uint _budget) public payable {
  _songRequestCount.increment();
  uint256 requestId = _songRequestCount.current();
    songRequestIdToRequest[requestId] = SongRequest(
      requestId,
      _name,
      _story,
      "",
      _budget,
      _requestTo,
      msg.sender,
      false,
      _isGlobalRequest
    );
  addressToSongRequest[_requestTo].push(SongRequest(
    requestId,
    _name,
    _story,
    "",
    _budget,
    _requestTo,
    msg.sender,
    false,
    _isGlobalRequest
  ));
}

function acceptRequest(uint _requestId) public {
  require(_requestId != 0, "Wrong Request Id");
  SongRequest storage _songRequest = songRequestIdToRequest[_requestId];
  require(_songRequest.requestTo == msg.sender || _songRequest.isGlobalRequest, "You are not the artist.");
  _songRequest.requestTo = msg.sender;
  _songRequest.isAccept = true;
}

function sumbitWork(uint _requestId, string memory _cid) public {
  require(_requestId != 0, "Wrong Request Id");
  SongRequest storage _songRequest = songRequestIdToRequest[_requestId];
  require(_songRequest.requestTo == msg.sender || _songRequest.isGlobalRequest, "You are not the artist.");
  _songRequest.cid = _cid;
}

function approveWork(uint _requestId) public {
  require(_requestId != 0, "Wrong Request Id");
  SongRequest storage _songRequest = songRequestIdToRequest[_requestId];
  require(_songRequest.requestBy == msg.sender , "You are not the Requester.");
  userMapping[_songRequest.requestTo].totalEarning += _songRequest.budget;
  address payable _requester = payable(msg.sender);
  _requester.transfer(_songRequest.budget);
}

function getSongRequestByCreator() public view returns (SongRequest[] memory) {
  SongRequest[] memory requests = new SongRequest[](addressToSongRequest[msg.sender].length);
  uint requestIndex = 0;
  for (uint i = 0; i < addressToSongRequest[msg.sender].length; i++) {
      SongRequest storage _songRequest = addressToSongRequest[msg.sender][i];
      requests[requestIndex] = _songRequest;
      requestIndex++;
  }
  return requests;
}

function getAllGlobalRequest() public view returns (SongRequest[] memory) {
  SongRequest[] memory requests = new SongRequest[](_songRequestCount.current());
  uint requestIndex = 0;
  for (uint i = 0; i < _songRequestCount.current(); i++) {
      SongRequest storage _songRequest = songRequestIdToRequest[i + 1];
      if(_songRequest.isGlobalRequest == true){
        requests[requestIndex] = _songRequest;
        requestIndex++;
      }
  }
  return requests;
}

function withdraw() public {
  require(msg.sender==platformOwner, "Only owner can withdraw!");
  payable(msg.sender).transfer(address(this).balance);
}


}