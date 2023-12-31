import express from 'express'
let router = express.Router()
import {client} from './../mongodb.mjs'
import {stringToHash,varifyHash} from 'bcrypt-inzi'
const userCollection = client.db("cruddb").collection("users");

router.post('/login', async (req,res)=>{
if(!req.body?.email ||!req.body?.password ){
    res.status(403)
    res.send(`required parameters missing, 
        example request body:
        {
            email: "some@email.com",
            password: "some$password",
        } `)
    return};
    req.body.email = req.body.email.toLowerCase()

    try{
        let result = await userCollection.findOne({email: req.body.email})
        console.log("result: ", result);
if(!result){
res.status(403).send({message: 'email or password incorrect'})
return
}else{
const isMatch = await varifyHash(req.body.password, result.password)
if(isMatch){
    res.send({message: 'login successfull'})
    return
}else {
    res.status(401).send({
        message: "email or password incorrect"
    })
    return;
}
}


    }
    catch (e){
    console.log("error getting data mongodb: ", e);
        res.status(500).send('server error, please try later');
}
})


router.post('/signup', async (req,res)=>{
  if(!req.body?.firstName || !req.body?.lastName || !req.body?.email || !req.body?.password){
    res.status(403);
        res.send(`required parameters missing, 
        example request body:
        {
            firstName: "some firstName",
            lastName: "some lastName",
            email: "some@email.com",
            password: "some$password",
        } `);
        return;
  }
  req.body.email = req.body.toLowerCase()
  try {
    let result = await userCollection.findOne({ email: req.body.email });
    console.log("result: ", result);

    if (!result) { // user not found

        const passwordHash = await stringToHash(req.body.password);

        const insertResponse = await userCollection.insertOne({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: passwordHash,
            createdOn: new Date()
        });
        console.log("insertResponse: ", insertResponse);

        res.send({ message: 'Signup successful' });

    } else { // user already exists
        res.status(403).send({
            message: "user already exist with this email"
        });
    }

} catch (e) {
    console.log("error getting data mongodb: ", e);
    res.status(500).send('server error, please try later');
}
})
export default router