import { useEffect, useState } from "react"
import axios from "axios"
import Swal from 'sweetalert2'
import { getDataHoraAtual } from "../../../../../utils/dataAtual"
import { get, post, put } from "../../../../../api/funcRequest"
import { useQuery } from "react-query"
import { useFetchData } from "../../../../../hooks/useFetchData"
import { validarCNPJ } from "../../../../../utils/mascaraCNPJ"
import { optionsTipoFrete } from "../../../../../../parceiro.json"

export const useCadastrarNFEdeEntrada = ({ handleClose, usuarioLogado, optionsModulos, handleClick }) => {
    
    const [condicaoPagamento, setCondicaoPagamento] = useState('');
    const [tipoFrete, setTipoFrete] = useState('');
    const [fornecedorExistente, setFornecedorExistente] = useState([]);
    const [ipUsuario, setIpUsuario] = useState('');
    const [fornecedorSelecionado, setFornecedorSelecionado] = useState("")
    const [marcaSelecionada, setMarcaSelecionada] = useState('');
    const [compradorSelecionado, setCompradorSelecionado] = useState('');
    const [usoPrincipalSelecionado, setUsoPrincipalSelecionado] = useState('');
    const [statusSelecionado, setStatusSelecionado] = useState('');
    const [saldoSelecionado, setSaldoSelecionado] = useState('');
    const [dataCadastro, setDataCadastro] = useState('');
    const [dataEmissao, setDataEmissao] = useState('');
    const [filialSelecionada, setFilialSelecionada] = useState('');
    const [cnpjFilial, setCnpjFilial] = useState('');
    const [tipoNFESelecionada, setTipoNFESelecionada] = useState('');
    const [numeroNFE, setNumeroNFE] = useState('');
    const [serieNFE, setSerieNFE] = useState('');
    const [modeloNFE, setModeloNFE] = useState('');
    const [chaveNFE, setChaveNFE] = useState('');
    const [numeroPedido, setNumeroPedido] = useState('');
    const [observacao, setObservacao] = useState('');
    const [totalAntesDesconto, setTotalAntesDesconto] = useState('');
    const [desconto, setDesconto] = useState('');
    const [adiantamentoTotal, setAdiantamentoTotal] = useState('');
    const [despesasAdicionais, setDespesasAdicionais] = useState('');
    const [impostos, setImpostos] = useState('');
    const [impostoRetido, setImpostoRetido] = useState('');
    const [totalPagar, setTotalPagar] = useState('');
    const [valorAplicado, setValorAplicado] = useState('');
    const [saldo, setSaldo] = useState('');

    const URL_PUBLICAWS = 'https://publica.cnpj.ws/cnpj/{CNPJ}';
    const URL_MINHA_RECEITA = 'https://minhareceita.org/{CNPJ}';
    const URL_RECEITAWS = 'https://www.receitaws.com.br/v1/cnpj/{CNPJ}';
    
    useEffect(() => {
        const dataAtual = getDataHoraAtual()
        setData(dataAtual)
    }, [])


    const getIPUsuario = async () => {
        let usuarioIP = null;

        try {
            const { data: ipWhoisData } = await axios.get("https://ifconfig.me/ip");
            usuarioIP = ipWhoisData?.ip;
        } catch (error) {
            console.error("Erro ao buscar IP via ifconfig.me:", error);
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
    
    
    const { data: dadosCondicoesPagamento = [], error: errorPagamento, isLoading: isLoadingPagamento } = useQuery(
        'condicaoPagamento',
        async () => {
        const response = await get(`/condicaoPagamento`);

        return response.data;
        },
        { enabled: true, staleTime: 60 * 60 * 1000, }
    );

    const { data: dadosTransportadora = [], error: errorTransportadora, isLoading: isLoadingTransportadora } = useQuery(
        'transportadoras',
        async () => {
        const response = await get(`/transportadoras`);

        return response.data;
        },
        { enabled: true, staleTime: 60 * 60 * 1000, }
    );

    const { data: dadosComprador = [], error: errorComprador, isLoading: isLoadingComprador, refetch: refetchComprador } = useQuery(
        'compradores',
        async () => {
            const response = await get(`/compradores`);
            return response.data;
        },
        { staleTime: 60 * 60 * 1000, enabled: true, cacheTime: 60 * 60 * 1000 }
    );

    const { data: dadosEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch: refetchEmpresas } = useQuery(
        'listaEmpresaComercial',
        async () => {
          const response = await get(`/listaEmpresaComercial`);
    
          return response.data;
        },
        { enabled: true, staleTime: 60 * 60 * 1000, }
    );

    const { data: dadosUsoPrincipal = [], error: errorUsoPrincipal, isLoading: isLoadingUsoPrincipal, refetch: refetchUsoPrincipal } = useQuery(
        'uso-principal',
        async () => {
          const response = await get(`/uso-principal`);
    
          return response.data;
        },
        { enabled: true, staleTime: 60 * 60 * 1000, }
    );

    const { data: dadosFornecedores = [], error: errorFornecedor, isLoading: isLoadingFornecedo } = useQuery(
        'fornecedores',
        async () => {
        const response = await get(`/fornecedores`);

        return response.data;
        },
        { enabled: true, staleTime: 60 * 60 * 1000, }
    );


    const { data: dadosNfePedido = [], error: errorNFE, isLoading: isLoadingNFE } = useQuery(
        ['cadastro-nfpedido'],
        async () => {
            const response = await get(`/cadastro-nfpedido?idPedido`);

            return response.data;
        },
        { enabled: false }
    );

    const { data: dadosCNPJ = [], error: errorCNPJ, isLoading: isLoadingCNPJ } = useQuery(
        ['fornecedores', cnpj],
        async () => {
            const response = await get(`/fornecedores?CNPJFornecedor=${cnpj}`);
            setFornecedorExistente(response.data);
            return response.data;
        },
        { enabled: cnpj.length > 13  }
    );
    

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

    async function preenche_dados_registrados(response, cnpj, stUltimaInstancia = false) {
        let cnpjEmpresa = cnpj.replace(/\D/g, "");
       
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
    

                    let status = await busca_e_valida_dados_empresa_com_API_externa(cnpjEmpresa);
    
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
    useEffect(() => {

        if (cnpj?.length >= 14 && dadosCNPJ && dadosCNPJ.length === 0) {
            preenche_dados_registrados([], cnpj);
        } else if (cnpj?.length >= 14 && dadosCNPJ && dadosCNPJ.length > 0) {
           console.log('✅ Cliente encontrado no banco de dados interno.');
        }

    }, [dadosCNPJ, cnpj]);

    useEffect(() => {
        if(dadosCNPJ && dadosCNPJ.length > 0) {

        }
    }, [dadosCNPJ])
     
    const handleFechar = () => {
        handleClose();
    }

    const onSubmit = async () => {
        if (optionsModulos[0]?.CRIAR == 'False') {
            Swal.fire({
                icon: 'error',
                title: 'Acesso Negado!',
                html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para cadastrar um Fornecedor!`,
                customClass: {
                    container: 'custom-swal',
                },
            });
            return;
        }


        const isUpdate = fornecedorExistente.length > 0 && idFornecedor;
        
        const postData = {
            ...(isUpdate && { IDFORNECEDOR: idFornecedor }),
            IDGRUPOEMPRESARIAL: 1,
            IDSUBGRUPOEMPRESARIAL: 1,
            MODPEDIDO: 'NENHUM',
            NORAZAOSOCIAL: razaoSocial,
            NOFANTASIA: nomeFantasia,
            NUCNPJ: cnpj,
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
            STATIVO: situacaoSelecionada.value,
            IDCONDPAGPADRAO: parseInt(condicaoPagamento.value),
            IDTRANSPORTADORAPADRAO: parseInt(transportadora.value),
            TPPEDIDOPADRAO: tipoPedido.value,
            NOVENDEDORPADRAO: vendedor,
            TPFRETEPADRAO: tipoFrete.value,
            TPARQUIVOPADRAO: enviar.value,
            TPFISCALPADRAO: fiscal.value,
            EMAILVENDEDORPADRAO: emailVendedor,
        }
        try {
            
            const response = isUpdate ? await put('/fornecedor/:id', postData) : await post('/cadastrar-fornecedor', postData)

            const textDados = JSON.stringify(postData)
            let textFuncao = isUpdate ? 'COMPRAS/ATUALIZAR FORNECEDOR' : 'COMPRAS/CADASTRO DE FORNECEDOR';
            const ipUsuario = await getIPUsuario();

            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'Indisponível'
            }

            await post('/log-web', createtLog)

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: isUpdate ? 'Atualizado!' : 'Cadastrado!',
                text: isUpdate ? 'Fornecedor atualizado com sucesso.' : 'Fornecedor cadastrado com sucesso.',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })
            handleClick();
            handleClose();
            return response.data;
        } catch (error) {
            const textDados = JSON.stringify(postData)
            let textFuncao = isUpdate ? 'COMPRAS/ ERRO AO ATUALIZAR FORNECEDOR' : 'COMPRAS/ ERRO AO CADASTRAR FORNECEDOR';
            const ipUsuario = await getIPUsuario();
            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'Indisponível'
            }

            await post('/log-web', createtLog)

            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                },
            });
            console.error('Erro ao criar fornecedor:', error);
        }
    }

    return {
        fornecedorSelecionado, 
        setFornecedorSelecionado,
        condicaoPagamento,
        setCondicaoPagamento,
        numeroPedido,
        setNumeroPedido,
        marcaSelecionada,
        setMarcaSelecionada,
        compradorSelecionado,
        setCompradorSelecionado,
        usoPrincipalSelecionado,
        setUsoPrincipalSelecionado,
        tipoFrete,
        setTipoFrete,
        statusSelecionado,
        setStatusSelecionado,
        saldoSelecionado,
        setSaldoSelecionado,
        dataCadastro,
        setDataCadastro,
        dataEmissao,
        setDataEmissao,
        filialSelecionada,
        setFilialSelecionada,
        cnpjFilial,
        setCnpjFilial,
        tipoNFESelecionada,
        setTipoNFESelecionada,
        numeroNFE,
        setNumeroNFE,
        serieNFE,
        setSerieNFE,
        modeloNFE,
        setModeloNFE,
        chaveNFE,
        setChaveNFE,
        observacao,
        setObservacao,
        totalAntesDesconto,
        setTotalAntesDesconto,
        desconto,
        setDesconto,
        adiantamentoTotal,
        setAdiantamentoTotal,
        despesasAdicionais,
        setDespesasAdicionais,
        impostos,
        setImpostos,
        impostoRetido,
        setImpostoRetido,
        totalPagar,
        setTotalPagar,
        valorAplicado,
        setValorAplicado,
        saldo,
        setSaldo,
        dadosCondicoesPagamento,
        dadosTransportadora,
        dadosComprador,
        dadosEmpresas,
        dadosUsoPrincipal,
        dadosFornecedores,
        dadosNfePedido,
        optionsTipoFrete, 
        handleFechar,
        onSubmit,
    }
}

