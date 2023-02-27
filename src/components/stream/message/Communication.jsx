import { useEffect, useState } from "react";
import { useSigner, useConnect, useAccount } from "wagmi";
import { Client } from "@xmtp/xmtp-js";
import { ethers, getDefaultProvider } from "ethers";
import "./communication.css";
import ConversationLeft from "./ConversationLeft";
import ConversationRight from "./ConversationRight";
import { InjectedConnector } from "wagmi/connectors/injected";

const Communication = (streamId) => {
  const { data } = useSigner();
  const { address } = useAccount();
  const [activeAddress, setActiveAddress] = useState("");
  const [client, setClient] = useState(null);
  const [allConversations, setAllConversations] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [Conversation, setConversation] = useState();
  const [singleMessage, setSingleMessage] = useState();
  // const [signer, setSigner] = useState(null);
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  const getXmtp = async (wallet) => {
    if (!data) {
      connect();
      // alert("Please connect with the wallet first.");

      return;
    }
    console.log(data);
    console.log(wallet);
    const xmtp = await Client.create(data);
    console.log(xmtp);
    setClient(xmtp);
    const allConvs = await xmtp.conversations.list();
    console.log(allConvs);
    // setActiveAddress("0x1c8E4C749754c6EB8Ab0629AfE41Bd5527C33e9E");
    setActiveAddress(address);
    // setActiveAddress(allConvs[0].peerAddress)
    setAllConversations(allConvs);
  };

  // const getConversations = async () => {
  //     for (const conversation of await client.conversations.list()) {
  //         // All parameters are optional and can be omitted
  //         console.log(conversation);
  //         // const opts = {
  //         //     // Only show messages from last 24 hours
  //         //     startTime: new Date(new Date().setDate(new Date().getDate() - 1)),
  //         //     endTime: new Date(),
  //         // };
  //         if (conversation.peerAddress === activeAddress) {"0x6Ea2D65538C1eAD906bF5F7EdcfEa03B504297ce"

  //             setConversation(conversation)
  //             // setAllMessages(await conversation.messages());
  //             // const messagesInConversation = ;
  //             // console.log(messagesInConversation[0].senderAddress);
  //             // console.log(messagesInConversation.senderAddress);
  //         }
  //         // setAllMessages(messagesInConversation);
  //     }
  // };

  const sendMessage = async () => {
    console.log("Inside message");
    if (singleMessage) {
      await Conversation.send(singleMessage);
      setAllMessages(await Conversation.messages());
      setSingleMessage("");
    }
  };

  const getConversation = async () => {
    // Get all the conversations
    const signer = new ethers.Wallet(
      "0x567514509ca3de736e96d064a40356b437b5bfc9a7878eea4cb786b50f76a024",
      getDefaultProvider()
    );

    const ccClient = await Client.create(signer);
    const conversations = await ccClient.conversations.list();
    console.log(conversations);
    const myAppConversations = conversations.filter(
      (convo) =>
        convo.context?.conversationId &&
        convo.context.conversationId.startsWith(streamId.streamId)
    );
    console.log(myAppConversations);
    setAllMessages(myAppConversations);

    // for (const conversation of myAppConversations) {
    //     const conversationId = conversation.context?.conversationId
    //     if (conversationId === streamId) {
    //         await conversation.send('Responce !!')
    //     }
    // }
  };

  const sendMsg = async () => {
    // Start a scoped conversation with ID mydomain.xyz/bar. And add some metadata

    const conversation = await client.conversations.newConversation(
      "0x2242007ae74311B7B0Bb17274C2ed9369C015227",
      {
        conversationId: streamId.streamId,
        metadata: {
          title: "Test Convo",
          msg: singleMessage,
          sender: address,
        },
      }
    );
    console.log("Test conversation", conversation);
    conversation.send("Hi !");
  };

  setTimeout(() => {
    getConversation();
  }, 1000);

  useEffect(() => {
    console.log(activeAddress);

    if (activeAddress) {
      const checkNewMessage = async () => {
        const conversation = await client.conversations.newConversation(
          activeAddress
        );
        for await (const message of await conversation.streamMessages()) {
          if (message.senderAddress === client.address) {
            // This message was sent by me
            continue;
          }
          // getConversations();
          console.log(
            `New message from ${message.senderAddress}: ${message.content}`
          );
        }
      };

      checkNewMessage();
      // getConversations();
    }
  }, [activeAddress]);

  // useEffect(() => {
  //     if (allMessages.length > 0) {
  //         sendMessage();
  //     }
  // }, [allMessages])

  // useEffect(() => {
  //     if (activeAddress) {
  //         const checkStream = async () => {
  //             if (client) {
  //                 const stream = await client.conversations.stream();
  //                 for await (const conv of stream) {
  //                     console.log("inside stream")
  //                     console.log("Newly added code" + conv.peerAddress);
  //                 }
  //             }
  //         }
  //     }
  //     // sendMessage();
  // }, [])

  if (!client) {
    return (
      <>
        <div className="inactive_client_main">
          <div className="inactive_client_inner">
            <div className="inactive_client_message">
              You are not connected to the XMTP client. Please click on the
              button below to sign and start the conversation.
            </div>
            <div className="inactive_client_btn_holder">
              <button
                onClick={() => {
                  getXmtp();
                }}
                className="inactive_client_btn"
              >
                Sign
              </button>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        {client ? (
          <div className="message__main">
            {/* <ConversationLeft allConversations={allConversations} setAllConversations={setAllConversations} client={client} activeAddress={activeAddress} setActiveAddress={setActiveAddress} /> */}
            <ConversationRight
              allMessages={allMessages}
              activeAddress={activeAddress}
              sendMessage={sendMsg}
              singleMessage={singleMessage}
              setSingleMessage={setSingleMessage}
            />
          </div>
        ) : null}
      </>
    );
  }
};

export default Communication;
