const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

const BOT_TOKEN = "9150356843:AAFIzGehiCV4-vhKts_L0AvJRcl8buXiJI0";
const CHAT_ID_ORDERS = "-1003817071456"; 
const CHAT_ID_SUPPORT = "-1004477425965";

// Разрешаем запросы отовсюду
app.use(cors({ origin: '*' }));
app.use(express.json({limit: '10mb'}));

// Проверка, что сервер жив
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'Nazarovo Server is running!' });
});

app.post('/send', async (req, res) => {
    try {
        const { channel, text, photoBase64 } = req.body;
        let chatId = CHAT_ID_ORDERS;
        if (channel === 'SUPPORT') chatId = CHAT_ID_SUPPORT;
        
        // Отправка в Telegram
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        const payload = { 
            chat_id: chatId, 
            text: text || 'Пустое сообщение', 
            parse_mode: 'HTML' 
        };
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        
        const tgData = await response.json();
        
        if (!response.ok) {
            console.error('TG Error:', tgData);
            return res.status(502).json({ error: 'Telegram API Error', details: tgData });
        }
        
        res.json({ status: 'ok', tg_response: tgData });
    } catch (e) {
        console.error('Server Crash:', e);
        res.status(500).json({ error: e.message });
    }
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
