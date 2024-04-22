import express from "express";
import {pets} from '../config/mongoCollections.js'
import petDataFunctions from "../data/pets.js";
import bcrypt from 'bcryptjs';
import { ObjectId }  from 'mongodb';

const router = express.Router();

router.route('/').get(async(req,res) => {
    try {
        res.render('pet_registration');
    } catch (error) {
        res.status(404).json(error);
    }
    }).post(async(req,res) => {

        try{
            const pet_info = req.body;
                if (!pet_info || Object.keys(pet_info).length === 0) {
                return res
                .status(400)
                .json({error: 'There are no fields in the request body'});
            }
            
            pet_info.userID = '661c4cf1a9dec3a78e1d97ed'
            if(!pet_info.name || !pet_info.species || !pet_info.breed || !pet_info.description || !pet_info.userID){
                res.send('Some fields are missing')
            }
            
            if(typeof pet_info.name!== 'string' || typeof pet_info.breed!== 'string' || typeof pet_info.species!== 'string'
                || typeof pet_info.description!== 'string'){
                    res.send('Some fields are not strings')
                }
            if(pet_info.name.trim() === '' || pet_info.breed.trim() === '' || pet_info.species.trim() === '' || 
                pet_info.description.trim() === ''){
                    res.send('Some fields are only empty spaces')
                }
                const current_user = new ObjectId(pet_info.userID);
            const pet = await petDataFunctions.addPets(pet_info.name,pet_info.species,pet_info.breed,
            pet_info.description,current_user);
                return res.status(200).json(institution);
        }
        catch(error){
            return res.status(500).json(error);
        }
    })

    router.route('/update/:id').get(async(req,res) => {
        try{
        const petID = req.params.id;
        const pet = await pets();
        const current_pet = await pet.findOne({_id:new ObjectId(petID)})
        if(!current_pet){
            res.send("Pet not found")
        }
        const pet_current_data = {
            name : current_pet.name,
            species : current_pet.species,
            breed : current_pet.breed,
            description : current_pet.description
        }
        res.render('pet_update',{petID,pet_current_data});
    }
    catch(error){
        res.status(404).json(error);
    }

    }).post(async(req,res) => {
        try{
        const petID = req.params.id;
            const updatedFields = req.body;
            const pet = await pets()
            const current_pet = await pet.findOne({_id:new ObjectId(petID)})
            if(!current_pet){
                res.send("Pet not found")
            }
            const pet_id_pass = new ObjectId(petID)
            const updatedPet = await petDataFunctions.updatePetDetails(pet_id_pass,updatedFields);  
            if(!updatedPet){
                res.send('Update Failed');
            }
            return res.status(200).json(updatedPet);
        }
        catch{
            return res.status(500).json({ error: 'Internal Server Error' });

        }
    })

    router.route('/view_pets/:id').get(async(req,res) => {
        const petID = req.params.id;
        if(!petID){
            res.send("No Pet ID")
        }
        const isValidObjectpetId = ObjectId.isValid(petID);

        if (!isValidObjectpetId) {
            res.send("Invalid Object ID");
        }
      
        const display_pet_data = await petDataFunctions.getPetDetails(petID);
        if(!display_pet_data){
            res.send("Pet not found")
        }
        res.render('view_pets',{petID,display_pet_data});


    })

    export default router;