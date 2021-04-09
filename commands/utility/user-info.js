module.exports = {
  name: "user-info",
  description: "get user informaation of self",
  aliases:["my-info"],
  execute(message, args) {
    message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
  }
}