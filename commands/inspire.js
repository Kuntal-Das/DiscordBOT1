const fetch = require("node-fetch")

module.exports = {
  name: "inspire",
  description: "inspirational quots",
  execute(message, args) {
    getQuote().then( quote => {
      message.channel.send(quote);
    })
  }
}

const getQuote = async () =>{
  let res = await fetch("https://zenquotes.io/api/random")
  let data = await res.json()
  let quote = ` ${data[0]["q"]} - ${data[0]["a"]} `
  return quote
}