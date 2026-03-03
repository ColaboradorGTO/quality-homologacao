import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getDataAtual } from "../../../../../utils/dataAtual";


export const useDiminuirQuantidade = ({ dadosBalancoAvulso, usuarioLogado, optionsModulos }) => {
    const [ipUsuario, setIpUsuario] = useState('')
    
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

    const onSubmit = async (idProduto, quantidadeAlterada) => {
        const produto = dadosBalancoAvulso.find(item => item.IDPRODUTO === idProduto);

        let novaQuantidade = produto.TOTALCONTAGEMGERAL + quantidadeAlterada;

        if (quantidadeAlterada === 0) {
            novaQuantidade = 0;
        }

        const putData = {
            "IDEMPRESA": Number(dadosBalancoAvulso[0].IDEMPRESA),
            "NUMEROCOLETOR": Number(usuarioLogado.id),
            "DSCOLETOR": usuarioLogado.nome,
            "IDPRODUTO": produto.IDPRODUTO,
            "TOTALCONTAGEMGERAL": Number(novaQuantidade),

        }

        try {
            const response = await put('/detalhe-balanco-avulso/:id', putData)

            const textDados = JSON.stringify(putData)
            let textoFuncao = 'ADMINISTRATIVO/ALTERANDO QUANTIDADE DE PRODUTO NO BALANÇO AVULSO';


            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'IP não disponível'
            }

            const responsePost = await post('/log-web', postData)

            Swal.fire({
                title: 'Atualização',
                text: 'Quantidade do produto atualizada com sucesso',
                icon: 'success'
            })


            handleClick()
            return responsePost.data;

        } catch (error) {
            const textDados = JSON.stringify(putData)
            let textoFuncao = 'ADMINISTRATIVO/ALTERANDO QUANTIDADE DE PRODUTO NO BALANÇO AVULSO';

            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'IP não disponível'
            }

            const responsePost = await post('/log-web', postData)

            Swal.fire({
                title: 'Atualização',
                text: 'Erro ao atualizar o quantidade do produto',
                icon: 'error'
            })
            return responsePost.data;

        }

    }


}