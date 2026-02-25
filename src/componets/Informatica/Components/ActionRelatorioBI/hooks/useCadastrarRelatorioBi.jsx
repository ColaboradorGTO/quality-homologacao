import React, { useState } from "react"
import Swal from "sweetalert2";
import { post } from "../../../../../api/funcRequest";
import axios from "axios";

export const useCadastrarRelatorioBi = ({ handleClose, refetch, optionsModulos, usuarioLogado }) => {

  const [statusSelecionado, setStatusSelecionado] = useState('');
  const [descricao, setDescricao] = useState('');
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

  const optionsStatus = [
    { value: "True", label: "Ativo" },
    { value: "False", label: "Inativo" },
  ]

  const onSubmit = async (data) => {

    if (optionsModulos?.CRIAR === 'False') {
      Swal.fire({
        title: 'Atenção',
        html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para cadastrar Relatório BI.`,
        icon: 'warning',
        confirmButtonText: 'OK',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 5000
      });
      return;
    }


    const postData = {
      DSRELATORIOBI: data.descricaoRelatorio,
      STATIVO: statusSelecionado
    }

    try {

      const response = await post('/createRelatorioInformaticaBI', postData)

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Relatório cadastrado com sucesso!',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 1500
      })
      const textDados = JSON.stringify(postData);
      let textoFuncao = 'INFORMATICA/CRIANDO RELATORIO BI';
      const ipUsuario = await getIPUsuario();

      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || 'IP não disponível',
      };

      await post('/log-web', createData);

      setStatusSelecionado('');
      refetch();
      handleClose();
      return response.data;

    } catch (error) {
      const textDados = JSON.stringify(postData);
      let textoFuncao = 'INFORMATICA/ERRO AO CRIAR RELATORIO BI';
      const ipUsuario = await getIPUsuario();
      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || 'IP não disponível',
      };

      const responsePost = await post('/log-web', createData);

      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Erro ao cadastrar Relatório!',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 5000
      });
      return responsePost.data;
    }
  }
  
  return {
    onSubmit,
    descricao,
    setDescricao,
    statusSelecionado,
    setStatusSelecionado,
    usuarioLogado,
    optionsStatus
  }


}
