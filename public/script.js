//slider
document.addEventListener('DOMContentLoaded', () => {
    const themeCheckbox = document.getElementById('theme-checkbox');
    console.log('theme-checkbox')
    const body = document.body;

    themeCheckbox.addEventListener('change', () => {
        body.classList.toggle('dark-mode');
        body.classList.toggle('light-mode');
        localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.classList.add(savedTheme === 'dark' ? 'dark-mode' : 'light-mode');
        themeCheckbox.checked = savedTheme === 'dark';
    } else {
        body.classList.add('light-mode');
    }
});
//timer
document.addEventListener('DOMContentLoaded', () => {
    const timerElement = document.getElementById('timer');
    const foregroundCircle = document.querySelector('.foreground');
    const radius = foregroundCircle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;

    foregroundCircle.style.strokeDasharray = `${circumference} ${circumference}`;
    foregroundCircle.style.strokeDashoffset = circumference;

    let timeLeft = 60;

    function updateTimer() {
        timerElement.textContent = timeLeft;
        const offset = circumference - (timeLeft / 60) * circumference;
        foregroundCircle.style.strokeDashoffset = offset;
        timeLeft--;

        if (timeLeft < 0) {
            timeLeft = 60;
        }
    }

    setInterval(updateTimer, 1000);
});




document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/tickers');
        const tickers = await response.json();

        const tableBody = document.querySelector('#tickers-table tbody');

        tickers.forEach(ticker => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${ticker.sr_no}</td>
                <td>${ticker.name}</td>
                <td>₹ ${ticker.last}</td>
                <td>₹ ${ticker.buy}</td>
                <td>₹ ${ticker.sell}</td>
                <td>${ticker.volume}</td>
                <td>${ticker.base_unit}</td>
            `;
            // <td>${ticker.volume}</td>

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching ticker data:', error);
    }
});