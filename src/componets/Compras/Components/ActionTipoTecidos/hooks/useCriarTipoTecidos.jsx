import { useState, useEffect } from "react";
import { post } from "../../../../../api/funcRequest";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2'


export const useCriarTipoTecido = ({ handleClose, usuarioLogado, optionsModulos }) => {
  const [descricao, setDescricao] = useState('')
  const [statusSelecionado, setStatusSelecionado] = useState([])
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

  const optionsStatus = [
    { value: 'True', label: 'ATIVO' },
    { value: 'False', label: 'INATIVO' }
  ]

  const handleCriar = async () => {
    const postData = {
      DSTIPOTECIDO: descricao,
      STATIVO: statusSelecionado.value,
    }
    try {

      const response = await post('/cadastrar-tipo-tecido', postData)

      const textDados = JSON.stringify(postData);
      let textoFuncao = 'COMPRAS/CADASTRO DE TIPOS DE TECIDOS';
      const ipUsuario = await getIPUsuario();
      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || 'IP não disponível'
      }
      
      const responsePost = await post('/log-web', createData)
      
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Atualizado com sucesso!',
        showConfirmButton: false,
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      });

      return responsePost.data;
    } catch (error) {
      const textDados = JSON.stringify(postData);
      let textoFuncao = 'COMPRAS/ERRO AO CADASTRAR TIPOS DE TECIDOS';
      const ipUsuario = await getIPUsuario();
      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || 'IP não disponível'
      }

      const responsePost = await post('/log-web', createData)

      Swal.fire({
        position: 'center',
        icon: 'error',
        text: 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.',
        showConfirmButton: false,
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      });
      console.error(error);
      return responsePost.data;
    }
  }


  return {
    descricao,
    setDescricao,
    statusSelecionado,
    setStatusSelecionado,
    optionsStatus,
    handleCriar
  }
}