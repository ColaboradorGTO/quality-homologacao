import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import { useState } from "react";
import axios from "axios";

export const useAtivarCancelar = ({ refetchCaixaZerado, usuarioLogado, optionsModulos }) => {
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

  const handleCancelar = async (row) => {
    if(optionsModulos[0]?.ALTERAR == 'False') {
      Swal.fire({
          position: 'center',
          icon: 'error',
          html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para alterar o caixa.`,
          showConfirmButton: true,
          timer: 3000,
          customClass: {
              container: 'custom-swal', 
          },
      });
      return;
    }

    const putData = {
      ID: row?.IDMOVIMENTO
    }
    try {

      const response = await put('/fechar-caixas-zerados', putData)

      
      const textDados = JSON.stringify(putData)
      let textoFuncao = 'FINANCEIRO/FECHAMENTO DE CAIXAS ZERADOS';
      const ipUsuario = await getIPUsuario();
      const postData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || 'IP não disponível'
      }
      
      await post('/log-web', postData)
      refetchCaixaZerado()
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Caixa Fechado com sucesso!',
        showConfirmButton: false,
        timer: 15000
      })
      return response.data;
    } catch (error) {
      const textDados = JSON.stringify(putData)
      let textoFuncao = 'FINANCEIRO/ERRO AO FAZER FECHAMENTO DE CAIXAS ZERADOS';
      const ipUsuario = await getIPUsuario();
      const postData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || 'IP não disponível'
      }

      const responsePost = await post('/log-web', postData)

      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.',
        showConfirmButton: false,
        timer: 1500
      });

      console.error('Erro ao buscar detalhes da venda: ', error);
      return responsePost.data
    }

  }

  return { handleCancelar };
}