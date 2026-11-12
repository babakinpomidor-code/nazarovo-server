const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

const BOT_TOKEN = "9150356843:AAFIzGehiCV4-vhKts_L0AvJRcl8buXiJI0";
const CHAT_ID_ORDERS = "-1003817071456"; 
const CHAT_ID_SUPPORT = "-1004477425965";

app.use(cors());
app.use(express.json({limit: '10mb'}));

app.post('/send', async (req, res) => {
    try {
        const { channel, text, photoBase64 } = req.body;
        let chatId = CHAT_ID_ORDERS;
        if (channel === 'SUPPORT') chatId = CHAT_ID_SUPPORT;
        
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        const payload = { chat_id: chatId, text: text, parse_mode: 'HTML' };
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) throw new Error('TG API error');
        
        res.json({ status: 'ok' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
