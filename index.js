const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();

client.once('ready', () => console.log('READY'));

client.on('message', message => {
  if (message.content.startsWith(`${prefix}kick`)) {
    message.channel.send("Sending a virtual kick ;)");
  }
  if (message.content.startsWith(`OK`)) {
    message.channel.send("Ok ! burh");
  }
  if (message.content.startsWith(`HI`) || message.content.startsWith(`hi`) || message.content.startsWith(`Hi`)) {
    message.channel.send("Hello");
  }
  // console.log(message.content);
}
);

client.login(token);
