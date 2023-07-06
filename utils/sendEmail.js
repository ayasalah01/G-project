const nodemailer = require('nodemailer');
const config = require("../config/config");

// send user verify email
const sendVerificationEmail = (email,user_id)=>{
    try {
        const transporter = nodemailer.createTransport
        ({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.passwordUser
            }
        });
            const mailOptions = {
                from: config.emailUser,
                to: email,
                subject: 'For verification Mail',
                html:'<p>Hi please click here to <a href="http://localhost:3000/verify?id='+user_id+'">Verify</a> your Email.</p>'
            };
            
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            })

    } catch (error) {
        console.log(error)
    }

}

//send sp verify mail
const sendSPVerificationMail = (email,serviceProvider_id)=>{
    try {
        const transporter = nodemailer.createTransport
        ({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.passwordUser
            }
        });
            const mailOptions = {
                from: config.emailUser,
                to: email,
                subject: 'For verification Mail',
                html:'<p>Hi please click here to <a href="http://localhost:3000/spVerify?id='+serviceProvider_id+'">Verify</a> your Email.</p>'
            };
            
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            })

    } catch (error) {
        console.log(error)
    }

}

//send user mail Resetpassword
const sendResetPasswordMail = (email,token)=>{
    try {
        const transporter = nodemailer.createTransport
        ({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.passwordUser
            }
    });
            const mailOptions = {
                from: config.emailUser,
                to: email,
                subject: 'password Reset',
                html:'<p>Hi please click here to <a href="http://localhost:3000/resetPassword?token='+token+'">Reset</a> your password.</p>'
            };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            })
} catch (error) {
        console.log(error)
}
}
// send sp mail Resetpassword
const sendSPResetPasswordMail = (email,token)=>{
    try {
        const transporter = nodemailer.createTransport
        ({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.passwordUser
            }
        });
            const mailOptions = {
                from: config.emailUser,
                to: email,
                subject: 'password Reset',
                html:'<p>Hi please click here to <a href="http://localhost:3000/spresetPassword?token='+token+'">Reset</a> your password.</p>'
            };
            
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            })
    } catch (error) {
        console.log(error)
    }
}
// send notify mail for admin
const sendAdminNotifyMail = (sp_id,title,details,price,category,serviceName,image)=>{
    try {
        const transporter = nodemailer.createTransport
        ({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.passwordUser
            }
        });
            const mailOptions = {
                from: config.emailUser,
                to: "ayas66223@gmail.com",
                subject: 'partner created new post offer',
                html:
                '<h3> OFFer Details</h3><p>offerTitle:'+title+'<br>postDetails:'+details+'<br>price:'+price+'<br>category:'+category+'<br>serviceName:'+serviceName+'<br>image:'+image+'<br>'+'Hi if you accept infromation order click here to <a href="http://localhost:3000/Accept?id='+sp_id+'">Accept</a>the Order .'+'<p>'
            };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            })

    } catch (error) {
        console.log(error)
    }

}
// send notfiy mail for sp who create offer
const sendSPNotifyMail = (email,username)=>{
    try {
        const transporter = nodemailer.createTransport
        ({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.passwordUser
            }
        });
            const mailOptions = {
                from: config.emailUser,
                to: email,
                subject: 'Notification Mail For New Oder',
                html:`Hi We received a request to create new order on your MTGY Account from ${username} user. `
            };
            
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            })

    } catch (error) {
        console.log(error)
    }

}
//send notfiy mail for sp who pay for order
const sendSPNotifyMailforPay = (email,username)=>{
    try {
        const transporter = nodemailer.createTransport
        ({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emailUser,
                pass:config.passwordUser
            }
        });
            const mailOptions = {
                from: config.emailUser,
                to: email,
                subject: 'Notification Mail For Payment ',
                html:`Hi We received a new payment process on your MTGY Account from ${username} user. `
            };
            
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            })

    } catch (error) {
        console.log(error)
    }

}
//
// const sendAdminMail = (title,details,price,category,serviceName,image)=>{
//     try {
//         const transporter = nodemailer.createTransport
//         ({
//             host:'smtp.gmail.com',
//             port:587,
//             secure:false,
//             requireTLS:true,
//             auth:{
//                 user:config.emailUser,
//                 pass:config.passwordUser
//             }
//         });
//             const mailOptions = {
//                 from: config.emailUser,
//                 to: "ayas66223@gmail.com",
//                 subject: 'partner created new post offer',
//                 html:
//                 '<h3> OFFer Details</h3><p>offerTitle:'+title+'<br>postDetails:'+details+'<br>price:'+price+'<br>category:'+category+'<br>serviceName:'+serviceName+'<br>image:'+image+'<p>'
//             };
//             transporter.sendMail(mailOptions, function(error, info){
//                 if (error) {
//                     console.log(error);
//                 } else {
//                     console.log('Email sent: ' + info.response);
//                 }
//             })

//     } catch (error) {
//         console.log(error)
//     }

// }
module.exports = {
    sendVerificationEmail,
    sendSPVerificationMail,
    sendResetPasswordMail,
    sendSPResetPasswordMail,
    sendAdminNotifyMail,
    sendSPNotifyMail,
    sendSPNotifyMailforPay
}