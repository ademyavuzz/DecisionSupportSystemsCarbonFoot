const mysql = require("mysql2")

const db = mysql.createConnection({
    host: 'localhost',      // Veritabanı sunucusunun adresi
    user: 'root',           // Veritabanı kullanıcı adı
    password: 'root',           // Veritabanı parolası
    database: 'kds', //kullanacagimiz veritabani adi
    port: 8889  // kullanacagimiz veritabani portu
});

db.connect((err) => {
    if (err) {
      console.error('MySQL bağlantısı başarısız: ', err);
    } else {
      console.log('MySQL veritabanına başarıyla bağlanıldı.');
    }
  });

module.exports = db;