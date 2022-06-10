const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

// Set Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {      // cb = callback(error, unique filename to be upload)
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('image');


// Check File Type
function checkFileType(file, cb) {
    // Allowed Extensions
    const filetypes = /jpeg|jpg|png|gif/;

    // Check Extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    // Check Mimetype 
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error : Allowed Images only');
    }
}


// Init App
const app = express();

// ejs
app.set('view engine', 'ejs');

// Public Folder
app.use(express.static('./public'));

// Home Page Route
app.get('/', (req, res) => {
    res.render('index');
});

// Upload Route
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render('index');
        } else {
            // Check either File selected or Not
            if (req.file == undefined) {
                res.render('index', {
                    msg: 'Error: No File Selected!'
                });
            } else {
                res.render('index', {
                    msg: 'Image Uploaded Successfully',
                    file: `uploads/${req.file.filename}`
                })
            }
        }
    });
});


const PORT = 3000;

app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));