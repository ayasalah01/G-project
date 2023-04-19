/* console.log('hello from app js')

const result = require ('./modules/fun.js')
result.add(5,7)
result.sequar(6)

console.log(typeof(result))

const http = require('http')
const body = require('body')
const server = http.createServer((req,res) =>{
    res.setHeader('Content-Type','text/html') 

    if (req.method === 'GET') {
        res.write('<form action ="/" method = "POST">')
        res.write('<input name = "username">')
        res.write('<input type = "submit">')
        res.write('</form>')
        res.end()
    }
    
    else if (req.method === 'POST'){
        body(req,(err,body) =>{
            console.log(body)
            res.end('done')
        })
        /* var body =[]
        req.on('data',(chunk) =>{
            body.push(chunk)
        })
        req.on('end',() =>{
            body= Buffer.concat(body)
            console.log(body)
            res.end('done')
        })

    }
})
server.listen(3000)
*/

const express = require('express')
const path = require('path')

//const MongoClient = require('mongodb').MongoClient
//const assert = require('assert')
const DB_URL = "mongodb://127.0.0.1:27017/mydatabase"

const bodyparser = require('body-parser')
const e = require('express')

const mongoose  = require('mongoose')

const app = express()

//app.use(express.json());

let userSchema = mongoose.Schema({
    name:String,
    age:Number
})


let User = mongoose.model('user', userSchema) // collection users

mongoose.set('strictQuery',false)

/*
MongoClient.connect('mongodb://127.0.0.1:27017' ,{useNewUrlParser: true}, (err, client)=> {
    if (err) return console.log(err);
    var database = client.db("mydatabase");
    console.log("Database connected.");
    client.close();
/*console.log('conntected')
    let db = res.db('first')
    res.close()
})*/


app.set('view engine' , 'ejs')
app.set('views','views')


app.use(express.static(path.join(__dirname,'statics')))     //to use css file 



app.get ('/',(req, res, next) =>{

    //MongoClient.connect('mongodb://127.0.0.1:27017' ,{useNewUrlParser: true}, (err, client)=> {

       // var database = client.db("mydatabase");
        //console.log("Database connected.");
    
       // database.collection('users').find().toArray().then(users =>{
            //console.log(users)
            mongoose.connect(DB_URL,{useNewUrlParser: true},(err)=>{
            User.find((err,users)=>{
                mongoose.disconnect();
                res.render('index',{
                    users:users,
                    pageTitle:"home"
            })
        })
            
        })
    })
    /*
    console.log(req.query)
    res.render('index',{
        pageTitle:"home"
    })*/
app.get('/to-home',(req,res,next)=>{
    res.redirect('/')
})
app.get ('/:name',(req, res, next) =>{
    res.render('index',{
        pageTitle:"Home", //to change page title dynamic
        name:req.params.name
    })
})

app.post('/',bodyparser.urlencoded({extended:true}),(req,res,next) =>{
    mongoose.connect(DB_URL,{useNewUrlParser: true},(err)=>{
        if (err) return console.log(err);
        console.log('connected to database');

        User.updateOne({name:req.body.name},{age:req.body.age},(err,result)=>{
            mongoose.disconnect();
            res.redirect('/')
        })

        //create new object
        /*
        let newUser = new User({
            name:req.body.name,
            age:req.body.age
        })
        newUser.save((err,result)=>{
            console.log(result);
            mongoose.disconnect();
            res.redirect('/')

        })*/

    })
})


    /*
    MongoClient.connect('mongodb://127.0.0.1:27017' ,{useNewUrlParser: true}, (err, client)=> {
    if (err) return console.log(err);
    var database = client.db("mydatabase");
    console.log("Database connected.");
/*
    database.collection('users').insertOne({
        name:req.body.name,
        age: req.body.age
    })
    database.collection('users').deleteOne({
        name:req.body.name
    })
    .then(result =>{
        console.log(result)
        res.redirect('/')
    })
    //client.close()
    })
})
    /*
    mongoose.connect(DB_URL ,{useNewUrlParser:true},(err)=>{
        console.log('connected to database')

        mongoose.disconnect()
    })
})
    /*
    MongoClient.connect('mongodb://localhost:27017', (err,client)=>{
        console.log('connected')
        const db = client.db()

    })
})*/

app.listen(3000, ()=>{
    console.log('hello express')
})