// import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import "./AllRequests.scss";
// import user from "../../contract/artifacts/userStream.json";
// import userBTTC from "../../contract/artifacts/userStreamBTTC.json";
import { useAccount, useNetwork } from "wagmi";
import { getUserStreamContract } from "../Contract";

function AllRequests() {
  const { address } = useAccount();
  // for creating the contract instance
  const { chain } = useNetwork();
  console.log(chain.id);
  const [requests, setRequests] = useState([]);

  // const getContract = async () => {
  //   try {
  //     const { ethereum } = window;
  //     if (ethereum) {
  //       const provider = new ethers.providers.Web3Provider(ethereum);
  //       const signer = provider.getSigner();
  //       if (!provider) {
  //         console.log("Metamask is not installed, please install!");
  //       }
  //       const { chainId } = await provider.getNetwork();
  //       console.log("switch case for this case is: " + chainId);
  //       if (chainId === 80001) {
  //         const contract = new ethers.Contract(
  //           process.env.REACT_APP_USER_ADDRESS_POLYGON_TESTNET,
  //           user,
  //           signer
  //         );
  //         return contract;
  //       } else if (chainId === 1029) {
  //         const contract = new ethers.Contract(
  //           process.env.REACT_APP_USER_ADDRESS_BTTC_TESTNET,
  //           userBTTC,
  //           signer
  //         );
  //         return contract;
  //       } else if (chainId === 199) {
  //         const contract = new ethers.Contract(
  //           process.env.REACT_APP_USER_ADDRESS_BTTC_MAINNET,
  //           userBTTC,
  //           signer
  //         );
  //         return contract;
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const getAllRequests = async () => {
    try {
      // const contract = await getContract();
      const contract = await getUserStreamContract();
      const reqs = await contract.getAllGlobalRequest();
      console.log(reqs.length);
      console.log(reqs);
      // for (let i = 0; i < 2; i++) {
      //   requests.push(reqs[i]);
      //   // setRequests((prev) => prev.push(reqs[i]));
      // }
      setRequests(reqs);
    } catch (error) {
      console.log(error);
    }
  };
  const songReqResponse = async (id, ans) => {
    console.log(id, ans);
    try {
      // const contract = await getContract();
      const contract = await getUserStreamContract();
      console.log(contract);
      const tx = await contract.songRequestResponse(id, ans);
      await tx.wait();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllRequests();
  }, []);
  return (
    <>
      <div className="exp">
        <div className="exp-header">All Requests</div>
        {requests.length > 0 ? (
          requests.map((item, key) => {
            return (
              <div className="requests-main" key={key}>
                <div className="request-details">
                  <h3 className="request-title">{item[1]}</h3>
                  <p className="request-story">{item[2]}</p>
                  <h3 className="request-budget">
                    Budget : {parseFloat(item[4], 16)}{" "}
                    {chain.id === 1029 ? "BTT" : "MATIC"}
                  </h3>
                  {/* <span className="status">Status :</span>
                    <span>
                      {item[6] !== address
                        ? item.isAccept && item.requestTo !== address
                          ? "Accepted"
                          : item.isAccept && item.requestTo === address
                          ? "Submit Work"
                          : item.isAccept &&
                            item.requestTo === address &&
                            item.cid.length > 0
                          ? "Waiting for Approval"
                          : item.isAccept &&
                            item.requestTo === address &&
                            item.cid.length > 0 &&
                            item.isApproved
                          ? "Paid"
                          : ""
                        : !item.isAccept && !item.isDecline
                        ? "Pending"
                        : item.isAccept &&
                          !item.isDecline &&
                          item.cid.length === 0
                        ? "Work Awaited"
                        : item.isDecline
                        ? "Decline"
                        : item.isAccept && item.cid.length > 0
                        ? "View Work"
                        : ""}
                      {item.isAccept ? " Accepted" : " Not Accepted Yet"}
                    </span> */}
                  <span>
                    Request by : {item[6] !== address ? `${item[6]}` : "You"}
                  </span>
                </div>
                <div className="request-response">
                  <div className="request-res-buttons">
                    {item[6] !== address ? (
                      <button
                        className={
                          item.isAccept
                            ? "disable accept-request"
                            : "accept-request"
                        }
                        onClick={() => songReqResponse(parseInt(item[0]), true)}
                      >
                        {item.isAccept ? (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="24px"
                              viewBox="0 0 24 24"
                              width="24px"
                              fill="#000000"
                            >
                              <path d="M0 0h24v24H0V0z" fill="none" />
                              <path d="M17.3 6.3c-.39-.39-1.02-.39-1.41 0l-5.64 5.64 1.41 1.41L17.3 7.7c.38-.38.38-1.02 0-1.4zm4.24-.01l-9.88 9.88-3.48-3.47c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L22.95 7.71c.39-.39.39-1.02 0-1.41h-.01c-.38-.4-1.01-.4-1.4-.01zM1.12 14.12L5.3 18.3c.39.39 1.02.39 1.41 0l.7-.7-4.88-4.9c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.03 0 1.42z" />
                            </svg>
                            Accepted
                          </>
                        ) : (
                          "Accept"
                        )}
                      </button>
                    ) : (
                      ""
                    )}
                    {/* <button className="rejest-request">Reject</button> */}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <h4>No Requests Found</h4>
        )}
      </div>
    </>
  );
}

export default AllRequests;
