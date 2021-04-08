module.exports = {
  name: "user-info",
  description: "get user informaation of self",
  execute(message, args) {
    message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
  }
}