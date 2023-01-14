import type { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from "../../../db";

type body = {
  dni: string
  amount: string
  operation: "extraction" | "deposit"
}
type sendResponse = {
  message:string
  status:boolean
}

const sendRes: sendResponse = {
  message: ``,
  status: false
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = await clientPromise;
  const db = client.db("ATM");

  const requestMethod = req.method;
  const body:body = req.body
  console.log("BODY",req.body)

  switch (requestMethod) {
    case 'PUT':
      const opAmount = body.amount
      const dni = body.dni
      const op = body.operation
      const userDni = await db.collection("USERS").findOne({dni:dni});
      console.log("User DNI", userDni)
      if (op==="extraction"){
        if (+userDni?.money >= +opAmount) {
          const newMoney:string = (userDni?.money - +opAmount).toString()
          await db.collection("USERS").findOneAndUpdate({dni:dni},{$set:{money:newMoney}});
          sendRes.message = `Extraction of ${opAmount} was succeful`
          sendRes.status = true
          res.status(200).json(sendRes)
        } else {
          sendRes.message = `Not enough $ ${opAmount} on the acount`
          res.status(200).json(userDni)
        }
      } else if (op==="deposit") {
          const newMoney:string = (userDni?.money + +opAmount).toString()
          await db.collection("USERS").findOneAndUpdate({dni:dni},{$set:{money:newMoney}})   
          sendRes.message = `Deposit of ${opAmount} was succeful`
          sendRes.status = true
          res.status(200).json(sendRes)
      } else {
        const sendRes = {message: `operation not aviable`}
        res.status(401).json(sendRes)
        return
      }
      break
    default:
      res.status(400).json({ message: 'Method does not available'})
  }
}
