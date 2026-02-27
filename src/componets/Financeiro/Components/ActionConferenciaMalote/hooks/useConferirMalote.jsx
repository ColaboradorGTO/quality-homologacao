import { useState } from "react";
import Swal from "sweetalert2"
import axios from "axios";
import { post, put } from "../../../../../api/funcRequest";

export const useConferirMalote = ({
  salvarDadosMalotes,
  checkedItems,
  handleClick,
  handleClose,
  optionsModulos,
  usuarioLogado
}) => {
  const [observacaoFinanceiro, setObservacaoFinanceiro] = useState('');
  const [observacaoLoja, setObservacaoLoja] = useState('');
  const [ipUsuario, setIpUsuario] = useState('');

  const getIPUsuario = async () => {
    let usuarioIP = null;

    try {
      const { data: ipWhoisData } = await axios.get("https://ifconfig.me/ip");
      usuarioIP = ipWhoisData?.ip;
    } catch (error) {
      console.error("Erro ao buscar IP via ifconfig.me:", error);
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

  const onSalvarMalote = async (status) => {
    if (optionsModulos[0]?.ALTERAR == 'False') {
      Swal.fire({
        title: 'Erro!',
        text: `${usuarioLogado?.NOFUNCIONARIO},\nVocê não tem permissão para alterar o Malote!`,
        icon: 'error',
        customClass: {
          container: 'custom-swal',
        },
      });
      return;
    }

    if (!usuarioLogado?.id || !salvarDadosMalotes[0]?.IDEMPRESA) {
      if (!salvarDadosMalotes[0]?.IDEMPRESA) {
        Swal.fire({
          title: 'Erro!',
          text: `Erro ao tentar recuperar os dados da Sessão do Usuário ${usuarioLogado?.NOFUNCIONARIO}, faça o logoff e entre novamente no sistema!`,
          icon: 'error',
          customClass: {
            container: 'custom-swal',
          },
        });
        return;
      }
    }

    if (salvarDadosMalotes[0]?.STATUSMALOTE == 'Devolvido' && !observacaoFinanceiro.length && !checkedItems.length) {
      Swal.fire({
        title: 'Erro!',
        text: `${usuarioLogado?.NOFUNCIONARIO},\nPara devolver o malote é necessário selecionar as pendências e/ou informar a observação!`,
        icon: 'error',
        customClass: {
          container: 'custom-swal',
        },
      });
      return;
    }

    const putData = {
      IDMALOTE: salvarDadosMalotes[0]?.IDMALOTE,
      STATUS: status,
      OBSERVACAOADMINISTRATIVO: observacaoFinanceiro,
      PENDENCIAS: checkedItems.map(id => ({ IDPENDENCIA: id })),
      IDUSERULTIMAALTERACAO: usuarioLogado?.id
    };

    Swal.fire({
      icon: 'question',
      title: `Deseja realmente enviar o Malote?`,
      showCloseButton: true,
      showCancelButton: true,
      cancelButtonColor: '#FD1381',
      confirmButtonColor: '#7352A5',
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      customClass: {
        container: 'custom-swal',
      },

    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await put(`/malotes-loja/:id`, putData);

          const textDados = JSON.stringify(putData);
          let textoFuncao = 'FINANCEIRO / CONFERÊNCIA DE MALOTE';
          const ipUsuario = await getIPUsuario();
          const createData = {
            IDFUNCIONARIO: String(usuarioLogado.id),
            PATHFUNCAO: textoFuncao,
            DADOS: textDados,
            IP: ipUsuario || 'IP não disponível',
          };

          await post('/log-web', createData);

          Swal.fire({
            title: 'Sucesso!',
            html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Malote Recebido com Sucesso!`,
            icon: 'success',
            customClass: {
              container: 'custom-swal',
            },
            timer: 5000,
          });

          handleClick();
          handleClose();
          return response.data;
        } catch (error) {

          const textDados = JSON.stringify(putData);
          let textoFuncao = 'FINANCEIRO / ERRO AO ENVIAR MALOTE';
          const ipUsuario = await getIPUsuario();
          const createData = {
            IDFUNCIONARIO: String(usuarioLogado.id),
            PATHFUNCAO: textoFuncao,
            DADOS: textDados,
            IP: ipUsuario || 'IP não disponível',
          };

          const responsePost = await post('/log-web', createData);

          Swal.fire({
            title: 'Erro!',
            html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Erro ao Enviar Malote!`,
            icon: 'error',
            customClass: {
              container: 'custom-swal',
            },
          });


          return responsePost.data;
        }
      }
    });
  };

  return {
    usuarioLogado,
    observacaoFinanceiro,
    setObservacaoFinanceiro,
    observacaoLoja,
    setObservacaoLoja,
    onSalvarMalote,
  };
};