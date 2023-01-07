import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/navbar/navbar";
import Home from "./components/home/home";
import Player from "./components/player/player";
import AllNfts from "./components/explore/allNfts";
import Explore from "./components/explore/explore";
import Streaming from "./components/stream/stream";
import Profile from "./components/profile/Profile";
import { WagmiConfig, createClient } from 'wagmi'
import { getDefaultProvider } from 'ethers'
import ArtistSingle from "./components/explore/artist-single/artist-single";
import Error404 from "./components/error404/error404";
import CollectionSingle from "./components/explore/artist-single/collections/collection-single";
import MintNft from "./components/player/MintNft";
import SellCollectionSingle from "./components/player/sell/sell-collection-single";
import AllStream from "./components/stream/all-stream";
import SingleStream from "./components/stream/single-stream";
import OldStream from "./components/stream/old-stream";

const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
})


const App = () => {
  return (
    <div>
      <>
        <WagmiConfig client={client}>
          <Router>
            <NavBar />
            <div className="pages">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/player" element={<Player />} />
                <Route path="/all-nfts" element={<AllNfts />} />
                <Route path="/all-artists" element={<Explore />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/artist/:id" element={<ArtistSingle />} />
                <Route path="/collection/:id" element={<CollectionSingle />} />
                <Route path="/mint-nft" element={<MintNft />} />
                <Route path="/sell-nft/:id" element={<SellCollectionSingle />} />
                <Route path="/all-stream" element={<AllStream />} />
                <Route path="/streaming" element={<Streaming />} />
                <Route path="/stream/:id" element={<SingleStream />} />
                <Route path="/old-stream/:id" element={<OldStream />} />
                <Route path="/*" element={<Error404 />} />
                {/* <Route path="/test" element={<Loading3 />} /> */}
              </Routes>
            </div>
          </Router>
        </WagmiConfig>
      </>
      {/* <Footer /> */}
    </div>
  );
};

export default App;
