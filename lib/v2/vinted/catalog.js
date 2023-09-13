const got = require('@/utils/got');
const cheerio = require('cheerio');
// const { parseDate } = require('@/utils/parse-date');
const { art } = require('@/utils/render');
const path = require('path');

module.exports = async (ctx) => {
    let search_text = ctx.params.search_text;
    search_text = search_text.replaceAll('___', '&');

    const url = `https://www.vinted.fr/catalog?${search_text.replace('___', '&')}`;

    const pagedata = await got({
        method: 'get',
        url,
    });

    const $ = cheerio.load(pagedata.data);
    const reponse = JSON.parse($('script[data-js-react-on-rails-store=MainStore]').text());
    const list = Object.values(reponse.items.catalogItems.byId);

    let feedTitle = reponse.catalogFilters.filters.query;

    if (feedTitle === null || feedTitle.trim() === '') {
        feedTitle = reponse.catalogFilters.filters.catalogIds;
    }

    ctx.state.data = {
        title: `Vinted | ${feedTitle}`,
        link: url,
        item: list.map((item) => {
            const title = `${item.brand_title} | ${item.title}`;
            const author = item.user.login;
            return {
                title,
                description: art(path.join(__dirname, 'templates/description.art'), {
                    vdescription: item.title,
                    size: item.size_title,
                    price: item.total_item_price.amount + ' ' + item.total_item_price.currency_code,
                    image: item.photo.url,
                }),
                pubDate: Date.now,
                link: item.url,
                author,
            };
        }),
    };
};
