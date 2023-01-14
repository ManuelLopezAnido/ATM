import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from "../../../db";


type user ={
  dni:string,
  clave:string
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const client = await clientPromise;
    const db = client.db("ATM");
    const requestMethod = req.method;
    const body:user = req.body
    const dni:string = body.dni
    switch (requestMethod) {
      case 'POST':
        const userFound = await db.collection("USERS").findOne({dni:dni, clave:body.clave});
        const clone = userFound ? (({ clave, ...rest }) => rest)(userFound) : false // remove clave if user was found
        res.status(200).send(clone)
      break
      default:
        res.status(400).json({ message: 'Method does not available'})
    }
  } catch (err) {
    
  } finally {

  }
}
