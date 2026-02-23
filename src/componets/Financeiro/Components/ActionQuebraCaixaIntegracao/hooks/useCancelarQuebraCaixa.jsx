import axios from "axios";
import { useState } from "react";
import { post, put } from "../../../../../api/funcRequest";
import Swal from "sweetalert2";

export const useCancelar = ({ usuarioLogado, optionsModulos, handleClick }) => {
  const [ipUsuario, setIpUsuario] = useState('');


  const getIPUsuario = async () => {
    let usuarioIP = null;

    try {
      const { data: ipWhoisData } = await axios.get("http://ipwho.is/");
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

  const handleCancelar = async (rowData) => {
    if (optionsModulos[0]?.ALTERAR == 'False') {
      Swal.fire({
        position: 'center',
        icon: 'error',
        html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para alterar a fatura.`,
        showConfirmButton: true,
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        },
      });
      return;
    }

    Swal.fire({
      title: 'Deseja Cancelar a Conferência da Quebra de Caixa?',
      text: 'Você não poderá reverter esta ação!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Não',
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
        actions: 'swal-button-spacing'
      },
      buttonsStyling: false,
      didOpen: () => {
        const style = document.createElement('style');
        style.innerHTML = '.swal-button-spacing button { margin: 0 5px; }';
        document.head.appendChild(style);
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          position: 'center',
          icon: 'info',
          title: 'Integrando Adiantamentos',
          html: 'Aguarde... <br><small><strong id="progressoIntegracao">0</strong> de <strong id="totalIntegracao">' + rowData.length + '</strong></small>',
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
          customClass: {
            container: 'custom-swal',
          }
        });

        const putData = {
          IDQUEBRACAIXA: parseInt(rowData.IDQUEBRACAIXA),
          STCONFERIDO: 'False',
          IDFUNCIONARIO: Number(usuarioLogado.id),
        }

        try {

          const response = await put('/quebra-caixa-conferencia/:id', putData)
          const textDados = JSON.stringify(putData)
          const ipUsuario = await getIPUsuario();
          const postData = {
            IDFUNCIONARIO: String(usuarioLogado.id),
            PATHFUNCAO: `FINANCEIRO/CANCELAR CONFIRMAÇÃO QUEBRA DE CAIXA`,
            DADOS: textDados,
            IP: ipUsuario
          }

          await post('/log-web', postData)
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Quebras de Caixa Atualizadas com sucesso!',
            showConfirmButton: false,
            timer: 3000,
            customClass: {
              container: 'custom-swal',
            },
          })

          handleClick();
          setSelectedItems([]);
          return response.data;
        } catch (error) {
          const textDados = JSON.stringify(putData)
          const ipUsuario = await getIPUsuario();
          const postData = {
            IDFUNCIONARIO: String(usuarioLogado.id),
            PATHFUNCAO: `FINANCEIRO/ERRO AO CANCELAR CONFIRMAÇÃO QUEBRA DE CAIXA`,
            DADOS: textDados,
            IP: ipUsuario
          }

          const responsePost = await post('/log-web', postData)
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Ocorreu um erro ao cancelar a confirmação da quebra de caixa. Por favor, tente novamente.',
            showConfirmButton: false,
            timer: 3000,
            customClass: {
              container: 'custom-swal',
            },
          });
          console.error('Erro ao cancelar a confirmação da quebra de caixa:', error);
          return responsePost.data;
        }
      } else {
        return;
      }
    });

  }


  return {
    handleCancelar
  }

}