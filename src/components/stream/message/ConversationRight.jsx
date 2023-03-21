import { useEffect, useState, useRef } from "react";
import { ethers } from "ethers";
import user from "../../../contract/artifacts/userStream.json";
import SendIcon from "./SendIcon";
import { useParams } from "react-router-dom";

const ConversationRight = ({
  allMessages,
  activeAddress,
  sendMessage,
  singleMessage,
  setSingleMessage,
  notShow,
}) => {
  const [resetField, setResetField] = useState(0);
  const [superChatAmount, setSuperChatAmount] = useState();
  const [streamData, setStreamData] = useState(true);
  const params = useParams();
  const messageRef = useRef();

  const getContract = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        if (!provider) {
          console.log("Metamask is not installed, please install!");
        }
        const { chainId } = await provider.getNetwork();
        console.log("switch case for this case is: " + chainId);
        if (chainId === 80001) {
          const contract = new ethers.Contract(
            process.env.REACT_APP_USER_ADDRESS,
            user,
            signer
          );
          return contract;
        } else {
          alert("Please connect to the Mumbai Testnet Network!");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const Superchat = async () => {
    const contract = await getContract();
    const streamId = params.id.replace(/-/g, "");
    const streamData = await contract.streamCodeToStream(streamId);
    let userData = {};
    userData.stremId = streamData.stremId;
    setStreamData(userData);
    // const streamId = params.id.replace(/-/g, "");
    // console.log(streamId);
    const convertToInt = parseInt(streamData.stremId);
    const superChat = await contract.sendSuperChat(convertToInt, {
      value: ethers.utils.parseEther(superChatAmount.toString()),
    });
    await superChat.wait();
    sendMessage(superChatAmount, "super");
    // console.log(superChat);
  };

  // console.log(allMessages, activeAddress);
  useEffect(() => {
    if (resetField > 0) {
      messageRef.current.value = "";
      setResetField(0);
    }
  }, [resetField]);

  useEffect(() => {
    console.log(allMessages);
  }, [allMessages]);

  useEffect(() => {
    if (allMessages.length > 0) {
      let toBottom = document.querySelector("#conversation_selector");
      toBottom.scrollTop = toBottom.scrollHeight - toBottom.clientHeight;
    }
  }, [allMessages]);

  // if (allMessages.length > 0) {
  return (
    <>
      <div className="message-right-main">
        <div className="message__right">
          {/* <div className="header">
                        <div className="image-header">
                            <img src="https://images.unsplash.com/photo-1662377088248-6cf24d3791d8?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=MnwzNjE5NjR8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjI1NDQyNDE\u0026ixlib=rb-1.2.1\u0026q=80\u0026w=200" alt="icon" className="bitmap-img" />
                        </div>
                        <div className="name">
                            {activeAddress}
                        </div>
                    </div> */}
          <div className="conversation" id="conversation_selector">
            {allMessages.map((m, i) => {
              if (m.sender === activeAddress) {
                return (
                  <div className="right" key={i}>
                    <div className="grow"></div>
                    <div className="msg">
                      {m.msg}
                      <div className="conv-time">
                        {m.createdAt.toString().split("GMT")[0]}
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="left" key={i}>
                    <div>
                      {m.msg}
                      <div className="conv-time">
                        {m.createdAt.toString().split("GMT")[0]}
                      </div>
                    </div>
                  </div>
                );
              }
            })}
            {/* <div className="left">
                            <div>Hi<div className="conv-time">3:20 PM</div></div>
                        </div>
                        <div className="right">
                            <div className="grow"></div><div className="msg">Hi<div className="conv-time">3:20 PM</div></div>
                        </div>
                        <div className="left">
                            How are you.....?<div className="conv-time">3:20 PM</div>
                        </div>
                        <div className="right">
                            <div className="grow"></div><div className="msg">I am good. What about you?<div className="conv-time">3:20 PM</div></div>
                        </div>
                        <div className="left">
                            I am good too.
                            <div className="conv-time">3:20 PM</div>
                        </div>
                        <div className="right">
                            <div className="grow"></div><div className="msg">Nice Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                Ex ad voluptas exercitationem libero obcaecati quia vitae quod optio! Libero laboriosam fuga amet
                                voluptatibus similique harum, obcaecati doloribus officiis porro? Dignissimos.
                                <div className="conv-time">3:20 PM</div></div>
                        </div>
                        <div className="left">
                            Hmmm.
                            <div className="conv-time">3:20 PM</div>
                        </div> */}
          </div>
          <div className="message">
            <input
              type="text"
              ref={messageRef}
              placeholder="Please type your message here..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage(singleMessage);
                  setResetField(1);
                }
              }}
              defaultValue={singleMessage}
              className="send"
              onChange={(e) => {
                setSingleMessage(e.target.value);
              }}
            />
            <div
              onClick={() => {
                sendMessage(singleMessage);
                setResetField(1);
              }}
            >
              <SendIcon />
            </div>
          </div>
        </div>
        {notShow ? (
          ""
        ) : (
          <>
            <div className="chats-super-main">
              <div className="chats-super-headermain">
                {/* <input type={"checkbox"} className="chats-super-check" /> */}
                <div className="chats-super-header">Superchat</div>
              </div>
              {/* <div className="chats-super-confirm">
                Please Specify the amount
              </div> */}
              {/* <div className="chat-super-amount">
          <Sparkle />
          Hi
        </div> */}
              <div className="chats-super-lowermain">
                <input
                  type={"number"}
                  className="chats-super-lowernum"
                  placeholder=" Please Specify the amount"
                  onChange={(e) => {
                    setSuperChatAmount(e.target.value);
                  }}
                />
                <button
                  className="chats-super-lowerbtn"
                  onClick={() => {
                    Superchat();
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
  // } else {
  //     return (
  //         <>
  //             Please start a conversation by clicking on the message button of the user profile.
  //         </>
  //     )
  // }
};

export default ConversationRight;
