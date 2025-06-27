        function updateEsp32() {
            
        }
        function updateTime() {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            const currentTimeString = `CURRENT TIME: ${hours}:${minutes}:${seconds}`;
            document.getElementById('current-time').textContent = currentTimeString;
        }
        updateTime();
        setInterval(updateTime, 1000);
