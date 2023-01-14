// posts.js

import clientPromise from "../../../db";
import { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(req:NextApiRequest, res:NextApiResponse) {
  const client = await clientPromise;
  const db = client.db("ATM");
  switch (req.method) {
    case "POST":
      let bodyObject = req.body;
      await db.collection("USERS").insertMany(bodyObject);
      console.log("Body:",bodyObject)
      res.json({message: 'Data inserted successfully'});
      break;
    case "GET":
      const allPosts = await db.collection("allPosts").find({}).toArray();
      res.json({ status: 200, data: allPosts });
      break;
  }
  client.close()
}