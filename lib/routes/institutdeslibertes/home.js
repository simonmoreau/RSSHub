/* eslint-disable linebreak-style */
const got = require('@/utils/got');
const cheerio = require('cheerio');
const parser = require('@/utils/rss-parser');

module.exports = async (ctx) => {
    const feed = await parser.parseURL('https://institutdeslibertes.org/feed/');

    const ProcessFeed = async (link) => {
        const response = await got({
            method: 'get',
            url: link,
        });

        const $ = cheerio.load(response.data);

        // 提取内容
        return $('.page-content__data').html();
    };

    const items = await Promise.all(
        feed.items.map(async (item) => {
            const cache = await ctx.cache.get(item.link);
            if (cache) {
                return Promise.resolve(JSON.parse(cache));
            }

            const description = await ProcessFeed(item.link);

            const single = {
                title: item.title,
                description,
                pubDate: item.pubDate,
                link: item.link,
                author: item.author,
            };
            ctx.cache.set(item.link, JSON.stringify(single));
            return Promise.resolve(single);
        })
    );

    ctx.state.data = {
        title: feed.title,
        link: feed.link,
        description: feed.description,
        item: items,
    };
};
