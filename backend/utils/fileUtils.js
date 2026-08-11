const multer = require("multer");

const randomString =()=>
{
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';

    for (let i = 0; i < 10; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
};

const storage = multer.diskStorage(
    {
        destination:(req,file,cb)=>
        {
            cb(null,"uploads/");
        },
        filename: (req,file,cb)=>
        {
            cb(null, randomString() + '-' + file.originalname);
        }
    }
);

const fileFilter = (req,file,cb)=>
{
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg')
    {
        cb(null,true);
    }
    else
    {
        cb(null,false);
    }
}

exports.storage = storage;
exports.fileFilter = fileFilter;