import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { post, put } from "../../../api/funcRequest";
import axios from "axios";

export const useEncerrarOT = (dadosEncerrarOT) => {
  const [observacao, setObservacao] = useState('')
  const [statusDivergencia, setStatusDivergencia] = useState('')
  const [idResumoOT, setIdResumoOT] = useState(dadosEncerrarOT.dadosEncerrarOT.IDRESUMOOT)
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [ipUsuario, setIpUsuario] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioArmazenado = localStorage.getItem('usuario');

    if (usuarioArmazenado) {
      try {
        const parsedUsuario = JSON.parse(usuarioArmazenado);
        setUsuarioLogado(parsedUsuario);
      } catch (error) {
        console.error('Erro ao parsear o usuário do localStorage:', error);
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    getIPUsuario();
  }, [usuarioLogado]);

  const getIPUsuario = async () => {
    const response = await axios.get('http://ipwho.is/');
    if (response.data) {
      setIpUsuario(response.data.ip);
    }
    return response.data;
  };

  const onSubmitEncerrar = async () => {
    if(statusDivergencia === 0) {
      Swal.fire({
        title: 'Atenção!',
        type: 'warning',
        text: 'Necessário preencher o Motivo!',
        icon: 'warning'
      });
      return;
    }

    if(statusDivergencia === 1 && observacao === '') {
      Swal.fire({
        title: 'Atenção!',
        type: 'warning',
        text: 'Necessário preencher a Observação!',
        icon: 'warning'
      });
      return;
    }
    
    const postData = {
      IDSTDIVERGENCIA: statusDivergencia,
      OBSDIVERGENCIA: observacao,
      IDUSRAJUSTE: usuarioLogado.id,
      IDSTATUSOT: parseInt(8),
      IDRESUMOOT: parseInt(idResumoOT)
    };
    const response = await put('/resumo-ordem-transferencia-cega/:id', postData);

    const textDados = JSON.stringify(postData);
    let textoFuncao = 'CONFERNCIA CEGA / ENCERRAR OT';

    const createData = {
      IDFUNCIONARIO: usuarioLogado.id,
      PATHFUNCAO: textoFuncao,
      DADOS: textDados,
      IP: ipUsuario
    };

    const responsePost = await post('/log-web', createData)
    handleClose();
    return responsePost.data;
  };

  return {
    observacao,
    setObservacao,
    usuarioLogado,
    setUsuarioLogado,
    statusDivergencia,
    setStatusDivergencia,
    onSubmitEncerrar
  };
};