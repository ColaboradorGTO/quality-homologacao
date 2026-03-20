import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { post, put } from "../../../api/funcRequest";
import axios from "axios";

export const useInserirDivergencia = ({
  dadosStatusDivergencia,
  handleClose,
  refetchStatus,
  optionsModulos,
  usuarioLogado
}) => {

  const [descricao, setDescricao] = useState('')
  const [statusDivergencia, setStatusDivergencia] = useState('')
  const [descricaoSelecionada, setDescricaoSelecionada] = useState('')
  const [statusSelecionado, setStatusSelecionado] = useState('')
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

  const onSubmit = async () => {
    if (statusDivergencia === '') {
      Swal.fire({
        title: 'Atenção!',
        type: 'warning',
        text: 'Necessário preencher o Motivo!',
        icon: 'warning',
        customClass: {
          container: 'custom-swal',
        }
      });
      return;
    }

    if (descricao === '') {
      Swal.fire({
        title: 'Atenção!',
        type: 'warning',
        text: 'Necessário preencher a Observação!',
        icon: 'warning',
        customClass: {
          container: 'custom-swal',
        }
      });
      return;
    }

    const postData = {
      DESCRICAODIVERGENCIA: descricao,
      IDUSRCRIACAO: usuarioLogado.id,
      STATIVO: statusDivergencia
    };
    const response = await post('/inserir-status-divergencia', postData);

    const textDados = JSON.stringify(postData);
    let textoFuncao = 'CONFERNCIA CEGA / INSERIR DIVERGENCIA OT';

    const createData = {
      IDFUNCIONARIO: usuarioLogado.id,
      PATHFUNCAO: textoFuncao,
      DADOS: textDados,
      IP: ipUsuario
    };

    const responsePost = await post('/log-web', createData)
    Swal.fire({
      title: 'Sucesso!',
      text: 'Divergência inserida com sucesso!',
      icon: 'success',
      customClass: {
        container: 'custom-swal',
      }
    });
    handleClose();
    return responsePost.data;
  };

  useEffect(() => {
    if (dadosStatusDivergencia) {
      setDescricaoSelecionada(dadosStatusDivergencia?.DESCRICAODIVERGENCIA);
      setStatusSelecionado(dadosStatusDivergencia?.STATIVO);
    }

  }, [dadosStatusDivergencia])
  
  const onSubmitAlterar = async () => {
    if (statusSelecionado === '') {
      Swal.fire({
        title: 'Atenção!',
        type: 'warning',
        text: 'Necessário preencher o Motivo!',
        icon: 'warning',
        customClass: {
          container: 'custom-swal',
        },
        timer: 3000,
      });
      return;
    }

    if (descricaoSelecionada === '') {
      Swal.fire({
        title: 'Atenção!',
        type: 'warning',
        text: 'Necessário preencher a Observação!',
        icon: 'warning',
        customClass: {
          container: 'custom-swal',
        },
        timer: 3000,
      });
      return;
    }

    const postData = {
      DESCRICAODIVERGENCIA: descricaoSelecionada,
      IDUSRCRIACAO: usuarioLogado.id,
      STATIVO: statusSelecionado
    };
    const response = await put('/status-divergencia/:id', postData);

    const textDados = JSON.stringify(postData);
    let textoFuncao = 'CONFERNCIA CEGA / ALTERAR DIVERGENCIA OT';

    const createData = {
      IDFUNCIONARIO: usuarioLogado.id,
      PATHFUNCAO: textoFuncao,
      DADOS: textDados,
      IP: ipUsuario
    };

    const responsePost = await post('/log-web', createData)
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
    return responsePost.data;
  };

  return {
    descricao,
    setDescricao,
    usuarioLogado,
    statusDivergencia,
    setStatusDivergencia,
    descricaoSelecionada,
    setDescricaoSelecionada,
    statusSelecionado,
    setStatusSelecionado,
    onSubmitInserir,
    onSubmitAlterar
  };
};