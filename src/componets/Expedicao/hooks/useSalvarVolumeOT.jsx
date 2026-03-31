import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { post, put } from "../../../api/funcRequest";
import axios from "axios";

export const useSalvarVolumeOT = ({
  refetchListaConferencia,
  optionsModulos,
  usuarioLogado,
  handleClose,
  dadosDetalheTransferencia
}) => {

  const [descricao, setDescricao] = useState('')
  const [qtdVolume, setQtdVolume] = useState('')
  const [conferirItens, setConferirItens] = useState('')
  const [ipUsuario, setIpUsuario] = useState('');

//console.log(dadosDetalheTransferencia[0]?.IDRESUMOOT)

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
    if (optionsModulos[0]?.ALTERAR !== 'True') {
      Swal.fire({
        icon: 'error',
        title: 'Atenção!',
        text: 'Você não tem permissão para finalizar esta Ordem de Transferência.',
        confirmButtonColor: '#7352A5',
      });
      return;
    }

    const putData = {
      IDSTATUSOT: parseInt(3),
      IDRESUMOOT: dadosDetalheTransferencia[0]?.IDRESUMOOT,
      IDEMPRESAORIGEM: usuarioLogado.IDEMPRESA,
      NUTOTALVOLUMES: qtdVolume,
      TPVOLUME: descricao,
      NOTAFISCAL: parseInt(0),
    };

    Swal.fire({
      icon: 'question',
      title: `Deseja Finalizar a OT?`,
      showCloseButton: true,
      showCancelButton: true,
      cancelButtonColor: '#FD1381',
      confirmButtonColor: '#7352A5',
      confirmButtonText: 'Sim, quero Finalizar!',
      cancelButtonText: 'Não',
      customClass: {
        container: 'custom-swal',
      },
      timer: 3000,
      preConfirm: async () => {

        try {
          const response = await put('/resumo-ordem-transferencia/:id', putData);

          const textDados = JSON.stringify(putData);
          let textoFuncao = 'CONFERENCIA CEGA / FINALIZAR OT';
          const ipUsuario = await getIPUsuario();

          const createData = {
            IDFUNCIONARIO: String(usuarioLogado.id),
            PATHFUNCAO: textoFuncao,
            DADOS: textDados,
            IP: ipUsuario || "INDISPONIVEL"
          };

          const responsePost = await post('/log-web', createData)

          Swal.fire({
            title: 'Sucesso!',
            text: 'OT Finalizada com sucesso.',
            icon: 'success',
            customClass: {
              container: 'custom-swal'
            }
          });

          refetchListaConferencia();
          handleClose();

          return responsePost.data;

        } catch (error) {
          console.error('Erro ao salvar dados:', error);

          const textDados = JSON.stringify(putData);
          let textoFuncao = 'CONFERENCIA CEGA / ERROR AO FINALIZAR OT';
          const ipUsuario = await getIPUsuario();

          const createData = {
            IDFUNCIONARIO: String(usuarioLogado.id),
            PATHFUNCAO: textoFuncao,
            DADOS: textDados,
            IP: ipUsuario || "INDISPONIVEL"
          };

          const responsePost = await post('/log-web', createData)

          Swal.fire({
            title: 'Sucesso!',
            text: 'OT Finalizada com sucesso.',
            icon: 'success',
            customClass: {
              container: 'custom-swal'
            }
          });

          return responsePost.data;
        }
      }
    });
  };

  return {
    descricao,
    setDescricao,
    qtdVolume,
    setQtdVolume,
    conferirItens,
    setConferirItens,
    usuarioLogado,
    onSubmit,
  };
};