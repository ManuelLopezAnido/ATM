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
    let msg:{message:string , response:string}
    switch (requestMethod) {
      case 'POST':
        const newUser = {...body,money:"0"}
        const sameDni = await db.collection("USERS").findOne({dni:body.dni})
        if (sameDni) {
          msg = {
            message: `Error: el DNI ${body.dni} ya existe`,
            response: 'EXIST'
          }
          res.status(200).json(msg)
          return
        }
        await db.collection("USERS").insertOne(newUser);
        msg = {
          message: `Usuario de DNI: ${body.dni} creado exitosamente`,
          response: 'OK'
        }
        res.status(200).json(msg)
        break
      case 'PUT':
        const userFound= await db.collection("USERS").findOneAndUpdate({dni:body.dni, clave:body.clave},{
          $set: {
            clave: body.newClave,
            name: body.name,
            lastName: body.lastName,
            email: body.email
          }
        });
        if (userFound.value) {
          msg = {
            message: `Usuario modificado correctamente`,
            response: 'OK'
          }
          res.status(200).json(msg)
        } else {
          msg = {
            message: `Clave incorrecta`,
            response: 'NOT'
          }
          res.status(200).json(msg)
        }
        break
      case 'DELETE':
        const userDFound = await db.collection("USERS").deleteOne({dni:body.dni, clave:body.clave});
        if (userDFound.deletedCount) {
          msg = {
            message: `Usuario eliminado correctamente`,
            response: 'OK'
          }
          res.status(200).json(msg)
        } else {
          msg = {
            message: `Clave incorrecta`,
            response: 'NOT'
        }
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
