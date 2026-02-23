import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { post } from "../../../../../api/funcRequest";
import { put } from "../../../../../api/funcRequest";

export const useSefazOT = () => {
  const [ipUsuario, setIpUsuario] = useState('');
  const [usuarioLogado, setUsuarioLogado] = useState(null);
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

  }, []);

  useEffect(() => {
    getIPUsuario();
  }, [usuarioLogado]);

  const getIPUsuario = async () => {
    const response = await axios.get('http://ipwho.is/')
    if (response.data) {
      setIpUsuario(response.data.ip);
    }
    return response.data;
  }

  const handleFaturar = async (IDRESUMOOT) => {
    Swal.fire({
      title: 'Deseja Faturar a OT?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, quero Faturar!',
      cancelButtonText: 'Não',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const postData = {
            IDSTATUSOT: 9,
            IDRESUMOOT: IDRESUMOOT,
            NOTAFISCAL: 0,
          };

          const response = await put('/resumo-ordem-transferencia/:id', postData);
          const textDados = JSON.stringify(postData);
          let textoFuncao = 'EXPEDICAO/OT FATURADA COM SUCESSO';

          const createData = {
            IDFUNCIONARIO: usuarioLogado.id,
            PATHFUNCAO: textoFuncao,
            DADOS: textDados,
            IP: ipUsuario
          };
      
          const responsePost = await post('/log-web', createData)

          return responsePost.data;
        } catch (error) {
          Swal.fire({
            title: 'Erro!',
            text: `Erro ao Faturar a OT: ${error}`,
            icon: 'success'
          });
          
          let textoFuncao = 'EXPEDICAO/ERRO AO FATURAR OT';

          const createData = {
            IDFUNCIONARIO: usuarioLogado.id,
            PATHFUNCAO: textoFuncao,
            DADOS: 'Erro ao Cancelar a OT',
            IP: ipUsuario
          };
      
          const responsePost = await post('/log-web', createData)

          return responsePost.data;
        }
      }
    })
  };

  return {
    usuarioLogado,
    setUsuarioLogado,
    handleFaturar,
  };
};

