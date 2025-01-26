// const path = require('path');
// const db = require("../db/db");

// exports.index = (req, res) => {
//     res.sendFile("C:\Users\ademy\OneDrive\Desktop\kds\dist\index.html")
//   };
const path = require('path');

exports.index = (req, res) => {
    // __dirname ile mutlak yolu alıyoruz
    const filePath = path.join(__dirname, '..', 'dist', 'index.html');
    res.sendFile(filePath);
};
