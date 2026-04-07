import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { post } from "../../../../../api/funcRequest";
import { put } from "../../../../../api/funcRequest";

export const useCancelarFaturaOT = ({
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

  const handleCancelar = async (IDRESUMOOT) => {
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

    const postData = {
      IDSTATUSOT: parseInt(2),
      IDRESUMOOT: IDRESUMOOT,
      IDUSRCANCELAMENTO: usuarioLogado.id,
    };

    Swal.fire({
      title: 'Deseja realmente CANCELAR essa OT?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, Cancelar!',
      cancelButtonText: 'Não',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await put('/resumo-ordem-transferencia/:id', postData);

          const textDados = JSON.stringify(postData);
          let textoFuncao = 'EXPEDICAO/OT CANCELADA COM SUCESSO';
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
            text: 'OT Cancelada com sucesso.',
            icon: 'success',
            timer: 1500,
            customClass: {
              container: 'custom-swal'
            }
          });

          refetchFaturaOT()

          return response.data;
        } catch (error) {
          Swal.fire({
            title: 'Erro!',
            text: `Erro ao Cancelar a OT: ${error}`,
            icon: 'success'
          });

          const textDados = JSON.stringify(postData);
          let textoFuncao = 'EXPEDICAO/ERRO AO CANCELAR OT';
          const ipUsuario = await getIPUsuario();

          const createData = {
            IDFUNCIONARIO: usuarioLogado.id,
            PATHFUNCAO: textoFuncao,
            DADOS: textDados,
            IP: ipUsuario || "INDISPONIVEL"
          };

          const responsePost = await post('/log-web', createData)

          return responsePost.data;
        }
      }
    })
  };

  return {

    handleCancelar,
  };
};

