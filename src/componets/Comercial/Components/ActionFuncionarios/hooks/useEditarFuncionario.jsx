import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2';
import axios from "axios";
import { Funcoes } from '../../../../../../tipoFuncao.json';
import { post, put } from "../../../../../api/funcRequest";

export const useEditarFuncionario = ({ dadosAtualizarFuncionarios, dadosEmpresas, refetchListaFuncionarios, usuarioLogado, optionsModulos }) => {
  const [empresaSelecionada, setEmpresaSelecionada] = useState(0);
  const [funcaoSelecionado, setFuncaoSelecionado] = useState('')
  const [tipoSelecionado, setTipoSelecionado] = useState('')
  const [cpf, setCPF] = useState('')
  const [nomeFuncionario, setNomeFuncionario] = useState('')
  const [localizacaoSelecionada, setLocalizacaoSelecionada] = useState('')
  const [valorDesconto, setValorDesconto] = useState('');
  const [valorSalario, setValorSalario] = useState('');
  const [senha, setSenha] = useState('')
  const [repitaSenha, setRepitaSenha] = useState('')
  const [situacaoSelecionada, setSituacaoSelecionada] = useState('')
  const [ipUsuario, setIpUsuario] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarRepitaSenha, setMostrarRepitaSenha] = useState(false);

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
    if (dadosAtualizarFuncionarios) {
      setEmpresaSelecionada({ value: dadosAtualizarFuncionarios[0]?.IDEMPRESA, label: dadosAtualizarFuncionarios[0]?.NOFANTASIA });
      setFuncaoSelecionado({ value: dadosAtualizarFuncionarios[0]?.DSFUNCAO, label: dadosAtualizarFuncionarios[0]?.DSFUNCAO });
      setTipoSelecionado({ value: dadosAtualizarFuncionarios[0]?.DSTIPO, label: dadosAtualizarFuncionarios[0]?.DSTIPO });
      setCPF(dadosAtualizarFuncionarios[0]?.NUCPF);
      setNomeFuncionario(dadosAtualizarFuncionarios[0]?.NOFUNCIONARIO);
      setLocalizacaoSelecionada(dadosAtualizarFuncionarios[0]?.STLOJA);
      setValorSalario(dadosAtualizarFuncionarios[0]?.VALORSALARIO);
      setValorDesconto(dadosAtualizarFuncionarios[0]?.PERC);
      setSituacaoSelecionada({ value: dadosAtualizarFuncionarios[0]?.STATIVO == 'True' ? 'Ativo' : 'Inativo', label: dadosAtualizarFuncionarios[0]?.STATIVO == 'True' ? 'Ativo' : 'Inativo' });
      setSenha(dadosAtualizarFuncionarios[0]?.PWSENHA);
      setRepitaSenha(dadosAtualizarFuncionarios[0]?.PWSENHA);

    }

  }, [dadosAtualizarFuncionarios]);

  const onSubmit = async (e) => {

    if (optionsModulos[0]?.ALTERAR == 'False') {
      Swal.fire({
        title: 'Acesso Negado',
        html: `${usuarioLogado?.NOFUNCIONARIO} <br/> não tem permissão para alterar`,
        icon: 'error',
        confirmButtonText: 'Ok',
        timer: 6000,
        customClass: {
          container: 'custom-swal',
        }
      })
      return;
    }

    if(senha !== repitaSenha) {
      Swal.fire({
        title: 'Erro de Validação',
        text: 'As senhas não coincidem. Por favor, verifique e tente novamente.',
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
      const response = await put('/funcionario-loja-comercial/:id', putData)

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
        IP: ipUsuario || 'Indisponível'
      }

      await post('/log-web', createData)
      refetchListaFuncionarios();

      return response.data;
    } catch (error) {
      const textDados = JSON.stringify(putData)
      const textoFuncao = 'COMERCIAL / ERRO AO ALTUALIZAR FUNCIONARIO';
      const ipUsuario = await getIPUsuario();

      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || 'Indisponível'
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


  const situacao = [
    {
      id: 1,
      label: "Ativo",
      value: "True"
    },
    {
      id: 2,
      label: "Inativo",
      value: "False"
    }
  ]

  const tipo = [
    {
      id: 1,
      label: "Selecione...",
      value: "0"
    },
    {
      id: 2,
      label: "Funcionário",
      value: "FUNCIONARIO"
    },
    {
      id: 3,
      label: "Parceiro de Negócios Apoio",
      value: "PN"
    },
    {
      id: 4,
      label: "Parceiro de Negócios PJ",
      value: "PN"
    }
  ]

  return {
    empresaSelecionada,
    setEmpresaSelecionada,
    funcaoSelecionado,
    setFuncaoSelecionado,
    Funcoes,
    tipoSelecionado,
    setTipoSelecionado,
    tipo,
    cpf,
    setCPF,
    nomeFuncionario,
    setNomeFuncionario,
    valorSalario,
    setValorSalario,
    valorDesconto,
    setValorDesconto,
    senha,
    setSenha,
    repitaSenha,
    setRepitaSenha,
    situacao,
    situacaoSelecionada,
    setSituacaoSelecionada,
    mostrarSenha,
    setMostrarSenha,
    mostrarRepitaSenha,
    setMostrarRepitaSenha,
    onSubmit,
    
  }
}