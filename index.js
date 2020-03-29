require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = "!"
const TOKEN = process.env.TOKEN;
const axios = require('axios')

async function getRedditPost() {
    let subs = [
        'https://www.reddit.com/r/dankmemes/top/.json?sort=top&t=day&limit=100',
        'https://www.reddit.com/r/dank_meme/top/.json?sort=top&t=day&limit=40',
        'https://www.reddit.com/r/memes/top/.json?sort=top&t=day&limit=100',
        'https://www.reddit.com/r/meirl/top/.json?sort=top&t=day&limit=100',
        'https://www.reddit.com/r/dankmemes/top/.json?sort=top&t=day&limit=100',
        'https://www.reddit.com/r/2meirl4meirl/top/.json?sort=top&t=day&limit=100',
        'https://www.reddit.com/r/PrequelMemes/top/.json?sort=top&t=day&limit=100',
        'https://www.reddit.com/r/surrealmemes/top/.json?sort=top&t=week&limit=100',
        'https://www.reddit.com/r/DeepFriedMemes/top/.json?sort=top&t=day&limit=100'
    ];

    let sub = subs[Math.floor(Math.random() * subs.length)]
    let limit = sub.split('limit=')[1];
    const res = await axios.get(sub);
    const posts = res.data.children.filter(post => post.data.post_hint === 'image');
    return posts[Math.floor(Math.random() * Number(limit) - 1)];
}

client.on("ready", () => {
    // This event will run if the bot starts, and logs in, successfully.
    console.log(`Logged in as ${client.user.tag}!`);
    // Example of changing the bot's playing game to something useful. `client.user` is what the
    // docs refer to as the "ClientUser".
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildCreate", guild => {
    // This event triggers when the bot joins a guild.
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
    // this event triggers when the bot is removed from a guild.
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    client.user.setActivity(`Serving ${client.guilds.size} servers`);
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
        post = await getRedditPost()
        const embed = new Discord.MessageEmbed()
            .setTitle(post.data.title)
            .setColor(0xff0000)
            .setImage(post.data.url)
            .setFooter(` ${post.data.ups} - 💬 ${post.data.num_comments} | ${post.data.subreddit}`)
        message.channel.send(embed);
    }

    if (command === 'start') {
        if (!message.member.hasPermission('MANAGE_GUILD')) {
            message.reply('You do not have permissions for using this command.')
        }

        post = getRedditPost()

    }
});

client.login(TOKEN);