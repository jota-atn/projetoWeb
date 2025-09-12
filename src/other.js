/**
 * Normaliza o CEP removendo os caracteres que não são numéricos.
 * 
 * @param {string|number} cep - CEP que vai ser normalizado. 
 * @returns {string} CEP contendo apenas os 8 dígitos numéricos.
 */
const normalizeCep = cep => String(cep || '').replace(/\D/g, '');

/**
 * Obtém as informações de um CEP a partir do web service ViaCep.
 * 
 * @param {string|number} rawCep - CEP que vai ser utilizado para obter as informações. 
 * @param {number} timeout - o tempo máximo em ms antes de abordar a requisição.
 * @returns {Promise<Object>} Objeto JSON com os dados obtidos a partir do CEP (logradouro, bairro, localidade...).
 * @throws {Error} Se o CEP estiver inválido, ou seja não existir, ou se ocorrer o timeout/erro na rede.
 */
const getCepInfo = async (rawCep, timeout = 7000) => {
    const cep = normalizeCep(rawCep);
    if (!/^\d{8}$/.test(cep)) {
        throw new Error('CEP inválido: deve conter 8 dígitos numéricos.');
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            signal: controller.signal
        });

        clearTimeout(timer);

        if (!res.ok) {
            throw new Error(`ViaCEP retornou status ${res.status}`);
        }

        const data = await res.json();
        if (data.erro) throw new Error('CEP não encontrado.');

        return data;
    } catch (err) {
        if (err.name === 'AbortError') throw new Error('Tempo esgotado ao consultar ViaCEP.');
        throw err;
    }
};

// Exemplo de uso:
getCepInfo('58225-000').then(value => console.log(value)).catch(value => console.log(value));