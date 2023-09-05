const got = require('@/utils/got');
const cheerio = require('cheerio');
// const { parseDate } = require('@/utils/parse-date');
const { art } = require('@/utils/render');
const path = require('path');

module.exports = async (ctx) => {
    const search_text = ctx.params.search_text;
    const url = `https://www.vinted.fr/catalog?search_text=${search_text}`;

    const pagedata = await got({
        method: 'get',
        url,
    });

    const $ = cheerio.load(pagedata.data);
    const reponse = JSON.parse($('script[data-js-react-on-rails-store=MainStore]').text());
    const list = Object.values(reponse.items.catalogItems.byId);

    ctx.state.data = {
        title: `Vinted | ${search_text}`,
        link: url,
        item: list.map((item) => {
            const title = `${item.brand_title} | ${item.title}`;
            const author = item.user.login;
            return {
                title,
                description: art(path.join(__dirname, 'templates/description.art'), {
                    vdescription: item.title,
                }),
                pubDate: Date.now,
                link: item.url,
                author,
            };
        }),
    };
};
