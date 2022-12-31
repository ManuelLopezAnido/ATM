// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path';
import { verify } from 'crypto';

let dataRaw = fs.readFileSync( path.join(process.cwd(),'./data/data.json'))
const data = JSON.parse(dataRaw.toString())
type user ={
  dni:string,
  clave:string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const requestMethod = req.method;
  console.log("BODY",req.body)
  //const body = req.body ? JSON.parse(req.body) : ""
  const body = req.body
  console.log('body',body.clave, body.dni)
  switch (requestMethod) {
    case 'POST':
      const newUser = {
        "dni": body.dni,
        "clave": body.clave
      }
      data.push(newUser)
      fs.writeFile(path.join(process.cwd(),'./data/data.json'),JSON.stringify(data,null,2),function (err){
        if (err) throw (err);
      })
      const msg = {message: `You submitted the following data: ${body}`}
      res.status(200).json(msg)
      break
    case 'PUT':
      const userExist = (user:user)=>{ return (user.dni === body.dni && user.clave === body.clave)}
      const userFound = data.find(userExist)
      const clone = userFound ? (({ clave, ...rest }) => rest)(userFound) : false // remove clave if user was found
      res.status(200).send(clone)
    break
    case 'GET':
      res.status(200).send(data)
    break
  }

}
