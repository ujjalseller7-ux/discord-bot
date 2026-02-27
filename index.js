const { 
  Client, 
  GatewayIntentBits, 
  PermissionsBitField, 
  EmbedBuilder 
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

/* BOT READY */
client.once("ready", () => {
  console.log(`🦖 AG TREX is online`);
  client.user.setActivity("Private Server Protection 🛡️");
});

/* WELCOME SYSTEM */
client.on("guildMemberAdd", member => {
  const channel = member.guild.systemChannel;
  if (channel) {
    channel.send(`👋 Welcome ${member} to ${member.guild.name}`);
  }
});

/* COMMAND SYSTEM */
client.on("messageCreate", async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  /* PING */
  if (command === "ping") {
    return message.reply(`🏓 Pong! ${client.ws.ping}ms`);
  }

  /* CLEAR */
  if (command === "clear") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
      return message.reply("❌ No permission");

    const amount = parseInt(args[0]);
    if (!amount) return message.reply("⚠ Enter number");

    await message.channel.bulkDelete(amount, true);
    return message.channel.send(`🧹 Deleted ${amount} messages`);
  }

  /* KICK */
  if (command === "kick") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers))
      return message.reply("❌ No permission");

    const member = message.mentions.members.first();
    if (!member) return message.reply("⚠ Mention a user");

    await member.kick();
    return message.channel.send(`👢 ${member.user.tag} kicked`);
  }

  /* BAN */
  if (command === "ban") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers))
      return message.reply("❌ No permission");

    const member = message.mentions.members.first();
    if (!member) return message.reply("⚠ Mention a user");

    await member.ban();
    return message.channel.send(`🔨 ${member.user.tag} banned`);
  }

  /* SERVER INFO */
  if (command === "serverinfo") {
    const embed = new EmbedBuilder()
      .setTitle("📊 Server Info")
      .addFields(
        { name: "Server", value: message.guild.name },
        { name: "Members", value: `${message.guild.memberCount}` }
      )
      .setColor("Blue");

    return message.reply({ embeds
