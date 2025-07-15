const express=require("express");
const app=express(); 
const path=require("path");
const mysql=require("mysql2");
require('dotenv').config();
var methodOverride = require('method-override');


const dbPassword = process.env.DB_PASSWORD;
const dbUser=process.env.DB_USER;
const dbName=process.env.DB_NAME;

const connection=mysql.createConnection({
    host:"localhost",
    user:dbUser,
    password:dbPassword,
    database:dbName
});



app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen("8080",()=>{
    console.log("Server is listening on port 8080");
});

app.get("/",(req,res)=>{
    try{
        connection.query("SELECT COUNT(*) FROM users",(err,result)=>{
            if(err) throw err;
            let userCount=result[0]["COUNT(*)"]
            res.render("home.ejs",{userCount});
        })
    }catch(err){
        console.log(err);
    }
});

app.get("/users",(req,res)=>{
    let q="SELECT id,username,email FROM users"
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let users=result;
            res.render("index.ejs",{users});
        })
    }catch{
        console.log(err);
    }
})

app.get("/user/:id",(req,res)=>{
    let id=req.params.id;
    let q="SELECT id,username,email FROM users WHERE id=?"
    try{
        connection.query(q,id,(err,result)=>{
            if(err) throw err;
            let user=result[0];
            res.render("user.ejs",{user});
        })
    }catch{
        console.log(err);
    }
});

app.get("/user/:id/edit",(req,res)=>{
        let id=req.params.id;
    let q="SELECT id,username,email FROM users WHERE id=?"
    try{
        connection.query(q,id,(err,result)=>{
            if(err) throw err;
            let user=result[0];
            res.render("edit.ejs",{user});
        })
    }catch{
        console.log(err);
    }
});

//MY BULKY CODE

app.patch("/user/:id",(req,res)=>{
    let {id}=req.params;
    let newUsername=req.body.username;
    let password=req.body.password;
    console.log(password);

    try{
        connection.query("SELECT * FROM users WHERE id=?",id,(err,result1)=>{
            let user=result1[0];
            console.log(result1[0].password);
            if(password==result1[0].password){
                let q=`UPDATE users SET username="${newUsername}"  WHERE id = "${id}";`

                try{
                    connection.query(q,(err,result)=>{
                    console.log(result);
                    })
                }catch(err){
                        console.log(err);
                }
                res.redirect(`/user/${id}`);
            }else{
                res.render("edit.ejs",{user,errorMsg: "Incorrect password, try again" });
            }
        });
    }catch(err){
        console.log(err);
    }
});


