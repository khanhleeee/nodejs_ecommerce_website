//[GET] /
const showLoginFB = async(req, res, next) => {
    res.render('TabHome/home', { layout: 'mainClient.hbs' });
}

module.exports = { showLoginFB }