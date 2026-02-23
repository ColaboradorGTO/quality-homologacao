import { useEffect, useState } from "react"
import axios from "axios"
import Swal from 'sweetalert2'
import { getDataHoraAtual } from "../../../../../utils/dataAtual"
import { get, post } from "../../../../../api/funcRequest"
import { useQuery } from "react-query"
import { removeMascaraCNPJ, validarCNPJ } from "../../../../../utils/mascaraCNPJ"

async function getDadosEnderecoViaCep_API_redundancia(cep) {
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

export const useCadastrarTransportadora = ({handleClose, usuarioLogado, optionsModulos, handleClick}) => {
    const [statusSelecionado, setStatusSelecionado] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [inscricaoEstadual, setInscricaoEstadual] = useState('')
    const [inscricaoMunicipal, setInscricaoMunicipal] = useState('')
    const [razaoSocial, setRazaoSocial] = useState('')
    const [nomeFantasia, setNomeFantasia] = useState('')
    const [cep, setCep] = useState('')
    const [endereco, setEndereco] = useState('')
    const [numero, setNumero] = useState('')
    const [complemento, setComplemento] = useState('')
    const [bairro, setBairro] = useState('')
    const [cidade, setCidade] = useState('')
    const [uf, setUf] = useState('')
    const [numeroIBGE, setNumeroIBGE] = useState('')
    const [nomeRepresentante, setNomeRepresentante] = useState('')
    const [email, setEmail] = useState('')
    const [telefone1, setTelefone1] = useState('')
    const [telefone2, setTelefone2] = useState('')
    const [telefone3, setTelefone3] = useState('')
    const [data, setData] = useState('')
    const [ipUsuario, setIpUsuario] = useState('');
    
    const URL_PUBLICAWS = 'https://publica.cnpj.ws/cnpj/{CNPJ}';
    const URL_MINHA_RECEITA = 'https://minhareceita.org/{CNPJ}';
    const URL_RECEITAWS = 'https://www.receitaws.com.br/v1/cnpj/{CNPJ}';

    
    useEffect(() => {
        const dataAtual = getDataHoraAtual()
        setData(dataAtual)
    },[])

    const getIPUsuario = async () => {
        let usuarioIP = null;

        try {
            const { data: ipWhoisData } = await axios.get("http://ipwho.is/");
            usuarioIP = ipWhoisData?.ip;
        } catch (error) {
            console.error("Erro ao buscar IP via ipwho.is:", error);
        }

        if (!usuarioIP) {
            try {
                const { data: ipifyData } = await axios.get("https://api.ipify.org?format=json");
                usuarioIP = ipifyData?.ip;
            } catch (error) {
                console.error("Erro ao buscar IP via ipify.org:", error);
            }
        }
        setIpUsuario(usuarioIP);
        return usuarioIP;
    };
    const optionsStatus = [
        { value: 'True', label: 'ATIVO' },
        { value: 'False', label: 'INATIVO' }
    ]

    async function getDadosCNPJRedundancia_API_externa(cnpj) {
        try {
            const response = await axios.get(URL_RECEITAWS.replace('{CNPJ}', cnpj));
            let { status, message } = response.data || {};

            if (status === 'OK') status = 200;
            if (status !== 200) throw { status, message };

            response.data.descApi = "API-receitaws";
            return { status, data: response.data };
        } catch (error) {
            let status = error?.response?.data?.status || error?.status || 400;
            let message = error?.response?.data?.message || error?.message;
            return { status, message };
        }
    }

    async function getDadosCNPJComIE_API_externa(cnpj) {
        console.log('🔥 CHAMADA API PUBLICA.WS - getDadosCNPJComIE_API_externa:', cnpj);
        try {
            const response = await axios.get(URL_PUBLICAWS.replace('{CNPJ}', cnpj));
            let status = response.data?.status || 200;
            if (status === 'OK') status = 200;

            response.data.descApi = "API-publicaws";
            return { status, data: response.data };
        } catch (error) {
            let status = error?.response?.data?.status || error?.status || 400;
            let message = error?.response?.data?.detalhes || error?.response?.data?.message || error?.message;
            return { status, message };
        }
    }

    async function getDadosExistenciaCNPJ_API_externa(cnpj) {
        
        try {
            const response = await axios.get(URL_MINHA_RECEITA.replace('{CNPJ}', cnpj));
            response.data = "API-minhareceita";
         
            return { status: 200, data: response.data };
            
        } catch (error) {
            let status = error?.response?.data?.status || error?.status || 400;
            let message = error?.response?.data?.message;
            if (!message && error?.response?.data?.responseText) {
                try {
                    message = JSON.parse(error.response.data.responseText)?.message;
            } catch {}
            }
          
            if (status !== 200 && status !== 400) {
                return await getDadosCNPJRedundancia_API_externa(cnpj);
            }
            return { status, message };
        }
    }

    async function busca_e_valida_dados_empresa_com_API_externa(cnpj, stUltimaInstancia = false) {
        cnpj = cnpj.replace(/\D/g, "");
        let objCliente = await getDadosExistenciaCNPJ_API_externa(cnpj);

        if(objCliente.status == 200) {
            const dadosComIE = await getDadosCNPJComIE_API_externa(cnpj); 

            if(dadosComIE.status == 200) {
                objCliente = dadosComIE;
            }
            
            const dados = objCliente.data;

            const dadosMapeados = {
                razao: dados.razao_social || '',
                fantasia: dados?.estabelecimento?.nome_fantasia || dados?.fantasia || dados?.nome_fantasia || dados?.razao_social || '',
                inscricaoEstadual: dados?.estabelecimento?.inscricoes_estaduais[0]?.inscricao_estadual || '',
                cnae: dados.estabelecimento?.atividade_principal?.id  || dados?.cnae_fiscal || '',
                dataCriacaoEmpresa: dados?.estabelecimento?.data_inicio_atividade || dados?.data_situacao ||  dados?.data_inicio_atividade || '',
                
                tel1: (dados?.estabelecimento?.ddd1 + dados?.estabelecimento?.telefone1) || dados?.telefone ||  (dados?.ddd_telefone || dados?.ddd_telefone_1.replace(/\D/g, "")) || '',
                tel2: (dados?.estabelecimento?.ddd2 + dados?.estabelecimento?.telefone2) || dados?.ddd_telefone_2 || '',
                email: dados?.estabelecimento?.email || dados?.email || '',
                cep: dados?.estabelecimento?.cep || dados?.cep || '',
                endereco: dados?.estabelecimento?.logradouro || dados?.logradouro || '',
                numeroEndereco: dados?.estabelecimento?.numero  || dados?.numero || '',
                complemento: dados?.estabelecimento?.complemento || dados?.complemento || '',

                bairro: dados?.estabelecimento?.bairro || dados?.bairro || '',
                cidade: dados?.estabelecimento?.cidade.nome || '',
                uf: dados?.estabelecimento?.estado?.sigla || '',
                codigoIbge: dados?.estabelecimento?.cidade?.ibge_id || ''
            };
            

            if(dadosMapeados) {
                setNomeFantasia(dadosMapeados.fantasia || '');
                setInscricaoEstadual(dadosMapeados.inscricaoEstadual || '');
                setRazaoSocial(dadosMapeados.razao || '');
                setCep(dadosMapeados.cep || '');
                setEndereco(dadosMapeados.endereco || '');
                setNumero(dadosMapeados.numeroEndereco || '');
                setComplemento(dadosMapeados.complemento || '');
                setBairro(dadosMapeados.bairro || '');
                setCidade(dadosMapeados.cidade || '');
                setUf(dadosMapeados.uf || '');
                setNumeroIBGE(dadosMapeados.codigoIbge || '');
                setEmail(dadosMapeados.email || '');
                setTelefone1(dadosMapeados.tel1 || '');
            }
            await getDadosEnderecoViaCep_API_redundancia(dadosMapeados.cep);
            return dadosMapeados;

        } else {
            !stUltimaInstancia && Swal.fire({
                title: 'Erro!',
                text: objCliente?.message || 'Erro ao tentar preencher os dados do cliente, recarregue e tente novamente!',
                icon: 'error',
                customClass: {
                    container: 'custom-swal',
                },
            });
            return null;
        }
    }

    async function preenche_cadastro_empresa_com_dados_de_API_externa(cnpj, stUltimaInstancia = false) {
        const dadosAPI = await busca_e_valida_dados_empresa_com_API_externa(cnpj, stUltimaInstancia);
 
        if(!dadosAPI) {
            return false;
        }

        const {
            razao,
            fantasia,
            inscricaoEstadual,
            cnae,
            dataCriacaoEmpresa,
            telefone1: tel1,
            telefone2: tel2,
            email,
            cep,
            endereco,
            numeroEndereco,
            complemento,
            bairro,
            cidade,
            uf,
            codigoIbge
        } = dadosAPI;
        console.log(fantasia, 'fantasia')
        if(razao) {
            setNomeFantasia(fantasia || '');
            setTelefone1(tel1 || '');
            setTelefoneComercial(tel2 || '');
            setCep(cep || '');
            setIE(inscricaoEstadual || '');
            setDataCriacao(dataCriacaoEmpresa || ''); 
            setNomeClienteRazao(razao || '');
            setSobrenome(fantasia || '');
            setEndereco(endereco || '');
            setNumero(numeroEndereco || '');
            setComplemento(complemento || '');
            setEmail(email || '');
            setBairro(bairro || '');
            setCidade(cidade || '');
            setEstado(uf || '');
            setNuIBGE(codigoIbge || '');


            if(cep) {
                await valida_e_preenche_cep_empresa_com_API_externa(cep, stUltimaInstancia);
            }
            return true;
        }
        
        return false;
    }

    const { data: dadosCNPJ = [], error: errorCNPJ, isLoading: isLoadingCNPJ, refetch: refetchCNPJ } = useQuery(
        ['transportadoras', cnpj], // ✅ Inclui cnpj na chave para invalidar cache
        async () => {
            const response = await get(`/transportadoras?cnpjTransportador=${cnpj}`);
            return response.data;
        },
        { 
            enabled: cnpj?.length >= 14,
            staleTime: 0, // ✅ Não fazer cache
            cacheTime: 0, // ✅ Remove do cache imediatamente 
        }
    );

    useEffect(() => {

        if (cnpj?.length >= 14 && dadosCNPJ && dadosCNPJ.length === 0) {
            // console.log('✅ Chamando API da Receita - Cliente NÃO encontrado no banco');
            // refetchCNPJ();
            preenche_dados_registrados([], cnpj);
        } else if (cnpj?.length >= 14 && dadosCNPJ && dadosCNPJ.length > 0) {
            // console.log('❌ NÃO chamando API da Receita - Cliente JÁ existe no banco:', dadosCNPJ[0]);
        }

    }, [dadosCNPJ, cnpj]);

    
    useEffect(() => {
        if(dadosCNPJ && dadosCNPJ.length > 0) {
            setCnpj(dadosCNPJ[0]?.NUCNPJ || '')
            setRazaoSocial(dadosCNPJ[0]?.NORAZAOSOCIAL || '')
            setNomeFantasia(dadosCNPJ[0]?.NOFANTASIA || '')
            setInscricaoEstadual(dadosCNPJ[0]?.NUINSCESTADUAL || '')
            setInscricaoMunicipal(dadosCNPJ[0]?.NUINSCMUNICIPAL || '')
            setEndereco(dadosCNPJ[0]?.EENDERECO || '')
            setNumero(dadosCNPJ[0]?.ENUMERO || '')
            setComplemento(dadosCNPJ[0]?.ECOMPLEMENTO || '')
            setBairro(dadosCNPJ[0]?.EBAIRRO || '')
            setCidade(dadosCNPJ[0]?.ECIDADE || '')
            setUf(dadosCNPJ[0]?.SGUF || '')
            setCep(dadosCNPJ[0]?.NUCEP || '')
            setNumeroIBGE(dadosCNPJ[0]?.NUIBGE || '')
            setNomeRepresentante(dadosCNPJ[0]?.NOREPRESENTANTE || '')
            setEmail(dadosCNPJ[0]?.EEMAIL || '')
            setTelefone1(dadosCNPJ[0]?.NUTELEFONE1 || '')
            setTelefone2(dadosCNPJ[0]?.NUTELEFONE2 || '')
            setTelefone3(dadosCNPJ[0]?.NUTELEFONE3 || '')
            setStatusSelecionado({value: dadosCNPJ[0]?.STATIVO || 'True', label: dadosCNPJ[0]?.STATIVO == 'True' ? 'ATIVO' : 'INATIVO' })
        }
    }, [dadosCNPJ])

    async function preenche_dados_registrados(response, cnpj, stUltimaInstancia = false) {
        let cnpjEmpresaVoucher = cnpj.replace(/\D/g, "");
     
        if(validarCNPJ(cnpj)) {
            await Swal.fire({
                text: 'Deseja Autocompletar ou Atualizar as Informações desta Transportadora Automaticamente!',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não',
                customClass: { container: 'custom-swal' }
            }).then(async (result) => {
                if (result.isConfirmed) {
                    // animationLoadingStart("Carregando os dados do CNPJ... Por favor aguarde!");
    

                    let status = await busca_e_valida_dados_empresa_com_API_externa(cnpjEmpresaVoucher);
    
                    if (status) {
                        await Swal.fire({
                            title: 'Sucesso!',
                            text: `Dados do CNPJ ${cnpj} carregados com sucesso!`,
                            icon: 'success',
                            customClass: {
                                container: 'custom-swal',
                            },
                        });
                    }
                }
                
            });

        }

        // await busca_e_valida_dados_empresa_com_API_externa(cnpjEmpresaVoucher, stUltimaInstancia);
    }

    const handleFechar = () => {
        setCnpj('');
        setInscricaoEstadual('');
        setInscricaoMunicipal('');
        setRazaoSocial('');
        setNomeFantasia('');
        setCep('');
        setEndereco('');
        setNumero('');
        setComplemento('');
        setBairro('');
        setCidade('');
        setUf('');
        setNumeroIBGE('');
        setNomeRepresentante('');
        setEmail('');
        setTelefone1('');
        setTelefone2('');
        setTelefone3('');
        setStatusSelecionado('');
        handleClose();
        // console.log(cnpj, 'Length após fechar:', cnpj?.length);
    }

    const onSubmit = async () => {
        if(optionsModulos[0]?.CRIAR == 'False') {
            Swal.fire({
                title: 'Erro!',
                text: `${usuarioLogado?.NOFUNCIONARIO},\nVocê não tem permissão para cadastrar Transportadora!`,
                customClass: {
                    container: 'custom-swal',
                },
            }); 
            return;
        }

        if (cnpj == '' || cnpj.length < 14) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: `CNPJ Incompleto, Faltam "${14 - cnpj.length}" Dígito(s)!`,
                text: `Favor Verificar o CNPJ!`,
                type: 'warning',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        if(razaoSocial == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Razão Social não pode ser vazia!',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        if(nomeFantasia == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Informe o Nome Fantasia do Transportador!',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        if(endereco == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Informe o Endereço do Transportador!',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        if(numero == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Informe o Número do Endereço do Transportador!',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        if(bairro == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Informe o Bairro do Transportador!',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        if(cidade == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Informe a Cidade do Transportador!',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        if(uf == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Informe o Estado do Transportador!',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        if(cep == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Informe o CEP do Transportador!',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }
        const postData = {
            IDGRUPOEMPRESARIAL: parseInt(1),
            IDSUBGRUPOEMPRESARIAL: parseInt(1),
            NORAZAOSOCIAL: razaoSocial,
            NOFANTASIA: nomeFantasia,
            NUCNPJ: removeMascaraCNPJ(cnpj),
            NUINSCESTADUAL: inscricaoEstadual,
            NUINSCMUNICIPAL: inscricaoMunicipal,
            NUIBGE: String(numeroIBGE),
            EENDERECO: endereco,
            ENUMERO: numero,
            ECOMPLEMENTO: complemento,
            EBAIRRO: bairro,
            ECIDADE: cidade,
            SGUF: uf,
            NUCEP: cep,
            EEMAIL: email,
            NUTELEFONE1: telefone1,
            NUTELEFONE2: telefone2,
            NUTELEFONE3: telefone3,
            NOREPRESENTANTE: nomeRepresentante,
            DTCADASTRO: data,
            DTULTATUALIZACAO: data,
            STATIVO: statusSelecionado?.value,
        }
        try {

            const response = await post('/cadastrar-transportador', postData)
      
            const textDados = JSON.stringify(postData)
            let textFuncao = 'COMPRAS/CADASTRO-EDIÇÃO DE TRANSPORTADORA';
            const ipUsuario = await getIPUsuario();
            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }
            
            await post('/log-web', createtLog)
            
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Atualizado com sucesso!',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })
            handleClick();
            handleFechar();
            return responseLog.data;
        } catch (error) {
            const textDados = JSON.stringify(postData)
            let textFuncao = 'COMPRAS/CADASTRO-EDIÇÃO DE TRANSPORTADORA';
            const ipUsuario = await getIPUsuario();
            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            const responseLog = await post('/log-web', createtLog)

            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                },
            });
            console.error('Erro ao criar categoria pedido:', error);
        }
    }

    return {
        statusSelecionado,
        setStatusSelecionado,
        cnpj,
        setCnpj,
        inscricaoEstadual,
        setInscricaoEstadual,
        inscricaoMunicipal,
        setInscricaoMunicipal,
        razaoSocial,
        setRazaoSocial,
        nomeFantasia,
        setNomeFantasia,
        cep,
        setCep,
        endereco,
        setEndereco,
        numero,
        setNumero,
        complemento,
        setComplemento,
        bairro,
        setBairro,
        cidade,
        setCidade,
        uf,
        setUf,
        numeroIBGE,
        setNumeroIBGE,
        nomeRepresentante,
        setNomeRepresentante,
        email,
        setEmail,
        telefone1,
        setTelefone1,
        telefone2,
        setTelefone2,
        telefone3,
        setTelefone3,
        optionsStatus,
        handleFechar,
        onSubmit,
    }
}