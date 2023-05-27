import { ethers } from "ethers";

import classicChordsABI from "../contract/artifacts/classicChordsBTTC.json";
import marketABI from "../contract/artifacts/marketBTTC.json";
import userStreamABI from "../contract/artifacts/userStreamBTTC.json";

export const CLASSIC_CHORDS_BTTC_TESTNET =
  "0xcf4123d181d1ae5512bE0D2c8AA71B2942C3a43C";
export const MARKET_ADDRESS_BTTC_TESTNET =
  "0xcc001ef7184bc6f5396d0fa017b269d3701e00cf";
export const USER_ADDRESS_BTTC_TESTNET =
  "0x613512dabd71443f8b5ba857aa1bfade33ead314";

export const CLASSIC_CHORDS_BTTC_MAINNET =
  "0xffcce602a376e0b344e06468f86b93476f11c8f4";
export const MARKET_ADDRESS_BTTC_MAINNET =
  "0xbfa7e42147c93a66284bd14cfc72b9e51ca6ac0b";
export const USER_ADDRESS_BTTC_MAINNET =
  "0xef4304e9d8d7710fef0fd6b673d6d15de34532b8";

export const CLASSIC_CHORDS_POLYGON_TESTNET =
  "0x657bafd65644193ff03014162606bb3b53cd32d1";
export const MARKET_ADDRESS_POLYGON_TESTNET =
  "0xbf95996598e8be13168bed152fc688f994d11a5a";
export const USER_ADDRESS_POLYGON_TESTNET =
  "0x99b2a61af1e37f52e0640e9331f70e430a5a70a8";

export const getUserStreamContract = async () => {
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
          USER_ADDRESS_POLYGON_TESTNET,
          userStreamABI,
          signer
        );
        return contract;
      } else if (chainId === 1029) {
        const contract = new ethers.Contract(
          USER_ADDRESS_BTTC_TESTNET,
          userStreamABI,
          signer
        );
        return contract;
      } else if (chainId === 199) {
        console.log("inside the BTTC");
        const contract = new ethers.Contract(
          USER_ADDRESS_BTTC_MAINNET,
          userStreamABI,
          provider
        );
        return contract;
      }
    }
  } catch (error) {
    console.log(error);
  }
};
export const getClassicChordsContract = async () => {
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
          CLASSIC_CHORDS_POLYGON_TESTNET,
          classicChordsABI,
          signer
        );
        return contract;
      } else if (chainId === 1029) {
        const contract = new ethers.Contract(
          CLASSIC_CHORDS_BTTC_TESTNET,
          classicChordsABI,
          signer
        );
        return contract;
      } else if (chainId === 199) {
        console.log("inside the BTTC");
        const contract = new ethers.Contract(
          CLASSIC_CHORDS_BTTC_MAINNET,
          classicChordsABI,
          provider
        );
        return contract;
      }
    }
  } catch (error) {
    console.log(error);
  }
};
export const getMarketContract = async () => {
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
          MARKET_ADDRESS_POLYGON_TESTNET,
          marketABI,
          signer
        );
        return contract;
      } else if (chainId === 1029) {
        const contract = new ethers.Contract(
          MARKET_ADDRESS_BTTC_TESTNET,
          marketABI,
          signer
        );
        return contract;
      } else if (chainId === 199) {
        console.log("inside the BTTC");
        const contract = new ethers.Contract(
          MARKET_ADDRESS_BTTC_MAINNET,
          marketABI,
          provider
        );
        return contract;
      }
    }
  } catch (error) {
    console.log(error);
  }
};
