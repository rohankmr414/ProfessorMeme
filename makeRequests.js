export function getRedditPost() {
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

    let sub = this.client.randomInArray(subs);
    let limit = sub.split('limit=')[1];
    const res = await this.client.http.get(sub);
    const posts = res.body.data.children.filter(post => post.data.post_hint === 'image');
    return posts[Math.floor(Math.random() * Number(limit) - 1)];
}