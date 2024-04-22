import express from "express";
import userDataFunctions from "../data/users.js";
import bcrypt from 'bcryptjs';

const router = express.Router();

router.route('/').get(async(req,res) => {
    try {
        res.render('user_registration');
    } catch (error) {
        res.status(404).json(error);
    }
    }).post(async (req, res) => {
        try {
            const user_info = req.body;
            if (!user_info || Object.keys(user_info).length === 0) {
            return res
            .status(400)
            .json({error: 'There are no fields in the request body'});
        }
        if (!user_info || Object.keys(user_info).length === 0) {
            return res.status(400).json({ error: 'There are no fields in the request body' });
        }
        if (!user_info.password) {
            return res.status(400).send("Password Not Entered"); // Changed res.send to res.status(400).send
        }
        if(!user_info.password){
            return res.status(400).send("Password Not Entered")
        }
        if(user_info.password.trim() === ""){
            return res.status(400).send('Only empty spaces')
        }
        if(user_info.password.length < 8){
            return res.status(400).send('Minimum 8 characters required for password')
        }
       user_info.password = user_info.password.trim()
        if(!/[A-Za-z]/.test(user_info.hashedPassword)){
            return res.status(400).send('Should contain atleast one character')
        }
        if(!/\d/.test(user_info.password)){
            return res.status(400).send('Should contain atleast one numeric character')
        }
        if(!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(user_info.password)){
            return res.status(400).send('Should contain atleast one special character')
        }
        if(!user_info.confirmPassword){
            return res.status(400).send('Please enter the password again')
        }
        if(user_info.confirmPassword.trim()===""){
            return res.status(400).send('Only empty spaces')
        }
        if(user_info.password!== user_info.confirmPassword ){
            return res.status(400).send('Passwords donot match')
        }
        if(user_info.password!==user_info.confirmPassword){
            return res.status(400).send("Passwords must match")
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(user_info.password || '',salt);
        const confirmhashPassword = await bcrypt.hash(user_info.confirmPassword || '',salt);
        if (!hashPassword || !confirmhashPassword) {
            return res.status(400).send('Failed to hash password');
        }

        if(!user_info.firstName || !user_info.lastName || !user_info.email || !user_info.state || !user_info.city || !user_info.gender || !user_info.age){
            return res.status(400).send('Some fields are missing')
        }
        if(typeof user_info.firstName!== 'string' || typeof user_info.lastName!== 'string' || typeof user_info.email!== 'string' || typeof user_info.state!== 'string' || 
        typeof user_info.city!=='string' ||  typeof user_info.gender!=='string'){
            return res.status(400).send('Some fields are not strings')
        }

        const user = await userDataFunctions.userRegistration(user_info.firstName, user_info.lastName,
                user_info.email, user_info.gender, user_info.city, user_info.state, parseInt(user_info.age),hashPassword, confirmhashPassword);
        return res.status(200).json(user);
        } 
        catch (error) {
            console.log(error)
            return res.status(500).json(error);
        }
    

    });
    

export default router