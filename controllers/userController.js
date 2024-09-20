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
             pfpImagePath = "/images" + req.file.filename;
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

module.exports = {
    getRegister,
    postRegister,
}