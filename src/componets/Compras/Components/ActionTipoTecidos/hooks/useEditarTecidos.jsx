import { useState, useEffect } from "react";
import { post, put } from "../../../../../api/funcRequest";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2'


export const useEditarTecido = ({ dadosDetalheTipoTecido, usuarioLogado, optionsModulos }) => {
  const [descricao, setDescricao] = useState('')
  const [statusSelecionado, setStatusSelecionado] = useState('')
  const [ipUsuario, setIpUsuario] = useState('');
  const navigate = useNavigate();


  const getIPUsuario = async () => {
    try {
      const { data: ipWhoisData } = await axios.get("http://ipwho.is/");
      let usuarioIP = ipWhoisData?.ip;

      if (!usuarioIP) {
        const { data: ipifyData } = await axios.get("https://api.ipify.org?format=json");
        usuarioIP = ipifyData?.ip;
      }

      setIpUsuario(usuarioIP);
      return usuarioIP;
    } catch (error) {
      console.error("Erro ao buscar IP:", error);
      return null;
    }
  };



  useEffect(() => {
    if (dadosDetalheTipoTecido.length) {
      setStatusSelecionado({ value: dadosDetalheTipoTecido[0]?.STATIVO, label: dadosDetalheTipoTecido[0]?.STATIVO == 'True' ? 'ATIVO' : 'INATIVO' })
      setDescricao(dadosDetalheTipoTecido[0]?.DSTIPOTECIDO)
    }
  }, [])

  const optionsStatus = [
    { value: 'True', label: 'ATIVO' },
    { value: 'False', label: 'INATIVO' }
  ]

  const onSubmit = async () => {
    if (optionsModulos[0]?.ALTERAR == 'False') {
      Swal.fire({
        icon: 'error',
        title: 'Acesso Negado!',
        text: `${usuarioLogado?.NOFUNCIONARIO},\nVocê não tem permissão para editar os Tipos de Tecidos!`,
        customClass: {
          container: 'custom-swal',
        },
        timer: 5000,
      })
      return;
    }

    const postData = {
      IDTPTECIDO: dadosDetalheTipoTecido[0]?.IDTPTECIDO,
      DSTIPOTECIDO: descricao,
      STATIVO: statusSelecionado.value,
    }
    try {

      const response = await put('/tipo-tecido/:id', postData)

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
      const textDados = JSON.stringify(postData);
      let textoFuncao = 'COMPRAS/CADASTRO DE TIPOS DE TECIDOS';

      const ip = await getIPUsuario();

      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ip
      }

      const responsePost = await post('/log-web', createData)


      return response.data;
    } catch (error) {
      const textDados = JSON.stringify(postData);
      let textoFuncao = 'COMPRAS/ERRO AO CADASTRAR TIPOS DE TECIDOS';

      const ip = await getIPUsuario();
      
      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ip
      }

      const response = await post('/log-web', createData)

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
      return response.data;
    }
  }


  return {
    descricao,
    setDescricao,
    statusSelecionado,
    setStatusSelecionado,
    usuarioLogado,
    ipUsuario,
    navigate,
    getIPUsuario,
    optionsStatus,
    onSubmit,
  }
}