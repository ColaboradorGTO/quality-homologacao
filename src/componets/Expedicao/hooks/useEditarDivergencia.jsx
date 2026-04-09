import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { post, put } from "../../../api/funcRequest";
import axios from "axios";

export const useEditarDivergencia = ({
  dadosEncontrados,
  handleClose,
  refetchStatus,
  optionsModulos,
  usuarioLogado
}) => {

  const [descricao, setDescricao] = useState('')
  const [statusDivergencia, setStatusDivergencia] = useState('')
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
    if (dadosEncontrados) {
      setDescricao(dadosEncontrados?.DESCRICAODIVERGENCIA);
      setStatusDivergencia(
        {
          value: dadosEncontrados?.STATIVO === "True" ? 'True' : 'False',
          label: dadosEncontrados?.STATIVO === "True" ? 'Ativo' : 'Inativo'
        }
      );
    }

  }, [dadosEncontrados])


  const onSubmit = async () => {
    if (optionsModulos[0]?.ALTERAR == 'False') {
      Swal.fire({
        title: 'Erro!',
        text: `${usuarioLogado?.NOFUNCIONARIO},\nVocê não tem permissão para finalizar a OT!`,
        icon: 'error',
        customClass: { container: 'custom-swal' }
      });
      return;
    }

    const postData = {
      DESCRICAODIVERGENCIA: descricao,
      IDSTATUSDIVERGENCIA: Number(dadosEncontrados.IDSTATUSDIVERGENCIA),
      STATIVO: statusDivergencia.value
    };

    try {
      const response = await put('/status-divergencia/:id', postData);

      const textDados = JSON.stringify(postData);
      let textoFuncao = 'CONFERNCIA CEGA / ALTERAR DIVERGENCIA OT';
      const ipUsuario = await getIPUsuario();

      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || "INDISPONIVEL"
      };

      await post('/log-web', createData)

      Swal.fire({
        title: 'Sucesso!',
        text: 'Divergência alterada com sucesso!',
        icon: 'success',
        customClass: {
          container: 'custom-swal',
        },
        timer: 3000,
      });

      handleClose();
      refetchStatus();

      return response.data;

    } catch (error) {
      console.log(error);

      const textDados = JSON.stringify(postData);
      let textoFuncao = 'CONFERNCIA CEGA / ALTERAR DIVERGENCIA OT';
      const ipUsuario = await getIPUsuario();

      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || "INDISPONIVEL"
      };

      const responsePost = await post('/log-web', createData)

      Swal.fire({
        title: 'Erro',
        text: 'Erro ao alterar divergência',
        icon: 'error',
        customClass: {
          container: 'custom-swal',
        },
        timer: 3000,
      });

      return responsePost.data;
    }
  };

  return {
    descricao,
    setDescricao,
    usuarioLogado,
    statusDivergencia,
    setStatusDivergencia,
    onSubmit
  };
};