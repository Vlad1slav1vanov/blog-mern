import streamifier from 'streamifier';
import cloudinary from 'cloudinary';

export const uploadImage = (req, res) => {
  let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
          let stream = cloudinary.v2.uploader.upload_stream(
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
  };

  const upload = async (req) => {
    try {
      let result = await streamUpload(req);
      console.log(result);
      res.status(200).json({
        url: result.secure_url
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  upload(req);
}