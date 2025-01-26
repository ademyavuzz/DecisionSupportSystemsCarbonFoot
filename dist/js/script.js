// DOMContentLoaded eventi, HTML içeriği tamamen yüklendiğinde tetiklenir
document.addEventListener('DOMContentLoaded', function() {
    // API'den veriyi almak
    fetch('http://localhost:3000/api/getProducts')
        .then(response => response.json())
        .then(data => {
            console.log('API Verisi:', data);  // Veriyi konsola yazdırarak kontrol edelim

            // Veriyi hazırlamak: X ekseni için tarih, Y ekseni için üretim miktarı
            const labels = data.map(item => `${item.yil}-${item.ay < 10 ? '0' + item.ay : item.ay}`).reverse();
            const productionValues = data.map(item => item.toplam_uretim).reverse();

            // Grafik oluşturma
            const ctx = document.getElementById('productionChart').getContext('2d');
            new Chart(ctx, {
                type: 'line',  // Grafik tipi (line chart)
                data: {
                    labels: labels,  // X eksenindeki etiketler (tarih)
                    datasets: [{
                        label: 'Toplam Üretim',
                        data: productionValues,  // Y eksenindeki değerler (üretim miktarı)
                        borderColor: 'rgba(75, 192, 192, 1)',  // Çizgi rengi
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',  // Çizgi altındaki renk
                        fill: true,  // Grafiğin altında renk dolgusunu göster
                        tension: 0.1,  // Çizginin eğriliği
                    }]
                },
                options: {
                    responsive: true,  // Ekran boyutuna göre grafik boyutunun uyumlu olması
                    scales: {
                        x: {
                            beginAtZero: true  // X ekseni sıfırdan başlasın
                        }
                    }
                }
            });
        })
        .catch(error => console.error('API verisi alınırken hata oluştu:', error));
});
x// Fetch production data
fetch('/api/production')
.then(response => response.json())
.then(data => {
    var ctx1 = document.getElementById('productionChart').getContext('2d');
    new Chart(ctx1, {
        type: 'line',
        data: {
            labels: data.labels, // ['2024-01', '2024-02', ...]
            datasets: [{
                label: 'Toplam Üretim',
                data: data.values, // [35000, 34000, ...]
                borderColor: 'rgba(64, 158, 255, 1)',
                backgroundColor: 'rgba(64, 158, 255, 0.2)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            }
        }
    });
});

// Fetch efficiency data
fetch('/api/efficiency')
.then(response => response.json())
.then(data => {
    var ctx2 = document.getElementById('efficiencyChart').getContext('2d');
    new Chart(ctx2, {
        type: 'line',
        data: {
            labels: data.labels, // ['Ocak', 'Şubat', ...]
            datasets: data.datasets // Example: [{label: 'H1-Pastörize', data: [80, 82, ...], borderColor: 'blue', fill: false}, ...]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' }
            }
        }
    });
});

// Fetch revenue and cost data
fetch('/api/revenue-cost')
.then(response => response.json())
.then(data => {
    var ctx3 = document.getElementById('revenueCostChart').getContext('2d');
    new Chart(ctx3, {
        type: 'bar',
        data: {
            labels: data.labels, // ['Ocak', 'Şubat', ...]
            datasets: [
                {
                    label: 'Gelir (TL)',
                    data: data.revenue, // [30000, 32000, ...]
                    backgroundColor: 'rgba(0, 123, 255, 0.5)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Maliyet (TL)',
                    data: data.cost, // [15000, 16000, ...]
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' }
            }
        }
    });
});

// Fetch profit analysis data
fetch('/api/profit-analysis')
.then(response => response.json())
.then(data => {
    var ctx4 = document.getElementById('profitAnalysisChart').getContext('2d');
    new Chart(ctx4, {
        type: 'line',
        data: {
            labels: data.labels, // ['Ocak', 'Şubat', ...]
            datasets: [
                { label: 'Gelir (Bin TL)', data: data.revenue
// API'den enerji yoğunluğu verisini çekme
async function enerjiYogunlugunuGetir() {
    try {
        const response = await fetch('http://localhost/api/enerji-yogunlugu'); // API adresinizi buraya yazın
        const data = await response.json();

        // Enerji yoğunluğu değerini al
        const enerjiYogunlugu = data.enerjiYogunlugu; // Örnek JSON: { "enerjiYogunlugu": 45 }

        let mesaj = '';

        // Enerji yoğunluğuna göre mesaj oluştur
        if (enerjiYogunlugu < 20) {
            mesaj = `Enerji yoğunluğu: %${enerjiYogunlugu}. Enerji yoğun değil.`;
        } else if (enerjiYogunlugu >= 20 && enerjiYogunlugu <= 50) {
            mesaj = `Enerji yoğunluğu: %${enerjiYogunlugu}. Enerji verimli kullanılıyor.`;
        } else if (enerjiYogunlugu > 50) {
            mesaj = `Enerji yoğunluğu: %${enerjiYogunlugu}. Enerji verimli kullanılmıyor.`;
        }

        // Mesajı DOM'a yazdır
        const mesajDiv = document.getElementById('enerjiMesaji');
        if (mesajDiv) {
            mesajDiv.textContent = mesaj;
        } else {
            console.log(mesaj); // Eğer DOM elemanı yoksa konsola yazdır
        }
    } catch (error) {
        console.error('Enerji yoğunluğu verisi alınırken hata oluştu:', error);
    }
}

// Sayfa yüklendiğinde fonksiyonu çağır
document.addEventListener('DOMContentLoaded', enerjiYogunlugunuGetir);
