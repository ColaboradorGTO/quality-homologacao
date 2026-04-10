import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import { useEffect, useState } from "react";
import { getDataHoraAtual } from "../../../../../utils/dataAtual";
import axios from 'axios';

export const useDesligarFuncionario = ({ handleClose, optionsModulos, usuarioLogado, handleClick }) => {
  const [ipUsuario, setIpUsuario] = useState('');
  const [dataAdmissao, setDataAdmissao] = useState('');

  useEffect(() => {
    const dataAtual = getDataHoraAtual()
    setDataAdmissao(dataAtual)
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

  const handleDesligarFuncionario = async (row) => {
    if (optionsModulos[0]?.ALTERAR == 'False') {
      Swal.fire({
        title: 'Acesso Negado',
        text: 'Você não tem permissão para acessar esta funcionalidade.',
        icon: 'warning',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      return;
    }

    const putData = {
      DATAULTIMAALTERACAO: String(dataAdmissao),
      STATIVO: 'False',
      DATA_DEMISSAO: String(dataAdmissao),
      ID: parseInt(row.ID)
    }

    try {
      const response = await put('/inativarFuncionarioRH', putData)

      Swal.fire({
        title: 'Atualização',
        text: 'Atualizção Realizada com Sucesso',
        icon: 'success',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })

      const textDados = JSON.stringify(putData)
      let status = putData.STATIVO;
      let textoFuncao;
      if (status == 'True') {
        textoFuncao = 'RH/ATIVA DESLIGAMENTO DE FUNCIONARIO';
      } else {
        textoFuncao = 'RH/DESLIGAMENTO DE FUNCIONARIO';
      }

      const ipUsuario = await getIPUsuario();
      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || 'INDISPONIVEL'
      }

      await post('/log-web', createData)

      handleClick()
      return response.data;
    } catch (error) {

      const putData = {
        DATAULTIMAALTERACAO: String(dataAdmissao),
        STATIVO: 'False',
        DATA_DEMISSAO: String(dataAdmissao),
        ID: Number(row.ID)
      }

      const textDados = JSON.stringify(putData)
      const ipUsuario = await getIPUsuario();
      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || 'INDISPONIVEL'
      }
      const responsePost = await post('/log-web', createData)
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
      return responsePost.data;
    }
  }

  return {
    handleDesligarFuncionario,
  }
}

