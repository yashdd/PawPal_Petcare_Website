import {pets} from '../config/mongoCollections.js'
import { ObjectId }  from 'mongodb';
import {users} from '../config/mongoCollections.js'


const petDataFunctions = {
    async addPets(name,species,breed,description,userID){
        if(!name){
            throw 'Email ID not entered'
        }
        if(typeof name!== 'string'){
            throw 'Type should be string'
        }
        if(name.trim()===""){
            throw 'Only empty spaces'
        }
        if(!species){
            throw 'Email ID not entered'
        }
        if(typeof species!== 'string'){
            throw 'Type should be string'
        }
        if(species.trim()===""){
            throw 'Only empty spaces'
        }
        if(!breed){
            throw 'Breed not entered'
        }
        if(typeof breed!== 'string'){
            throw 'Type should be string'
        }
        if(breed.trim()===""){
            throw 'Only empty spaces'
        }
        if(!description){
            throw 'Description not entered'
        }
        if(typeof description!== 'string'){
            throw 'Type should be string'
        }
        if(description.trim()===""){
            throw 'Only empty spaces'
        }
        
        let updatedTime = new Date();
        if(!userID){
            throw 'User ID not entered'
        }
        if(!ObjectId.isValid(userID)){
            throw 'Not a Valid Object ID'
        }

        const user = await users()
        
        const existing_user = await user.findOne({_id:userID})
        if(!existing_user){
            throw 'User with same user ID doesnot exists'
        }
    
        const newPet = {
            name: name,
            species:species,
            breed: breed,
            description: description,
            updatedTime: updatedTime,
            userID: userID.toString()
    
        }
        const pet = await pets()
        const create_pet = await pet.insertOne(newPet)

    if (create_pet.acknowledged || create_pet.insertedId){
        console.log("Pet Added successfully");
        existing_user.pets.push(create_pet.insertedId.toString());
        await user.updateOne({_id:userID},{ $set: { pets: existing_user.pets }})
    }
    else{
        throw 'Could not add pet'
    }
    return create_pet;
    },

    async updatePetDetails(pet_id_pass,updatedFields){
        const pet = await pets()
        const updatedPet = await pet.updateOne(
        { _id: pet_id_pass },
        { $set: updatedFields }
    );
    if (updatedPet.modifiedCount!== 1) {
        throw 'Pet Update failed'
    } 
    return updatedPet;
    },

    async getPetDetails(pet_id){
        if(!pet_id){
            throw 'No Pet ID provided'
        }
        const pet = await pets()
        const view_current_pet = await pet.findOne({_id:new ObjectId(pet_id)})
        if(!view_current_pet){
            res.send("Pet not found")
        }
        const display_pet_data = {
            name: view_current_pet.name,
            species: view_current_pet.species,
            breed: view_current_pet.breed,
            description: view_current_pet.description
        }
        return display_pet_data;
    }
}
export default petDataFunctions;