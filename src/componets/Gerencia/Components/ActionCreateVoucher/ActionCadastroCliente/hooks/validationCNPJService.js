export const validationCNPJService = (cnpj) => {
    async function getDadosEnderecoViaCep_API_externa(cep) {
        const URL_VIA_CEP = 'https://viacep.com.br/ws/{CEP}/json/';
        cep = cep.replace(/\D/g, "");

        try {
            const response = await axios.get(URL_VIA_CEP.replace('{CEP}', cep));
            const data = response.data;
            let { erro } = data || {};

            // Se não houver erro, status é 200
            let status = erro ? 429 : 200;

            if (status !== 200) {
                return { status: 429, message: 'CEP INVÁLIDO OU NÃO ENCONTRADO, verifique e tente novamente!' };
            }

            return { status, data };
        } catch (respError) {
            let status = respError?.response?.status || 500;
            let message = respError?.response?.statusText || respError?.message || 'Erro ao consultar o CEP';
            return { status, message };
        }
    }

    async function validaCEP(cep, verificarNaApi = false) {
        const regex = /^[0-9]{5}-?[0-9]{3}$/;
        
        if (!regex.test(cep)){
            return false;
        }

        if(verificarNaApi){
            let respCep = await getDadosEnderecoViaCep_API_externa(cep);

            return !(respCep?.erro == 'true'); 
        }

        return true;
    }

    async function getDadosEnderecoViaCep_API_redundancia(cep) {
        const URL_VIA_CEP = 'https://opencep.com/v1/{CEP}.json';
        cep = cep.replace(/\D/g, "");

        try {
            const response = await axios.get(URL_VIA_CEP.replace('{CEP}', cep));
            const data = response.data;
            let { erro } = data || {};

            // Se não houver erro, status é 200
            let status = erro ? 429 : 200;

            if (status !== 200) {
                return { status: 429, message: 'CEP INVÁLIDO OU NÃO ENCONTRADO, verifique e tente novamente!' };
            }

            return { status, data };
        } catch (respError) {
            let status = respError?.response?.status || 500;
            let message = respError?.response?.statusText || respError?.message || 'Erro ao consultar o CEP';
            return { status, message };
        }
    }

}