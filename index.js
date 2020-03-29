require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = "!"
const TOKEN = process.env.TOKEN;

var getRedditPost = require('./makeRequests');

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.author.bot) return;

    if (!msg.content.startsWith(prefix)) return;

    if (msg.content.startsWith(`${prefix}ping`)) {
        msg.reply('Pong!');
    }

    if (msg.content.startsWith(`${prefix}meme`)) {
        const embed = new Discord.MessageEmbed()
            .setTitle('An interesting title')
            .setColor(0xff0000)
            .setDescription('The description')
        msg.channel.send(embed);
    }

    if (msg.content.startsWith(`${prefix}start`)) {
        if (!msg.member.hasPermission('MANAGE_GUILD')) {
            msg.reply('You do not have permissions for using this command.')
            break
        }

        post =  getRedditPost()

    }
});

client.login(TOKEN);