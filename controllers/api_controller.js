// const path = require('path');
// const db = require("../db/db");

// exports.getProducts = (req, res) => {  
//     db.query('SELECT * FROM uretim', (err, results) => {
//     if (err) {
//         console.error('Veritabanı sorgusu sırasında hata oluştu: ', err);
//         return res.status(500).json({ error: 'Veritabanı sorgusu hatalı' });
//     }

//     res.json(results);
//     })}

const db = require("../db/db");

exports.getProducts = (req, res) => {  
    const query = `
        SELECT
            YEAR(uretim_tarihi) AS yil,
            MONTH(uretim_tarihi) AS ay,
            SUM(uretim_miktari) AS toplam_uretim
        FROM
            uretim
        GROUP BY
            YEAR(uretim_tarihi),
            MONTH(uretim_tarihi)
        ORDER BY
            yil DESC, ay DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Veritabanı sorgusu sırasında hata oluştu: ', err.message);
            return res.status(500).json({ error: 'Veritabanı sorgusu hatalı', details: err.message });
        }

        // Kontrol: results'ın doğru formatta olup olmadığını kontrol et
        if (Array.isArray(results)) {
            res.json(results);
        } else {
            console.error('Beklenmeyen sonuç formatı: ', results);
            res.status(500).json({ error: 'Beklenmeyen sonuç formatı' });
        }
    });
};

exports.getTotalProductQuantity = (req, res) => {  
    const query = `
        SELECT 
    CASE 
        WHEN MONTH(uretim.uretim_tarihi) = 1 THEN 'Ocak'
        WHEN MONTH(uretim.uretim_tarihi) = 2 THEN 'Şubat'
        WHEN MONTH(uretim.uretim_tarihi) = 3 THEN 'Mart'
        WHEN MONTH(uretim.uretim_tarihi) = 4 THEN 'Nisan'
        WHEN MONTH(uretim.uretim_tarihi) = 5 THEN 'Mayıs'
        WHEN MONTH(uretim.uretim_tarihi) = 6 THEN 'Haziran'
        WHEN MONTH(uretim.uretim_tarihi) = 7 THEN 'Temmuz'
        WHEN MONTH(uretim.uretim_tarihi) = 8 THEN 'Ağustos'
        WHEN MONTH(uretim.uretim_tarihi) = 9 THEN 'Eylül'
        WHEN MONTH(uretim.uretim_tarihi) = 10 THEN 'Ekim'
        WHEN MONTH(uretim.uretim_tarihi) = 11 THEN 'Kasım'
        WHEN MONTH(uretim.uretim_tarihi) = 12 THEN 'Aralık'
    END AS Aylar, 
    SUM(uretim.uretim_miktari) AS Uretim 
FROM uretim
GROUP BY MONTH(uretim.uretim_tarihi), CASE 
        WHEN MONTH(uretim.uretim_tarihi) = 1 THEN 'Ocak'
        WHEN MONTH(uretim.uretim_tarihi) = 2 THEN 'Şubat'
        WHEN MONTH(uretim.uretim_tarihi) = 3 THEN 'Mart'
        WHEN MONTH(uretim.uretim_tarihi) = 4 THEN 'Nisan'
        WHEN MONTH(uretim.uretim_tarihi) = 5 THEN 'Mayıs'
        WHEN MONTH(uretim.uretim_tarihi) = 6 THEN 'Haziran'
        WHEN MONTH(uretim.uretim_tarihi) = 7 THEN 'Temmuz'
        WHEN MONTH(uretim.uretim_tarihi) = 8 THEN 'Ağustos'
        WHEN MONTH(uretim.uretim_tarihi) = 9 THEN 'Eylül'
        WHEN MONTH(uretim.uretim_tarihi) = 10 THEN 'Ekim'
        WHEN MONTH(uretim.uretim_tarihi) = 11 THEN 'Kasım'
        WHEN MONTH(uretim.uretim_tarihi) = 12 THEN 'Aralık'
    END
ORDER BY MONTH(uretim.uretim_tarihi);

    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Veritabanı sorgusu sırasında hata oluştu: ', err.message);
            return res.status(500).json({ error: 'Veritabanı sorgusu hatalı', details: err.message });
        }

        // Kontrol: results'ın doğru formatta olup olmadığını kontrol et
        if (Array.isArray(results)) {
            res.json(results);
        } else {
            console.error('Beklenmeyen sonuç formatı: ', results);
            res.status(500).json({ error: 'Beklenmeyen sonuç formatı' });
        }
    });
};

exports.getProductivity = (req, res) => {  
    const query = `
        SELECT uretim.uretim_hatti_id as uretim_hatti,Round((SUM(uretim.uretim_miktari) / SUM(Uretim_Hatti.kapasite)) * 100/
    (SELECT MAX(islem) AS maximum
    FROM (
        SELECT SUM(uretim.uretim_miktari) / SUM(Uretim_Hatti.kapasite) AS islem
        FROM uretim
        GROUP BY uretim.uretim_hatti_id
    ) AS subquery))as verim
    from uretim, Uretim_Hatti
    WHERE uretim.uretim_hatti_id=Uretim_Hatti.uretim_hatti_id
    GROUP BY uretim.uretim_hatti_id  
ORDER BY 'verim' ASC;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Veritabanı sorgusu sırasında hata oluştu: ', err.message);
            return res.status(500).json({ error: 'Veritabanı sorgusu hatalı', details: err.message });
        }

        // Kontrol: results'ın doğru formatta olup olmadığını kontrol et
        if (Array.isArray(results)) {
            res.json(results);
        } else {
            console.error('Beklenmeyen sonuç formatı: ', results);
            res.status(500).json({ error: 'Beklenmeyen sonuç formatı' });
        }
    });
};

exports.getShiftProductivity = (req, res) => {  
    const query = `
       SELECT uretim.vardiya as vardiya,Round((SUM(uretim.uretim_miktari) / SUM(uretim.uretim_suresi)) * 100/
    (SELECT MAX(islem) AS maximum
    FROM (
        SELECT SUM(uretim.uretim_miktari) / SUM(uretim.uretim_suresi) AS islem
        FROM uretim
        GROUP BY uretim.vardiya
    ) AS subquery))as verim
    from uretim 
    GROUP BY uretim.vardiya  
ORDER BY 'verim' ASC;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Veritabanı sorgusu sırasında hata oluştu: ', err.message);
            return res.status(500).json({ error: 'Veritabanı sorgusu hatalı', details: err.message });
        }

        // Kontrol: results'ın doğru formatta olup olmadığını kontrol et
        if (Array.isArray(results)) {
            res.json(results);
        } else {
            console.error('Beklenmeyen sonuç formatı: ', results);
            res.status(500).json({ error: 'Beklenmeyen sonuç formatı' });
        }
    });
};

exports.getShiftProductivity2 = (req, res) => {  
    const query = `
      SELECT
    u.vardiya,
    SUM(u.uretim_miktari) AS toplam_uretim_miktari,  -- Vardiya bazında toplam üretim miktarı
    SUM(u.uretim_suresi) AS toplam_uretim_suresi,    -- Vardiya başına toplam üretim süresi
    SUM(u.uretim_miktari) / SUM(u.uretim_suresi) AS verimlilik -- Vardiya başına üretim miktarı / üretim süresi (Verimlilik)
FROM
    uretim u
JOIN
    Uretim_Hatti h ON u.uretim_hatti_id = h.uretim_hatti_id
JOIN
    Urunler ur ON u.urun_id = ur.urun_id
GROUP BY
    u.vardiya
ORDER BY
    toplam_uretim_miktari DESC;  -- Üretim miktarına göre sıralama

    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Veritabanı sorgusu sırasında hata oluştu: ', err.message);
            return res.status(500).json({ error: 'Veritabanı sorgusu hatalı', details: err.message });
        }

        // Kontrol: results'ın doğru formatta olup olmadığını kontrol et
        if (Array.isArray(results)) {
            res.json(results);
        } else {
            console.error('Beklenmeyen sonuç formatı: ', results);
            res.status(500).json({ error: 'Beklenmeyen sonuç formatı' });
        }
    });
};

exports.getTotalProductSell = (req, res) => {  
    const query = `
      SELECT
    ur.urun_adi,  -- Ürün adı
    ur.kategori,  -- Ürün kategorisi
    SUM(u.uretim_miktari) AS toplam_uretim_miktari,  -- Ürün bazında toplam üretim miktarı
    ur.birim_fiyat AS birim_satis_fiyati,  -- Ürünün birim satış fiyatı
    (SUM(u.uretim_miktari) * ur.birim_fiyat) AS toplam_satis_geliri,  -- Toplam gelir (birim fiyat x üretim miktarı)
    SUM(u.uretim_miktari) * 10 AS toplam_uretim_maliyet,  -- Örnek üretim maliyeti (her birim ürünün maliyetini 10 olarak varsaydık)
    ((SUM(u.uretim_miktari) * ur.birim_fiyat) - (SUM(u.uretim_miktari) * 10)) AS toplam_kar  -- Toplam kâr (gelir - maliyet)
FROM
    uretim u
JOIN
    Urunler ur ON u.urun_id = ur.urun_id  -- Ürünler tablosuyla ilişkilendir
JOIN
    Uretim_Hatti h ON u.uretim_hatti_id = h.uretim_hatti_id  -- Üretim hattı tablosuyla ilişkilendir
GROUP BY
    ur.urun_adi, ur.kategori, ur.birim_fiyat, h.kapasite  -- Gruplama ürün bazında
ORDER BY
    toplam_kar DESC;

    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Veritabanı sorgusu sırasında hata oluştu: ', err.message);
            return res.status(500).json({ error: 'Veritabanı sorgusu hatalı', details: err.message });
        }

        // Kontrol: results'ın doğru formatta olup olmadığını kontrol et
        if (Array.isArray(results)) {
            res.json(results);
        } else {
            console.error('Beklenmeyen sonuç formatı: ', results);
            res.status(500).json({ error: 'Beklenmeyen sonuç formatı' });
        }
    });
};


exports.getProductionQuantityPeriod = (req, res) => {  
    const query = `
        SELECT Urunler.urun_id, uretim.uretim_miktari,uretim.uretim_suresi
FROM uretim,Urunler
WHERE Urunler.urun_id=uretim.uretim_id
ORDER BY 'uretim.uretim_id' ASC;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Veritabanı sorgusu sırasında hata oluştu: ', err.message);
            return res.status(500).json({ error: 'Veritabanı sorgusu hatalı', details: err.message });
        }

        // Kontrol: results'ın doğru formatta olup olmadığını kontrol et
        if (Array.isArray(results)) {
            res.json(results);
        } else {
            console.error('Beklenmeyen sonuç formatı: ', results);
            res.status(500).json({ error: 'Beklenmeyen sonuç formatı' });
        }
    });
};

exports.getMaxProductionLine= (req, res) => {  
    const query = `
        SELECT uretim.uretim_hatti_id as id, sum(uretim.uretim_miktari) as miktar
FROM uretim
GROUP BY uretim.uretim_hatti_id
ORDER BY id ASC 
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Veritabanı sorgusu sırasında hata oluştu: ', err.message);
            return res.status(500).json({ error: 'Veritabanı sorgusu hatalı', details: err.message });
        }

        // Kontrol: results'ın doğru formatta olup olmadığını kontrol et
        if (Array.isArray(results)) {
            res.json(results);
        } else {
            console.error('Beklenmeyen sonuç formatı: ', results);
            res.status(500).json({ error: 'Beklenmeyen sonuç formatı' });
        }
    });
};

exports.getEnergyTour= (req, res) => {  
    const query = `
        SELECT tur.tur_adi as tur , sum(enerji_tuketim.enerji_miktari) as enerji_harcama
        FROM enerji_tuketim,tur
        WHERE tur.tur_id=enerji_tuketim.tur_id
        GROUP BY tur.tur_id;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Veritabanı sorgusu sırasında hata oluştu: ', err.message);
            return res.status(500).json({ error: 'Veritabanı sorgusu hatalı', details: err.message });
        }

        // Kontrol: results'ın doğru formatta olup olmadığını kontrol et
        if (Array.isArray(results)) {
            res.json(results);
        } else {
            console.error('Beklenmeyen sonuç formatı: ', results);
            res.status(500).json({ error: 'Beklenmeyen sonuç formatı' });
        }
    });
};

exports.getEnergyMonth= (req, res) => {  
    const query = `
        SELECT 
    DATE_FORMAT(enerji_tuketim.tuketim_tarihi, '%M') AS ay, -- Ay isimlerini çeker
    SUM(enerji_tuketim.enerji_miktari) AS enerji -- Toplam enerji miktarı
FROM 
    enerji_tuketim
GROUP BY 
    MONTH(enerji_tuketim.tuketim_tarihi), ay -- Hem ay hem de isim bazında gruplama
ORDER BY 
    MONTH(enerji_tuketim.tuketim_tarihi); -- Ay sırasına göre sıralama
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Veritabanı sorgusu sırasında hata oluştu: ', err.message);
            return res.status(500).json({ error: 'Veritabanı sorgusu hatalı', details: err.message });
        }

        // Kontrol: results'ın doğru formatta olup olmadığını kontrol et
        if (Array.isArray(results)) {
            res.json(results);
        } else {
            console.error('Beklenmeyen sonuç formatı: ', results);
            res.status(500).json({ error: 'Beklenmeyen sonuç formatı' });
        }
    });
};

exports.getEnergyProductionData = (req, res) => {  
    const query = `
        SELECT
            -- Enerji Tüketimi Bilgileri (öncelikli bilgi)
            et.tuketim_tarihi,
            et.enerji_miktari,
            
            -- Üretim Bilgileri (enerji tüketiminden sonra)
            ur.uretim_tarihi,
            ur.uretim_miktari,
            ur.uretim_suresi,
            
            -- Ürün Bilgileri (üretimden sonra)
            u.urun_adi,
            u.kategori,
            u.birim_fiyat,
            
            -- Üretim Hattı Bilgileri (son olarak)
            ut.hat_adi,
            ut.kapasite

        FROM
            enerji_tuketim et
        JOIN
            uretim ur ON et.uretim_id = ur.uretim_id
        JOIN
            urunler u ON ur.urun_id = u.urun_id
        JOIN
            uretim_hatti ut ON ur.uretim_hatti_id = ut.uretim_hatti_id
        ORDER BY
            et.tuketim_tarihi DESC;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Veritabanı sorgusu sırasında hata oluştu: ', err.message);
            return res.status(500).json({ error: 'Veritabanı sorgusu hatalı', details: err.message });
        }

        // Kontrol: results'ın doğru formatta olup olmadığını kontrol et
        if (Array.isArray(results)) {
            res.json(results);
        } else {
            console.error('Beklenmeyen sonuç formatı: ', results);
            res.status(500).json({ error: 'Beklenmeyen sonuç formatı' });
        }
    });
};
