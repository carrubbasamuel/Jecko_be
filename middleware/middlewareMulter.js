const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret:  process.env.CLOUDINARY_SECRET
});


const storageAvatar = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'avatar',
        transformation: [{ format: 'jpg' }]
    }
});


const formDataSingup = multer({ storage: storageAvatar });



module.exports = formDataSingup;