/* eslint-disable linebreak-style */
const got = require('@/utils/got');
const cheerio = require('cheerio');
// const parser = require('@/utils/rss-parser');

const fetchPageHtml = async (catalog, brandId) => {
    const url = `https://www.vinted.fr/vetements?size_id[]=208&catalog[]=${catalog}&brand_id[]=${brandId}&order=newest_first`;

    // const url = 'https://www.vinted.fr/vetements?size_id[]=208&catalog[]=1820&brand_id[]=88&order=newest_first';
    // const url = `https://mbasic.facebook.com${linkPath}`;

    const { data: html } = await got.get(url);
    return html;
};

module.exports = async (ctx) => {
    // const feed = await parser.parseURL(url);

    const { catalog, brandid } = ctx.params;
    // const pageId = encodeURIComponent(id);
    // const linkPath = `/${pageId}`;

    const html = await fetchPageHtml(catalog, brandid, ctx.cache);
    const $ = cheerio.load(html);

    const selection = '.feed-grid__item';
    const itemLinks = $(selection)
        .toArray()
        .map((item) => {
            const childSelector = 'a';
            const a = item.find(childSelector);
            return $(a).attr('href');
        });

    return itemLinks;
    //     // console.log(itemLinks);
    // const itemsTzmp = await Promise.all(
    //     itemLinks.map(async (itemLink) => {
    //         console.log(itemLink);
    //     })
    // );

    // const ProcessFeed = async (link) => {
    //     const response = await got({
    //         method: 'get',
    //         url: link,
    //     });

    //     const $ = cheerio.load(response.data);

    //     // 提取内容
    //     return $('.feed-grid__item').html();
    // };

    // const items = await Promise.all(
    //     feed.items.map(async (item) => {
    //         const cache = await ctx.cache.get(item.link);
    //         if (cache) {
    //             return Promise.resolve(JSON.parse(cache));
    //         }

    //         const description = await ProcessFeed(item.link);

    //         const single = {
    //             title: item.title,
    //             description,
    //             pubDate: item.pubDate,
    //             link: item.link,
    //             author: item.author,
    //         };
    //         ctx.cache.set(item.link, JSON.stringify(single));
    //         return Promise.resolve(single);
    //     })
    // );

    // ctx.state.data = {
    //     title: feed.title,
    //     link: feed.link,
    //     description: feed.description,
    //     item: items,
    // };
};
