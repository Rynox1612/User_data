const express=require("express");
const app=express(); 
const path=require("path");
const mysql=require("mysql2");

const connection=mysql.createConnection({
    host:"localhost",
    user:"",
    password:"",
    database:"college"
});




app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"public")));

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
            console.log(user);
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
            console.log(user);
        })
    }catch{
        console.log(err);
    }
});

app.patch("/user/:id",(req,res)=>{
    console.log("patch req is working");
})