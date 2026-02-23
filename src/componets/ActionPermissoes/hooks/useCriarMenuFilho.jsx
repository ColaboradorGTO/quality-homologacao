import React, { Fragment, useEffect, useRef, useState } from "react"
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { get, post, put } from "../../../api/funcRequest";
import { useQuery } from "react-query";


export const useCriarMenuFilho = () => {
  const [moduloSelecionado, setModuloSelecionado] = useState(null);
  const [complementoUrl, setComplementoUrl] = useState("");
  const [urlFinal, setUrlFinal] = useState("");
  const [nomeMenu, setNomeMenu] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);
  const [selectedModule, setSelectedModule] = useState(null)
  const [moduloUsuario, setModuloUsuario] = useState(null);
  const menuLeft = useRef(null);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [ipUsuario, setIpUsuario] = useState('');
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

  const { data: optionsModulos = [], error: errorModulos, isLoading: isLoadingModulos, refetch: refetchModulos } = useQuery(
    'menus-usuario',
    async () => {
      const response = await get(`/menus-usuario?idUsuario=${usuarioLogado?.id}`);

      return response.data;
    },
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000, }
  );


  const onSubmit = async () => {

    if (optionsModulos[0]?.ALTERAR == 'False') {
      Swal.fire({
        icon: 'error',
        title: 'Atenção',
        text: 'Você não tem permissão para alterar as permissões de usuário.',
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    if (moduloSelecionado == '') {
      Swal.fire({
        type: 'error',
        title: 'Atenção',
        text: 'Selecione um módulo',
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    Swal.fire({
      title: 'Verificando permissões...',
      text: 'Aguarde...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    });

    const postData = {
      DSNOME: String(nomeMenu),
      IDMENUPAI: Number(moduloSelecionado?.value),
      URL: String(urlFinal)
    }

    try {

      const response = await post(`/menu-filho/:id`, postData);

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Menu Filho criado com sucesso!',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 1500,
      });


      const textDados = JSON.stringify(postData);
      const textoFuncao = `MENU FILHO/ NOVO MENU FILHO`;
      const ipUsuario = await getIPUsuario();

      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario,
      };

      const responsePost = await post('/log-web', createData);

      setNomeMenu("");
      setComplementoUrl("");
      setUrlFinal("");
      setModuloSelecionado(null);
      return createData.data;
    } catch (error) {

      const textDados = JSON.stringify(postData);
      const textoFuncao = `MENU FILHO/ NOVO MENU FILHO`;
      const ipUsuario = await getIPUsuario();

      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario,
      };

      await post('/log-web', createData);

      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Erro ao criar menu filho',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 1500,
      });

      console.error('Erro ao processar permissões:', error);

      return createData.data;

    }
  }

  return {
    moduloSelecionado,
    setModuloSelecionado,
    complementoUrl,
    setComplementoUrl,
    urlFinal,
    setUrlFinal,
    nomeMenu,
    setNomeMenu,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    selectedModule,
    setSelectedModule,
    moduloUsuario,
    setModuloUsuario,
    menuLeft,
    usuarioLogado,
    setUsuarioLogado,
    navigate,
    optionsModulos,
    onSubmit
  }
}
