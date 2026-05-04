import React, { Fragment, useEffect, useRef, useState } from "react"
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { get, post, put } from "../../../../../api/funcRequest";
import { useQuery } from "react-query";

export const useCriarMenuFilho = ({
  usuarioLogado,
  optionsModulos,
  refetchMenuFilho
}) => {
  
  const [moduloSelecionado, setModuloSelecionado] = useState(null);
  const [complementoUrl, setComplementoUrl] = useState("");
  const [urlFinal, setUrlFinal] = useState("");
  const [nomeMenu, setNomeMenu] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedModule, setSelectedModule] = useState(null)
  const [moduloUsuario, setModuloUsuario] = useState(null);
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

      const response = await post(`/criar-menu-filho`, postData);

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
        IP: ipUsuario || "INDISPONIVEL",
      };

      const responsePost = await post('/log-web', createData);

      setNomeMenu("");
      setComplementoUrl("");
      setUrlFinal("");
      setModuloSelecionado(null);

      refetchMenuFilho()

      return createData.data;

    } catch (error) {

      const textDados = JSON.stringify(postData);
      const textoFuncao = `MENU FILHO/ NOVO MENU FILHO`;
      const ipUsuario = await getIPUsuario();

      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || "INDISPONIVEL",
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
    selectedModule,
    setSelectedModule,
    moduloUsuario,
    setModuloUsuario,
    onSubmit
  }
}
