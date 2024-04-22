import {institutions} from '../config/mongoCollections.js'
import bcrypt from 'bcryptjs';
const institutionDataFunctions = {

    async institutionRegistration(name,email,services,address,city,state,hashedPassword,confirmhashedPassword){
        if(!email){
            throw 'Email ID not entered'
        }
        if(typeof email!== 'string'){
            throw 'Type should be string'
        }
        if(email.trim()===""){
            throw 'Only empty spaces'
        }
        email = email.toLowerCase();
        if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)){
            throw 'Invalid Email'
        }
        const institution = await institutions();
        const existing_institution = await institution.findOne({email:email})
        if(existing_institution){
            throw 'Institution with same user ID already exists'
        }
        if(!name){
            throw 'Email ID not entered'
        }
        if(typeof name!== 'string'){
            throw 'Type should be string'
        }
        if(name.trim()===""){
            throw 'Only empty spaces'
        }
        if(!address){
            throw 'Email ID not entered'
        }
        if(typeof address!== 'string'){
            throw 'Type should be string'
        }
        if(address.trim()===""){
            throw 'Only empty spaces'
        }
        if(!city){
            throw 'Email ID not entered'
        }
        if(typeof city!== 'string'){
            throw 'Type should be string'
        }
        if(city.trim()===""){
            throw 'Only empty spaces'
        }
        if(!hashedPassword){
            throw 'Password Not Entered'
        }
        if(typeof hashedPassword!== 'string'){
            throw 'Type should be hashed string'
        }
        if(!state){
            throw 'State not selected'
        }
        if(typeof state!== 'string'){
            throw 'State should be of type string'
        }
        if(!services){
            throw 'Services not present'
        }
        if (!Array.isArray(services)){
            throw 'Services should be of type array'
        }
        for(let i=0;i<services.length;i++){
            if(services[i].trim() === ""){
                throw 'Only empty spaces not allowed'
            }
        }
        if(!hashedPassword){
            throw 'Password not present'
        }
        if(!confirmhashedPassword){
            throw 'Password not present'
        }
        if(typeof hashedPassword!== 'string'){
            throw 'Password should be of type string'
        }
        if(typeof confirmhashedPassword!== 'string'){
            throw 'Password should be of type string'
        }
        
    const newInstitution = {
        name: name,
        email:email,
        services: services,
        address: address,
        city: city,
        state: state,
        hashedPassword: hashedPassword

    }

    
    const create_institution = await institution.insertOne(newInstitution);
    if (create_institution.acknowledged || create_institution.insertedId){
        console.log("Institution Added successfully");
    }
    else{
        throw 'Could not add Institution'
    }
    
    return create_institution;
    
},

async updateInstitutionDetails(institutionID, updatedFields) {
    if(!institutionID){
        throw 'No Institution ID'
    }
    if(!updatedFields){
        throw 'No Update Fields provided'
    }
    const institute = await institutions()
    const updatedInstitution = await institute.updateOne(
        { _id: institutionID },
        { $set: updatedFields }
    );
    if (updatedInstitution.modifiedCount!== 1) {
        throw 'Institution Update failed'
    } 
    return updatedInstitution;
}
}
export default institutionDataFunctions