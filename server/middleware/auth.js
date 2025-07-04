function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return res.redirect("/users/dashboard");
    }
    next()
}

function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    return res.redirect("/users/login")
}

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated
};