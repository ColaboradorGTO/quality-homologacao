import { useState } from "react";
import { post } from "../../../../../api/funcRequest";
import axios from "axios";
import Swal from "sweetalert2";

export const useCadastrarConta = ({
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

    const onSubmit = async (data) => {
        if (optionsModulos[0]?.CRIAR == 'False') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                html: `${usuarioLogado?.NOFUNCIONARIO} <br> Você não tem permissão para cadastrar uma conta bancária.`,
                showConfirmButton: true,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                },
            });
            return;
        }

        const confirmResult = await Swal.fire({
            title: 'Confirmar Cadastro',
            text: 'Deseja realmente executar esta ação?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
            customClass: {
                container: 'custom-swal',
                actions: 'swal-button-spacing'
            },
            width: '500px',
            buttonsStyling: false,
            didOpen: () => {
                const style = document.createElement('style');
                style.innerHTML = '.swal-button-spacing button { margin: 0 5px; }';
                document.head.appendChild(style);
            }
        });

        if (!confirmResult.isConfirmed) {
            return;
        }

        const posData = {
            IDBANCO: parseInt(bancoSelecionado?.value),
            DSCONTABANCO: descricaoConta,
            NUAGENCIA: numeroAgencia,
            NUDIGITOAGENCIA: digitoAgencia,
            NUCONTA: numeroConta,
            NUDIGITOCONTA: digitoConta,
            TPPESSOA: tipoPessoaSelecionada?.value,
            STATIVO: statusSelecionado?.value,
            NUCONTASAP: numeroContaSap,
            TPCONTA: tipoContaSelecionada?.value
        }

        try {

            const response = await post('/cadastrar-conta-banco', posData)
            const textDados = JSON.stringify(posData)
            const ipUsuario = await getIPUsuario();
            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: `FINANCEIRO/CRIACAO CONTA BANCO`,
                DADOS: textDados,
                IP: ipUsuario
            }

            await post('/log-web', postData)
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Conta bancária cadastrada com sucesso!',
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
            const textDados = JSON.stringify(posData)
            const ipUsuario = await getIPUsuario();
            const postDataError = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: `FINANCEIRO/ERRO AO CADASTRAR CONTA BANCO`,
                DADOS: textDados,
                IP: ipUsuario
            }

            await post('/log-web', postDataError)
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Ocorreu um erro ao cadastrar a conta. Por favor, tente novamente.',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                },
            });
            console.error('Erro Cadastrar Conta Banco:', error);
            return error;
        }
    }

    const OptionsStatus = [
        { value: "True", label: "Ativa" },
        { value: "False", label: "Inativa" },
    ]

    const OptionsTipoPessoa = [
        { value: "FISICA", label: "Física" },
        { value: "JURIDICA", label: "Jurídica" },
    ]

    const OptionsTipoConta = [
        { value: "BANCO", label: "Banco" },
        { value: "TESOURARIA", label: "Tesouraria" },
        { value: "TRANSPORTEVALORES", label: "Transporte de Valores" },
        { value: "DEVSOBRA", label: "Devolução Sobra" },
        { value: "Premiações/Promoções", label: "Premiações/Promoções" },
        { value: "Conta Transitória", label: "Transitória" },
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