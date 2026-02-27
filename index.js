const { 
  Client, 
  GatewayIntentBits, 
  PermissionsBitField 
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

const prefix = "!";
const TOKEN = process.env.TOKEN;

client.once("ready", () => {
  console.log("🦖 AG TREX is online");
});

client.on("messageCreate", async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    return message.reply("🏓 Pong!");
  }

  if (command === "clear") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
      return message.reply("❌ No permission");

    const amount = parseInt(args[0]);
    if (!amount) return message.reply("Enter number");

    await message.channel.bulkDelete(amount, true);
    return message.channel.send(`Deleted ${amount} messages`);
  }
});

client.login(TOKEN);
