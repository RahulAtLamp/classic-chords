import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import "./AllRequests.scss";
import user from "../../contract/artifacts/userStream.json";
import userBTTC from "../../contract/artifacts/userStreamBTTC.json";

function AllRequests() {
  // for creating the contract instance

  const [requests, setRequests] = useState([]);

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
            process.env.REACT_APP_USER_ADDRESS_POLYGON_TESTNET,
            user,
            signer
          );
          return contract;
        } else if (chainId === 1029) {
          const contract = new ethers.Contract(
            process.env.REACT_APP_USER_ADDRESS_BTTC_TESTNET,
            userBTTC,
            signer
          );
          return contract;
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllRequests = async () => {
    try {
      const contract = await getContract();
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
  useEffect(() => {
    getAllRequests();
  }, []);
  return (
    <>
      <div className="exp">
        <div className="exp-header">All Requests</div>
        {requests.length > 0
          ? requests.map((item, key) => {
              return (
                <div className="requests-main" key={key}>
                  <div className="request-details">
                    <h3 className="request-title">{item[1]}</h3>
                    <p className="request-story">{item[2]}</p>
                    <h3 className="request-budget">
                      Budget : {parseFloat(item[4], 16)} MATIC
                    </h3>
                  </div>
                  <div className="request-response">
                    <div className="request-res-buttons">
                      <button className="accept-request">Accept</button>
                      <button className="rejest-request">Reject</button>
                    </div>
                  </div>
                </div>
              );
            })
          : ""}
      </div>
    </>
  );
}

export default AllRequests;
