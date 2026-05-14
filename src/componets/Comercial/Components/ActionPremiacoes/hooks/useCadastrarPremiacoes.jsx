import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import axios from "axios";
import { getDataAtual } from "../../../../../utils/dataAtual";
import { post } from "../../../../../api/funcRequest";

export const useCadastrarPremiacoes = ({ usuarioLogado, optionsModulos }) => {
    const [grupoEmpresarial, setGrupoEmpresarial] = useState('');
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [funcaoSelecionada, setFuncaoSelecionada] = useState('');
    const [indicadorSelecionado, setIndicadorSelecionado] = useState('');
    const [apuracaoSelecionada, setApuracaoSelecionada] = useState('');
    const [valorBonusSenior, setValorBonusSenior] = useState('');
    const [valorBonusPleno, setValorBonusPleno] = useState('');
    const [valorBonusJunior, setValorBonusJunior] = useState('');
    const [valorBonusTodos, setValorBonusTodos] = useState('');
    const [ipUsuario, setIpUsuario] = useState('');

    useEffect(() => {
        const dataAtual = getDataAtual();
        setDataInicio(dataAtual);
        setDataFim(dataAtual);
    }, [])  

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

    const onSubmit = async (e) => {

        if (optionsModulos[0]?.CRIAR == 'False') {
        Swal.fire({
            title: 'Acesso Negado',
            html: `${usuarioLogado?.NOFUNCIONARIO} <br/> não tem permissão para realizar esta ação!`,
            icon: 'error',
            confirmButtonText: 'Ok',
            timer: 6000,
            customClass: {
            container: 'custom-swal',
            }
        })
        return;
        }

    

        const putData = {
        ID: dadosAtualizarFuncionarios[0]?.ID,
        IDFUNCIONARIO: dadosAtualizarFuncionarios[0]?.IDFUNCIONARIO,
        IDEMPRESA: empresaSelecionada?.value,
        IDSUBGRUPOEMPRESARIAL: dadosAtualizarFuncionarios[0]?.IDSUBGRUPOEMPRESARIAL,
        IDFUNCIONARIOULTALTERACAO: usuarioLogado.id,
        NOLOGIN: dadosAtualizarFuncionarios[0]?.NOLOGIN,
        PWSENHA: senha,
        }

    try {
      const response = await post('/funcionario-loja-comercial/:id', putData)

      Swal.fire({
        title: 'Atualização',
        text: 'Atualização Realizada com Sucesso',
        icon: 'success',
        timer: 5000,
        customClass: {
          container: 'custom-swal',
        }
      })

      const textDados = JSON.stringify(putData)
      const textoFuncao = 'COMERCIAL / ALTUALIZAÇÃO DE FUNCIONARIOS';
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
      const textDados = JSON.stringify(putData)
      const textoFuncao = 'COMERCIAL / ERRO AO ALTUALIZAR FUNCIONARIO';
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
        grupoEmpresarial,
        setGrupoEmpresarial,
        dataInicio,
        setDataInicio,
        dataFim,
        setDataFim,
        funcaoSelecionada,
        setFuncaoSelecionada,
        indicadorSelecionado,
        setIndicadorSelecionado,
        apuracaoSelecionada,
        setApuracaoSelecionada,
        valorBonusSenior,
        setValorBonusSenior,
        valorBonusPleno,
        setValorBonusPleno,
        valorBonusJunior,
        setValorBonusJunior,
        valorBonusTodos,
        setValorBonusTodos,
        onSubmit
    }
}