import { useEffect, useState } from "react"
import { post } from "../../../../../api/funcRequest";
import Swal from "sweetalert2";
import axios from "axios";
import { getDataHoraAtual } from "../../../../../utils/horaAtual";
import { removerFormatacaoMoeda } from "../../../../../utils/formatMoeda";

export const useCadastroFaturas = ({ handleClose, dadosDetelheFatura, usuarioLogado, optionsModulos, refetchCaixaMovimento }) => {
    const [empresa, setEmpresa] = useState('')
    const [codAutorizacao, setCodAutorizacao] = useState('')
    const [valorFatura, setValorFatura] = useState(0)
    const [numeroMovimento, setNumeroMovimento] = useState('')
    const [ipUsuario, setIpUsuario] = useState('')
    const [horaAtual, setHoraAtual] = useState('')

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

    useEffect(() => {
        const data = getDataHoraAtual()
        setHoraAtual(data)
    }, [])

    const onSubmit = async (data) => {
        if (optionsModulos[0]?.CRIAR == 'False') {
            Swal.fire({
                title: 'Acesso Negado',
                text: 'Você não tem permissão para alterar este registro.',
                icon: 'error',
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            });
            return;
        }

        const postData = {
            IDEMPRESA: Number(usuarioLogado.IDEMPRESA),
            IDFUNCIONARIO: Number(dadosDetelheFatura[0].IDOPERADORFECHAMENTO),
            IDDETALHEFATURALOCAL: null,
            IDCAIXAWEB: Number(dadosDetelheFatura[0].IDCAIXAFECHAMENTO),
            IDCAIXALOCAL: null,
            NUESTABELECIMENTO: "",
            NUCARTAO: "",
            DTPROCESSAMENTO: String(dadosDetelheFatura[0].DTABERTURAMOVCAIXA),
            HRPROCESSAMENTO: String(horaAtual),
            NUNSU: "",
            NUNSUHOST: "",
            IDMOVIMENTOCAIXAWEB: String(dadosDetelheFatura[0].ID),
            NUCODAUTORIZACAO: String(codAutorizacao),
            VRRECEBIDO: Number(removerFormatacaoMoeda(valorFatura)),
            DTHRMIGRACAO: null,
            STCANCELADO: 'False',
            IDUSRCACELAMENTO: null,
        }

        try {
            const response = await post('/criar-detalhe-fatura', postData)
            const textDados = JSON.stringify(postData)
            const ipUsuario = await getIPUsuario();
            let textoFuncao = 'GERENCIA/AJUSTE LANÇAR FATURA';

            const createData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            await post('/log-web', createData)

            Swal.fire({
                title: 'Atualização',
                text: 'Atualização Realizada com Sucesso',
                icon: 'success',
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            });

            handleClose()
            refetchCaixaMovimento()
            return response.data;
        } catch (error) {

            const textDados = JSON.stringify(postData)
            const ipUsuario = await getIPUsuario();
            let textoFuncao = 'GERENCIA/ERRO AO LANCAR FATURA';

            const createData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            const responsePost = await post('/log-web', createData)
            Swal.fire({
                title: 'Cadastro',
                text: 'Erro ao Tentar Confimar Alteração',
                icon: 'error',
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            });

            console.log(error);
            return responsePost.data
        }
    }

    return {
        onSubmit,
        empresa,
        setEmpresa,
        codAutorizacao,
        setCodAutorizacao,
        valorFatura,
        setValorFatura,
        numeroMovimento,
        setNumeroMovimento,
        horaAtual,
        setHoraAtual
    }
}

