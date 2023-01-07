import { Buffer } from "buffer";
import './App.css';
import { MediaFactory } from "../node_modules/@zoralabs/core/dist/typechain/MediaFactory";
import { ethers } from "ethers";
import { useEffect, useState } from 'react';
import sha256 from "sha256";
import axios, * as others from 'axios';
import { NFTStorage, File, Blob } from "nft.storage"
import { create } from 'ipfs-http-client'
// import { IERC721__factory } from "../node_modules@zoralabs/v3/dist/typechain/factories/IERC721__factory";
// import { IERC20__factory } from "../node_modules@zoralabs/v3/dist/typechain/factories/IERC20__factory";
const contract_address = "0xabEFBc9fD2F806065b4f3C237d4b59D9A97Bcac7";
// https://bafyreidhq3m57jgqusozzmk3fcp4lmpbq44asqqxjyvd5xdnlgtubbozo4.ipfs.dweb.link/metadata.json
//.ipfs.dweb.link/metadata.json
function MintGameContract() {
  //for nft. storage
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDQyRGJGMDUxNUM2MTc2ZjE3MDExZTUyNDM4Q0JjNTQ3YzY4RTllZTMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1OTc5ODExMzU4OCwibmFtZSI6Ik5GVCJ9.jJhUz3RHVCZBJO-F3c9opVIqd4sSfIQhPRZLlN7ASIE"
  const client = new NFTStorage({ token: token })
  const [data, setdata] = useState({ name: "", desc: "", img: "", url: "" });
  const [profile_image, setProfile_image] = useState();
  const [profile_image_url, setProfile_image_url] = useState();
  async function UploadImage(e) {
    const file = e.target.files[0];
    console.log(file);
    setProfile_image(file);
    try {
      const client = create("https://ipfs.infura.io:5001/api/v0");
      const added = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setProfile_image_url(url);
      console.log(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }
  //main function
  const mintNFT = async () => {
    //creating an instance
    let accounts = await window.ethereum
      .request({
        method: "eth_requestAccounts",
      })
      .catch((err) => { });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const media = MediaFactory.connect(contract_address, signer);
    console.log(media);
    // console.log('Minting... ');
    const f = new File([profile_image], "abc.jpg", { type: 'image/gif', })
    const imgurl = { profile_image_url };
    // taking meta data dynamically
    const metaData = {
      name: "Bhadreshhsh",
      description: "Front-end developer",
      image: f,
      url: profile_image_url,
    }
    //metadata storing on ipfs
    const metadata = await client.store(metaData);
    console.log(metadata.url);
    const url = "https://" + metadata.ipnft + ".ipfs.dweb.link/metadata.json";
    console.log(url);
    await axios.get(url).then((response) => {
      console.log(response.data, "The data is");
      console.log(response.data.image)
      setdata({ ...data, name: response.data.name, desc: response.data.description, img: response.data.image, url: response.data.url });
    });
    const metadataHashh = sha256(metaData);
    // for minting
    const tx = await media.mint(
      {
        tokenURI:
          url,
        metadataURI:
          url,
        contentHash: Uint8Array.from(
          Buffer.from(
            "2a846ga617c3361fc127e1d5c1f1834j332b8p5gdk182z1a4z9xdf68d2c1992w",
            "hex"
          )
        ),
        metadataHash: Uint8Array.from(
          Buffer.from(
            "2a846ga617c3361fc127e1d5c1f1834j334b8p5gdk182z1a4z9ddf68d2c1992v",
            "hex"
          )
        ),
      },
      {
        prevOwner: Decimal.new(0),
        creator: Decimal.new(50),
        owner: Decimal.new(100 - 50),
      }
    );
    tx.wait();
    console.log("New piece is minted ");
    console.log(media);
    //getting token id
    media.on("Transfer", (from, to, tokenId) => {
      console.log(tokenId);
    });
    const tokenURI = await media.tokenURI(132);
    // console.log(tokenURI);
    const metadataURI = await media.tokenMetadataURI(132);
    // console.log(metadataURI);
    const contentHash = media.tokenContentHashes(132);
    const metadataHash = media.tokenMetadataHashes(132);
    // console.log(tokenURI);
    // setimage(tokenURI);
    console.log("Media Information for token" + 132);
    console.log({ tokenURI, contentHash, metadataURI, metadataHash });
    //transfering nft
    // const transfer = await media.transferFrom(
    //   "0x7E34F0f3A60E730Ca36787FD658AD909479A59a8",
    //   "0xDaB4984b2F4e06d207f73678935A649ae6969490",
    //   token_id
    // );
    // transfer.wait();
  };
  return (
    <div className="App">
      <div className="container">
        <button onClick={mintNFT}>Mint</button><br></br>
        {/* <img className="nft" src="https://bafybeigcdaq374v5iartwx7u72ne5cdddsnzoglxamtssrfioazvdozt4a.ipfs.dweb.link/test/1.png" alt="NFT"></img><br></br> */}
        <div className="nft-container">
          <img src="https://ipfs.io/ipfs/QmSsYRx3LpDAb1GZQm7zZ1AuHZjfbPkD6J7s9r41xu1mf8?filename=pug.png" className="nft" alt="NFT"></img><br></br>
          <ul><li>{data.name}</li><li>{data.desc}</li><li> {data.img}</li></ul>
        </div>
        <div className="nft-container">
          <input
            className="input-edit-profile"
            type="file"
            // defaultValue={nameOfUser}
            onChange={(e) => {
              UploadImage(e);
            }}
          /><br></br>
          <img src={data.url} className="nft"></img>
        </div>
      </div>
    </div>
  );
}
export default App;