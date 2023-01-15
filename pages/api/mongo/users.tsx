import { MongoClient } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from "../../../db";


type user ={
  dni:string,
  newDni?:string,
  clave:string,
  newClave:string,
  name:string,
  lastName:string,
  email:string
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const client = await clientPromise;
  try{
    const db = client.db("ATM");
    const requestMethod = req.method;
    const body:user = req.body 
    let msg:{message:string}
    switch (requestMethod) {
      case 'POST':
        const newUser = {...body,amount:"0"}
        await db.collection("USERS").insertOne(newUser);
        msg = {message: `You submitted the following data: ${JSON.stringify(body)}`}
        res.status(200).json(msg)
        break
      case 'PUT':
        const userFound= await db.collection("USERS").findOneAndUpdate({dni:body.dni, clave:body.clave},{
          $set: {
            dni: body.newDni,
            clave: body.newClave,
            name: body.name,
            lastName: body.lastName,
            email: body.email
          }
        });
        if (userFound.value) {
          msg = {message: `User modifed correctly`}
          res.status(200).json(msg)
        } else {
          msg = {message: `User not found`}
          res.status(200).json(msg)
        }
        break
      case 'DELETE':
        const userDFound = await db.collection("USERS").deleteOne({dni:body.dni, clave:body.clave});
        console.log(userDFound)
        if (userDFound.deletedCount) {
          msg = {message: `User deleted correctly`}
          res.status(200).json(msg)
        } else {
          msg = {message: `User not found`}
          res.status(200).json(msg)
        }
      break
      default:
        res.status(400).json({ message: 'Method does not available'})
    }
    
  } catch (err) {
    res.status(400).json({ message: `Error: ${err}`})
  }   

}
