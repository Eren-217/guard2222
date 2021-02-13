const {Client, MessageEmbed} = require("discord.js"), client = new Client({fetchAllMembers: true});  
let yetki = ["ADMINISTRATOR", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_NICKNAMES", "MANAGE_EMOJIS", "MANAGE_WEBHOOKS"];

client.ayar = {
  prefix: "!",
  token: "ODEwMTQ1Nzc0ODA0NjY0MzQw.YCfZDA.Kd8FQH8GCGCm09Y54LY8AvvSQig",
  
  jail: "809582648250466354",
  booster: "807659036841213963",
  sunucu: "808549359447965756",
  
  dokunma: ["809766417729716246", "779735023175073812", "809780482404515850", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
  sahip: "806438785402273803",
  ses: "808820772797415425",
  
  vanity_url: "",
  
  logs: {
    sunucuk: "810147960196169769",
    botk: "810148011401019416",
    kick: "810148041440100363",
    bank: "810148041440100363",
    kanalk: "809769351821525032"
  }
};

client.login(client.ayar.token).then(x=> console.log(`${client.user.username} kullanıcı adıyla giriş yapıldı.`));

function ceza (id, tür, sebep) {
  let guild = client.guilds.cache.get(client.ayar.sunucu),
      member = guild.members.cache.get(id); 
  
 if (!member || !tür) return; 
 if (!sebep) sebep = "Belirtilmedi. | Woxy Guard." 
  
 if (tür == "jail") return member.roles.cache.has(client.ayar.booster) ? member.roles.set([client.ayar.jail, client.ayar.booster]) : member.roles.set([client.ayar.jail]);
 if (tür == "ban")  return member.ban({reason: sebep});
};

function ytKapat (guildID) {
 let guild = client.guilds.cache.get(guildID);
 
 if (!guild) return; 
  
 guild.roles.cache.filter(r => r.editable && (r.permissions.has("ADMINISTRATOR") || r.permissions.has("MANAGE_GUILD") || r.permissions.has("MANAGE_ROLES") || r.permissions.has("MANAGE_WEBHOOKS"))).forEach(async r => {
    await r.setPermissions(0);
  }); 
};

function güvenli (userID) {
 let member = client.guilds.cache.get(client.ayar.sunucu).members.cache.get(userID);
 let x = client.ayar.dokunma || []; 
  
 if (!member || member.id == client.user.id || member.id == client.ayar.sahip || member.id == member.guild.owner.id || x.some(v=> member.id == v || member.roles.cache.has(v))) return true
 else return false;
};

/*client.renk = {
  "renksiz": "2F3136", // 0x36393E
  "mor": "3c0149",
  "mavi": "10033d",
  "turkuaz": "00ffcb",
  "kirmizi": "750b0c",
  "yesil": "032221"// 00cd00 - 008b00
};

client.color = function () {
  return client.renk[Object.keys(client.renk).random()];
};*/

client.color = "RANDOM";

Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
};


client.on("ready", () => {
  let kanal = client.channels.cache.get(client.ayar.ses);   
    
      client.user.setPresence({activity: {name: "Woxy ❤️ Force", type: "PLAYING"}, status: "idle"});
  if (kanal) kanal.join(); 
  });

  
client.on("message", async message => {
  if (message.author.bot || !message.guild || !message.content.toLowerCase().startsWith(client.ayar.prefix)) return;
  if (message.author.id !== client.ayar.sahip) return;
  let args = message.content.split(' ').slice(1);
  let command = message.content.split(' ')[0].slice(client.ayar.prefix.length);
  
  // Eval
  if (command === "eval" && message.author.id === client.ayar.sahip) {
    if (!args[0]) return message.channel.send(`Kod belirtilmedi`);
      let code = args.join(' ');
      function clean(text) {
      if (typeof text !== 'string') text = require('util').inspect(text, { depth: 0 })
      text = text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
      return text;
    };
    try { 
      var evaled = clean(await eval(code));
      if(evaled.match(new RegExp(`${client.token}`, 'g'))) evaled.replace(client.token, "Yasaklı komut");
      message.channel.send(`${evaled.replace(client.token, "Yasaklı komut")}`, {code: "js", split: true});
    } catch(err) { message.channel.send(err, {code: "js", split: true}) };
  };
});  

client.on("guildMemberAdd", async (member) => {
  let entry = await member.guild.fetchAuditLogs({type: "BOT_ADD"}).then(x=> x.entries.first());
         
  let kanal = member.guild.channels.cache.get(client.ayar.logs.botk);
  
  if (!entry || !entry.executor || !member.user.bot || güvenli(entry.executor.id)) return;
  
  ceza (entry.executor.id, "ban", "Bot Koruma | Woxy Guard.");
  ceza (member.id, "ban", "Bot Koruma | Woxy Guard.");  
  ytKapat (client.ayar.sunucu);
  
  if (kanal) kanal.send(new MessageEmbed().setAuthor(entry.executor.username, entry.executor.avatarURL({dynamic: true})).setDescription(`${entry.executor} • (\`${entry.executor.id}\`) kullanıcısı, sunucuya ${member.user.tag} • \`${member.id}\` botunu ekledi. Güvenlik amacıyla 2 sinide sunucudan uzaklaştırdım!`).setColor(client.color));
});

client.on("guildMemberRemove", async (member) => {
  let entry = await member.guild.fetchAuditLogs({type: "MEMBER_KICK"}).then(x=> x.entries.first());
  
  let kanal = member.guild.channels.cache.get(client.ayar.logs.kick);
  
  if (!entry || !entry.executor || Date.now()-entry.createdTimestamp > 5000 || güvenli(entry.executor.id)) return;
  
  ceza (entry.executor.id, "ban", "Kick Koruma | Woxy Guard.");
  ytKapat(client.ayar.sunucu);
  
  if (kanal) kanal.send(new MessageEmbed().setAuthor(entry.executor.username, entry.executor.avatarURL({dynamic: true})).setDescription(`${entry.executor} • (\`${entry.executor.id}\`) kullanıcısı, sunucudan ${member.user.tag} • \`${member.id}\` kullanıcısını kickledi. Kickleyeni sunucudan uzaklaştırdım!`).setColor(client.color));
});



const request = require("request");

client.on("guildUpdate", async (oldGuild, newGuild) => {
  let entry = await newGuild.fetchAuditLogs({type: "GUILD_UPDATE"}).then(x=> x.entries.first());
  
  if (!entry || !entry.executor || Date.now()-entry.createdTimestamp > 5000 || güvenli(entry.executor.id)) return;
  
  let kanal = newGuild.channels.cache.get(client.ayar.logs.sunucuk);
  
  ceza (entry.executor.id, "ban", "Sunucu Koruması | Woxy Guard.");
  ytKapat(client.ayar.sunucu);
  
  if (newGuild.name !== oldGuild.name) newGuild.setName(oldGuild.name);
  if (newGuild.iconURL({dynamic: true, size: 2048}) !== oldGuild.iconURL({dynamic: true, size: 2048})) newGuild.setIcon(oldGuild.iconURL({dynamic: true}))
  if (oldGuild.vanityURLCode != newGuild.vanityURLCode) {
 // ceza (entry.executor.id, "ban", "Url Koruma | Woxy Guard.");

  request({  
  method: 'PATCH',
  url: `https://discord.com/api/v6/guilds/${newGuild.id}/vanity-url`,
  body: {
    code: client.ayar.vanity_url
  },
  json: true,
  headers: {
    "Authorization": `Bot ${client.ayar.token}`
  }
}, (err, aprax, body) => {
  if (err) return console.error(err);
});
};
  
  if (kanal) kanal.send(new MessageEmbed().setColor(client.color).setAuthor(entry.executor.username, entry.executor.avatarURL({dynamic: true})).setDescription(`${entry.executor} • (\`${entry.executor.id}\`) kullanıcısı, sunucuda değişiklik yaptı ve sunucudan uzaklaştırıldı!`))
});

client.on("channelCreate", async (channel) => {
  let entry = await channel.guild.fetchAuditLogs({type: "CHANNEL_CREATE"}).then(x=> x.entries.first());
  
  if (!entry || !entry.executor || güvenli(entry.executor.id)) return;
  
  let kanal = channel.guild.channels.cache.get(client.ayar.logs.kanalk);
  
  channel.delete({reason: "Kanal Koruma | Woxy Guard."});
  ceza (entry.executor.id, "ban", "Kanal Koruma | Woxy Guard.");
  ytKapat(client.ayar.sunucu);
  
 if (kanal) kanal.send(new MessageEmbed().setColor(client.color).setAuthor(entry.executor.username, entry.executor.avatarURL({dynamic: true})).setDescription(`${entry.executor} • (\`${entry.executor.id}\`) kullanıcısı, sunucuda kanal açtı ve sunucudan uzaklaştırıldı!`))
});

client.on("channelUpdate", async (oldChannel, newChannel) => {
  let entry = await newChannel.guild.fetchAuditLogs({type: 'CHANNEL_UPDATE'}).then(audit => audit.entries.first());
  
  if (!entry || !entry.executor || !newChannel.guild.channels.cache.has(newChannel.id) || Date.now()-entry.createdTimestamp > 5000 || güvenli(entry.executor.id)) return;
  
  ceza (entry.executor.id, "ban", "Kanal Koruma | Woxy Guard.");
  ytKapat(client.ayar.sunucu);
  
  let kanal = newChannel.guild.channels.cache.get(client.ayar.logs.kanalk);
  
  if (newChannel.type !== "category" && newChannel.parentID !== oldChannel.parentID) newChannel.setParent(oldChannel.parentID);
  
  if (newChannel.type === "category") {
    newChannel.edit({
      name: oldChannel.name,
    });
  } else if (newChannel.type === "text") {
    newChannel.edit({
      name: oldChannel.name,
      topic: oldChannel.topic,
      nsfw: oldChannel.nsfw,
      rateLimitPerUser: oldChannel.rateLimitPerUser
    });
  } else if (newChannel.type === "voice") {
    newChannel.edit({
      name: oldChannel.name,
      bitrate: oldChannel.bitrate,
      userLimit: oldChannel.userLimit,
    });
  };
  oldChannel.permissionOverwrites.forEach(perm => {
    let thisPermOverwrites = {};
    perm.allow.toArray().forEach(p => {
      thisPermOverwrites[p] = true;
    });
    perm.deny.toArray().forEach(p => {
      thisPermOverwrites[p] = false;
    });
    newChannel.createOverwrite(perm.id, thisPermOverwrites);
  });
  
   if (kanal) kanal.send(new MessageEmbed().setColor(client.color).setAuthor(entry.executor.username, entry.executor.avatarURL({dynamic: true})).setDescription(`${entry.executor} • (\`${entry.executor.id}\`) kullanıcısı, sunucuda \`${newChannel.name}\` kanalı üzerinde değişiklik yaptı ve sunucudan uzaklaştırıldı!`));
 }); 

client.on("channelDelete", async (channel) => {
  let entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_DELETE'}).then(audit => audit.entries.first());
  
  if (!entry || !entry.executor || Date.now()-entry.createdTimestamp > 5000 || güvenli(entry.executor.id)) return;
  
  let kanal = channel.guild.channels.cache.get(client.ayar.logs.kanalk);
  
  ceza (entry.executor.id, "ban", "Kanal Koruma | Woxy Guard.");
  ytKapat(client.ayar.sunucu);
  
  await channel.clone({ reason: "Kanal Koruma | Woxy Guard." }).then(async kanal => {
    if (channel.parentID != null) await kanal.setParent(channel.parentID);
    await kanal.setPosition(channel.position);
    if (channel.type == "category") await channel.guild.channels.cache.filter(k => k.parentID == channel.id).forEach(x => x.setParent(kanal.id));
  });
  
  if (kanal) kanal.send(new MessageEmbed().setColor(client.color).setAuthor(entry.executor.username, entry.executor.avatarURL({dynamic: true})).setDescription(`${entry.executor} • (\`${entry.executor.id}\`) kullanıcısı, sunucuda \`${channel.name}\` kanalını sildi ve sunucudan uzaklaştırıldı!`));
 }); 
