import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { post } from "../../../../../api/funcRequest";

export const useProcessarSefazOT = ({
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

  const handleProcessarSefaz = async (selectedIds) => {
    if (optionsModulos[0]?.ALTERAR === 'False') {
      Swal.fire({
        title: 'Erro!',
        text: `${usuarioLogado?.NOFUNCIONARIO},\nVocê não tem permissão para processar  SEFAZ!`,
        icon: 'error',
        customClass: {
          container: 'custom-swal'
        },
      });
      return;
    }

    const dados = selectedIds.map(id => ({
      IDSAPORIGEM: parseInt(id),
    }));

    if (dados.length === 0) {
      Swal.fire({
        title: 'Atenção',
        text: 'Nenhuma OT selecionada para emissão.',
        icon: 'warning',
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Deseja Realizar a Emissão das Notas?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, quero Emitir!',
      cancelButtonText: 'Não',
    });

    if (!result.isConfirmed) return;

    Swal.fire({
      title: 'Emitindo Notas, aguarde...',
      icon: 'info',
      timer: 120000,
      backdrop: false,
      didOpen: () => Swal.showLoading(),
      allowOutsideClick: false,
    });

    try {
      const response = await post('/consulta-nfe-saida-tranferencia-varias', dados);

      Swal.close();
      Swal.fire('Notas Emitidas com Sucesso!', '', 'success');

      const textDados = JSON.stringify(dados);
      let textoFuncao = 'EXPEDICAO/PROCESSAR SEFAZ COM SUCESSO';
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
      console.error('Erro ao Emitir as Notas:', error);
      Swal.close();
      Swal.fire({
        title: 'Erro!',
        text: `Erro ao Emitir as Notas: `,
        icon: 'error',
      });

      const textDados = JSON.stringify(dados);
      let textoFuncao = 'EXPEDICAO/ERRO AO PROCESSAR SEFAZ COM SUCESSO';
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

    handleProcessarSefaz,
  };
};

