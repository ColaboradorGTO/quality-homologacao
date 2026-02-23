import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {post} from "../../../../../api/funcRequest";

export const useCadastrarMotivoDevolucao = ({optionsModulos, usuarioLogado, handleClose}) => {
  const storedModule = localStorage.getItem('moduloselecionado');
  const selectedModule = JSON.parse(storedModule);
  const [ipUsuario, setIpUsuario] = useState('');
  const [motivo, setMotivo] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    getIPUsuario();
  }, [usuarioLogado]);

  const getIPUsuario = async () => {
    const response = await axios.get('http://ipwho.is/')
    if (response.data) {
      setIpUsuario(response.data.ip);
    }
    return response.data;
  }

 

  const onSubmit = async () => {
    if(optionsModulos[0]?.CRIAR == 'False') {
      Swal.fire({
        position: 'top-center',
        icon: 'error',
        text: 'Você não tem permissão para criar Motivo de Devolução.',
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
    setIsSubmitting(true);

    const putData = {
      IDUSUARIO: usuarioLogado.id,
      DSMOTIVO: motivo,
    }

    try {

      const response = await post('/criar-motivo-devolucao', putData)

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

      const textDados = JSON.stringify(putData);
      let textoFuncao = `FINANCEIRO/EMPRESAS/CADASTRO DE MOTIVO DE DEVOLUÇÃO`;


      const postData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }


      const responsePost = await post('/log-web', postData)
      handleClose();
      return responsePost.data;
    } catch (error) {
      const textDados = JSON.stringify(putData);
      let textoFuncao = `FINANCEIRO/ERRO NO CADASTRO DE MOTIVO DE DEVOLUÇÃO`;

      const postData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
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
    } finally {
      setIsSubmitting(false);
    }
  }


  return {
    motivo,
    setMotivo,
    onSubmit,
  }
}