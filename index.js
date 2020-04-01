require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = "!"
const TOKEN = process.env.TOKEN;
require('./getRedditPost')()

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

client.on('message', async message => {
    if (message.author.bot) return;

    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (command === 'ping') {
        message.reply('Pong!');
    }

    if (command === 'meme') {
        post = await makeRequest()
        const embed = new Discord.MessageEmbed()
            .setTitle(post.data.title)
            .setURL(`https://www.reddit.com${post.data.permalink}`)
            .setColor(0xff0000)
            .setImage(post.data.url)
            .setFooter(`⬆️ ${post.data.ups} - 💬 ${post.data.num_comments} | ${post.data.subreddit}`)
        message.channel.send(embed);
    }

    if (command === 'start') {

        if (!message.member.hasPermission('MANAGE_GUILD')) {
            message.reply('You do not have permissions for using this command.')
        }

        else if (message.member.hasPermission('MANAGE_GUILD')) {

            if (args % 5 == 0) {
                setInterval(async () => {
                    post = makeRequest()
                    const embed = new Discord.MessageEmbed()
                        .setTitle(post.data.title)
                        .setURL(`https://www.reddit.com${post.data.permalink}`)
                        .setColor(0xff0000)
                        .setImage(post.data.url)
                        .setFooter(`⬆️ ${post.data.ups} - 💬 ${post.data.num_comments} | ${post.data.subreddit}`)
                    message.channel.send(embed)
                }, args*60000)
            }

            else {
                message.reply('You can set the interval only in multiples of 5.')
            }
        }
    }
});

client.login(TOKEN);