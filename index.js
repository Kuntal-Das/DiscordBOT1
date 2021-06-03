const fs = require('fs');
const Discord = require('discord.js');
const { token } = require('./config.json');
const { prefix } = require("./prefix.json");

//declaring client and commands collection
const client = new Discord.Client();
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();


const commandFolders = fs.readdirSync("./commands");

//looping commandFolders to get to the specfic commands 
for (const folder of commandFolders) {

  //commandFiles is a array of files names which contains commands
  const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));

  //maping commandFiles into collection(client.commands)
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.name, command);
  }
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

  // if (!client.commands.has(commandName)) return;

  // getting commands form client.commands collection if exists
  const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return

  // making sure `guild only commands` don't get exuted in DMs or outside a Server 
  if (command.guildOnly && message.channel.type === 'dm') {
    return message.reply('I can\'t execute that command inside DMs!');
  }

  //if specified command require arguments but not provided it warns user
  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;
    if (command.usage) {
      reply += `\nThe proper usage would be \`${prefix}${commandName} ${command.usage}\``
    }

    return message.channel.send(reply);
  }

  // client and command based cooldown implementation 
  const { cooldowns } = client;

  // if cooldowns does not have the requested command add it 
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  const now = Date.now();

  // A reference to the Collection of user-ID and timestamp key/value pairs for the triggered command
  const timestamps = cooldowns.get(command.name);
  // cooldown in milliseconds. min : 3000
  const cooldownAmount = (command.cooldown || 3) * 1000;

  // if command is in the timestamps collection
  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing  the "${command.name}" command`);
    }
  }
  // if command is not found in the timestamps collection from the `client.cooldowns` collection
  // add it to the collection with the author id 
  timestamps.set(message.author.id, now);

  // and settimeout to delete it after the cooldown is over
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  //executes the command and trys to catch any error is happened
  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }

});

// client.login(process.env.TOKEN);
client.login(token);
