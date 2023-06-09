const MongoClient = require('mongodb').MongoClient
const bcrypt = require("bcrypt");
const session = require("express-session");
const randomstring = require("randomstring");
const nodemailer = require("nodemailer");

const ServiceProvider = require("../models/spModel");
const User = require("../models/userModel");
const config = require("../config/config");
const sendMail = require("../utils/sendEmail");
const Services = require('../models/serviceModel');
const Chat = require("../models/chatModel");
const Review = require("../models/reviewModel");
const Natural = require("../models/natural");
const natural = require('../models/natural');






// bycrpt password
const securePassword = (password)=>{
    try {
        const hashedPassword = bcrypt.hash(password,10);
        return hashedPassword;
    } catch (error) {
        console.log(error.message);
    }
}
// signup
const getSignup = (req,res,next) =>{
    try {
        res.render("spSignup",{
            pageTitle:"Signup"
        })
    } catch (error) {
        console.log(error.message);
    }
}
// create new user
const createNewUser = async(req,res,next)=>{
    try{
        const hashPassword = await securePassword (req.body.password);
        const user = new ServiceProvider({
            serviceName:req.body.serviceName,
            email : req.body.email,
            Address: req.body.Address,
            phoneNumber:req.body.phoneNumber,
            password : hashPassword,
            category:req.body.category,
        });
        const userData = await user.save();
        console.log(userData._id)
        if(userData){
            sendMail.sendSPVerificationMail(req.body.email,userData._id)
            res.render("spSignin",{pageTitle:"Signin",message:"your registration has been successfully Please verfiy your email"});
        }
        else{
            res.render("spSignup",{pageTitle:"Signup",message:"your registration has been failed"})
        }
    } catch(err) {
        console.log(err.message)
    }
}
//verify your email
const verifyMail = async(req,res,next)=>{
    try {
        const updateinfo = await ServiceProvider.updateOne({_id:req.query.id},{$set:{is_varified:1 }});
        console.log(updateinfo);
        res.render("spVerifyEmail")
    } catch (error) {
        console.log(error.message);
    }
}
// login 
const getSignin =(req,res,next)=>{
    try {
        try {
            res.render("spSignin",{
                pageTitle:"Signin",
            })
        } catch (error) {
            console.log(error.message);
        }
    } catch (error) {
        console.log(error.message)
    }
}
const postSignin = async(req,res,next)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userData = await ServiceProvider.findOne({email:email})
        if(userData){
            const passwordMatch = await bcrypt.compare(password,userData.password);
            if (passwordMatch){
                if(userData.is_varified === 0){
                    res.render("spSignin",{pageTitle:"Signin",message:"please verify your Email"})
                }
                else{
                req.session.serviceProvider_id = userData._id
                res.redirect("/HomeSPAfterlogin")
                }
            }
            else{
                res.render("spSignin",{pageTitle:"Signin",message:"email and password is incorrect"})
            }
        }
        else{
            res.render("spSignin",{pageTitle:"Signin",message:"email and password is incorrect"})
        }
    } catch (error) {
        console.log(error.message)
    }
}
// logout
const userlogout = (req,res,next)=>{
    try {
        if(req.session){

            req.session.destroy((error)=>{
                if(error){
                    console.log(error);
                }
            });
        }
        res.redirect("/")
    } catch (error) {
        console.log(error.message)
    }
}
//forget password
const getforget_Password = (req,res,next)=>{
    try {
        res.render('spforgetPassword',{
            pageTitle:"ForgetPassword"
        });
    } catch (error) {
        console.log(error)
        
    }
    
}
const postforget_Password = async(req,res,next)=>{
    try {
        const email = req.body.email;
        const userData =  await ServiceProvider.findOne({email:email});
        console.log(userData.email)
        if(userData)
        {
            const randomString = randomstring.generate();
            const updatedData = ServiceProvider.updateOne({email:email},{$set:{token:randomString}});
            sendMail.sendSPResetPasswordMail(userData.email,randomString);
            res.render('spforgetPassword',{pageTitle:"ForgetPassword",message:"please check your email"})
        }
        else{
            res.render('spforgetPassword',{pageTitle:"ForgtPassword",message:"user email is incorrect"})
        }
    } catch (error) {
        console.log(error.message)
    }

}
const getReset_Password = async(req,res,next)=>{
    try {
        const token = req.query.token;

        const tokenData =  ServiceProvider.findOne({token:token});
        if(tokenData){
            res.render("spresetPassword",{pageTitle:"ResetPassword",serviceProvider_id:tokenData._id});
        }
        else{
            res.render("sp404",{message:"token is invalid"});
        }
    } catch (error) {
        console.log(error.message);
    }
        
}
const postReset_Password = async(req,res,next)=>{
    try {
        const new_password = req.body.new_password;
        const user_id = req.body.serviceProvider_id;
        const  hashedPassword = await securePassword(new_password);
        await User.updateOne({ _id:user_id},{$set:{ password:hashedPassword,token:""}});
        res.redirect("/spSignin",{message:"password has been reseted"})  
        
    } catch (error) {
        console.log(error)
    }
}

//user profile
const getUserProfile = async(req,res,next)=>{
    try {
        const userData = await ServiceProvider.findById({_id:req.session.serviceProvider_id});
        res.render('spProfile',{user:userData});
    } catch (error) {
        console.log(error.message)
    }
}
const editUserProfile = async(req,res,next)=>{
    try {
        
        const userData = await ServiceProvider.findById({_id:req.session.serviceProvider_id});
        if(userData){
            res.render("spSetting",{user:userData})
        }
        else{
            res.redirect("/HomeSPAfterlogin")
        }
    } catch (error) {
        console.log(error.message)
    }
}
const updateProfile = async(req,res,next)=>{
    try {
        req.body.serviceProvider_id = req.session.serviceProvider_id
        console.log(req.body.serviceProvider_id);
        const userData = await ServiceProvider.findByIdAndUpdate({_id:req.body.serviceProvider_id},{$set:{serviceName:req.body.serviceName,email:req.body.email,phoneNumber:req.body.phoneNumber,Address:req.body.Address}})
        res.redirect("/HomeSPAfterlogin")
    } catch (error) {
        console.log(error.message)
    }
}
const deleteUserAccount = async(req,res,next)=>{
    if(req.body.serviceProvider_id === req.session.serviceProvider_id){
    try {
        console.log(req.body.serviceProvider_id);
        await ServiceProvider.findByIdAndDelete({_id:req.body.serviceProvider_id});
        res.redirect("/")
    } catch (error) {
        console.log(error.message)
    }
}
}
// change password
const updatePassword = async(req,res,next)=>{
    try {
        const id = req.session.serviceProvider_id;
        const old_password = req.body.old_password
        const new_password = req.body.new_password
        const userData = await User.findById({_id:id})
        
        if (userData) {
            const passwordMatch = await bcrypt.compare(old_password,userData.password)
            if (passwordMatch){
                console.log(new_password)
                const hashedPassword = await securePassword(new_password)
                await User.updateOne({_id:userData._id},{$set:{password:hashedPassword}});
                req.session.serviceProvider_id = userData._id
                
                res.redirect("/HomeSPAfterlogin");
                
            }
            else{
                res.redirect("/setting",{message:"password is incorrect"});
            }
        }
        else{
            res.redirect("/setting",{message:"password is incorrect"});
        }
    } catch (error) {
        console.log(error)
    }
}
// reset verification email
const getVerification = (req,res,next)=>
{
    try {
        res.render("spVerification",{pageTitle:"verification Email"});
    } 
    catch (error) {
        console.log(error.message);
    }
}
const sendVerificationLink = async (req,res,next)=>{
    try {
        const email = req.body.email;
        const userData = await ServiceProvider.findOne({email:email});
        console.log(userData.email)
        if(userData){
            sendMail.sendSPVerificationMail(userData.email,userData._id);
            res.render("spSignin",{pageTitle:"Signin",message:"Reset verification Mail"});
        }
        else{
            res.render("spVerification",{pageTitle:"verification Email",message:"this mail is not exist"})
        }
    } 
    catch (error) {
        console.log(error.message);
    }
}
//create post
const getPartnerOffer = async (req,res,next)=>{
    try {
        const id = req.session.serviceProvider_id
        const userData = await ServiceProvider.findById({_id:id})
        // console.log(userData.category);
        const users = await Services.find({category:userData.category});
        // console.log(users);
        res.render("HomeSPAfterlogin",{data:users});

    } catch (error) {
        console.log(error.message);
    }
}
// to get sp profile
// const HotelPost = async(req,res,next)=>{
//     try {
//         // const id = req.session.serviceProvider_id
//         // const userData = await ServiceProvider.findById({_id:id})
//         // console.log(userData.serviceName); 
        
//         // MongoClient.connect('mongodb://127.0.0.1:27017' ,{useNewUrlParser: true}, (err, client)=> {
//         //     var database = client.db("mydatabase");
//         //     database.collection("Hotel").distinct("serviceName").then(users =>{
//         //         console.log(users)
//         //     ServiceProvider.findOne({serviceName:users}).then(user =>{
//         //             console.log(user._id)
        
//                     //try {
//                         const userData = await Services.findOne({category:"Hotel"});
//                         console.log(userData.serviceName);
//                         const data = await ServiceProvider.findOne({serviceName:userData.serviceName});
//                         console.log(data);
//                         res.render('sp_profile_forClient',{user:data});
//                         // const userData = ServiceProvider.findOne({_id:user._id});
//                         // console.log(userData.email)
//                         // res.render('sp_profile_forClient',{users:userData});
//     //                 } catch (error) {
//     //                     console.log(error.message)
//     // //                 }
//     //         })
//     //     })
//     // })
//                 //res.render("hotel",{data:users});
            
        
//         // const data = Hotel.findOne()
//         // console.log(data)
//         // if(data){
//         //     res.redirect("/hotel")
//         //}
//                     // }
//                 } 
//     catch (error) {
//         console.log(error.message);
//     }
// }
// const createPost = async(req,res,next)=>{
//     try {
//         const data = req.body
//         const id = req.session.serviceProvider_id
//         const userData = await ServiceProvider.findById({_id:id})
//         console.log(userData.category);
//         MongoClient.connect('mongodb://127.0.0.1:27017' ,{useNewUrlParser: true}, (err, client)=> {
//             var database = client.db("mydatabase");
//             database.collection(userData.category).insertOne({
//             offerTitle:req.body.offerTitle,
//             postDetails:req.body.postDetails,
//             price:req.body.price,
//             serviceName:userData.serviceName,
//             image:req.file.filename
//         })
//         })
//         //sendMail.sendAdminNotifyMail(data)
//         res.redirect("/HomeSPAfterlogin")
        
//     } catch (error) {
//         console.log(error.message);
//     }
// }
const spCreatePost = async(req,res,next)=>{
    try {
        const id = req.session.serviceProvider_id
        const userData = await ServiceProvider.findById({_id:id})
        console.log(userData._id);
            const service = new Services({

                offerTitle :req.body.offerTitle,
                postDetails:req.body.postDetails,
                price:req.body.price,
                category:userData.category,
                serviceName:userData.serviceName,
                sp_id:userData._id,
                image:req.file.filename
            });
            const post = await service.save();
            console.log(post)
            if(post){
               // sendMail.sendAdminNotifyMail(post.offerTitle,post.postDetails,post.price,post.category,post.serviceName,req.file.filename);
                res.redirect("/HomeSPAfterlogin")
            }
            else{
                console.log("error when creating post");
            }
            // await sendMail.sendAdminNotifyMail(userData._id,req.body.offerTitle,req.body.postDetails,req.body.price,userData.category,userData.serviceName,req.file.filename);
            // res.redirect("/HomeSPAfterlogin");
            // if(userData.AcceptOffer === 1){
            //     const post = await service.save();
            //     console.log(post);
            //     userData.AcceptOffer = 0;
            // }
            //     else{
            //     console.log("error");
            // }
        
            
        //     const post = await service.save();
        //     console.log(post)
        //     if(post){
        //        // sendMail.sendAdminNotifyMail(post.offerTitle,post.postDetails,post.price,post.category,post.serviceName,req.file.filename);
        //         res.redirect("/HomeSPAfterlogin")
        //     }
        //     else{
        //         console.log("error when creating post");
        //     }
        // }
        
    } catch (error) {
        console.log(error.message);
    }
}

const AcceptOffer = async(req,res,next)=>{
    try {
        const updateinfo = await ServiceProvider.updateOne({_id:req.query.id},{$set:{OfferAccepted:1} });
        console.log(updateinfo);
        res.render("spVerifyEmail")
    } catch (error) {
        console.log(error.message);
    }
}
//get sp Profile for client
const getSPProfile_forClient = async(req,res,next)=>{
    try {
        const id = req.params.id
        const data = await ServiceProvider.findById({_id:id});
        res.render('sp_profile_forClient',{user:data});
    } catch (error) {
        console.log(error)
    }
}
// const hotelProfile = async (req,res,next)=>{
//     try {
//             const userData = await Services.findOne({category:"Hotel"});
//             console.log(userData);
//             const data = await ServiceProvider.findOne({serviceName:userData.serviceName});
//             console.log(data);
//             res.render('sp_profile_forClient',{user:data});
        
//     } catch (error) {
//         console.log(error.message);
//     }
// }
// const cinemaProfile  = async(req,res,next)=>{
//     try {
//         const userData = await Services.findOne({category:"Cinema"});
//             console.log(userData._id);
//             const service = await ServiceProvider.findOne({serviceName:userData.serviceName})
//             const data = await ServiceProvider.findById({_id:service._id});
//             console.log(service._id);
//             res.render('sp_profile_forClient',{user:data}); 
//     } catch (error) {
//         console.log(error)
//     }
// }
// const bazzarProfile  = async(req,res,next)=>{
//     try {
//         const userData = await Services.findOne({category:"Bazaar"});
//             console.log(userData._id);
//             const service = await ServiceProvider.findOne({serviceName:userData.serviceName})
//             const data = await ServiceProvider.findById({_id:service._id});
//             console.log(service._id);
//             res.render('sp_profile_forClient',{user:data}); 
//     } catch (error) {
//         console.log(error)
//     }
// }
// const restorProfile  = async(req,res,next)=>{
//     try {
//         const userData = await Services.findOne({category:"Resort & Village"});
//             console.log(userData._id);
//             const service = await ServiceProvider.findOne({serviceName:userData.serviceName})
//             const data = await ServiceProvider.findById({_id:service._id});
//             console.log(service._id);
//             res.render('sp_profile_forClient',{user:data}); 
//     } catch (error) {
//         console.log(error)
//     }
// }
// const naturalProfile  = async(req,res,next)=>{
//     try {
//         const userData = await Services.findOne({category:"Natural Preserve"});
//             console.log(userData._id);
//             const service = await ServiceProvider.findOne({serviceName:userData.serviceName})
//             const data = await ServiceProvider.findById({_id:service._id});
//             console.log(service._id);
//             res.render('sp_profile_forClient',{user:data}); 
//     } catch (error) {
//         console.log(error)
//     }
// }
// const toursimProfile  = async(req,res,next)=>{
//     try {
//         const userData = await Services.findOne({category:"Tourism Company"});
//             console.log(userData._id);
//             const service = await ServiceProvider.findOne({serviceName:userData.serviceName})
//             const data = await ServiceProvider.findById({_id:service._id});
//             console.log(service._id);
//             res.render('sp_profile_forClient',{user:data}); 
//     } catch (error) {
//         console.log(error)
//     }
// }
// const asiteProfile  = async(req,res,next)=>{
//     try {
//         const userData = await Services.findOne({category:"Archaeological Site"});
//             console.log(userData._id);
//             const service = await ServiceProvider.findOne({serviceName:userData.serviceName})
//             const data = await ServiceProvider.findById({_id:service._id});
//             console.log(service._id);
//             res.render('sp_profile_forClient',{user:data}); 
//     } catch (error) {
//         console.log(error)
//     }
// }
// const resturantProfile  = async(req,res,next)=>{
//     try {
//         const userData = await Services.findOne({category:"Restaurant & Cafe"});
//             console.log(userData._id);
//             const service = await ServiceProvider.findOne({serviceName:userData.serviceName})
//             const data = await ServiceProvider.findById({_id:service._id});
//             console.log(service._id);
//             res.render('sp_profile_forClient',{user:data}); 
//     } catch (error) {
//         console.log(error)
//     }
// }
// const TransportationProfile  = async(req,res,next)=>{
//     try {
//         const userData = await Services.findOne({category:"Transportation Company"});
//             console.log(userData._id);
//             const service = await ServiceProvider.findOne({serviceName:userData.serviceName})
//             const data = await ServiceProvider.findById({_id:service._id});
//             console.log(service._id);
//             res.render('sp_profile_forClient',{user:data}); 
//     } catch (error) {
//         console.log(error)
//     }
// }
const getRate = async (req,res,next)=>{
    try {
        const id = req.session.serviceProvider_id;
        const data = await Review.find({sp_id:id});
        console.log(data)
        res.render("spReview",{data:data})
    } catch (error) {
        console.log(error.message);
    }
}

const Load_Chat = async(req,res,next)=>{
    try {
            const user = await ServiceProvider.findById({_id:req.session.serviceProvider_id});
            const data = await User.find();
            console.log(data);
            res.render("spChat",{
                user:user,
                users:data
            
        }) 
        
    } catch (error) {
        console.log(error.message);
    }
}

const saveChat = async(req,res,next)=>{
    try {
        const chat = new Chat({
            sender_id :req.body.sender_id,
            receiver_id:req.body.receiver_id,
            message:req.body.message
        })
        const newChat = await chat.save();
        res.status(200).send({success:true,msg:"chat inserted",data:newChat});
    } catch (error) {
        res.status(400).send({success:false,msg:error.message});
    }
}

module.exports ={
    getSignup,
    createNewUser,
    verifyMail,
    getSignin,
    postSignin,
    userlogout,
    getforget_Password,
    postforget_Password,
    getReset_Password,
    postReset_Password,
    getUserProfile,
    editUserProfile,
    updateProfile,
    deleteUserAccount,
    updatePassword,
    getVerification,
    sendVerificationLink,
    getPartnerOffer,
    getRate,
    spCreatePost,
    getSPProfile_forClient,
    Load_Chat,
    saveChat,
    AcceptOffer

    
}