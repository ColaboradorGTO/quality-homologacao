import { useState } from "react"
import { get, post, put } from "../../../../../api/funcRequest";
import Swal from "sweetalert2";
import axios from "axios";
import { removerFormatacaoMoeda } from "../../../../../utils/formatMoeda";
import { useEffect } from "react";
import { useQuery } from "react-query";

export const useCancelarArquivoAlvara = ({ handleClose, dadosAlvaraSelecionado, usuarioLogado, optionsModulos, refetchAlvaraEmpresa, refetchVinculoAlvara }) => {
    const [arquivoAlvara, setArquivoAlvara] = useState([])
    const [descricaoDetalheAndamento, setDescricaoDetalheAndamento] = useState('')
    const [dataFimCompetencia, setDataFimCompetencia] = useState('')
    const [dataIncioCompetencia, setDataIncioCompetencia] = useState('')
    const [statusAndamento, setStatusAndamento] = useState('')
    const [statusAlvara, setStatusAlvara] = useState('')
    const [metragemLoja, setMetragemLoja] = useState('')
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


    /*     useEffect(() => {
            setStatusAlvara(dadosAlvaraSelecionado?.[0]?.STATIVO)
            setDataIncioCompetencia(dadosAlvaraSelecionado?.[0]?.DTINICIOCOMPETENCIAALVARA)
            setDataFimCompetencia(dadosAlvaraSelecionado?.[0]?.DTFIMCOMPETENCIAALVARA)
            setStatusAndamento(dadosAlvaraSelecionado?.[0]?.DESCRICAOSTATUS)
            setMetragemLoja(dadosAlvaraSelecionado?.[0]?.METRAGEMEMPRESA)
            setDescricaoDetalheAndamento(dadosAlvaraSelecionado?.[0]?.DESCRICAODETALHEANDAMENTO)
            setArquivoAlvara(dadosAlvaraSelecionado?.[0]?.ARQUIVALVARA)
        }, [dadosAlvaraSelecionado]) */


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
