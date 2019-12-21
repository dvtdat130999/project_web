
exports.getIndex = (req, res, next) =>  {
    if(typeof req.user == 'undefined')
        res.redirect('/login');
    else
    {
        if(req.user.author === 'admin')
            res.redirect('/shop');
        else
            res.redirect('/products')
    }
}