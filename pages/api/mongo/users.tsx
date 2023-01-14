import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from "../../../db";


type user ={
  dni:string,
  clave:string,
  name:string,
  lastName:string,
  email:string
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  try{
    const client = await clientPromise;
    const db = client.db("ATM");
    const requestMethod = req.method;
    const body:user = req.body
    
    switch (requestMethod) {
      case 'POST':
        const newUser = {...body}
        await db.collection("USERS").insertOne(newUser);
        const msg = {message: `You submitted the following data: ${body}`}
        res.status(200).json(msg)
        break
      case 'PUT':
        
      //   const clone = userFound ? (({ clave, ...rest }) => rest)(userFound) : false // remove clave if user was found
      //   res.status(200).send(clone)
      // break
      // case 'GET':
      //   res.status(200).send(data)
      // break
      default:
        res.status(400).json({ message: 'Method does not available'})
    }
  } catch (err) {

  } finally {
    
  }
  

}
