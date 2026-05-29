import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import axios from "axios";
import { post, put } from "../../../../../api/funcRequest";
import { getDataAtual } from "../../../../../utils/dataAtual";
import { removeMascaraCNPJ } from "../../../../../utils/mascaraCNPJ";

export const useGerarGnre = ({
    dadosDetalhesVendas,
    optionsModulos,
    usuarioLogado
}) => {
    const formatarCepApenasNumeros = (cep = '') => String(cep).replace(/\D/g, '').slice(0, 8);
    const removerDoisUltimosDigitos = (valor = '') => {
        const apenasNumeros = String(valor).replace(/\D/g, '');
        if (apenasNumeros.length <= 2) {
            return '';
        }
        return apenasNumeros.slice(0, -2);
    };

    const [icms, setIcms] = useState('');
    const [cnpjEmitente, setCnpjEmitente] = useState('');
    const [nomeEmitente, setNomeEmitente] = useState('');
    const [municipioEmitente, setMunicipioEmitente] = useState('');
    const [numeroMunicipioEmitente, setNumeroMunicipioEmitente] = useState('');
    const [estadoEmitente, setEstadoEmitente] = useState('');
    const [cepEmitente, setCepEmitente] = useState('');
    const [cnpjDestinatario, setCnpjDestinatario] = useState('');
    const [nomeDestinatario, setNomeDestinatario] = useState('');
    const [municipioDestinatario, setMunicipioDestinatario] = useState('');
    const [numeroMunicipioDestinatario, setNumeroMunicipioDestinatario] = useState('');
    const [estadoDestinatario, setEstadoDestinatario] = useState('');
    const [valorProduto, setValorProduto] = useState('');
    const [produto, setProduto] = useState('');
    const [valorTotal, setValorTotal] = useState('');
    const [dataHoje, setDataHoje] = useState('');

    useEffect(() => {
        const dataAtual = getDataAtual();
        setDataHoje(dataAtual);
    }, [ ])
 
    useEffect(() => {
        if(dadosDetalhesVendas) {
        setCnpjEmitente(dadosDetalhesVendas[0]?.cnpjEmitente);
        setNomeEmitente(dadosDetalhesVendas[0]?.xNomeEmitente);
        setMunicipioEmitente(dadosDetalhesVendas[0]?.xMun);
        setNumeroMunicipioEmitente(dadosDetalhesVendas[0]?.municipioEmitente);
        setEstadoEmitente(dadosDetalhesVendas[0]?.estadoEmitente);
        setCepEmitente(dadosDetalhesVendas[0]?.CEP);
        
        setCnpjDestinatario(dadosDetalhesVendas[0]?.CPFCNPJDestinatario);
        setNomeDestinatario(dadosDetalhesVendas[0]?.xNomeDestinatario);
        setMunicipioDestinatario(dadosDetalhesVendas[0]?.xMunDestinatario);
        setNumeroMunicipioDestinatario(dadosDetalhesVendas[0]?.municipioDestinatario);
        setEstadoDestinatario(dadosDetalhesVendas[0]?.UFDestinatario);
        setValorProduto(dadosDetalhesVendas[0]?.vProd);
        setProduto(dadosDetalhesVendas[0]?.Descricao);
        setValorTotal(dadosDetalhesVendas[0]?.vNF);
        }
    }, [dadosDetalhesVendas])

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


    const onSubmit = async (e) => {

        if (optionsModulos[0]?.CRIAR == 'False') {
            Swal.fire({
                title: 'Acesso Negado',
                html: `${usuarioLogado?.NOFUNCIONARIO} <br/> não tem permissão para realizar esta ação.`,
                icon: 'error',
                confirmButtonText: 'Ok',
                timer: 6000,
                customClass: {
                    container: 'custom-swal',
                }
            })
            return;
        }


        const postData = {
            chave: dadosDetalhesVendas[0]?.Chave55,
            nnf: dadosDetalhesVendas[0]?.nNF,
            DocEntry: dadosDetalhesVendas[0]?.DocEntry,
            indFinal: dadosDetalhesVendas[0]?.indFinal,
            tipoDocumento: 0,
            receita: icms?.value,
            dataVencimento: dataHoje,
            dataPagamento: dataHoje,
            emitente: {
                CNPJ: removeMascaraCNPJ(cnpjEmitente),
                xNome: nomeEmitente,
                state: estadoEmitente,
                xLgr: dadosDetalhesVendas[0]?.xLgr,
                xMun: municipioEmitente,
                municipioEmitente: numeroMunicipioEmitente,
                CEP: formatarCepApenasNumeros(cepEmitente),
                fone: dadosDetalhesVendas[0]?.fone,
            },
            destinatario: {
                CNPJ: removeMascaraCNPJ(cnpjDestinatario),
                xMun: municipioDestinatario,
                UF: estadoDestinatario,
                indIEDest: dadosDetalhesVendas[0]?.indIEDest,
                municipioDestinatario: numeroMunicipioDestinatario,
                xNomeDestinatario: nomeDestinatario,
            },
            valorNota: parseFloat(valorTotal),
        }


        try {
            const response = await post('/gnre', postData)

            Swal.fire({
                title: 'Atualização',
                text: 'Atualização Realizada com Sucesso',
                icon: 'success',
                timer: 5000,
                customClass: {
                container: 'custom-swal',
                }
            })

            const textDados = JSON.stringify(postData)
            const textoFuncao = 'CONTBILIDADE / GERAR GNRE';
            const ipUsuario = await getIPUsuario();

            const createData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            await post('/log-web', createData)

            return response.data;
        } catch (error) {
        const textDados = JSON.stringify(postData)
        const textoFuncao = 'CONTBILIDADE / ERRO AO GERAR GNRE';
        const ipUsuario = await getIPUsuario();

        const createData = {
            IDFUNCIONARIO: String(usuarioLogado.id),
            PATHFUNCAO: textoFuncao,
            DADOS: textDados,
            IP: ipUsuario
        }

        const response = await post('/log-web', createData)
        Swal.fire({
            title: 'Erro ao Atualizar',
            text: 'Erro ao Tentar Atualizar',
            icon: 'error',
            timer: 3000,
            customClass: {
            container: 'custom-swal',
            }
        })
        console.error('Erro ao parsear o usuário do localStorage:', error);
        return response.data;
        }
    }

    return {
        cnpjEmitente,
        nomeEmitente,
        municipioEmitente,
        numeroMunicipioEmitente,
        estadoEmitente,
        cepEmitente,
        cnpjDestinatario,
        nomeDestinatario,
        municipioDestinatario,
        numeroMunicipioDestinatario,
        estadoDestinatario,
        valorProduto,
        produto,
        valorTotal,
        icms,
        setIcms,

        onSubmit,
    }
}