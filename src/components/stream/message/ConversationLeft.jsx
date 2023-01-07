import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useEnsAddress } from 'wagmi';

const ConversationLeft = ({
  allConversations,
  activeAddress,
  setActiveAddress,
  client,
  setAllConversations
}) => {
  const changeId = (addr) => {
    setActiveAddress(addr);
  };

  const [searchedAddress, setSearchedAddress] = useState("");

  const addAddress = async (e) => {
    if (e.key === 'Enter') {
      console.log(client);
      if (ethers.utils.isAddress(searchedAddress)) {
        // onst xmtp = await Client.create(client);
        // console.log(client);
        // console.log(searchedAddress);
        const conversation = await client.conversations.newConversation(searchedAddress)
        console.log(conversation);
        await conversation.send("Hi");
        const fetchConversations = await client.conversations.list();
        setAllConversations(fetchConversations);
      } else {
        console.log(searchedAddress);
        alert("Please provide a proper wallet address...");
      }
    }
  }

  useEffect(() => {
    if (searchedAddress) {
      console.log(searchedAddress);
    }
  }, [searchedAddress])

  return (
    <>
      <div className="message__left">
        <div className="searchbar-xmtp">
          <label htmlFor="simple-search" className="sr-only">
            Search
          </label>
          <div className="relative w-full">
            <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              id="simple-search"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search by wallet address..."
              onChange={(e) => { setSearchedAddress(e.target.value) }}
              onKeyDown={(e) => { addAddress(e) }}
              required
            />
          </div>
        </div>

        <div className="conv_box">
          {allConversations.map((addr, index) => {
            return (
              <div
                className={
                  activeAddress === addr.peerAddress ? "conv active" : "conv"
                }
                key={index}
                onClick={() => changeId(addr.peerAddress)}
              >
                <div className="conv_left">
                  <div className="avatar">
                    <img src="./images/Avatar.png" alt="icon" className="bitmap" />
                  </div>
                </div>
                <div className="conv_right">
                  <div className="top">
                    <div className="name">{addr.peerAddress}</div>
                  </div>

                  {/* <div className="bottom">
                                            <div className="msg">
                                                Hmm
                                            </div>
                                            <div className="msg-time">3:20 PM</div>
                                        </div> */}
                </div>
              </div>
            );
          })}
          {/* <div className="conv active">
            <div className="conv_left">
              <div className="image">
                <img
                  src="https://images.unsplash.com/photo-1661294052753-c92664e3e1d6?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=MnwzNjE5NjR8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjI1NDAyODk\u0026ixlib=rb-1.2.1\u0026q=80\u0026w=200"
                  alt="icon"
                  className="bitmap"
                />
              </div>
            </div>
            <div className="conv_right">
              <div className="top">
                <div className="name">Vineetha Deepthi</div>
              </div>
              <div className="bottom">
                <div className="msg">Hmm</div>
                <div className="msg-time">3:20 PM</div>
              </div>
            </div>
          </div>
          <div className="conv">
            <div className="conv_left">
              <div className="image">
                <img
                  src="https://images.unsplash.com/photo-1662377088248-6cf24d3791d8?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=MnwzNjE5NjR8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjI1NDQyNDE\u0026ixlib=rb-1.2.1\u0026q=80\u0026w=200"
                  alt="icon"
                  className="bitmap"
                />
              </div>
            </div>
            <div className="conv_right">
              <div className="top">
                <div className="name">Rajeev Singh</div>
              </div>
              <div className="bottom">
                <div className="msg">Hello Rahul, How are you?</div>
                <div className="msg-time">3:20 PM</div>
              </div>
            </div>
          </div>
          <div className="conv unread">
            <div className="conv_left">
              <div className="image">
                <img
                  src="https://images.unsplash.com/photo-1659942546320-297ce58f567a?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=MnwzNjE5NjR8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjI1NDU5NjU\u0026ixlib=rb-1.2.1\u0026q=80\u0026w=200"
                  alt="icon"
                  className="bitmap"
                />
              </div>
            </div>
            <div className="conv_right">
              <div className="top">
                <div className="name-unread">Jenisha Modi</div>
                <div className="unseen-msg">2</div>
              </div>
              <div className="bottom">
                <div className="msg">
                  You owe me 200₹. When are you giving back?
                </div>
                <div className="msg-time">3:20 PM</div>
              </div>
            </div>
          </div>
          <div className="conv">
            <div className="conv_left">
              <div className="image">
                <img
                  src="https://images.unsplash.com/photo-1661379935198-a2f4afb915df?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=MnwzNjE5NjR8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjI1NDQ3ODA\u0026ixlib=rb-1.2.1\u0026q=80\u0026w=200"
                  alt="icon"
                  className="bitmap"
                />
              </div>
            </div>
            <div className="conv_right">
              <div className="top">
                <div className="name">Vinay Solanki</div>
              </div>
              <div className="bottom">
                <div className="msg">Hello Bro, Picnic ka kya plan hai?</div>
                <div className="msg-time">3:20 PM</div>
              </div>
            </div>
          </div>
          <div className="conv">
            <div className="conv_left">
              <div className="image">
                <img
                  src="https://images.unsplash.com/photo-1661379935198-a2f4afb915df?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=MnwzNjE5NjR8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjI1NDQ3ODA\u0026ixlib=rb-1.2.1\u0026q=80\u0026w=200"
                  alt="icon"
                  className="bitmap"
                />
              </div>
            </div>
            <div className="conv_right">
              <div className="top">
                <div className="name">Vinay Solanki</div>
              </div>
              <div className="bottom">
                <div className="msg">Hello Bro, Picnic ka kya plan hai?</div>
                <div className="msg-time">3:20 PM</div>
              </div>
            </div>
          </div>
          <div className="conv">
            <div className="conv_left">
              <div className="image">
                <img
                  src="https://images.unsplash.com/photo-1661379935198-a2f4afb915df?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=MnwzNjE5NjR8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjI1NDQ3ODA\u0026ixlib=rb-1.2.1\u0026q=80\u0026w=200"
                  alt="icon"
                  className="bitmap"
                />
              </div>
            </div>
            <div className="conv_right">
              <div className="top">
                <div className="name">Vinay Solanki</div>
              </div>
              <div className="bottom">
                <div className="msg">Hello Bro, Picnic ka kya plan hai?</div>
                <div className="msg-time">3:20 PM</div>
              </div>
            </div>
          </div>
          <div className="conv">
            <div className="conv_left">
              <div className="image">
                <img
                  src="https://images.unsplash.com/photo-1661379935198-a2f4afb915df?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=MnwzNjE5NjR8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjI1NDQ3ODA\u0026ixlib=rb-1.2.1\u0026q=80\u0026w=200"
                  alt="icon"
                  className="bitmap"
                />
              </div>
            </div>
            <div className="conv_right">
              <div className="top">
                <div className="name">Vinay Solanki</div>
              </div>
              <div className="bottom">
                <div className="msg">Hello Bro, Picnic ka kya plan hai?</div>
                <div className="msg-time">3:20 PM</div>
              </div>
            </div>
          </div>
          <div className="conv">
            <div className="conv_left">
              <div className="image">
                <img
                  src="https://images.unsplash.com/photo-1661379935198-a2f4afb915df?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=MnwzNjE5NjR8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjI1NDQ3ODA\u0026ixlib=rb-1.2.1\u0026q=80\u0026w=200"
                  alt="icon"
                  className="bitmap"
                />
              </div>
            </div>
            <div className="conv_right">
              <div className="top">
                <div className="name">Vinay Solanki</div>
              </div>
              <div className="bottom">
                <div className="msg">Hello Bro, Picnic ka kya plan hai?</div>
                <div className="msg-time">3:20 PM</div>
              </div>
            </div>
          </div>
          <div className="conv">
            <div className="conv_left">
              <div className="image">
                <img
                  src="https://images.unsplash.com/photo-1661435806102-1f9fa4c6050f?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=MnwzNjE5NjR8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjI1NTExMTE\u0026ixlib=rb-1.2.1\u0026q=80\u0026w=200"
                  alt="icon"
                  className="bitmap"
                />
              </div>
            </div>
            <div className="conv_right">
              <div className="top">
                <div className="name">Kessiya Cleates</div>
              </div>
              <div className="bottom">
                <div className="msg">
                  What is the current update of the files I have shared.
                </div>
                <div className="msg-time">3:20 PM</div>
              </div>
            </div>
          </div> */}

          <div className="verify-content">
            <p className="font-black text-black-500 dark:text-white w-2/4 pl-2 grow">Powered By</p>
            <img src="./images/xmtp_logo.svg" className="xmtp-logo-msg" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ConversationLeft;
