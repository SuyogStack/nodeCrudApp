const express = require('express');
const app=express();
const dotenv = require("dotenv");
var bodyParser = require('body-parser');

const connection = require('./config/DB');
dotenv.config();

app.set("view engine","ejs");
app.use(express.static(__dirname+"/public/"));
app.use(express.static(__dirname+"/views"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.get('/',(req,res)=>{
    res.redirect('/create.html')
});

//show data on dashboard
app.get('/data',(req,res)=>{
    connection.query("SELECT * FROM youtube_table",(err,rows)=>{
        if(err){
            console.log(err);
        }else{
            // console.log(rows);
            res.render("read.ejs",{rows});
        }
    });
});

//delete record
app.get('/delete-data',(req,res)=>{
    const deleteQuery="delete from youtube_table where id=?";
    connection.query(deleteQuery,[req.query.id],(err,rows)=>{
        if(err){
            console.log(err);
        }else{
            console.log(rows);
            res.redirect("/data");
        }
    });
});

//set data in edit fome
app.get('/update-data',(req,res)=>{
    connection.query("SELECT * FROM youtube_table where id=?",[req.query.id],(err,eachRow)=>{
        if(err){
            console.log(err);
        }else{
            var result=JSON.parse(JSON.stringify(eachRow[0]));
            console.log(eachRow);
            res.render("edit.ejs",{result});
        }
    });
})

//update
app.post("/final-update",(req,res)=>{

    const id=req.body.id;
    const name=req.body.name;
    const age=req.body.age;
    const email=req.body.email;
    const role=req.body.role;
    const comment=req.body.comment;

    var UpdateQuery ="Update youtube_table set name=?,email=?,age=?,role=?,comment=? where id=?";
    try {
        connection.query(
            UpdateQuery,
            [name, email, age, role, comment,id],
            (err, result) => {
                if (err) {
                    console.log(err);
                    // res.status(500).send("Error inserting data into database");
                } else {
                    console.log("Data Update successfully");
                    // res.status(200).send("Data inserted successfully");
                    res.redirect("/data");
                }
            }
        );
    } catch (err) {
        console.log(err);
        // res.status(500).send("Internal server error");
    }
});

//create
app.post("/add",(req,res)=>{
    const { name, age, email, role, comment } = req.body;

    var InsertQuery ="INSERT INTO youtube_table (name, email, age, role, comment) VALUES (?, ?, ?, ?, ?)";
    try {
        connection.query(
            InsertQuery,
            [name, email, age, role, comment],
            (err, result) => {
                if (err) {
                    console.log(err);
                    // res.status(500).send("Error inserting data into database");
                } else {
                    console.log("Data inserted successfully");
                    // res.status(200).send("Data inserted successfully");
                    res.redirect("/data");
                }
            }
        );
    } catch (err) {
        console.log(err);
        // res.status(500).send("Internal server error");
    }
});



app.listen(process.env.PORT || 6000,(err)=>{
    if(err)
    {
        throw err;
    }else{
        console.log(`SERVER IS RUNNING ON ${process.env.PORT}`);
    }
});