import { ethers } from "ethers";

import classicChordsABI from "../contract/artifacts/classicChordsBTTC.json";
import marketABI from "../contract/artifacts/marketBTTC.json";
import userStreamABI from "../contract/artifacts/userStreamBTTC.json";

export const CLASSIC_CHORDS_BTTC_TESTNET =
  "0xcf4123d181d1ae5512bE0D2c8AA71B2942C3a43C";
export const MARKET_ADDRESS_BTTC_TESTNET =
  "0xCc001Ef7184bc6f5396D0fA017b269d3701E00cf";
export const USER_ADDRESS_BTTC_TESTNET =
  "0x613512daBd71443F8b5Ba857Aa1BfADE33EAd314";

export const CLASSIC_CHORDS_BTTC_MAINNET =
  "0xffcce602a376e0b344e06468f86b93476f11c8f4";
export const MARKET_ADDRESS_BTTC_MAINNET =
  "0xbfa7e42147c93a66284bd14cfc72b9e51ca6ac0b";
export const USER_ADDRESS_BTTC_MAINNET =
  "0xef4304e9d8d7710fef0fd6b673d6d15de34532b8";

export const CLASSIC_CHORDS_POLYGON_TESTNET =
  "0x698166e83c49ba131C3E87BAc6cc412BF95c1016";
export const MARKET_ADDRESS_POLYGON_TESTNET =
  "0x7Bcc23bb52c738730DC6906809758AeE8713c57A";
export const USER_ADDRESS_POLYGON_TESTNET =
  "0x85834da0AFad6f8caA80Be92E20C3DCa28d593b0";

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
          signer
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
          signer
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
          signer
        );
        return contract;
      }
    }
  } catch (error) {
    console.log(error);
  }
};
