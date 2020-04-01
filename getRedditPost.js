const axios = require('axios')

module.exports = function () {
    this.makeRequest = async function () {
        let subs = [
            'https://www.reddit.com/r/dankmemes/top/.json?sort=top&t=day&limit=100',
            'https://www.reddit.com/r/memes/top/.json?sort=top&t=day&limit=100',
            'https://www.reddit.com/r/dankmemes/top/.json?sort=top&t=day&limit=100',
            'https://www.reddit.com/r/PrequelMemes/top/.json?sort=top&t=day&limit=100',
            'https://www.reddit.com/r/DeepFriedMemes/top/.json?sort=top&t=day&limit=100'
        ];

        let sub = subs[Math.floor(Math.random() * subs.length)];
        let limit = sub.split('limit=')[1];
        const res = await axios.get(sub);
        const posts = res.data.data.children.filter(post => post.data.post_hint === 'image');
        return posts[Math.floor(Math.random() * Number(limit) - 1)];
    }
}