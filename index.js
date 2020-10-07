const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();

client.once('ready', () => console.log('READY'));

client.on('message', message => {
  //ignores messages without prefix and its own messages
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  console.log(`${command}(${args})`);

  if (command === 'ping') {
    message.channel.send('Pong.');
  } else if (command === 'beep') {
    message.channel.send('Boop.');
  } else if (command === 'server') {
    message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
  } else if (command === 'user-info') {
    message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
  } else if (command === 'clean') {
    const lines = parseInt(args[0]) + 1;

    if (isNaN(lines)) {
      return message.reply('that doesn\'t seem to be a valid number.');
    } else if (lines <= 1 || lines > 99) {
      return message.reply('you need to input a number between 1 and 99.');
    }

    message.channel.bulkDelete(lines, true).catch(err => {
      console.error(err);
      message.channel.send('there was an error trying to prune messages in this channel!');
    });
  } else if (command === 'avatar') {
    if (!message.mentions.users.size) {
      return message.channel.send(`Your avatar: <${message.author.displayAvatarURL({ dynamic: true })}>`);
    }

    const avatarList = message.mentions.users.map(user => {
      return `${user.username}'s avatar: <${user.displayAvatarURL({ dynamic: true })}>`;
    });

    message.channel.send(avatarList);
  }

});

client.login(token);
