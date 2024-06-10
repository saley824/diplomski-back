import { Request, Response } from "express";

var serviceAccount = require("../serviceAccountKey.json");

import admin from "firebase-admin";

import formidable from "formidable";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://diplomski-fc1d8.appspot.com", //storage bucket url
});

const bucket = admin.storage().bucket();

const uploadImages = async (req: Request, res: Response) => {
  //initialise formidable
  const form = formidable({ multiples: true });
  console.log("------------------------------------");
  //   console.log(form);
  console.log("------------------------------------");
  form.parse(req, async (err: any, fields: any, files: any) => {
    if (err) {
      res.status(500).json({ success: false, error: err });
    } else {
      let image_url; //to save the download url
      console.log("------------------------------------");
      console.log(files);
      console.log("------------------------------------");
      // path to image
      //   const filePath = files["file_variable_name"][0].filepath;

      //set a preferred path on firebase storage
      const remoteFilePath = "images/kazeem.jpg";

      /* upload the image using the bucket.upload() function which takes in 2
           arguments 1. the file path and 2. an object containing additional 
           informations like gzip, metadata, destination e.t.c
           we will be handling only the destination key as firebase handles the
           rest automatically. bucket.upload() is a promise hence the await keyword
         */
      //   await bucket.upload(filePath, { destination: remoteFilePath });

      // options for the getSignedUrl() function
      const options = {
        action: "read",
        expires: Date.now() + 24 * 60 * 60 * 1000, // 1 day
      };

      // The right hand side returns an array of signedUrl
      //   let signedUrl = await bucket.file(remoteFilePath).getSignedUrl(options);

      //   image_url = signedUrl[0]; // save the signed Url to image_url

      console.log(image_url);

      //send image url back to frontend
      res.status(200).json({ success: true, url: image_url });
    }
  });
};

export default {
  uploadImages,
};
