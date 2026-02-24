import { useState } from "react"
import { post, put } from "../../../../../api/funcRequest";
import Swal from "sweetalert2";
import axios from "axios";

export const useEditarArquivoAlvara = ({
    usuarioLogado,
    optionsModulos,
    refetchVinculoAlvara
}) => {
    const [ipUsuario, setIpUsuario] = useState('')

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

    const onEditarArquivo = async (row, arquivos) => {
        if (optionsModulos[0]?.ALTERAR !== 'True') {
            Swal.fire({
                title: 'Acesso Negado',
                text: 'Você não tem permissão para alterar este Alvara.',
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
            text: `Certeza que deseja substituir ou adicionar o anexo?`,
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

        const putData = {
            ARQUIVOSALVARA: arquivos,
            IDVINCULOALVARAEMPRESA: row.IDVINCULO,
            IDFUNCIONARIO: String(usuarioLogado.id),
            IDARQUIVOSALVARA: row.IDARQUIVOSALVARA,
        }
        try {
            const stCancelar = 'False';
            const response = await put(`/arquivosAnexosAlvara/:id?cancelar=${stCancelar}`, putData);

            const textDados = JSON.stringify(putData)
            let textoFuncao = 'CONTABILIDADE/EDITAR ALVARA PREFEITURA';
            const ipUsuario = await getIPUsuario();

            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            await post('/log-web', postData)

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

            refetchVinculoAlvara()

            return response.data;
        } catch (error) {

            const textDados = JSON.stringify(putData)
            const ipUsuario = await getIPUsuario();
            let textoFuncao = 'CONTABILIDADE/ERRO AOEDITAR ALVARA PREFEITURA';

            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
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
        onEditarArquivo,
    }

}