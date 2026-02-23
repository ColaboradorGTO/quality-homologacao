import { useEffect, useState } from "react";
import { post, put } from "../../../../../api/funcRequest";
import axios from 'axios'
import Swal from "sweetalert2";


export const useEditarConta = ({ 
    dadosDetalheContaBanco, 
    optionsModulos, 
    usuarioLogado,
    handleClick, 
    handleClose
}) => {
    const [bancoSelecionado, setBancoSelecionado] = useState('');
    const [tipoPessoaSelecionada, setTipoPessoaSelecionada] = useState('');
    const [tipoContaSelecionada, setTipoContaSelecionada] = useState('');
    const [numeroAgencia, setNumeroAgencia] = useState('');
    const [digitoAgencia, setDigitoAgencia] = useState('');
    const [numeroConta, setNumeroConta] = useState('');
    const [digitoConta, setDigitoConta] = useState('');
    const [numeroContaSap, setNumeroContaSap] = useState('');
    const [descricaoConta, setDescricaoConta] = useState('');
    const [statusSelecionado, setStatusSelecionado] = useState('')
    const [ipUsuario, setIpUsuario] = useState('');

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
        if( dadosDetalheContaBanco.length > 0) {
            setBancoSelecionado({value:  dadosDetalheContaBanco[0].IDBANCO, label:  dadosDetalheContaBanco[0].DSBANCO});
            setTipoPessoaSelecionada({value:  dadosDetalheContaBanco[0].TPPESSOA, label:  dadosDetalheContaBanco[0].TPPESSOA === 'FISICA' ? 'Física' : 'Jurídica'});
            setTipoContaSelecionada({value:  dadosDetalheContaBanco[0].TPCONTA, label:  dadosDetalheContaBanco[0].TPCONTA });
            setNumeroAgencia( dadosDetalheContaBanco[0].NUAGENCIA || '');
            setDigitoAgencia( dadosDetalheContaBanco[0].NUDIGITOAGENCIA || '');
            setNumeroConta( dadosDetalheContaBanco[0].NUCONTA || '');
            setDigitoConta( dadosDetalheContaBanco[0].NUDIGITOCONTA || '');
            setNumeroContaSap( dadosDetalheContaBanco[0].NUCONTASAP || '');
            setDescricaoConta( dadosDetalheContaBanco[0].DSCONTABANCO || '');
            setStatusSelecionado({value:  dadosDetalheContaBanco[0].STATIVO, label:  dadosDetalheContaBanco[0].STATIVO ? 'Ativa' : 'Inativa'});
        }
        
    }, [ dadosDetalheContaBanco]);

    const onSubmit = async (data) => {
        if(optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Você não tem permissão para alterar a fatura.',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal', 
                },
            });
            return;
        }

        // ========== CONFIRMAÇÃO ANTES DO PUT ========== //
        const confirmResult = await Swal.fire({
            text: 'Deseja realmente executar esta ação?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f0ad4e',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, alterar!',
            cancelButtonText: 'Cancelar',
            customClass: {
                container: 'custom-swal',
            },
            width: '550px'
        });

        // Se o usuário cancelou, não continua
        if (!confirmResult.isConfirmed) {
            return;
        }
        // ========== FIM DA CONFIRMAÇÃO ========== //

        const putData = {
            IDCONTABANCO: parseInt(dadosDetalheContaBanco[0]?.IDCONTABANCO),
            IDBANCO: parseInt(bancoSelecionado?.value),
            DSCONTABANCO: descricaoConta,
            NUAGENCIA: numeroAgencia,
            NUDIGITOAGENCIA: digitoAgencia,
            NUCONTA: numeroConta,
            NUDIGITOCONTA: digitoConta,
            TPPESSOA: tipoPessoaSelecionada?.value,
            STPADRAO: dadosDetalheContaBanco[0]?.STPADRAO,
            STATIVO: statusSelecionado?.value,
            NUCONTASAP: numeroContaSap,
            TPCONTA: tipoContaSelecionada?.value || ''
        }

        try {
            const response = await put('/conta-banco/:id', putData)
            const textDados = JSON.stringify(putData)
            const ipUsuario = await getIPUsuario();
            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: `FINANCEIRO/ALTERACAO CONTA BANCO`,
                DADOS: textDados,
                IP: ipUsuario
            }
            
            await post('/log-web', postData)
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Conta bancária alterada com sucesso!',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal', 
                },
            })

            handleClick();
            handleClose();
            return response.data;
        } catch (error) {
            const textDados = JSON.stringify(putData)
            const ipUsuario = await getIPUsuario();
            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: `FINANCEIRO/ERRO AO ALTERAR CONTA BANCO`,
                DADOS: textDados,
                IP: ipUsuario
            }
            
            await post('/log-web', postData)
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Ocorreu um erro ao alterar a conta. Por favor, tente novamente.',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal', 
                },
            });
            console.error('Erro Alterar Conta Banco:', error);
            
        }
    }

    const OptionsStatus = [
        {value: "True", label: "Ativa" },
        {value: "False", label: "Inativa" },
    ]

    const OptionsTipoPessoa = [
        {value: "FISICA", label: "Física" },
        {value: "JURIDICA", label: "Jurídica" },
    ]
    
    const OptionsTipoConta = [
        {value: "BANCO", label: "Banco" },
        {value: "TESOURARIA", label: "Tesouraria" },
        {value: "TRANSPORTEVALORES", label: "Transporte de Valores" },
        {value: "DEVSOBRA", label: "Devolução Sobra" },
        {value: "Premiações/Promoções", label: "Premiações/Promoções" },
        {value: "Conta Transitória", label: "Transitória" },
    ]
    
    return {
        bancoSelecionado,
        setBancoSelecionado,
        tipoPessoaSelecionada,
        setTipoPessoaSelecionada,
        tipoContaSelecionada,
        setTipoContaSelecionada,
        numeroAgencia,
        setNumeroAgencia,
        digitoAgencia,
        setDigitoAgencia,
        numeroConta,
        setNumeroConta,
        digitoConta,
        setDigitoConta,
        numeroContaSap,
        setNumeroContaSap,
        descricaoConta,
        setDescricaoConta,
        statusSelecionado,
        setStatusSelecionado,
        OptionsStatus,
        OptionsTipoPessoa,
        OptionsTipoConta,
        onSubmit,

    }
}