import Swal from "sweetalert2"
import { post, get } from "../../../../../api/funcRequest"
import { useQuery } from "react-query"
import axios from "axios"
import { useEffect, useState } from "react"


export const useCadastrarliente = ({handleClose, optionsModulos, usuarioLogado}) => {
    const [cpf, setCPF] = useState('')
    const [telefone, setTelefone] = useState('')
    const [nome, setNome] = useState('')
    const [endereco, setEndereco] = useState('')
    const [complemento, setComplemento] = useState('')
    const [bairro, setBairro] = useState('')
    const [cidade, setCidade] = useState('')
    const [cep, setCEP] = useState('')
    const [uf, setUF] = useState('')
    const [campanhaSelecionada, setCampanhaSelecionada] = useState('')
    const [ipUsuario, setIpUsuario] = useState('');
    const [dadosCEP, setDadosCEP] = useState('');
    
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
        if (cep.length === 8) {
            getCEP();
        }

    }, [cep]);

    const getCEP = async () => {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json`);
        if (response.data) {
            setDadosCEP(response.data);
            setEndereco(response.data.logradouro);
            setComplemento(response.data.complemento);
            setBairro(response.data.bairro);
            setCidade(response.data.localidade);
            setUF(response.data.uf);

        }
        return response.data;
    };

    const { data: dadosCampanha = [], error: errorCampanha, isLoading: isLoadingCampanha, refetch: refetchCampanha } = useQuery(
        'campanha',
        async () => {
            const response = await get(`/campanha`);
            return response.data;
        },
        { staleTime: 5 * 60 * 1000 }
    );


    const onSubmit = async (data) => {
        if (!optionsModulos[0]?.CRIAR == 'False') {
            Swal.fire({
                title: 'Atenção',
                text: 'Você não tem permissão para cadastrar clientes.',
                icon: 'warning',
                confirmButtonText: 'Ok',
                customClass: {
                    container: 'custom-swal',
                },
            });
            return;
        }

        if (!cpf || !telefone || !nome) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: `Preencha os campos! CPF e Telefone e Nome`,
                customClass: {
                    container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 3000,
            });
            return;
        }
        const postData = {
            IDCAMPANHA: campanhaSelecionada,
            NOME: nome,
            NUCPFCNPJ: cpf,
            EENDERECO: endereco,
            ECOMPLEMENTO: complemento,
            EBAIRRO: bairro,
            ECIDADE: cidade,
            SGUF: uf,
            NUCEP: cep,
            NUTELEFONE: telefone,
        };

        try {
            const response = await post('/cadastrar-campanha-cliente', postData);
            
            const textDados = JSON.stringify(postData);
            let textoFuncao = 'MARKETING/CADASTRO DE CLIENTE';
            const ipUsuario = await getIPUsuario();
            const createData = {
                IDFUNCIONARIO: usuarioLogado.id,
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario,
            };
            
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

            await post('/log-web', createData);
            handleClose();
            return response.data;
        } catch (error) {
            const textDados = JSON.stringify(postData);
            let textoFuncao = 'MARKETING/ERRO AO CADASTRAR CLIENTE';
            const ipUsuario = await getIPUsuario();
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
        cpf,
        setCPF,
        telefone,
        setTelefone,
        nome,
        setNome,
        endereco,
        setEndereco,
        complemento,
        setComplemento,
        bairro,
        setBairro,
        cidade,
        setCidade,
        cep,
        setCEP,
        uf,
        setUF,
        dadosCampanha,
        errorCampanha,
        isLoadingCampanha,
        refetchCampanha,
        campanhaSelecionada,
        setCampanhaSelecionada,
        onSubmit
    }
}