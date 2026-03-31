import axios from "axios";
import Swal from "sweetalert2";
import { useQuery } from "react-query";
import { useState, useEffect } from "react";
import { get, post, put } from "../../../api/funcRequest";

export const useEncerrarOT = ({
  dadosEncerrarOT,
  refetchListaConferencia,
  optionsModulos,
  usuarioLogado,
  handleClose,
}) => {

  const [observacao, setObservacao] = useState('')
  const [statusDivergencia, setStatusDivergencia] = useState('')
  const [idResumoOT, setIdResumoOT] = useState(null)
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

  const { data: dadosStatus = [], error: errorStatus, isLoading: isLoadingStatus } = useQuery(
    'status-divergencia',
    async () => {
      const response = await get(`/status-divergencia`);
      return response.data;
    },

    { staleTime: 5 * 60 * 1000 }
  );

  useEffect(() => {
    setIdResumoOT(dadosEncerrarOT.IDRESUMOOT)
  }, [dadosEncerrarOT])

  const onSubmit = async () => {
    if (optionsModulos[0]?.ALTERAR !== 'True') {
      Swal.fire({
        icon: 'error',
        title: 'Atenção!',
        text: 'Você não tem permissão para cancelar este arquivo.',
        confirmButtonColor: '#7352A5',
      });
      return;
    }

    const putData = {
      IDSTDIVERGENCIA: Number(statusDivergencia.value),
      OBSDIVERGENCIA: observacao,
      IDUSRAJUSTE: usuarioLogado.id,
      IDSTATUSOT: parseInt(8),
      IDRESUMOOT: parseInt(idResumoOT)
    };
    try {
      const response = await put('/resumo-ordem-transferencia-cega/:id', putData);

      const textDados = JSON.stringify(putData);
      let textoFuncao = 'CONFERNCIA CEGA / SUCESSO AO ENCERRAR OT';
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
        text: 'OT encerrada com sucesso.',
        icon: 'success',
        customClass: {
          container: 'custom-swal'
        }
      });

      handleClose();
      refetchListaConferencia()

      return response.data;
    }
    catch (error) {
      console.error('Erro ao encerrar OT:', error);

      const textDados = JSON.stringify(putData);
      let textoFuncao = 'CONFERENCIA CEGA/ERRO AO ENCERRAR OT';
      const ipUsuario = await getIPUsuario();

      const createData = {
        IDFUNCIONARIO: String(usuarioLogado?.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || "INDISPONÍVEL"
      };

      const responsePost = await post('/log-web', createData)

      Swal.fire({
        title: 'Erro!',
        text: 'Erro ao encerrar produto.',
        icon: 'error',
        customClass: {
          container: 'custom-swal'
        }
      });
      
      return responsePost.data;
    }
  };

  return {
    observacao,
    setObservacao,
    statusDivergencia,
    setStatusDivergencia,
    onSubmit,
    dadosStatus
  };
};