import { useEffect, useState, useRef } from "react";
import SendIcon from "./SendIcon";

const ConversationRight = ({ allMessages, activeAddress, sendMessage, singleMessage, setSingleMessage }) => {
    const [resetField, setResetField] = useState(0);
    const messageRef = useRef();

    // console.log(allMessages, activeAddress);
    useEffect(() => {
        if (resetField > 0) {
            messageRef.current.value = "";
        }
    }, [resetField])

    useEffect(() => {
        console.log(allMessages)
    }, [allMessages]);

    useEffect(() => {
        if (allMessages.length > 0) {
            let toBottom = document.querySelector("#conversation_selector");
            toBottom.scrollTop = toBottom.scrollHeight - toBottom.clientHeight;
        }
    }, [allMessages])

    if (allMessages.length > 0) {
        return (
            <>
                <div className="message__right">
                    <div className="header">
                        <div className="image-header">
                            <img src="https://images.unsplash.com/photo-1662377088248-6cf24d3791d8?crop=entropy\u0026cs=tinysrgb\u0026fit=max\u0026fm=jpg\u0026ixid=MnwzNjE5NjR8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NjI1NDQyNDE\u0026ixlib=rb-1.2.1\u0026q=80\u0026w=200" alt="icon" className="bitmap-img" />
                        </div>
                        <div className="name">
                            {activeAddress}
                        </div>
                    </div>
                    <div className="conversation" id="conversation_selector">
                        {
                            allMessages.map((m, i) => {
                                console.log(m.sent);
                                if (m.senderAddress === activeAddress) {
                                    return (
                                        <div className="left" key={i}>
                                            <div>{m.content}<div className="conv-time">{m.sent.toString().split("GMT")[0]}</div></div>
                                        </div>
                                    )
                                } else {
                                    return (
                                        <div className="right" key={i}>
                                            <div className="grow"></div><div className="msg">{m.content}<div className="conv-time">{m.sent.toString().split("GMT")[0]}</div></div>
                                        </div>
                                    )
                                }
                            })
                        }
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
                        <input type="text" ref={messageRef} placeholder="Please type your message here..." onKeyDown={(e) => { if (e.key === "Enter") { sendMessage(); setResetField(1) } }} defaultValue={singleMessage} className="send" onChange={(e) => { setSingleMessage(e.target.value) }} />
                        <div onClick={() => { sendMessage(); setResetField(1) }} ><SendIcon /></div>
                    </div>
                </div>
            </>
        )
    } else {
        return (
            <>
                Please start a conversation by clicking on the message button of the user profile.
            </>
        )
    }
}

export default ConversationRight;