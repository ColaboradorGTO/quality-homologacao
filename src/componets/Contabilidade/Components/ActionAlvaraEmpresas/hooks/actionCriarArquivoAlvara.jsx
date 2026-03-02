import { useState } from "react"
import { post } from "../../../../../api/funcRequest";
import Swal from "sweetalert2";
import axios from "axios";

export const useCriarArquivoAlvara = ({
    usuarioLogado,
    optionsModulos,
    refetchVinculoAlvara
}) => {

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

    const onCriarArquivo = async (idVinculo, arquivos) => {
        if (optionsModulos[0]?.ALTERAR !== 'True') {
            Swal.fire({
                title: 'Acesso Negado',
                text: 'Você não tem permissão para adicionar alvara.',
                icon: 'error',
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            });
            return;
        }

        const confirmacao = await Swal.fire({
            title: 'Tem certeza?',
            text: `Certeza que deseja adicionar o anexo selecionado?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
            confirmButtonColor: '#7352A5',
            cancelButtonColor: '#FD1381',
            customClass: {
                container: 'custom-swal',
            },
        });

        if (!confirmacao.isConfirmed) return;

        const postData = {
            ARQUIVOSALVARA: arquivos,
            IDVINCULOALVARAEMPRESA: idVinculo,
            IDFUNCIONARIO: String(usuarioLogado.id),
        }
        try {
            const response = await post(`/arquivosAnexosAlvara`, postData);

            const textDados = JSON.stringify(postData)
            let textoFuncao = 'CONTABILIDADE/CRIAR ARQUIVO ALVARA PREFEITURA';
            const ipUsuario = await getIPUsuario();

            const postCreateLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            await post('/log-web', postCreateLog)

            if (response?.success === false) {
                Swal.fire({
                    title: 'Atenção',
                    text: response.msg,
                    icon: 'info',
                    customClass: {
                        container: 'custom-swal',
                    }
                });
                return;
            }

            Swal.fire({
                title: 'Sucesso',
                text: 'Atualização Realizada com Sucesso',
                icon: 'success',
                customClass: {
                    container: 'custom-swal',
                }
            });

            refetchVinculoAlvara();
            return response.data;
        } catch (error) {

            const textDados = JSON.stringify(postData)
            const ipUsuario = await getIPUsuario();
            let textoFuncao = 'CONTABILIDADE/ERRO AO CRIAR ARQUIVO ALVARA PREFEITURA';

            const postCreateLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            const responsPost = await post('/log-web', postCreateLog)

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
        onCriarArquivo
    }

}