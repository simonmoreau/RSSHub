module.exports = (router) => {
    router.get('/catalog/:search_text?', require('./catalog'));
};
