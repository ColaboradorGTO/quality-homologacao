import Swal from "sweetalert2"
import { get, post } from "../../../../../../api/funcRequest"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { getDataAtual } from "../../../../../../utils/dataAtual"
import axios from "axios"


export const useCadastrarCampanha = ({optionsModulos, usuarioLogado, handleClose}) => {
    const [descricao, setDescricao] = useState('')
    const [dataInicio, setDataInicio] = useState('')
    const [dataFim, setDataFim] = useState('')
    const [marcaSelecionada, setMarcaSelecionada] = useState('')
    const [empresaSelecionada, setEmpresaSelecionada] = useState('')
    const [percentDesconto, setPercentDesconto] = useState(0)
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
        const dataInicial = getDataAtual()
        const dataFinal = getDataAtual()
        setDataInicio(dataInicial)
        setDataFim(dataFinal)

    }, [])

    const { data: optionsMarcas = [], error: errorMarcas, isLoading: isLoadingMarcas, refetch: refetchMarcas } = useQuery(
        'marcasLista',
        async () => {
            const response = await get(`/marcasLista`);
            return response.data;
        },
        { staleTime: 5 * 60 * 1000 }
    );

    const { data: optionsEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch: refetchEmpresas } = useQuery(
        ['listaEmpresaComercial', marcaSelecionada],
        async () => {
            if (marcaSelecionada) {
                const response = await get(`/listaEmpresaComercial?idMarca=${marcaSelecionada}`);
                return response.data;
            } else {
                return [];
            }
        },
        { enabled: false, staleTime: 5 * 60 * 1000 }
    );


    useEffect(() => {
        if (marcaSelecionada) {
            refetchEmpresas();
        }
        refetchMarcas()
    }, [marcaSelecionada, refetchEmpresas]);



    const onSubmit = async (data) => {
        if(optionsModulos[0]?.CRIAR == 'False') {
            Swal.fire({
                title: 'Atenção',
                html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para cadastrar campanhas.`,
                icon: 'warning',
                confirmButtonText: 'Ok',
                customClass:{
                    container: 'custom-swal',
                }
            });
            return;
        } 

        if (!descricao || !percentDesconto || !empresaSelecionada) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: `Preencha os campos! Descrição e Desconto e Empresa são obrigatórios!`,
                customClass: {
                    container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 3000,
            });
            return;
        }
        const postData = {
            DSCAMPANHA: descricao,
            IDOPERADOR: usuarioLogado.id,
            DTINICIO: dataInicio,
            DTFINAL: dataFim,
            VRPERCDESCONTO: parseFloat(percentDesconto),
            EMPRESAS: empresaSelecionada,
        };

        try {
            const response = await post('/cadastra-campanha', postData);
            const ipUsuario = await getIPUsuario();
            const textDados = JSON.stringify(postData);
            let textoFuncao = 'MARKETING/CADASTRO DE CAMPANHA';
            
            const createData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario,
            };
            
            await post('/log-web', createData);
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Cadastro realizado com sucesso!',
                customClass: {
                    container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 1500,
            });
            handleClose();
            return response.data;
        } catch (error) {
            const ipUsuario = await getIPUsuario();
            const textDados = JSON.stringify(postData);
            let textoFuncao = 'MARKETING/ERRO AO CADASTRAR CAMPANHA';
            
            const createData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario,
            };
            
            await post('/log-web', createData);
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Erro ao Cadastrar Cleinte!',
                customClass: {
                    container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 1500,
            });
            console.log(error);
        }
    };

    return {
        descricao,
        setDescricao,
        dataInicio,
        setDataInicio,
        dataFim,
        setDataFim,
        marcaSelecionada,
        setMarcaSelecionada,
        empresaSelecionada,
        setEmpresaSelecionada,
        percentDesconto,
        setPercentDesconto,
        optionsMarcas,
        optionsEmpresas,
        onSubmit
    };
}