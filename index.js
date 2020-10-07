const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Discord.Client();
client.commands = new Discord.Collection();

//commandFiles is a array of file names which contains commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
console.log(commandFiles);

//maping commandFiles into collection(client.commands)
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once('ready', () => console.log('READY'));

client.on('message', message => {
  //ignores messages without prefix and its own messages
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  //splits commands in command and arguments
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  console.log(`${command}(${args})`);//print requested functions

  if (!client.commands.has(command)) return;

  try {
    client.commands.get(command).execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }

});

client.login(token);
