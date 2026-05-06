import React, { Fragment, useEffect, useRef, useState } from "react"
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { get, post, put } from "../../../../../api/funcRequest";
import { useQuery } from "react-query";

export const useAtualizarMenuFilho = ({
  usuarioLogado,
  optionsModulos,
  refetchMenuFilho,
  dadosAtualizarMenu,
  dadosMenuPai,
  handleClose

}) => {

  const [moduloSelecionado, setModuloSelecionado] = useState(null);
  const [complementoUrl, setComplementoUrl] = useState("");
  const [urlFinal, setUrlFinal] = useState("");
  const [nomeMenu, setNomeMenu] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedModule, setSelectedModule] = useState(null)
  const [moduloUsuario, setModuloUsuario] = useState(null);
  const [ipUsuario, setIpUsuario] = useState('');
  const [prefixoEdit, setPrefixoEdit] = useState('');

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

  const handleChange = (e) => {
    const texto = e.target.value;
    setUrlFinal(texto)
  };

  const showAlert = (text) => {
    Swal.fire({
      icon: 'info',
      title: 'Atenção',
      text,
      showConfirmButton: false,
      timer: 1800,
      customClass: {
        container: 'custom-swal',
      },
    });
  };

  useEffect(() => {
    if (dadosAtualizarMenu[0]) {

      setNomeMenu(dadosAtualizarMenu[0]?.DSNOME);

      const modulo = dadosMenuPai.find(
        (item) => item.IDMENU === dadosAtualizarMenu[0]?.IDMENUPAI
      );
      setModuloSelecionado({ value: dadosAtualizarMenu[0]?.IDMENUPAI, label: modulo?.DSMENU });
    }
    setUrlFinal(dadosAtualizarMenu[0]?.URL);


  }, [dadosAtualizarMenu]);


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

    if (!moduloSelecionado) {
      showAlert('Selecione um módulo');
      return;
    }

    if (!nomeMenu) {
      showAlert('Digite um nome para o menu filho');
      return;
    }

    if (!urlFinal) {
      showAlert('Digite uma URL para o menu filho');
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

    const putData = {
      ID: Number(dadosAtualizarMenu[0]?.ID),
      DSNOME: String(nomeMenu),
      IDMENUPAI: Number(moduloSelecionado?.value),
      URL: String(urlFinal)
    }

    try {

      const response = await put(`/menu-filho/:id`, putData);

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

      const textDados = JSON.stringify(putData);
      const textoFuncao = `MENU FILHO/ NOVO MENU FILHO`;
      const ipUsuario = await getIPUsuario();

      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || "INDISPONIVEL",
      };

      const responsePost = await post('/log-web', createData);

      handleClose();
      refetchMenuFilho()

      return createData.data;

    } catch (error) {

      const textDados = JSON.stringify(putData);
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
    handleChange,
    onSubmit
  }
}
