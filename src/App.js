import logo from './logo.svg';
import './App.css';
import React from 'react';
import {useState} from 'react';
import lighthouse from '@lighthouse-web3/sdk';
import { createAlchemyWeb3 } from '@alch/alchemy-web3';
import mintnft from 'mint-nft.js';
import web3 from 'web3';
import NftAbi from "./NftAbi.json"



function App() {
  const[images,setImages] = useState([])
  const[name,setName] = useState("")
  const[des,setDes] = useState("") 
  const contractAddress = "0x2804623fcff2ec43488df763cf37a14da586cc9d"
const nftContract = new web3.eth.Contract(NftAbi, contractAddress)
  const handleChangeName = (event) => {
    setName(event.target.value)
  }
  const handleChangeDes = (event) => {
    setDes(event.target.value)

  }
  const uploadImage = async(e) => {
    // Push file to lighthouse node
    const output = await lighthouse.upload(e, "00a1458d-43a7-46c8-beab-547c0ef27890");
    console.log('File Status:', output);

    let images = 'https://gateway.lighthouse.storage/ipfs/' + output.data.Hash;
    setImages(images)
  }
  
    const changeSubmit = async(e) => {
      e.preventDefault();
    let metadata = {
      name:name,
      description:des,
      image:images
    }
    console.log("metadata",metadata)
    let metadataStringified = JSON.stringify(metadata)
    console.log("metadataStringified  ",metadataStringified)
    const result = await lighthouse.uploadText(metadataStringified,"00a1458d-43a7-46c8-beab-547c0ef27890");
    console.log('File Status:',result);
    let Hash = "https://gateway.lighthouse.storage/ipfs/QmfFRkTcvbRGuKmtfGRbGwMbeYSuMMBGNNK8Q8meCYcGKY"

    const NewHash = async function mintNFT(Hash) {
      const nonce = await web3.eth.getTransactionCount("0x370292b410B8306a82253C87949A7C445d9d2Bb8", "latest")
      const tx = {
        from: "0x370292b410B8306a82253C87949A7C445d9d2Bb8",
        to: contractAddress,
        nonce: nonce,
        gas: 500000,
        data: nftContract.methods.mintNFT("0x370292b410B8306a82253C87949A7C445d9d2Bb8", Hash).encodeABI(),
      }
  }
}
 
  
  return (
    <div className="App">
      <form>
      <input onChange={e=>uploadImage(e)} type="file" />
      <br></br>
      <input value={name} type="text" placeholder='name' onChange={handleChangeName}/>
      {name}
      <br></br>
      <input value={des} type="text" placeholder='description'onChange=
      {handleChangeDes} />
      {des}
      <br></br>
      <button onClick={(e)=>changeSubmit(e)}>submit</button>
      </form>
      
    
      
    </div>
  );
}

export default App;
