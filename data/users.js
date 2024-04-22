
import {users} from '../config/mongoCollections.js'
import bcrypt from 'bcryptjs';
const userDataFunctions = {

async userRegistration(firstName,lastName,email,gender,city,state,age,hashedPassword,confirmhashedPassword){
    
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
    const user = await users();
    const existing_user = await user.findOne({email:email})
    if(existing_user){
        throw 'User with same user ID already exists'
    }
    if(!firstName){
        throw 'Firstname not Entered'
    }
    if(firstName.trim()===""){
        throw 'Only empty spaces'
    }
    if(typeof firstName!== 'string'){
        throw 'Type should be string'
    }
    if(!lastName){
        throw 'Lastname not Entered'
    }
    if(lastName.trim()===""){
        throw 'Only empty spaces'
    }
    if(typeof lastName!== 'string'){
        throw 'Type should be string'
    }
    if(!gender){
        throw 'Gender not Selected'
    }
    if(!city){
        throw 'City not Entered'
    }
    if(typeof city!== 'string'){
        throw 'Type should be string'
    }
    if(city.trim()===""){
        throw 'Only empty spaces'
    }
    if(!state){
        throw 'State not Selected'
    }
    if(!age){
        throw 'Age not entered'
    }
    if(typeof age!== 'number'){
        throw 'Type should be number'
    }
    
    if(age<0 || age>120){
        throw 'Invalid age'
    }
    if(age<16){
        throw 'User should be minimum of age 16 to register'
    }
    
    if(!hashedPassword){
        throw 'Password Not Entered'
    }
    if(typeof hashedPassword!== 'string'){
        throw 'Type should be hashed string'
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
    firstName = firstName.trim()
    lastName = lastName.trim()
    city = city.trim()
    
    const newUser = {
        firstName:firstName,
        lastName:lastName,
        email:email,
        gender:gender,
        city:city,
        state:state,
        age:age,
        hashedPassword:hashedPassword,
        pets: [],
        posts: [],
        reviews: [],
        comments: []

    }

    
    const create_user = await user.insertOne(newUser)
    if (create_user.acknowledged || create_user.insertedId){
        console.log("User Added successfully");
    }
    else{
        throw 'Could not add user'
    }
    
    return create_user;
    
}
};

export default userDataFunctions;