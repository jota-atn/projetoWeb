const getFrete = async () => {
    const distanciaKm = 10;
    const precoPorKm = 2;
    try {
        const resp = await fetch('/api/frete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ distanciaKm, precoPorKm })
        });

        if (!resp.ok) {
            const err = await resp.json().catch(()=>({}));
            console.log('Erro: ' + (err.error || resp.status));
        return;
        }

        const data = await resp.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (e) {
        console.log('Erro de rede: ' + e.message);
    }
} 

// getFrete()