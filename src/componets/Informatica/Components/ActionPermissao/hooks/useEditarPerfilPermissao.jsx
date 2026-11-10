import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { post, put } from "../../../../../api/funcRequest";

export const useEditarPerfilPermissaoUsuario = ({ dadosEditarPermissao, handleClose, handleClick }) => {

  const [alterar, setAlterar] = useState('False');
  const [criar, setCriar] = useState('False');
  const [nivel1, setNivel1] = useState('False');
  const [nivel2, setNivel2] = useState('False');
  const [nivel3, setNivel3] = useState('False');
  const [nivel4, setNivel4] = useState('False');
  const [administrador, setAdministrador] = useState('False');
  const [situacaoSelecionada, setSituacaoSelecionada] = useState('False');
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

    if (dadosEditarPermissao) {

      setAlterar({ value: dadosEditarPermissao[0]?.ALTERAR == 'True' ? 'Sim' : 'Não', label: dadosEditarPermissao[0]?.ALTERAR == 'True' ? 'Sim' : 'Não' });
      setCriar({ value: dadosEditarPermissao[0]?.CRIAR == 'True' ? 'Sim' : 'Não', label: dadosEditarPermissao[0]?.CRIAR == 'True' ? 'Sim' : 'Não' });
      setNivel1({ value: dadosEditarPermissao[0]?.N1 == 'True' ? 'Sim' : 'Não', label: dadosEditarPermissao[0]?.N1 == 'True' ? 'Sim' : 'Não' });
      setNivel2({ value: dadosEditarPermissao[0]?.N2 == 'True' ? 'Sim' : 'Não', label: dadosEditarPermissao[0]?.N2 == 'True' ? 'Sim' : 'Não' });
      setNivel3({ value: dadosEditarPermissao[0]?.N3 == 'True' ? 'Sim' : 'Não', label: dadosEditarPermissao[0]?.N3 == 'True' ? 'Sim' : 'Não' });
      setNivel4({ value: dadosEditarPermissao[0]?.N4 == 'True' ? 'Sim' : 'Não', label: dadosEditarPermissao[0]?.N4 == 'True' ? 'Sim' : 'Não' });
      setAdministrador({ value: dadosEditarPermissao[0]?.ADMINISTRADOR == 'True' ? 'Sim' : 'Não', label: dadosEditarPermissao[0]?.ADMINISTRADOR == 'True' ? 'Sim' : 'Não' });
      setIdMenuFilho(dadosEditarPermissao[0]?.IDMENUFILHO);
      setSituacaoSelecionada({ value: dadosEditarPermissao[0]?.STATIVO == 'True' ? 'Ativo' : 'Inativo', label: dadosEditarPermissao[0]?.STATIVO == 'True' ? 'Ativo' : 'Inativo' });

    }

  }, [])

  console.log(situacaoSelecionada.value == 'ATIVO' ? 'True' : 'False', 'condição')
  console.log(situacaoSelecionada.value, 'situacaoSelecionada.value ')
  const onSubmitUpdate = async (data) => {

    try {
      const payload = {
        ADMINISTRADOR: administrador.value,
        CRIAR: criar.value,
        ALTERAR: alterar.value,
        N1: nivel1.value,
        N2: nivel2.value,
        N3: nivel3.value,
        N4: nivel4.value,
        STATIVO: situacaoSelecionada.value,
        IDPERFIL: dadosEditarPermissao[0]?.IDPERFIL,
      };

      const response = await put(`/perfil-update/:id`, payload);

      const textDados = JSON.stringify(payload);
      const textoFuncao = 'PERFIL PERMISSÕES/ALTERAÇÃO DE PERMISSÕES';
      const ipUsuario = await getIPUsuario();

      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || 'INDISPONIVEL',
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
        customClass: {
          container: 'custom-swal',
        },
      });

    }
  };


  const onSubmit = async (data) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    //console.log(dadosEditarPermissao[0]?.IDPERFIL, 'IDPERFIL');
    try {
      const payload = {
        IDPERFIL: dadosEditarPermissao[0]?.IDPERFIL,
        CRIAR: criar.value,
        ALTERAR: alterar.value,
        ADMINISTRADOR: administrador.value,
        N1: nivel1.value,
        N2: nivel2.value,
        N3: nivel3.value,
        N4: nivel4.value,
        //STATIVO: situacaoSelecionada.value || 'True',
        IDUSERULTIMAALTERACAO: usuarioLogado.id,
      };

      const response = await put(`/perfil-usuario/:id`, payload);

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
        customClass: {
          container: 'custom-swal',
        },
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
    situacaoSelecionada,
    setSituacaoSelecionada,
    usuarioLogado,
    onSubmit,
    isSubmitting,
    idMenuFilho,
    setIdMenuFilho,
    onSubmitUpdate
  }
}