import { useState } from "react"
import { get, post, put } from "../../../../../api/funcRequest";
import Swal from "sweetalert2";
import axios from "axios";
import { removerFormatacaoMoeda } from "../../../../../utils/formatMoeda";
import { useEffect } from "react";
import { useQuery } from "react-query";

export const useCriarArquivoAlvara = ({ handleClose, dadosAlvaraSelecionado, usuarioLogado, optionsModulos, refetchAlvaraEmpresa, refetchVinculoAlvara }) => {
    /*   const [arquivoAlvara, setArquivoAlvara] = useState([])
      const [descricaoDetalheAndamento, setDescricaoDetalheAndamento] = useState('')
      const [dataFimCompetencia, setDataFimCompetencia] = useState('')
      const [dataIncioCompetencia, setDataIncioCompetencia] = useState('')
      const [statusAndamento, setStatusAndamento] = useState('')
      const [statusAlvara, setStatusAlvara] = useState('')
      const [metragemLoja, setMetragemLoja] = useState('') */

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
    //  console.log(optionsStatusAlvara , 'optionsStatusAlvara')


    /*  useEffect(() => {
         setStatusAlvara(dadosAlvaraSelecionado?.[0]?.STATIVO)
         setDataIncioCompetencia(dadosAlvaraSelecionado?.[0]?.DTINICIOCOMPETENCIAALVARA)
         setDataFimCompetencia(dadosAlvaraSelecionado?.[0]?.DTFIMCOMPETENCIAALVARA)
         setStatusAndamento(dadosAlvaraSelecionado?.[0]?.DESCRICAOSTATUS)
         setMetragemLoja(dadosAlvaraSelecionado?.[0]?.METRAGEMEMPRESA)
         setDescricaoDetalheAndamento(dadosAlvaraSelecionado?.[0]?.DESCRICAODETALHEANDAMENTO)
         setArquivoAlvara(
             Array.isArray(dadosAlvaraSelecionado?.[0]?.ARQUIVALVARA)
                 ? dadosAlvaraSelecionado?.[0]?.ARQUIVALVARA
                 : []
         );
     }, [dadosAlvaraSelecionado])
  */

    const optionsStatus = [
        { value: 'True', label: 'Ativo' },
        { value: 'False', label: 'Inativo' },
    ];

    /*  const handlSelecionarArquivosCriado = async (event) => {
         const files = Array.from(event.target.files || []);
 
         const arquivosConvertidos = await Promise.all(
             files.map(file => {
                 return new Promise((resolve, reject) => {
                     const reader = new FileReader();
 
                     reader.onload = () => {
                         resolve({
                             ARQUIVOBASE64: reader.result.split(',')[1],
                             NOMEARQUIVO: file.name,
                             TIPOARQUIVO: file.type
                         });
                     };
 
                     reader.onerror = reject;
                     reader.readAsDataURL(file);
                 });
             })
         );
 
         return arquivosConvertidos;
     };
  */
    const onCriarArquivo = async (idVinculo, arquivos) => {
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
            text: `Certeza que deseja substituir o anexo selecionado?`,
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
            //handleClose()
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
        onCriarArquivo
    }

}