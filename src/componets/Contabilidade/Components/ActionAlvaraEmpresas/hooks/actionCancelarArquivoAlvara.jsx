import { useState } from "react"
import { post, put } from "../../../../../api/funcRequest";
import Swal from "sweetalert2";
import axios from "axios";

export const useCancelarArquivoAlvara = ({
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

    const onSubmit = async (row) => {
        if (optionsModulos[0]?.ALTERAR !== 'True') {
            Swal.fire({
                icon: 'error',
                title: 'Atenção!',
                text: 'Você não tem permissão para cancelar este arquivo.',
                confirmButtonColor: '#7352A5',
            });
            return;
        }

        const confirmacao = await Swal.fire({
            title: 'Tem certeza?',
            text: `Certeza que deseja cancelar o anexo "${row.NOMEARQUIVOALVARA}"?`,
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
            IDARQUIVOSALVARA: row.IDARQUIVOSALVARA,
            IDFUNCIONARIO: String(usuarioLogado?.id),
            STATIVO: "False"
        };

        try {
            const stCancelar = 'True';
            const response = await put(`/arquivosAnexosAlvara/:id?cancelar=${stCancelar}`, putData);

            const textDados = JSON.stringify(putData)
            let textoFuncao = 'CONTABILIDADE/CANCELAR ALVARA PREFEITURA';
            const ipUsuario = await getIPUsuario();

            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            await post('/log-web', postData)

            Swal.fire({
                title: 'Arquivo cancelado!',
                icon: 'success',
                timer: 3000,
                showConfirmButton: false,
                customClass: {
                    container: 'custom-swal',
                }
            });

            refetchVinculoAlvara();
            return response.data;

        } catch (error) {
            console.error("Erro ao cancelar arquivo:", error);

            const textDados = JSON.stringify(putData)
            const ipUsuario = await getIPUsuario();
            let textoFuncao = 'CONTABILIDADE/ERRO AO CANCELAR ALVARA PREFEITURA';

            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            const responsPost = await post('/log-web', postData)

            Swal.fire({
                title: 'Erro!',
                text: 'Erro ao Tentar Cancelar o Arquivo',
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
        onSubmit
    }
}
