import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/navbar/navbar";
import Footer from "./components/navbar/footer";
import Home from "./components/home/home";
import Player from "./components/player/player";
import AllNfts from "./components/explore/allNfts";
import Explore from "./components/explore/explore";
import Streaming from "./components/stream/stream";
import Profile from "./components/profile/Profile";
import { WagmiConfig, createClient, configureChains } from "wagmi";
import { getDefaultProvider } from "ethers";
import ArtistSingle from "./components/explore/artist-single/artist-single";
import Error404 from "./components/error404/error404";
import CollectionSingle from "./components/explore/artist-single/collections/collection-single";
import MintNft from "./components/player/MintNft";
import SellCollectionSingle from "./components/player/sell/sell-collection-single";
import AllStream from "./components/stream/all-stream";
import SingleStream from "./components/stream/single-stream";
import OldStream from "./components/stream/old-stream";
import StreamEnded from "./components/stream/stream-ended";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { mainnet, polygon, polygonMumbai } from "wagmi/chains";
import "@rainbow-me/rainbowkit/styles.css";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const BTTChain = {
  id: 1029,
  iconUrl: "https://static.bt.io/production/logo/1002000.png",
  name: "BitTorrent Chain Donau",
  network: "BitTorrent Chain Donau",
  nativeCurrency: {
    decimals: 18,
    name: "BitTorrent Chain Donau",
    symbol: "BTT",
  },
  rpcUrls: {
    default: "https://pre-rpc.bittorrentchain.io/",
  },
  blockExplorers: {
    default: {
      name: "BitTorrent Chain Donau",
      url: "https://testscan.bt.io",
    },
  },
  testnet: true,
};

const { provider, chains } = configureChains(
  [polygonMumbai, BTTChain, mainnet, polygon],
  [
    jsonRpcProvider({
      rpc: (chain) => ({ http: "https://pre-rpc.bittorrentchain.io/" }),
    }),
  ]
);

// const { chains, provider } = configureChains(
//   [mainnet, polygon, polygonMumbai, BTTChain],
//   [
//     alchemyProvider({ apiKey: process.env.REACT_APP_ALCHEMY_ID }),
//     publicProvider(),
//   ]
//   // [
//   //   jsonRpcProvider({
//   //     rpc: (chain) => ({ http: chain.rpcUrls.default.http[0] }),
//   //   }),
//   // ]
// );

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const client = createClient({
  autoConnect: true,
  connectors,
  // provider: getDefaultProvider(),
  provider,
});

const App = () => {
  return (
    <div>
      <>
        <WagmiConfig client={client}>
          <RainbowKitProvider
            chains={chains}
            theme={darkTheme({
              accentColor: "#7b3fe4",
              accentColorForeground: "white",
              borderRadius: "medium",
              fontStack: "system",
              overlayBlur: "small",
            })}
          >
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
                  <Route
                    path="/collection/:id"
                    element={<CollectionSingle />}
                  />
                  <Route path="/mint-nft" element={<MintNft />} />
                  <Route
                    path="/sell-nft/:id"
                    element={<SellCollectionSingle />}
                  />
                  <Route path="/all-stream" element={<AllStream />} />
                  <Route path="/streaming" element={<Streaming />} />
                  <Route path="/stream/:id" element={<SingleStream />} />
                  <Route path="/old-stream/:id" element={<OldStream />} />
                  <Route path="/stream-ended" element={<StreamEnded />} />
                  <Route path="/*" element={<Error404 />} />
                  {/* <Route path="/test" element={<Loading3 />} /> */}
                </Routes>
              </div>
            </Router>
          </RainbowKitProvider>
        </WagmiConfig>
      </>
      <Footer />
    </div>
  );
};

export default App;
