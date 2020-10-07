module.exports = {
  name: "clean",
  description: "clean past text messages in a channel",
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
  }
}