const User = require("../model/userModel");
const bcrypt = require("bcrypt");

async function getRegister(req,res){
    try{
        res.render("register.ejs");
    }
    catch(err){
        console.log(err.message);
    }
}

async function postRegister(req,res){
    try{

        let passwordHash = await bcrypt.hash(req.body.password,10);
        let pfpImagePath = null       // if file comes undefined on not uploading
        if(req.file){
             pfpImagePath = `${Date.now()}-${req.file.filename}`;
        }
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: passwordHash,
            pfpImage: pfpImagePath,

        })
            await newUser.save();
            res.render("register.ejs",{
                successReg:"Registration successfull",
            });
    }
    catch(err){
        console.log(err.message)
    }
}

async function getLogin (req,res){
    try{
        res.render("login.ejs")
    }
    catch(err){
        console.log(err.message)
    }
}

async function postLogin(req,res){
    try{
        const {email,password} = req.body;
        const findUser = await User.findOne({email:email});
        if(findUser){
            const comparePassword = await bcrypt.compare(password,findUser.password);
            if(comparePassword){
                req.session.storeUser = findUser // storing whole user content to storeUser varibale 
                res.redirect("/dashboard");
            }
            else{
                res.render("login.ejs",{
                    deniedLogin:"entered password is incorrect"
                }) 
            }
        }
        else{
            res.render("login.ejs",{
                deniedLogin : "user not exists"
            })
        }
    }
    catch(err){
        console.log(err.message)
    }
}

async function getLogout (req,res){
    try{
        req.session.destroy()   //Destroy the client abruptly with the given err. All the pending and running requests will be asynchronously aborted and error
        res.redirect("/login.ejs")
    }
    catch(err){
        console.log(err.message)
    }
}

async function getDashBoard (req,res){
    try{
        // to load all users on dashboard except currentUser so nin -> not in arr ie. finding id of users that is not in session
        const users = await User.find({_id:{$nin:[req.session.storeUser]}})

        res.render("dashboard.ejs",{
            currentUser : req.session.storeUser,
            users:users,
        })
    }
    catch(err){
        console.log(err.message)
    }
}

module.exports = {
    getRegister,
    postRegister,
    getLogin,
    postLogin,
    getLogout,
    getDashBoard,
}