const { 
  Client, 
  GatewayIntentBits, 
  PermissionsBitField,
  EmbedBuilder,
  ChannelType
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

const prefix = "*";
const TOKEN = process.env.TOKEN;

const BAD_WORDS = ["badword1", "badword2"]; // edit this
const AUTO_ROLE = "Member";
const LOG_CHANNEL = "ag-logs";

/* ================= READY ================= */
client.once("ready", () => {
  console.log("🦖 AG TREX SECURITY MODE ACTIVE");
});

/* ================= AUTO ROLE + LOG JOIN ================= */
client.on("guildMemberAdd", async member => {
  const role = member.guild.roles.cache.find(r => r.name === AUTO_ROLE);
  if (role) member.roles.add(role).catch(() => {});

  const logChannel = member.guild.channels.cache.find(c => c.name === LOG_CHANNEL);
  if (logChannel) {
    logChannel.send(`📥 ${member.user.tag} joined.`);
  }
});

/* ================= MESSAGE SYSTEM ================= */
client.on("messageCreate", async message => {
  if (message.author.bot) return;

  const logChannel = message.guild?.channels.cache.find(c => c.name === LOG_CHANNEL);

  /* ===== ANTI LINK ===== */
  if (message.content.includes("http")) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
      message.delete().catch(() => {});
      if (logChannel) logChannel.send(`🚫 Link deleted from ${message.author.tag}`);
      return message.channel.send("🚫 Links are not allowed here.");
    }
  }

  /* ===== ANTI BAD WORD ===== */
  const lower = message.content.toLowerCase();
  if (BAD_WORDS.some(word => lower.includes(word))) {
    message.delete().catch(() => {});
    if (logChannel) logChannel.send(`⚠ Bad word detected from ${message.author.tag}`);
    return message.channel.send("⚠ Bad language not allowed.");
  }

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  /* ===== TICKET SYSTEM ===== */
  if (command === "ticket") {
    const existing = message.guild.channels.cache.find(c => 
      c.name === `ticket-${message.author.id}`
    );

    if (existing) return message.reply("You already have a ticket.");

    const channel = await message.guild.channels.create({
      name: `ticket-${message.author.id}`,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: message.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: message.author.id,
          allow: [PermissionsBitField.Flags.ViewChannel]
        }
      ]
    });

    return channel.send(`🎟 Ticket created for ${message.author}`);
  }

  if (command === "close") {
    if (!message.channel.name.startsWith("ticket-"))
      return message.reply("Not a ticket channel.");

    message.channel.delete();
  }

  /* ===== PING ===== */
  if (command === "ping") {
    return message.reply("🏓 Pong!");
  }

  /* ===== HELP ===== */
  if (command === "help") {
    const embed = new EmbedBuilder()
      .setTitle("🦖 AG TREX Security Panel")
      .setColor("Purple")
      .setDescription(`
🛡 Moderation:
*clear <number>
*kick @user
*ban @user

🎟 Support:
*ticket
*close

⚙ Utility:
*ping
*help
      `);

    return message.reply({ embeds: [embed] });
  }

  /* ===== CLEAR ===== */
  if (command === "clear") {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
      return message.reply("No permission");

    const amount = parseInt(args[0]);
    if (!amount) return message.reply("Enter number");

    await message.channel.bulkDelete(amount, true);
    return message.channel.send(`Deleted ${amount}`);
  }
});

client.login(TOKEN);
