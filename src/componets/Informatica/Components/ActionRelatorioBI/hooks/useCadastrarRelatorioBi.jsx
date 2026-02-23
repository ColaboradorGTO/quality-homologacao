import React, { useEffect, useState } from "react"
import Swal from "sweetalert2";
import { post } from "../../../../../api/funcRequest";
import axios from "axios";

export const useCadastrarRelatorioBi = ({ handleClose, refetch, optionsModulos, usuarioLogado }) => {

  const [statusSelecionado, setStatusSelecionado] = useState('');
  const [descricao, setDescricao] = useState('');
  const [ipUsuario, setIpUsuario] = useState('');

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


  const optionsStatus = [
    { value: "True", label: "Ativo" },
    { value: "False", label: "Inativo" },
  ]

  const onSubmit = async (data) => {

    if (optionsModulos?.CRIAR === 'False') {
      Swal.fire({
        title: 'Atenção',
        text: 'Você não tem permissão para cadastrar Relatório BI.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }

    if (!data.descricaoRelatorio || !statusSelecionado) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Preencha todos os campos!',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 1500
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
        IP: ipUsuario,
      };

      const responsePost = await post('/log-web', createData);

      setStatusSelecionado('');
      refetch();
      handleClose();
      return responsePost.data;

    } catch (error) {

      const postData = {
        DSRELATORIOBI: data.descricaoRelatorio,
        STATIVO: statusSelecionado
      }

      const textDados = JSON.stringify(postData);
      let textoFuncao = 'INFORMATICA/ERRO AO CRIAR RELATORIO BI';

      const ipUsuario = await getIPUsuario();

      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario,
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
        timer: 1500
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
