import React, { Fragment, useEffect, useRef, useState } from "react"
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { get, post, put } from "../../../../../api/funcRequest";
import { set } from "react-hook-form";

export const useAtualizarMenuFilho = ({
  dadosDetalhesMenuFilho,
  usuarioLogado,
  optionsModulos,
  refetchMenuFilho,
  dadosMenuPai,
  handleClose
}) => {

  const [moduloSelecionado, setModuloSelecionado] = useState(null);
  const [idMenu, setIdMenu] = useState('');
  const [urlFinal, setUrlFinal] = useState('');
  const [url, setUrl] = useState('');
  const [nomeMenu, setNomeMenu] = useState('');
  const [complementoUrl, setComplementoUrl] = useState('');

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

  const moduloSelecionadoChange = dadosMenuPai.find((item) => item.IDMODULO == dadosDetalhesMenuFilho[0]?.IDMENUPAI);

  useEffect(() => {
    if (dadosDetalhesMenuFilho[0]) {
      setIdMenu(dadosDetalhesMenuFilho[0]?.ID);
      setModuloSelecionado({ value: moduloSelecionadoChange.IDMODULO, label: moduloSelecionadoChange.DSMENU });
      setNomeMenu(dadosDetalhesMenuFilho[0]?.DSNOME);
      setUrl(dadosDetalhesMenuFilho[0]?.URL);
    }

  }, [dadosDetalhesMenuFilho]);


  useEffect(() => {
    if (url && moduloSelecionado) {
      trocarModuloUrl(url, moduloSelecionado);
    }
  }, [url, moduloSelecionado]);

  const trocarModuloUrl = (url, modulo) => {
    const nomeAction = url.split("/")[2];
    console.log(moduloSelecionado, "MODULO SELECIONADO CHANGE");
    const urlFinal = `/${modulo.label.toLowerCase()}/${nomeAction}`
    setUrlFinal(urlFinal);
    console.log(urlFinal, "URL FINAL");

  }

  const modulos = {
    1: "IDMODULOADMINISTRATIVO",
    2: "IDMODULOGERENCIA",
    3: "IDMODULOINFORMATICA",
    4: "IDMODULOFINANCEIRO",
    5: "IDMODULOCOMERCIAL",
    6: "IDMODULOCOMPRAS",
    7: "IDMODULOCONTABILIDADE",
    8: "IDMODULOMARKETING",
    9: "IDMODULORH",
    10: "IDMODULOCOMPRASADM",
    11: "IDMODULOEXPEDICAO",
    12: "IDMODULOCONFERENCIACEGA",
    13: "IDMODULOCADASTRO",
    14: "IDMODULOETIQUETAGEM",
    15: "IDMODULOVOUCHER",
    16: "IDMODULOMALOTE",
    17: "IDMODULORESUMOVENDAS",
    18: "IDPERMISSAO",
    19: "IDMODULOPROMOCAO"
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

    const putData = {
      DSNOME: String(nomeMenu),
      IDMENUPAI: Number(moduloSelecionado?.value),
      URL: String(urlFinal),
      ID: Number(idMenu)
    }

    try {

      const response = await put(`/menu-filho/:id`, putData);

      const campoModulo = modulos[moduloSelecionado?.value];

      const payload = {
        IDUSUARIO: Number(usuarioLogado.id),
        IDMODULOADMINISTRATIVO: '',
        IDMODULOGERENCIA: '',
        IDMODULOINFORMATICA: '',
        IDMODULOFINANCEIRO: '',
        IDMODULOCOMERCIAL: '',
        IDMODULOCOMPRAS: '',
        IDMODULOCONTABILIDADE: '',
        IDMODULOMARKETING: '',
        IDMODULORH: '',
        IDMODULOCOMPRASADM: '',
        IDMODULOEXPEDICAO: '',
        IDMODULOCONFERENCIACEGA: '',
        IDMODULOCADASTRO: '',
        IDMODULOETIQUETAGEM: '',
        IDMODULOVOUCHER: '',
        IDMODULOMALOTE: '',
        IDMODULORESUMOVENDAS: '',
        IDMODULOPROMOCAO: '',
        IDMODULO: '',
        IDPERMISSAO: '',
        IDMENU: moduloSelecionado?.value,
        IDMENUFILHO: idMenu,
        CRIAR: 'True',
        ALTERAR: 'True',
        ADMINISTRADOR: 'False',
        N1: 'False',
        N2: 'False',
        N3: 'False',
        N4: 'False',
        IDUSERULTIMAALTERACAO: String(usuarioLogado?.id ?? '')
      };

      if (campoModulo) {
        payload[campoModulo] = String(moduloSelecionado?.value);
      }

      const responsePermissao = await put(`/perfil-usuario/:id`, payload);

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Menu Filho atualizado com sucesso!',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 1500,
      });

      const textDados = JSON.stringify(putData);
      const textoFuncao = `MENU FILHO/ ATUALIZAR MENU FILHO`;
      const ipUsuario = await getIPUsuario();

      const updateData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || "INDISPONIVEL",
      };

      const responsePost = await post('/log-web', updateData);
      handleClose()
      refetchMenuFilho()

      return updateData.data;

    } catch (error) {

      const textDados = JSON.stringify(postData);
      const textoFuncao = `MENU FILHO/ NOVO MENU FILHO`;
      const ipUsuario = await getIPUsuario();

      const updateData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || "INDISPONIVEL",
      };

      await post('/log-web', updateData);

      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Erro ao atualizar menu filho',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 1500,
      });

      console.error('Erro ao processar permissões:', error);

      return updateData.data;

    }
  }

  return {
    moduloSelecionado,
    setModuloSelecionado,
    urlFinal,
    setUrlFinal,
    nomeMenu,
    setNomeMenu,
    idMenu,
    setIdMenu,
    currentPage,
    setCurrentPage,
    selectedModule,
    setSelectedModule,
    complementoUrl,
    setComplementoUrl,
    moduloUsuario,
    setModuloUsuario,
    onSubmit
  }
}