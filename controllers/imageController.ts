import { Request, Response } from "express";
import { prisma } from "../script";

import admin from "firebase-admin";
import formidable from "formidable";

var serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://diplomski-fc1d8.appspot.com", //storage bucket url
});

const bucket = admin.storage().bucket();

const uploadImages = async (req: Request, res: Response) => {
  const id = req.params.id;

  //initialise formidable
  const form = formidable();

  form.parse(req, async (err: any, fields, files) => {
    if (err) {
      res.status(500).json({ success: false, error: err });
    } else {
      try {
        let image_url; //to save the download url

        const keys = Object.keys(files);
        const firstKey = keys[0];

        if (files[firstKey] != undefined) {
          let remoteFilePath = `images/${files[firstKey]![0].originalFilename}`;
          let filePath = files[firstKey]![0].filepath;
          const response = await bucket.upload(filePath, {
            destination: remoteFilePath,
          });
          image_url = await bucket.file(remoteFilePath).getSignedUrl({
            action: "read",
            expires: Date.now() + 365 * 60 * 1000, // 15 minutes
            version: "v4",
          });
        }
        await prisma.product.update({
          where: {
            id: id,
          },
          data: {
            image: image_url![0],
          },
        });

        res.status(200).json({ success: true, url: image_url });
      } catch (error) {
        console.log(`EXCEPTION ${error} uploadImagesTAG`);
        res.status(404).json({
          status: "fail",
        });
      }
    }
  });
};

export default {
  uploadImages,
};

/* upload the image using the bucket.upload() function which takes in 2
           arguments 1. the file path and 2. an object containing additional 
           informations like gzip, metadata, destination e.t.c
           we will be handling only the destination key as firebase handles the
           rest automatically. bucket.upload() is a promise hence the await keyword
         */

// options for the getSignedUrl() function
// const options = {
//   action: "read",
//   expires: Date.now() + 24 * 60 * 60 * 1000, // 1 day
// };

// The right hand side returns an array of signedUrl

//   image_url = signedUrl[0]; // save the signed Url to image_url

//send image url back to frontend
