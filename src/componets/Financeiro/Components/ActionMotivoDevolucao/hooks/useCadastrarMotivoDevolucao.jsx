import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {post} from "../../../../../api/funcRequest";

export const useCadastrarMotivoDevolucao = ({optionsModulos, usuarioLogado, handleClose}) => {
  const [ipUsuario, setIpUsuario] = useState('');
  const [motivo, setMotivo] = useState('')

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
    if(optionsModulos[0]?.CRIAR == 'False') {
      Swal.fire({
        position: 'top-center',
        icon: 'error',
        html: `${usuarioLogado?.NOFUNCIONARIO} Você não tem permissão para criar Motivo de Devolução.`,
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    if (!motivo || motivo.length < 8) {
      Swal.fire({
        position: 'top-center',
        icon: 'error',
        text: 'O campo Motivo é obrigatório. e deve ter no mínimo 8 caracteres.',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }
  

    const putData = {
      IDUSUARIO: usuarioLogado.id,
      DSMOTIVO: motivo,
    }

    try {

      const response = await post('/criar-motivo-devolucao', putData)
      const textDados = JSON.stringify(putData);
      let textoFuncao = `FINANCEIRO/EMPRESAS/CADASTRO DE MOTIVO DE DEVOLUÇÃO`;
      const ipUsuario = await getIPUsuario();

      const postData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || 'IP não disponível'
      }
      
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Motivo de Devolução Criado com sucesso!',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 3000
      });

      await post('/log-web', postData)
      handleClose();
      return response.data;
    } catch (error) {
      const textDados = JSON.stringify(putData);
      let textoFuncao = `FINANCEIRO/ERRO NO CADASTRO DE MOTIVO DE DEVOLUÇÃO`;
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
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 3000
      });
      handleClose();
      return responsePost.data;
    } 
  }


  return {
    motivo,
    setMotivo,
    onSubmit,
  }
}