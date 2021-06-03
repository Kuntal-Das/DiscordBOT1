module.exports = {
  name: "clean",
  description: "clean/prune upto 99 past text messages in a channel",
  args: true,
  cooldown: 5,
  guildOnly: true,
  aliases: ["prune", "clear", "delete", "del"],
  usage: '<number_of_messages_to_delete>',
  execute(message, args) {
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
    message.channel.send(`Deleted ${lines - 1}(+ 1) no of lines`)
    setTimeout(() => {
      message.channel.bulkDelete(1, true).catch(err => {
        console.error(err);
        message.channel.send('there was an error trying to prune messages in this channel!');
      });
    }, 1000)
    // message.channel.send(`Arguments: ${args}\nArguments length: ${args.length}`);
  },
}