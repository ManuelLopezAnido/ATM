// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path';

let dataRaw = fs.readFileSync( path.join(process.cwd(),'./data/data.json'))
const data = JSON.parse(dataRaw.toString())
type body = {
  dni: string
  amount: string
  operation: "extraction" | "deposit"
}
type user ={
  dni:string,
  clave:string
}

type sendResponse = {
  message:string
  status:boolean
}

const sendRes: sendResponse = {
  message: ``,
  status: false
}
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const requestMethod = req.method;
  const body = req.body
  switch (requestMethod) {
    case 'PUT':
      const opAmount = body.amount
      const dni = body.dni
      const op = body.operation


      const userDni = (user:user)=>{return (user.dni === dni)}
      const indexUser = data.findIndex(userDni)
      if (indexUser === -1){
        const sendRes = {message: `DNI incorrect`}
        res.status(400).json(sendRes)
        return
      }
      const actualMoney = data[indexUser].money

      if (op==="extraction"){
        if (+actualMoney >= +opAmount) {
          data[indexUser].money = (+data[indexUser].money - +opAmount).toString()
          fs.writeFile(path.join(process.cwd(),'./data/data.json'),JSON.stringify(data,null,2),function (err){
            if (err) throw (err);
          })
          sendRes.message = `Extraction of ${opAmount} was succeful`
          sendRes.status = true
          res.status(200).json(sendRes)
        } else {
          sendRes.message = `Not enough $ ${opAmount} on the acount`
          res.status(200).json(sendRes)
        }
      } else if (op==="deposit") {
        data[indexUser].money = (+data[indexUser].money + +opAmount).toString()
          fs.writeFile(path.join(process.cwd(),'./data/data.json'),JSON.stringify(data,null,2),function (err){
            if (err) throw (err);
          })
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
