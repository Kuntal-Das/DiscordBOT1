const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');

//declaring client and commands collection
const client = new Discord.Client();
client.commands = new Discord.Collection();

//commandFiles is a array of files names which contains commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

//maping commandFiles into collection(client.commands)
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

//print 'READY' msg when the bot is ready
client.once('ready', () => console.log('READY'));

//message event handler
client.on('message', message => {
  //ignores messages without prefix and its own messages
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  //splits commands in command and arguments
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  //requested commands are logged in console
  console.log(`${commandName}(${args}) requested by : ${message.author.username} in #${message.channel.name}`);//print requested functions

  if (!client.commands.has(commandName)) return;

  // getting commands form client.commands collection if exists
  command = client.commands.get(commandName);

  //if specified command require arguments but not provided it warns user
  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;
    if (command.usage) {
      reply += `\nThe proper usage would be \`${prefix}${commandName} ${command.usage}\``
    }

    return message.channel.send(reply);
  }

  //executes the command and trys to catch any error is happened
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }

});

client.login(token);
