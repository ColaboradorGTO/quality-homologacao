import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { post, put } from "../../../../../api/funcRequest";

export const useProcessarFaturamentoOT = ({
  usuarioLogado,
  refetchFaturaOT,
  optionsModulos

}) => {

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

  const handleProcessarFaturamento = async (selectedIds, isLote) => {
    if (optionsModulos[0]?.ALTERAR === 'False') {
      Swal.fire({
        title: 'Erro!',
        text: `${usuarioLogado?.NOFUNCIONARIO},\nVocê não tem permissão para processar faturamento!`,
        icon: 'error',
        customClass: { container: 'custom-swal' },
      });
      return;
    }

    const dados = selectedIds.map(id => ({
      IDSTATUSOT: Number(9),
      IDRESUMOOT: parseInt(id),
      NOTAFISCAL: isLote ? 1 : 0,
    }));

    if (dados.length === 0) {
      Swal.fire({
        title: 'Atenção',
        text: 'Nenhuma OT selecionada para faturamento.',
        icon: 'warning',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Deseja Faturar as OTs?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, quero Faturar!',
      cancelButtonText: 'Não',
    });

    if (!result.isConfirmed) return;

    Swal.fire({
      title: 'Emitindo Faturamento, aguarde...',
      icon: 'info',
      timer: 120000,
      backdrop: false,
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false,
    });

    try {
      const response = await put('/resumo-ordem-transferencia/:id', dados);

      Swal.close();
      Swal.fire('Faturado com Sucesso!', '', 'success');

      let textoFuncao = 'EXPEDICAO/PROCESSAR FATURAMENTO COM SUCESSO';
      const textDados = JSON.stringify(dados);
      const ipUsuario = await getIPUsuario();

      await post('/log-web', {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || 'INDISPONIVEL',
      });

      refetchFaturaOT()

      return response.data;

    } catch (error) {
      console.error(error);
      Swal.close();
      Swal.fire({
        title: 'Erro!',
        text: `Erro ao Faturar as OTs`,
        icon: 'error',
      });

      let textoFuncao = 'EXPEDICAO/ERRO AO PROCESSAR FATURAMENTO COM SUCESSO';
      const textDados = JSON.stringify(dados);
      const ipUsuario = await getIPUsuario();

      const responsePost = await post('/log-web', {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || 'INDISPONIVEL',
      });

      return responsePost.data;
    }
  };

  return {
    handleProcessarFaturamento,

  };
};

