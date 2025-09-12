const express = require('express');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/api/frete', (req, res) => {
    const {distanciaKm, precoPorKm = 2} = req.body;
    if (typeof distanciaKm !== 'number') {
        return res.status(400).json({error: `distanciaKm deve ser number`});
    }
    const frete = Number((distanciaKm * precoPorKm)).toFixed(2);
    res.json({distanciaKm, precoPorKm, frete});
});

app.get('/api/ping', (req, res) => res.json({ok: true}));

app.listen(PORT, () => {
    console.log(`Servidor rodadando em http://localhost:${PORT}`);
})