
const getHome = (req,res,next) =>{
    try {
        res.render("home1");
    } catch (error) {
        console.log(error.message);
    }
}
const getHomeAfterlogin = (req,res,next) =>{
    try {
        res.render("HomeAfterlogin");
    } catch (error) {
        console.log(error.message);
    }
}
const getHomeSPAfterlogin = (req,res,next) =>{
    try {
        res.render("HomeSPAfterlogin");
    } catch (error) {
        console.log(error.message);
    }
}

module.exports ={
    getHome,
    getHomeAfterlogin,
    getHomeSPAfterlogin
}