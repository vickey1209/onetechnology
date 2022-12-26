const express = require('express');
const app = express();
const path = require('path');
const bodyparser = require('body-parser');
const hbs = require ("hbs");
const ejs = require('ejs');
const jwt = require("jsonwebtoken");
const bcrypt = require ("bcryptjs");


require("./db/conn");
const Register = require("./models/registers");
const auth = require('./middleware/auth');


const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname,"../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");


var urlencodedParser = bodyparser.urlencoded({extended:false})
app.use(express.json());

app.use(express.urlencoded({extended:false}));
app.use(express.static(static_path));

app.set("view engine" , "hbs");
app.set("views", template_path);
app.engine("html", require("ejs").renderFile);
hbs.registerPartials(partials_path);


app.get("/", (req, res) =>{
    res.render("index");
});
app.get("/login", (req, res) =>{
    res.render("login");
});

app.get("/register",(req , res) => {
    res.render("register");
  })


  
app.post("/register", async  (req, res) => {
    try {

        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
  
        if (password === cpassword) {
            const registerclient = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password :req.body.password,
                confirmpassword : req.body.cpassword
            })
    console.log("the success part" + registerclient);
             
    const token = await registerclient.generateAuthToken();
    console.log ("the token part" + token); 
  
    
     const registered = await registerclient.save();
    res.status(201).render("index");     
       }
        else {
            res.send("passwords are not matching");
        }
   }catch (error) {
        res.status(400).send(error);
        console.log("the error part page");
    }
  })
  

  app.post("/login", async(req, res) =>{
    try{
        const email = req.body.email;
        const password = req.body.password; 
  
      const useremail = await Register.findOne({email:email});
       
          if(useremail.password === password){
            res.status(201).render("index");
            console.log("login successful");
        }else{
            res.send("invalid login details");
        }
    }catch(e){
        res.status(400).send("invalid login details");
    }
  })

    
  app.get('/logout', (req, res) => {
    console.log("logout successful");
    res.clearCookie('token');
    return res.redirect('/');
   
  });

    
    app.get("/displayuser",(req, res) => {
      Register.find({}, function (err, result) {
     if (err)
     { 
       console.log(err);
     } 
     else
     {
       res.render("displayuser", { details: result });
     }
   });
  });
     

const createToken = async () => {
  const token = await jwt.sign(
    { _id: "62d13d0330e7b3c29b0855de" },
    "mynameisvickeyvishnucharanshrivastavaaaa",
    {
      expiresIn: "20 days",
    }
  );
  console.log(token);

  const userVer = await jwt.verify(
    token,
    "mynameisvickeyvishnucharanshrivastavaaaa"
  );
  console.log(userVer);
};
createToken();

 
app.listen(port, () => {
    console.log(`server is running at port ${port}`);
  });


