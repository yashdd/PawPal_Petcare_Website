import express from "express";
import institutionDataFunctions from "../data/institutions.js";
import bcrypt from 'bcryptjs';
import { ObjectId }  from 'mongodb';
import {institutions} from '../config/mongoCollections.js'

const router = express.Router();

router.route('/').get(async(req,res) => {
    try {
        res.render('institution_registration');
    } catch (error) {
        res.status(404).json(error);
    }
    }).post(async (req, res) => {
        try{
        const institute_info = req.body;
            if (!institute_info || Object.keys(institute_info).length === 0) {
            return res
            .status(400)
            .json({error: 'There are no fields in the request body'});
        }
        if(!institute_info.hashedPassword){
            res.send("Password Not Entered")
        }
        if(institute_info.hashedPassword.trim()===""){
            res.send('Only empty spaces')
        }
        if(institute_info.hashedPassword.length < 8){
            res.send('Minimum 8 characters required for password')
        }
        institute_info.hashedPassword = institute_info.hashedPassword.trim()
        if(!/[A-Za-z]/.test(institute_info.hashedPassword)){
            res.send('Should contain atleast one character')
        }
        if(!/\d/.test(institute_info.hashedPassword)){
            res.send('Should contain atleast one numeric character')
        }
        if(!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(institute_info.hashedPassword)){
            res.send('Should contain atleast one special character')
        }
        if(!institute_info.confirmhashedPassword){
            res.send('Please enter the password again')
        }
        if(institute_info.confirmhashedPassword.trim()===""){
            res.send('Only empty spaces')
        }
        if(institute_info.hashedPassword!== institute_info.confirmhashedPassword ){
            res.send('Passwords donot match')
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(institute_info.hashedPassword || '',salt);
        const confirmhashPassword = await bcrypt.hash(institute_info.confirmhashedPassword || '',salt);
        if (!hashPassword || !confirmhashPassword) {
            res.send('Failed to hash password');
        }
        if(!institute_info.name || !institute_info.email || !institute_info.state || !institute_info.city  || !institute_info.address){
            res.send('Some fields are missing')
        }
        if(typeof institute_info.name!== 'string' || typeof institute_info.email!== 'string' || typeof institute_info.state!== 'string' || typeof institute_info.city!== 'string' || 
        typeof institute_info.address!=='string'){
            res.send('Some fields are not strings')
        }
        if (!Array.isArray(institute_info.services)){
            res.send('Services should be of type array')
        }
        for(let i=0;i<institute_info.services.length;i++){
            if(institute_info.services[i].trim() === ""){
                res.send('Only empty spaces not allowed')
            }
        }
        const institution = await institutionDataFunctions.institutionRegistration(institute_info.name,institute_info.email,institute_info.services,institute_info.address,
            institute_info.city , institute_info.state,hashPassword,confirmhashPassword);
        return res.status(200).json(institution);
        }
        catch(error){
            console.log(error)
            return res.status(500).json(error);
        }

    })

    router.route('/dashboard').get(async(req,res) => {
        try {
            res.render('institution_dashboard');
        } catch (error) {
            res.status(404).json(error);
        }})

    router.route('/update/:id').get(async(req,res) => {
        try {
            const institutionID = req.params.id;
            // institutionID = new Object(institutionID);  
            // console.log(institutionID)
            const institution = await institutions()
            const current_institution = await institution.findOne({_id:new ObjectId(institutionID)})
            
            if(!current_institution){
                res.send("Institution not found")
            }
            const institution_current_data = {
                name:current_institution.name,
                email:current_institution.email,
                services:current_institution.services,
                address:current_institution.address,
                city:current_institution.city,
                state:current_institution.state

            }
            res.render('institution_update',{institutionID,institution_current_data});
        } catch (error) {
            res.status(404).json(error);
        }}).post(async(req,res) => {
            try{
            const institutionID = req.params.id;
            const updatedFields = req.body;
            const institution = await institutions()
            const current_institution = await institution.findOne({_id:new ObjectId(institutionID)})
            if(!current_institution){
                res.send("Institution not found")
            }
            const institution_id_pass = new ObjectId(institutionID)
            const updatedInstitution = await institutionDataFunctions.updateInstitutionDetails(institution_id_pass,updatedFields);  
            if(!updatedInstitution){
                res.send('Update Failed');
            }
            return res.status(200).json(updatedInstitution);
        }
        catch(error){
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        });

    export default router;