import { useEffect, useState } from "react"
import axios from 'axios'
import Swal from "sweetalert2"
import { get, post } from "../../../../../api/funcRequest"
import { getDataAtual } from "../../../../../utils/dataAtual"
import { useQuery } from "react-query"
import { toFloat } from "../../../../../utils/toFloat"


export const useCadastrarCondicaoPagamento = ({handleClose, usuarioLogado, optionsModulos, handleClick}) => {
    const [statusSelecionado, setStatusSelecionado] = useState('')
    const [descricao, setDescricao] = useState('')
    const [parceladoSelecionado, setParceladoSelecionado] = useState('')
    const [numeroParcelas, setNumeroParcelas] = useState('')
    const [dias1Pagamento, setDias1Pagamento] = useState('')
    const [qtdDiasPagamento, setQtdDiasPagamento] = useState('')
    const [tipoDocumentoSelecionado, setTipoDocumentoSelecionado] = useState('')
    const [condPagamento, setCondPagamento] = useState('')
    const [dataUltimaAlteracao, setDataUltimaAlteracao] = useState('')
    const [ipUsuario, setIpUsuario] = useState('');
   

    const { data: dadosTipoDocumentos = [], error: errorDocumento, isLoading: isLoadingDocumento } = useQuery(
        'tipoDocumento', 
        async () => {
            const response = await get(`/tipoDocumento`);
    
            return response.data;
        },
        { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 60 * 60 * 1000, }
    );

    const optionsStatus = [
        { value: 'True', label: 'ATIVO' },
        { value: 'False', label: 'INATIVO' }
    ]
    const optionsParcelado = [
        { value: 'True', label: 'SIM' },
        { value: 'False', label: 'NAO' }
    ]

    useEffect(() => {
        const dataAtual = getDataAtual();
        setDataUltimaAlteracao(dataAtual);
    })

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
    
    const cadastrar = async () => {
        if(optionsModulos[0]?.CRIAR == 'False') {
            Swal.fire({
                title: 'Erro!',
                text: `${usuarioLogado?.NOFUNCIONARIO},\nVocê não tem permissão para criar uma Condição de Pagamento!`,
                icon: 'error',
                customClass: {
                    container: 'custom-swal',
                },
            })
            return;
        }

        if (descricao == '') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'O campo descrição é obrigatório.',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        const diasParcelas = [];
        
        for(let i = 1; i < numeroParcelas; i++) {
            if (i == 1) {
                diasParcelas[i] = toFloat(dias1Pagamento) + toFloat(qtdDiasPagamento);
            } else {
                diasParcelas[i] = diasParcelas[i - 1] + toFloat(qtdDiasPagamento);
            }
        }

        const postData = {
            IDGRUPOEMPRESARIAL: 1,
            DSCONDICAOPAG: descricao,
            STPARCELADO: parceladoSelecionado.value,
            NUPARCELAS: toFloat(numeroParcelas),
            NUNDIA1PAG: toFloat(dias1Pagamento),
            NUNDIA2PAG: diasParcelas[1] || 0,
            NUNDIA3PAG: diasParcelas[2] || 0,
            NUNDIA4PAG: diasParcelas[3] || 0,
            NUNDIA5PAG: diasParcelas[4] || 0,
            NUNDIA6PAG: diasParcelas[5] || 0,
            NUNDIA7PAG: diasParcelas[6] || 0,
            NUNDIA8PAG: diasParcelas[7] || 0,
            NUNDIA9PAG: diasParcelas[8] || 0,
            NUNDIA10PAG: diasParcelas[9] || 0,
            NUNDIA11PAG: diasParcelas[10] || 0,
            NUNDIA12PAG: diasParcelas[11] || 0,
            DTULTALTERACAO: dataUltimaAlteracao,
            STATIVO: statusSelecionado.value,
            QTDDIAS: toFloat(qtdDiasPagamento),
            IDTPDOCUMENTO: toFloat(tipoDocumentoSelecionado.value),
        }
        try {

            const response = await post('/cadastrarCondicaoPagamento', postData)

            const textDados = JSON.stringify(postData)
            let textFuncao = 'COMPRAS/CADASTRO DE CONDIÇÕES DE PAGAMENTO';
            const ipUsuario = await getIPUsuario();
            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }
            
            const responseLog = await post('/log-web', createtLog)
            handleClick();
            handleClose();
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
            return responseLog.data;
        } catch (error) {
            const textDados = JSON.stringify(postData)
            let textFuncao = 'COMPRAS/ERRO AO CADASTRAR CONDIÇÕES DE PAGAMENTO';
            const ipUsuario = await getIPUsuario();
            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            const responseLog = await post('/log-web', createtLog)
            handleClick();
            handleClose();
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
        descricao,
        setDescricao,
        parceladoSelecionado,
        setParceladoSelecionado,
        numeroParcelas,
        setNumeroParcelas,
        dias1Pagamento,
        setDias1Pagamento,
        qtdDiasPagamento,
        setQtdDiasPagamento,
        tipoDocumentoSelecionado,
        setTipoDocumentoSelecionado,
        condPagamento,
        setCondPagamento,
        usuarioLogado,
        ipUsuario,
        optionsStatus,
        optionsParcelado,
        dadosTipoDocumentos,
        cadastrar,
    }
}
