import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { get, post, put } from "../../../../../api/funcRequest";


export const useIncluirProduto = ({ usuarioLogado, optionsModulos, handleClick }) => {
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

    const validarGradeamento = (produtoDetalhe) => {
        const gradeRaw = produtoDetalhe?.detalhegrade || produtoDetalhe?.detalheGrade || [];
        const grade = Array.isArray(gradeRaw) ? gradeRaw : [gradeRaw].filter(Boolean);
        const qtdTotal = Number(produtoDetalhe?.QTDPRODUTO || 0);

        const itensComValor = grade.filter(item => Number(item.INDICETAMANHO || 0) > 0);

        if (!itensComValor.length) {
            return { valido: false, mensagem: 'O Gradeamento de Tamanhos Não Pode Estar Zerado.' };
        }

        const totalIndice = itensComValor.reduce((acc, item) => acc + parseFloat(item.INDICETAMANHO), 0);
        const erros = [];

        for (const item of itensComValor) {
            const qtdGrade = (qtdTotal / totalIndice) * parseFloat(item.INDICETAMANHO);
            if (!Number.isInteger(qtdGrade)) {
                erros.push(`( Tamanho: ${item.DSTAMANHO}, Quantidade: ${qtdGrade.toFixed(2)} )`);
            }
        }

        if (erros.length) {
            return {
                valido: false,
                mensagem: `Os valores digitados no Gradeamento de Tamanhos não geram quantidades exatas para cada TAMANHO: ${erros.join(', \n')}`
            };
        }

        return { valido: true };
    };

    const handleIncluirProduto = async (row) => {
        if (optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                icon: "error",
                title: "Permissão Negada!",
                html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão.`,
            });
            return;
        }

        let produtoDetalhe = null;
        try {
            const responseProduto = await get(`/produtoAvulso?idDetalhePedidoProduto=${row.IDDETALHEPRODUTOPEDIDO}`);
            const dados = responseProduto.data;
            produtoDetalhe = Array.isArray(dados) ? dados[0] : dados;
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erro!",
                text: 'Não foi possível obter os dados do produto para validação.',
            });
            return;
        }

        const { valido, mensagem } = validarGradeamento(produtoDetalhe);
        if (!valido) {
            Swal.fire({
                icon: "warning",
                title: "Erro no gradeamento de tamanhos!",
                text: mensagem,
            });
            return;
        }

        const data = {
            IDDETALHEPRODUTOPEDIDO: row.IDDETALHEPRODUTOPEDIDO,
        }

        try {
            const response = await put(`/incluir-produto-avulso/:id`, data);

            const ipUsuario = await getIPUsuario();
            const textDados = JSON.stringify(data);
            const textFuncao = 'CADASTRO/PRODUTO AVULSO - INCLUINDO NO PDV';
            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'Indisponível'
            }

            await post('/log-web', createtLog)

            Swal.fire({
                icon: "success",
                title: "Sucesso!",
                text: 'Produto Avulso incluído no PDV com sucesso.',
            });
            handleClick();

            return response.data;
        } catch (error) {
            const ipUsuario = await getIPUsuario();
            const textDados = JSON.stringify(data);
            const textFuncao = 'CADASTRO/PRODUTO AVULSO - ERRO AO INCLUIR NO PDV';
            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'Indisponível'
            }

            await post('/log-web', createtLog)

            Swal.fire({
                icon: "error",
                title: "Erro!",
                text: 'Ocorreu um erro ao incluir o Produto Avulso no PDV.',
            });
        }
    }

    return { handleIncluirProduto };
}
