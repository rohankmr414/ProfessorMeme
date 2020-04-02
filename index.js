const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
var config = require('./config.json')
var prefixes = require('./prefixes.json')
const TOKEN = config.token;
require('./getRedditPost')()

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildCreate', (guild) => { // If the Bot was added on a server, proceed
    if (!prefixes[guild.id]) { // If the guild's id is not on the prefixes File, proceed
        prefixes[guild.id] = {
            prefix: config.prefix
        }
    }
    fs.writeFile('.prefixes.json', JSON.stringify(prefixes), (err) => {
        if (err) console.log(err)
    })
});


client.on('guildDelete', (guild) => { // If the Bot was removed on a server, proceed
    delete prefixes[guild.id]; // Deletes the Guild ID and Prefix
    fs.writeFile('.prefixes.json', JSON.stringify(prefixes, null, 2), (err) => {
        if (err) console.log(err)
    })
});


client.on('message', async message => {
    if (message.author.bot) return;

    if (!message.content.startsWith(prefixes[message.guild.id].prefix)) return;

    const args = message.content.slice(prefixes[message.guild.id].prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === 'ping') {
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms.`);
    }

    if (command === 'help') {
        if (!args[0]) {
            const hEmbed = new Discord.MessageEmbed()
                .setColor('#D97694')
                .setTitle('ProfessorMeme Command List')
                .setDescription(`${prefixes[message.guild.id].prefix}help prefix
            ${prefixes[message.guild.id].prefix}help meme
            ${prefixes[message.guild.id].prefix}help automeme`)
            message.channel.send(hEmbed);
        }

        if (args[0] === 'meme') {
            const memehelp = new Discord.MessageEmbed()
                .setColor('#D97694')
                .setTitle(`${prefixes[message.guild.id].prefix}meme`)
                .setDescription('Shows a funny meme from reddit.')
            message.channel.send(memehelp);
        }

        if (args[0] === 'automeme') {
            const amhelp = new Discord.MessageEmbed()
                .setColor('#D97694')
                .setTitle(`${prefixes[message.guild.id].prefix}automeme`)
                .setDescription(`Starts showing memes at a given interval of time.
            Usage: ${prefixes[message.guild.id].prefix}automeme <interval duration in minutes>`)
            message.channel.send(amhelp)
        }

        if (args[0] === 'prefix') {
            const prefixhelp = new Discord.MessageEmbed()
                .setColor('#D97694')
                .setTitle(`${prefixes[message.guild.id].prefix}prefix`)
                .setDescription(`Changes the prefix of the bot to the desired one.
            Usage: ${prefixes[message.guild.id].prefix}prefix <desired prefix here>`)
            message.channel.send(prefixhelp)
        }
    }

    if (command == 'prefix') {
        if (!message.member.hasPermission('MANAGE_GUILD')) {
            message.reply('You do not have permissions for using this command.')
        }

        if (!args[0] || args[0 == 'help']) return message.channel.send(`Usage: ${prefixes[message.guild.id].prefix}prefix <desired prefix here>`);

        prefixes[message.guild.id].prefix = args[0];

        fs.writeFile('./prefixes.json', JSON.stringify(prefixes), (err) => {
            if (err) console.log(err)
        });

        let pEmbed = new Discord.MessageEmbed()
            .setColor('#FF9900')
            .setTitle('Prefix Set!')
            .setDescription(`Prefix set to ${args[0]}`)

        message.channel.send(pEmbed);
    }

    if (command === 'meme') {
        post = await makeRequest()
        const embed = new Discord.MessageEmbed()
            .setTitle(post.data.title)
            .setURL(`https://www.reddit.com${post.data.permalink}`)
            .setColor('#ff0000')
            .setImage(post.data.url)
            .setFooter(`⬆️ ${post.data.ups} - 💬 ${post.data.num_comments} | ${post.data.subreddit}`)
        message.channel.send(embed);
    }

    if (command === 'automeme') {

        if (!message.member.hasPermission('MANAGE_GUILD')) {
            message.reply('You do not have permissions for using this command.')
        }

        else if (!args[0]) return message.channel.send(`Usage: ${prefixes[message.guild.id].prefix}automeme <interval duration in minutes>.`)

        else if (message.member.hasPermission('MANAGE_GUILD')) {

            if (args % 5 == 0) {
                interval = setInterval(async () => {
                    post = await makeRequest()
                    const embed = new Discord.MessageEmbed()
                        .setTitle(post.data.title)
                        .setURL(`https://www.reddit.com${post.data.permalink}`)
                        .setColor('#40b3a2')
                        .setImage(post.data.url)
                        .setFooter(`⬆️ ${post.data.ups} - 💬 ${post.data.num_comments} | ${post.data.subreddit}`)
                    message.channel.send(embed)
                }, args * 1000)
            }

            else {
                message.reply('You can set the interval only in multiples of 5.')
            }
        }
    }

    if (command === 'stop') {
        if (!message.member.hasPermission('MANAGE_GUILD')) {
            message.reply('You do not have permissions for using this command.')
        }

        clearInterval(interval);
        message.channel.send('Automeme feature has been disabled.')
    }
});

client.login(TOKEN);