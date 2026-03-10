const conditions = ['Güneşli', 'Parçalı Bulutlu', 'Bulutlu', 'Yağmurlu', 'Karlı', 'Sisli', 'Rüzgarlı'];
const icons = {
    'Güneşli': '☀️',
    'Parçalı Bulutlu': '⛅',
    'Bulutlu': '☁️',
    'Yağmurlu': '🌧️',
    'Karlı': '❄️',
    'Sisli': '🌫️',
    'Rüzgarlı': '💨',
};

// Deterministic pseudo-random based on date string
function hashDate(dateStr, cityIdx) {
    let h = cityIdx * 13;
    for (let i = 0; i < dateStr.length; i++) {
        h = ((h << 5) - h + dateStr.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
}

export function getWeather(city, dateStr) {
    const cityIndex = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Trabzon', 'Konya', 'Adana'].indexOf(city);
    const h = hashDate(dateStr, cityIndex >= 0 ? cityIndex : 0);
    const condIdx = h % conditions.length;
    const condition = conditions[condIdx];

    // Temperature ranges by city (March)
    const baseTemps = { 'İstanbul': 12, 'Ankara': 8, 'İzmir': 15, 'Bursa': 10, 'Antalya': 18, 'Trabzon': 10, 'Konya': 7, 'Adana': 17 };
    const base = baseTemps[city] || 12;
    const temp = base + (h % 8) - 3;
    const humidity = 40 + (h % 40);
    const wind = 5 + (h % 25);

    return {
        condition,
        icon: icons[condition],
        temperature: temp,
        humidity,
        wind,
        feelsLike: temp - Math.floor(wind / 10),
    };
}

export function getWeekForecast(city) {
    const today = new Date();
    const forecast = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
        forecast.push({
            date: dateStr,
            dayName: dayNames[d.getDay()],
            ...getWeather(city, dateStr),
        });
    }
    return forecast;
}
