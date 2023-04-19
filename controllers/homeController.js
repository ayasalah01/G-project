
const getHome = (req,res,next) =>{
    try {
        res.render("home1");
    } catch (error) {
        console.log(error.message);
    }
}

module.exports ={
    getHome
}