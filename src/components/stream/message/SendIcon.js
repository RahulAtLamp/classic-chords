const SendIcon = ({style}) => {
    return (
        <div style={{ fontSize: "30px", padding:"0 10px", cursor:"pointer" }}>
            <svg width="20px" height="20px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" version="1.1" fill="#9FD356" stroke="gray" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                <polygon points="1.75 1.75,14.25 7.75,1.75 14.25,3.25 7.75" />
                <line x1="3.75" y1="7.75" x2="7.25" y2="7.75" />
            </svg>
        </div>
    )
}

export default SendIcon;