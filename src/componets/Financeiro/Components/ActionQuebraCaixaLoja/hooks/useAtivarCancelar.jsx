import axios from "axios";
import { useState } from "react";
import { post, put } from "../../../../../api/funcRequest";
import Swal from "sweetalert2";

export const useAtivarCancelar = ({ usuarioLogado, optionsModulos, handleClick }) => {
  const [ipUsuario, setIpUsuario] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleCancelar = async (IDQUEBRACAIXA, status) => {
    if (optionsModulos[0]?.ALTERAR == 'False') {
      Swal.fire({
        title: 'Atenção',
        text: `Você não tem permissão para alterar o status da Quebra de Caixa`,
        icon: 'warning',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      return;
    }

    setIsSubmitting(true);
    const putData = {
      IDQUEBRACAIXA: IDQUEBRACAIXA,
      STATIVO: status ? 'True' : 'False'
    }
    try {
      const response = await put('/atualizar-status-quebra', putData)
      Swal.fire({
        title: 'Sucesso',
        text: `Quebra de Caixa ${status ? 'Ativada' : 'Cancelada'} com Sucesso`,
        icon: 'success',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })

      const textDados = JSON.stringify(putData)
      let textoFuncao = status ? 'FINANCEIRO/ATIVADO QUEBRA DE CAIXA' : 'FINANCEIRO/CANCELAMENTO DE QUEBRA DE CAIXA';
      const ipUsuario = await getIPUsuario();
      const postData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }

      await post('/log-web', postData)
      await handleClick();
      return response.data;

    } catch (error) {
      const textDados = JSON.stringify(putData)
      let textoFuncao = status ? 'FINANCEIRO/ERRO ALTERAR QUEBRA DE CAIXA' : 'FINANCEIRO/CANCELAMENTO DE QUEBRA DE CAIXA';
      const ipUsuario = await getIPUsuario();
      const postData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }

      const responsePost = await post('/log-web', postData)

      Swal.fire({
        title: 'Erro',
        text: `Erro ao Tentar ${status ? 'Ativar' : 'Cancelar'} a Quebra de Caixa`,
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      responsePost.data;
    } finally {
      setIsSubmitting(false);
    }

  }

  return {
    handleCancelar
  }

}