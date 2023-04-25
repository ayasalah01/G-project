const isLogin = (req,res,next)=>{
    try {
        if(req.session.user_id){}
        else{
            res.redirect("/")
        }
        next();
    } catch (error) {
        console.log(error.message);
    }
}

const isLogout = (req,res,next)=>{
    try {
        if(req.session.user_id){
            res.redirect("/HomeAfterlogin")
        }
        next();
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    isLogin,
    isLogout
}