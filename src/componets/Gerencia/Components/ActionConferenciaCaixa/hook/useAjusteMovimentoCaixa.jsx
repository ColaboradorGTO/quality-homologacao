import { useState } from "react"
import { post, put } from "../../../../../api/funcRequest";
import Swal from "sweetalert2";
import axios from "axios";
import { removerFormatacaoMoeda } from "../../../../../utils/formatMoeda";


export const useAjusteMovimentoCaixa = ({
    handleClose,
    dadosDetalheFechamento,
    usuarioLogado,
    optionsModulos,
    refetchCaixaMovimento
}) => {

    const [empresa, setEmpresa] = useState('')
    const [operadorCaixa, setOperadorCaixa] = useState('')
    const [motivoAjuste, setMotivoAjuste] = useState('')
    const [dataLancamento, setDataLancamento] = useState('')
    const [dinheiroInformado, setDinheiroInformado] = useState('')
    const [dinheiroAjuste, setDinheiroAjuste] = useState('')
    const [faturaInformada, setFaturaInformada] = useState('')
    const [faturaAjuste, setFaturaAjuste] = useState('')
    const [ipUsuario, setIpUsuario] = useState('')

    const getIPUsuario = async () => {
        let usuarioIP = null;

        try {
            const { data: ipWhoisData } = await axios.get("https://ifconfig.me/ip");
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


    const onSubmit = async (data) => {
        if (optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                title: 'Acesso Negado',
                html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para ajustar o movimento de caixa.`,
                icon: 'error',
                timer: 5000,
                customClass: {
                    container: 'custom-swal',
                }
            });
            return;
        }

        const txtObservacaoAjuste = motivoAjuste + '-' + 'Justificativa do Ajuste: ' + motivoAjuste + 'Data do Ajuste: ' + dataLancamento + 'Ajustado por: ' + usuarioLogado?.NOFUNCIONARIO
        const dinheiroAjusteNum = Number(removerFormatacaoMoeda(dinheiroAjuste));
        const fisicoNum = Number(dadosDetalheFechamento[0]?.TOTALFECHAMENTODINHEIROFISICO || 0);
        const vrQuebraNova = dinheiroAjusteNum - fisicoNum;

        const putData = {
            ID: dadosDetalheFechamento[0]?.ID,
            VRAJUSTDINHEIRO: parseFloat(removerFormatacaoMoeda(dinheiroAjusteNum)),
            VRAJUSTTEF: parseFloat(0),
            VRAJUSTPOS: parseFloat(0),
            VRAJUSTFATURA: parseFloat(removerFormatacaoMoeda(faturaAjuste)),
            VRAJUSTVOUCHER: parseFloat(0),
            VRAJUSTCONVENIO: parseFloat(0),
            VRAJUSTPIX: parseFloat(0),
            VRAJUSTPL: parseFloat(0),
            TXT_OBS: txtObservacaoAjuste,
            VRQUEBRACAIXA: parseFloat(vrQuebraNova),
        }
        try {
            const response = await put('/ajuste-recebimento', putData)

            const textDados = JSON.stringify(putData)
            let textoFuncao = 'GERENCIA/AJUSTE MOVIMENTO CAIXA';
            const ipUsuario = await getIPUsuario();

            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario || "Indisponível"
            }

            await post('/log-web', postData)

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

            const textDados = JSON.stringify(putData)
            const ipUsuario = await getIPUsuario();
            let textoFuncao = 'GERENCIA/ERRO AO AJUSTAR MOVIMENTO CAIXA';

            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario || "Indisponível"
            }

            const responsPost = await post('/log-web', postData)

            Swal.fire({
                title: 'Cadastro',
                text: 'Erro ao Tentar Confimar Alteração',
                icon: 'error',
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            });
            return responsPost.data
        }
    }

    return {
        empresa,
        setEmpresa,
        operadorCaixa,
        setOperadorCaixa,
        motivoAjuste,
        setMotivoAjuste,
        dataLancamento,
        setDataLancamento,
        dinheiroAjuste,
        setDinheiroAjuste,
        faturaInformada,
        setFaturaInformada,
        faturaAjuste,
        setFaturaAjuste,
        onSubmit
    }

}