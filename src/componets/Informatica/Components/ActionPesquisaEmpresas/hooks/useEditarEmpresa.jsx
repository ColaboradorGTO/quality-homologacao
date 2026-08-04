import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import { useEffect, useState } from "react";
import axios from "axios";

export const useEditarEmpresa = ({ dadosEditarEmpresa, handleClose, refetch, usuarioLogado }) => {
    const [grupoEmpresa, setGrupoEmpresa] = useState('');
    const [situacao, setSituacao] = useState('');
    const [dataCriacao, setDataCriacao] = useState('');
    const [nomeFantasia, setNomeFantasia] = useState('');
    const [cep, setCep] = useState('');
    const [endereco, setEndereco] = useState('');
    const [complemento, setComplemento] = useState('');
    const [bairro, setBairro] = useState('');
    const [cidade, setCidade] = useState('');
    const [uf, setUF] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('')
    const [ipUsuario, setIpUsuario] = useState('');
 
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

    useEffect(() => {
        if (dadosEditarEmpresa) {
            setGrupoEmpresa(dadosEditarEmpresa[0]?.IDGRUPOEMPRESARIAL == 1 ? "TO - TESOURA DE OURO" : dadosEditarEmpresa[0]?.IDGRUPOEMPRESARIAL == 2 ? "MG - MAGAZINE" : dadosEditarEmpresa[0]?.IDGRUPOEMPRESARIAL == 3 ? "YO - YORUS" : dadosEditarEmpresa[0]?.IDGRUPOEMPRESARIAL == 4 ? "FC - FREE CENTER" : "");
            setSituacao({value: dadosEditarEmpresa[0]?.STATIVO, label: dadosEditarEmpresa[0]?.STATIVO == "True" ? "ATIVO" : "INATIVO"});
            setDataCriacao(dadosEditarEmpresa[0]?.DTULTATUALIZACAO);
            setNomeFantasia(dadosEditarEmpresa[0]?.NOFANTASIA);
            setCep(dadosEditarEmpresa[0]?.NUCEP)
            setEndereco(dadosEditarEmpresa[0]?.EENDERECO)
            setComplemento(dadosEditarEmpresa[0]?.ECOMPLEMENTO)
            setBairro(dadosEditarEmpresa[0]?.EBAIRRO)
            setCidade(dadosEditarEmpresa[0]?.ECIDADE)
            setUF(dadosEditarEmpresa[0]?.SGUF)
            setEmail(dadosEditarEmpresa[0]?.EEMAILPRINCIPAL)
            setTelefone(dadosEditarEmpresa[0]?.NUTELGERENCIA)
        }
    }, [])

    const onSubmit = async (data) => {

        const putData = {
            IDEMPRESA: Number(dadosEditarEmpresa[0]?.IDEMPRESA),
            STGRUPOEMPRESARIAL: Number(dadosEditarEmpresa[0]?.IDGRUPOEMPRESARIAL),
            IDGRUPOEMPRESARIAL: Number(dadosEditarEmpresa[0]?.IDGRUPOEMPRESARIAL),
            IDSUBGRUPOEMPRESARIAL: Number(dadosEditarEmpresa[0]?.IDSUBGRUPOEMPRESARIAL),
            NORAZAOSOCIAL: String(dadosEditarEmpresa[0]?.NORAZAOSOCIAL),
            NOFANTASIA: String(dadosEditarEmpresa[0]?.NOFANTASIA),
            NUCNPJ: String(dadosEditarEmpresa[0]?.NUCNPJ),
            NUINSCESTADUAL: String(dadosEditarEmpresa[0]?.NUINSCESTADUAL),
            NUINSCMUNICIPAL: String(dadosEditarEmpresa[0]?.NUINSCMUNICIPAL),
            CNAE: String(dadosEditarEmpresa[0]?.CNAE),
            EENDERECO: endereco,
            ECOMPLEMENTO: complemento,
            EBAIRRO: bairro,
            ECIDADE: cidade,
            SGUF: uf,
            NUUF: Number(uf === 'DF' ? 53 : 52),
            NUCEP: cep,
            NUIBGE: String(dadosEditarEmpresa[0]?.NUIBGE),
            EEMAILPRINCIPAL: String(dadosEditarEmpresa[0]?.EEMAILPRINCIPAL),
            EEMAILCOMERCIAL: String(dadosEditarEmpresa[0]?.EEMAILCOMERCIAL),
            EEMAILFINANCEIRO: String(dadosEditarEmpresa[0]?.EEMAILFINANCEIRO),
            EEMAILCONTABILIDADE: String(dadosEditarEmpresa[0]?.EEMAILCONTABILIDADE),
            NUTELPUBLICO: String(dadosEditarEmpresa[0]?.NUTELPUBLICO),
            NUTELCOMERCIAL: String(dadosEditarEmpresa[0]?.NUTELCOMERCIAL),
            NUTELFINANCEIRO: String(dadosEditarEmpresa[0]?.NUTELFINANCEIRO),
            NUTELGERENCIA: String(telefone),
            EURL: String(dadosEditarEmpresa[0]?.EURL),
            PATHIMG: String(dadosEditarEmpresa[0]?.PATHIMG),
            NUCNAE: String(dadosEditarEmpresa[0]?.NUCNAE),
            STECOMMERCE: String(dadosEditarEmpresa[0]?.STECOMMERCE),
            DTULTATUALIZACAO: String(dadosEditarEmpresa[0]?.DTULTATUALIZACAO),
            STATIVO: situacao?.value,
            ALIQPIS: Number(dadosEditarEmpresa[0]?.ALIQPIS),
            ALIQCOFINS: Number(dadosEditarEmpresa[0]?.ALIQCOFINS)
        }
        try {

            const usuarioIP = await getIPUsuario();

            const response = await put(`/empresas/:id`, putData)

            const textDados = JSON.stringify(putData);
            let textoFuncao = 'GERENCIA / EDIÇÃO DA EMPRESA';

            const createData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: usuarioIP || 'INDISPONIVEL'
            };

            const responsePost = await post('/log-web', createData)

            Swal.fire({
                title: 'Sucesso!',
                text: 'Empresa atualizada com sucesso!',
                icon: 'success',
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })
            handleClose();
            refetch();

            return responsePost.data
        } catch (error) {

            const usuarioIP = await getIPUsuario();
            let textoFuncao = 'GERENCIA /ERRO NA EDIÇÃO DA EMPRESA';

            const createData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: '',
                IP: usuarioIP || 'INDISPONIVEL'
            };

            const responsePost = await post('/log-web', createData)


            Swal.fire({
                title: 'Erro!',
                text: 'Erro ao atualizar a empresa!',
                icon: 'error',
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })
            return responsePost.data
        }
    }

    return {
        grupoEmpresa,
        setGrupoEmpresa,
        situacao,
        setSituacao,
        dataCriacao,
        setDataCriacao,
        nomeFantasia,
        setNomeFantasia,
        cep,
        setCep,
        endereco,
        setEndereco,
        complemento,
        setComplemento,
        bairro,
        setBairro,
        cidade,
        setCidade,
        uf,
        setUF,
        email,
        setEmail,
        telefone,
        setTelefone,
        onSubmit,
        ipUsuario

    }
}