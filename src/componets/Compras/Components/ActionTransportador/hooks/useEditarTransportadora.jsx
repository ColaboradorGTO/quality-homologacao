import { useEffect, useState } from "react"
import { post, put } from "../../../../../api/funcRequest"
import axios from "axios"
import Swal from 'sweetalert2'
import { getDataHoraAtual } from "../../../../../utils/dataAtual"
import { situacao } from "../../../../../../parceiro.json"

export const useEditarTransportadora = ({handleClose, dadosDetalheTranspotador, usuarioLogado, optionsModulos, handleClick }) => {
    const [statusSelecionado, setStatusSelecionado] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [inscricaoEstadual, setInscricaoEstadual] = useState('')
    const [inscricaoMunicipal, setInscricaoMunicipal] = useState('')
    const [razaoSocial, setRazaoSocial] = useState('')
    const [nomeFantasia, setNomeFantasia] = useState('')
    const [cep, setCep] = useState('')
    const [endereco, setEndereco] = useState('')
    const [numero, setNumero] = useState('')
    const [complemento, setComplemento] = useState('')
    const [bairro, setBairro] = useState('')
    const [cidade, setCidade] = useState('')
    const [uf, setUf] = useState('')
    const [numeroIBGE, setNumeroIBGE] = useState('')
    const [nomeRepresentante, setNomeRepresentante] = useState('')
    const [email, setEmail] = useState('')
    const [telefone1, setTelefone1] = useState('')
    const [telefone2, setTelefone2] = useState('')
    const [telefone3, setTelefone3] = useState('')
    const [data, setData] = useState('')
    const [ipUsuario, setIpUsuario] = useState('');

   
    useEffect(() => {
        const dataAtual = getDataHoraAtual()
        setData(dataAtual)
    },[])

   const getIPUsuario = async () => {
        let usuarioIP = null;

        try {
            const { data: ipWhoisData } = await axios.get("https://ifconfig.me/ip");
            usuarioIP = ipWhoisData?.ip;
        } catch (error) {
            console.error("Erro ao buscar IP via ifconfig.me:", error);
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
        setStatusSelecionado({value: dadosDetalheTranspotador[0]?.STATIVO, label: dadosDetalheTranspotador[0]?.STATIVO == 'True' ? 'ATIVO' : 'INATIVO'})
        setCnpj(dadosDetalheTranspotador[0]?.NUCNPJ)
        setInscricaoEstadual(dadosDetalheTranspotador[0]?.NUINSCESTADUAL)
        setInscricaoMunicipal(dadosDetalheTranspotador[0]?.NUINSCMUNICIPAL)
        setRazaoSocial(dadosDetalheTranspotador[0]?.NORAZAOSOCIAL)
        setNomeFantasia(dadosDetalheTranspotador[0]?.NOFANTASIA)
        setCep(dadosDetalheTranspotador[0]?.NUCEP)
        setEndereco(dadosDetalheTranspotador[0]?.EENDERECO)
        setNumero(dadosDetalheTranspotador[0]?.ENUMERO)
        setComplemento(dadosDetalheTranspotador[0]?.ECOMPLEMENTO)
        setBairro(dadosDetalheTranspotador[0]?.EBAIRRO)
        setCidade(dadosDetalheTranspotador[0]?.ECIDADE)
        setUf(dadosDetalheTranspotador[0]?.SGUF)
        setNumeroIBGE(dadosDetalheTranspotador[0]?.NUIBGE)
        setNomeRepresentante(dadosDetalheTranspotador[0]?.NOREPRESENTANTE)
        setEmail(dadosDetalheTranspotador[0]?.EEMAIL)
        setTelefone1(dadosDetalheTranspotador[0]?.NUTELEFONE1)
        setTelefone2(dadosDetalheTranspotador[0]?.NUTELEFONE2)
        setTelefone3(dadosDetalheTranspotador[0]?.NUTELEFONE3)

    }, [dadosDetalheTranspotador])

 

    const onSubmit = async () => {
        if(optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                icon: 'error',
                title: 'Acesso Negado!',
                html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para alterar a Transportadora!`,
                customClass: {
                    container: 'custom-swal',
                },
            });
            return;
        }
        

        const postData = {
            IDTRANSPORTADORA: parseInt(dadosDetalheTranspotador[0]?.IDTRANSPORTADORA),
            IDGRUPOEMPRESARIAL: dadosDetalheTranspotador[0]?.IDGRUPOEMPRESARIAL == null ? 1 : dadosDetalheTranspotador[0]?.IDGRUPOEMPRESARIAL,
            IDSUBGRUPOEMPRESARIAL: dadosDetalheTranspotador[0]?.IDSUBGRUPOEMPRESARIAL == null ? 1 : dadosDetalheTranspotador[0]?.IDSUBGRUPOEMPRESARIAL,
            NORAZAOSOCIAL: razaoSocial,
            NOFANTASIA: nomeFantasia,
            NUCNPJ: cnpj,
            NUINSCESTADUAL: inscricaoEstadual,
            NUINSCMUNICIPAL: inscricaoMunicipal,
            NUIBGE: numeroIBGE,
            EENDERECO: endereco,
            ENUMERO: numero,
            ECOMPLEMENTO: complemento,
            EBAIRRO: bairro,
            ECIDADE: cidade,
            SGUF: uf,
            NUCEP: cep,
            EEMAIL: email,
            NUTELEFONE1: telefone1,
            NUTELEFONE2: telefone2,
            NUTELEFONE3: telefone3 || '',
            NOREPRESENTANTE: nomeRepresentante || '',
            DTCADASTRO: data,
            DTULTATUALIZACAO: data,
            STATIVO: statusSelecionado?.value,
        }
        try {

            const response = await put('/transportador/:id', postData)

            
            const textDados = JSON.stringify(postData)
            let textFuncao = 'COMPRAS/ALTERAÇÃO DE TRANSPORTADORA';
            const ipUsuario = await getIPUsuario();
            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'Indisponível'
            }
            
            await post('/log-web', createtLog)
            
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Atualizado com sucesso!',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })
            handleClick();
            handleClose();
            return response.data;
        } catch (error) {
            const textDados = JSON.stringify(postData)
            let textFuncao = 'COMPRAS/ERRO AO ALTERAR TRANSPORTADORA';
            const ipUsuario = await getIPUsuario();
            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'Indisponível'
            }

            const responseLog = await post('/log-web', createtLog)
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                },
            });
            console.error('Erro ao editar transportadora:', error);
            return responseLog.data;
        }
    }

    return {
        statusSelecionado,
        setStatusSelecionado,
        cnpj,
        setCnpj,
        inscricaoEstadual,
        setInscricaoEstadual,
        inscricaoMunicipal,
        setInscricaoMunicipal,
        razaoSocial,
        setRazaoSocial,
        nomeFantasia,
        setNomeFantasia,
        cep,
        setCep,
        endereco,
        setEndereco,
        numero,
        setNumero,
        complemento,
        setComplemento,
        bairro,
        setBairro,
        cidade,
        setCidade,
        uf,
        setUf,
        numeroIBGE,
        setNumeroIBGE,
        nomeRepresentante,
        setNomeRepresentante,
        email,
        setEmail,
        telefone1,
        setTelefone1,
        telefone2,
        setTelefone2,
        telefone3,
        setTelefone3,
        situacao,
        onSubmit,
    }
}