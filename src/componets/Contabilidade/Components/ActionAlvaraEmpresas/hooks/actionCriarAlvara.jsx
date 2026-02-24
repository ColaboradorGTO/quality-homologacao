import { useState } from "react"
import { get, post, put } from "../../../../../api/funcRequest";
import Swal from "sweetalert2";
import axios from "axios";
import { removerFormatacaoMoeda } from "../../../../../utils/formatMoeda";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import { converterArquivosParaBase64 } from "../../../../../utils/converterFileBase64";

export const useCriarAlvara = ({ handleClose, dadosAlvaraSelecionado, usuarioLogado, optionsModulos, refetchAlvaraEmpresa, idAlvaraSelecionado, refetchAlvaraSelecionado }) => {
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

    const { data: optionsStatusAlvara = [], error: errorStatus, isLoading: isLoadingStatus, refetch: refetchStatus } = useQuery(
        'options-status-alvara',
        async () => {
            const response = await get(`/status-alvara`);
            console.log(response, 'response.data status alvara')
            return response.data;
        },
        { enabled: true, staleTime: 60 * 60 * 1000, }
    );

    const { data: vinculoAlvaraEmpresa = [], error: errorvinculoAlvaraEmpresa, isLoading: isLoadingvinculoAlvaraEmpresa, refetch: refetchvinculoAlvaraEmpresa } = useQuery(
        ['vinculo-alvaras-empresa', dadosAlvaraSelecionado?.[0]?.IDEMPRESA],
        async () => {
            const response = await get(`/alvaras-empresa-detalhe?idFilial=${Number(dadosAlvaraSelecionado?.[0]?.IDEMPRESA)}`);
            console.log(response, 'response.data status alvara')
            return response.data;
        },
        { enabled: !!dadosAlvaraSelecionado?.[0]?.IDEMPRESA, }
    );

    //const arquivoConvertido = converterArquivosParaBase64(arquivoAlvara)
    // console.log(arquivoConvertido, 'arquivoConvertido')

    /*     useEffect(() => {
            setStatusAlvara({ value: dadosAlvaraSelecionado?.[0]?.STATIVO == 'True' || "False", label: dadosAlvaraSelecionado?.[0]?.STATIVO == 'True' ? 'Ativo' : 'Inativo' })
            setDataIncioCompetencia(dadosAlvaraSelecionado?.[0]?.DTINICIOCOMPETENCIAALVARA)
            setDataFimCompetencia(dadosAlvaraSelecionado?.[0]?.DTFIMCOMPETENCIAALVARA)
            setStatusAndamento({ value: dadosAlvaraSelecionado?.[0]?.IDSTATUS, label: dadosAlvaraSelecionado?.[0]?.DESCRICAOSTATUS })
            setMetragemLoja(dadosAlvaraSelecionado?.[0]?.METRAGEMEMPRESA)
            setDescricaoDetalheAndamento(dadosAlvaraSelecionado?.[0]?.DESCRICAODETALHEANDAMENTO)
            setArquivoAlvara(dadosAlvaraSelecionado?.[0]?.ARQUIVOSALVARAS)
        }, [dadosAlvaraSelecionado]) */


    const optionsStatus = [
        { value: 'True', label: 'Ativo' },
        { value: 'False', label: 'Inativo' },
    ];

    //console.log(IDSTATUSANDAMENTO, 'arquivoAlvara')
    //console.log(dadosAlvaraSelecionado, 'dadosAlvaraSelecionado hook')

    const onSubmit = async () => {
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
            text: `Certeza que deseja salvar os dados do Alvará?`,
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

        const tratarResposta = (response) => {
            if (!response.data?.success) {
                throw new Error(response.data?.msg);
            }
            return response.data;
        }

        const arquivosConvertidos = await converterArquivosParaBase64(arquivoAlvara);

        const postData = {
            IDEMPRESA: dadosAlvaraSelecionado?.[0]?.IDEMPRESA,
            IDALVARA: idAlvaraSelecionado,
            STATIVO: "True",
            DTINICIOCOMPETENCIA: dataIncioCompetencia,
            DTFIMCOMPETENCIA: dataFimCompetencia,
            IDSTATUSANDAMENTO: Number(statusAndamento?.value),
            DESCRICAODETALHEANDAMENTO: descricaoDetalheAndamento,
            METRAGEMEMPRESA: Number(metragemLoja),
            IDFUNCIONARIO: Number(usuarioLogado.id),
            ARQUIVOSALVARA: arquivosConvertidos,
        }

        try {
            const response = await post('vinculoAlvarasEmpresa', postData)
            const textDados = JSON.stringify(postData)
            let textoFuncao = 'CONTABILIDADE/EDITAR ALVARA PREFEITURA';
            const ipUsuario = await getIPUsuario();

            const CreateLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            await post('/log-web', CreateLog)

            console.log(response, 'response')
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

            refetchAlvaraSelecionado();
            refetchAlvaraEmpresa();
            handleClose();
            return response.data;
        } catch (error) {

            const textDados = JSON.stringify(postData)
            const ipUsuario = await getIPUsuario();
            let textoFuncao = 'CONTABILIDADE/ERRO AOEDITAR ALVARA PREFEITURA';

            const CreateLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            const responsPost = await post('/log-web', CreateLog)

            Swal.fire({
                title: 'Cadastro',
                text: 'Erro ao Tentar Confimar Alteração',
                icon: 'error',
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            });
            return responsPost
        }
    }

    return {
        optionsStatusAlvara,
        optionsStatus,
        arquivoAlvara,
        setArquivoAlvara,
        descricaoDetalheAndamento,
        setDescricaoDetalheAndamento,
        dataFimCompetencia,
        setDataFimCompetencia,
        dataIncioCompetencia,
        setDataIncioCompetencia,
        statusAndamento,
        setStatusAndamento,
        statusAlvara,
        setStatusAlvara,
        metragemLoja,
        setMetragemLoja,
        onSubmit
    }

}