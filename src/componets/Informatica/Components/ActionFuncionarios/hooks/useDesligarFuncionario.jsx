import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import { useEffect, useState } from "react";
import { getDataAtual, getDataHoraAtual } from "../../../../../utils/dataAtual";
import axios from 'axios';


export const useDesligarFuncionario = ({ handleClose, optionsModulos, usuarioLogado, handleClick }) => {
  const [ipUsuario, setIpUsuario] = useState('');
  const [dataAdmissao, setDataAdmissao] = useState('');

  useEffect(() => {
    const dataAtual = getDataHoraAtual()
    setDataAdmissao(dataAtual)
  }, [])

  const getIPUsuario = async () => {
    try {
      const response = await axios.get('https://api.ipify.org?format=json9');
      if (response.data && response.data.ip) {
        return response.data.ip;
      }
      throw new Error("Resposta inválida do ipfy.org");
    } catch (error) {
      const responseIP2 = await axios.get('https://api.ipwho.org/me');
      return responseIP2.data?.data?.ip;

    }
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
      DATAULTIMAALTERACAO: dataAdmissao,
      STATIVO: 'False',
      DATA_DEMISSAO: dataAdmissao,
      ID: Number(row.ID)
    }



    try {
      const response = await put('/inativar-funcionario', putData)

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
        textoFuncao = 'INFORMATICA/ATIVA DESLIGAMENTO DE FUNCIONARIO';
      } else {
        textoFuncao = 'INFORMATICA/DESLIGAMENTO DE FUNCIONARIO';
      }

      const ipUsuario = await getIPUsuario();
      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }

      const responsePost = await post('/log-web', createData)

      handleClick()
      return responsePost.data;
    } catch (error) {

      const putData = {
        DATAULTIMAALTERACAO: dataAdmissao,
        STATIVO: 'False',
        DATA_DEMISSAO: dataAdmissao,
        ID: Number(row.ID)
      }

      const textDados = JSON.stringify(putData)
      const ipUsuario = await getIPUsuario();
      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
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

