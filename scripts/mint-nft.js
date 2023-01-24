const { createAlchemyWeb3 } = require("@alch/alchemy-web3")
const web3 = createAlchemyWeb3("https://eth-goerli.g.alchemy.com/v2/ckOzGq1oqVquB-KSvF6nU04iYPRjc6J-")

const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json")
const contractAddress = "0x2804623fcff2ec43488df763cf37a14da586cc9d"
const nftContract = new web3.eth.Contract(contract.abi, contractAddress)

async function mintNFT(tokenURI) {
  const nonce = await web3.eth.getTransactionCount("0x370292b410B8306a82253C87949A7C445d9d2Bb8", "latest") //get latest nonce

  //the transaction
  const tx = {
    from: "0x370292b410B8306a82253C87949A7C445d9d2Bb8",
    to: contractAddress,
    nonce: nonce,
    gas: 500000,
    data: nftContract.methods.mintNFT("0x370292b410B8306a82253C87949A7C445d9d2Bb8", tokenURI).encodeABI(),
  }

  const signPromise = web3.eth.accounts.signTransaction(tx, "f3b477e560dfd0a46e3432bf32e6f0594d33cd40ab3887905540523d48ad45c1")
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log(
              "The hash of your transaction is: ",
              hash,
              "\nCheck Alchemy's Mempool to view the status of your transaction!"
            )
          } else {
            console.log(
              "Something went wrong when submitting your transaction:",
              err
            )
          }
        }
      )
    })
    .catch((err) => {
      console.log("Promise failed:", err)
    })
}