import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { post, put } from "../../../../../api/funcRequest";



export const useEditarPerfilPermissaoUsuario = ({dadosEditarPermissao, handleClose, handleClick}) => {
  const [alterar, setAlterar] = useState('False');
  const [criar, setCriar] = useState('False');
  const [nivel1, setNivel1] = useState('False');
  const [nivel2, setNivel2] = useState('False');
  const [nivel3, setNivel3] = useState('False');
  const [nivel4, setNivel4] = useState('False');
  const [administrador, setAdministrador] = useState('False');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [ipUsuario, setIpUsuario] = useState('');
  const [idMenuFilho, setIdMenuFilho] = useState('');
  const [nomeMenuFilho, setNomeMenuFilho] = useState('');
  const [departamentoSelecionado, setDepartamentoSelecionado] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const usuarioArmazenado = localStorage.getItem('usuario');

    if (usuarioArmazenado) {
      try {
        const parsedUsuario = JSON.parse(usuarioArmazenado);
        setUsuarioLogado(parsedUsuario);
      } catch (error) {
        console.error('Erro ao parsear o usuário do localStorage:', error);
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  const getIPUsuario = async () => {
    try {
      const response = await axios.get('https://api.ipify.org?format=json9');
      if (response.data && response.data.ip) {
        return response.data.ip;
      }
      throw new Error("Resposta inválida do ipfy.org");
    } catch (error) {
      const responseIP2 = await axios.get('https://ifconfig.me/ip');
      return responseIP2.data?.data?.ip;
      
    }
  };

  useEffect(() => {

    if(dadosEditarPermissao) {
      setAlterar(dadosEditarPermissao[0]?.ALTERAR == 'True' ? 'Sim' : 'Não');
      setCriar(dadosEditarPermissao[0]?.CRIAR == 'True' ? 'Sim' : 'Não');
      setNivel1(dadosEditarPermissao[0]?.N1 == 'True' ? 'Sim' : 'Não');
      setNivel2(dadosEditarPermissao[0]?.N2 == 'True' ? 'Sim' : 'Não');
      setNivel3(dadosEditarPermissao[0]?.N3 == 'True' ? 'Sim' : 'Não');
      setNivel4(dadosEditarPermissao[0]?.N4 == 'True' ? 'Sim' : 'Não');
      setAdministrador(dadosEditarPermissao[0]?.ADMINISTRADOR == 'True' ? 'Sim' : 'Não');
      setIdMenuFilho(dadosEditarPermissao[0]?.IDMENUFILHO);
     
    }

  }, [])


  const onSubmit = async (data) => {
    if (isSubmitting) return; 

    setIsSubmitting(true); 

    try {
      const payload = {
        IDPERFIL: dadosEditarPermissao[0]?.IDPERFIL,
        CRIAR: criar == 'Sim' ? 'True' : 'False',
        ALTERAR: alterar == 'Sim' ? 'True' : 'False',
        ADMINISTRADOR: administrador == 'Sim' ? 'True' : 'False',
        N1: nivel1 == 'Sim' ? 'True' : 'False',
        N2: nivel2 == 'Sim' ? 'True' : 'False',
        N3: nivel3 == 'Sim' ? 'True' : 'False',
        N4: nivel4 == 'Sim' ? 'True' : 'False',
        IDUSERULTIMAALTERACAO: usuarioLogado.id,
      };

      const response = await put(`/perfil-permissao/:id`, payload);

      const textDados = JSON.stringify(payload);
      const textoFuncao = 'PERFIL PERMISSÕES/ALTERAÇÃO DE PERMISSÕES';
      const ipUsuario = await getIPUsuario();
      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario,
      };

      await post('/log-web', createData);

      Swal.fire({
        icon: 'success',
        title: 'Sucesso',
        text: 'Permissão editada com sucesso!',
        showConfirmButton: false,
        timer: 3000,
        customClass: {
          container: 'custom-swal',
      },
      });
      handleClose()
      handleClick()
      return response.data;
    } catch (error) {
      
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Ocorreu um erro ao editar a permissão.',
      });
    } finally {
      setIsSubmitting(false); 
    }
  };

  return {
    alterar,
    setAlterar,
    criar,
    setCriar,
    nivel1,
    setNivel1,
    nivel2, 
    setNivel2,
    nivel3,
    setNivel3,
    nivel4,
    setNivel4,
    administrador,
    setAdministrador,
    usuarioLogado,
    onSubmit,
    isSubmitting,
    idMenuFilho,
    setIdMenuFilho,
  }
}