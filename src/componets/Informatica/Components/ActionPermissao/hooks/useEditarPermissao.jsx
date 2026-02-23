import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { post, get } from "../../../../../api/funcRequest";
import { useQuery } from "react-query";

export const useCopiarPermissaoUsuario = ({
  usuarioOrigemId,
  usuarioDestinoId,
  permissoesSelecionadas,
  usuarioClonado,
  selectedItems,
  usuarioSelecionado,
  setSelectedItems,
  usuarioLogado,
  optionsModulos
}) => {
  const [moduloSelecionado, setModuloSelecionado] = useState('');
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState('');
  const [menuPaiSelecionado, setMenuPaiSelecionado] = useState('');
  const [menuFilhoSelecionado, setMenuFilhoSelecionado] = useState([]);
  const [funcaoSelecionada, setFuncaoSelecionada] = useState('');
  const [alterar, setAlterar] = useState('False');
  const [criar, setCriar] = useState('False');
  const [nivel1, setNivel1] = useState('False');
  const [nivel2, setNivel2] = useState('False');
  const [nivel3, setNivel3] = useState('False');
  const [nivel4, setNivel4] = useState('False');
  const [administrador, setAdministrador] = useState('False');
  const [ipUsuario, setIpUsuario] = useState('');


  const getIPUsuario = async () => {
    try {
      const response = await axios.get('https://api.ipify.org?format=json9');
      if (response.data && response.data.ip) {
        return response.data.ip;
      }
      throw new Error("Resposta inválida do ipfy.org");
    } catch (error) {
      const responseIP2 = await axios.get('https://api.ipwho.org/me');
      return responseIP2.data?.data?.ip;
      
    }
  };

  const handleSubmit = async () => {
    // if (optionsModulos[0]?.ALTERAR === 'False') {
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Atenção',
    //     text: 'Você não tem permissão para alterar as permissões de usuário.',
    //     showConfirmButton: false,
    //     timer: 1500
    //   });
    //   return;
    // }

    if (!usuarioClonado) {
      Swal.fire({
        icon: 'error',
        title: 'Atenção',
        text: 'Selecione um funcionário',
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    Swal.fire({
      title: 'Verificando permissões...',
      text: 'Aguarde...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    try {

      const response = await get(`/menus-filho-usuario?idUsuario=${usuarioClonado}&idMenuFilho=${encodeURIComponent(selectedItems.map(item => item.IDMENUFILHO).join(','))}`);

      const menusExistentes = response.data || [];

      const menuFilhoExistentes = []


      const idsJaExistentes = menusExistentes.map(menu => menu.IDMENUFILHO);


      const menuFilhosNovos = selectedItems.filter(item =>
        !idsJaExistentes.includes(item.IDMENUFILHO)
      );


      if (menuFilhosNovos.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'Informação',
          text: `O funcionário já possui acesso a todos os menus selecionados.`,
          confirmButtonText: 'OK'
        });
        return;
      }

   
      const menuFilhosJaExistentes = selectedItems.filter(item =>
        idsJaExistentes.includes(item.IDMENUFILHO)
      );

      if (menuFilhosJaExistentes.length > 0) {
        console.log(`ℹ️ ${menuFilhosJaExistentes.length} menu(s) já existente(s), ${menuFilhosNovos.length} novo(s) serão adicionados`);
      }

      let textoLoading = `Adicionando ${menuFilhosNovos.length} nova(s) permissão(ões)...`;
      if (menuFilhosJaExistentes.length > 0) {
        textoLoading += ` (${menuFilhosJaExistentes.length} já existente(s))`;
      }

      Swal.fire({
        title: 'Criando permissões...',
        text: textoLoading,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        }
      });
      
      for (let i = 0; i < menuFilhosNovos.length; i++) {
        const sel = menuFilhosNovos[i];
        const payload = {
          IDUSUARIO: Number(usuarioClonado),
          IDMODULOADMINISTRATIVO: String(sel.IDMODULOADMINISTRATIVO ?? ''),
          IDMODULOGERENCIA: String(sel.IDMODULOGERENCIA ?? ''),
          IDMODULOINFORMATICA: String(sel.IDMODULOINFORMATICA ?? ''),
          IDMODULOFINANCEIRO: String(sel.IDMODULOFINANCEIRO ?? ''),
          IDMODULOCOMERCIAL: String(sel.IDMODULOCOMERCIAL ?? ''),
          IDMODULOCOMPRAS: String(sel.IDMODULOCOMPRAS ?? ''),
          IDMODULOCONTABILIDADE: String(sel.IDMODULOCONTABILIDADE ?? ''),
          IDMODULOMARKETING: String(sel.IDMODULOMARKETING ?? ''),
          IDMODULORH: String(sel.IDMODULORH ?? ''),
          IDMODULOCOMPRASADM: String(sel.IDMODULOCOMPRASADM ?? ''),
          IDMODULOEXPEDICAO: String(sel.IDMODULOEXPEDICAO ?? ''),
          IDMODULOCONFERENCIACEGA: String(sel.IDMODULOCONFERENCIACEGA ?? ''),
          IDMODULOCADASTRO: String(sel.IDMODULOCADASTRO ?? ''),
          IDMODULOETIQUETAGEM: String(sel.IDMODULOETIQUETAGEM ?? ''),
          IDMODULOVOUCHER: String(sel.IDMODULOVOUCHER ?? ''),
          IDMODULOMALOTE: String(sel.IDMODULOMALOTE ?? ''),
          IDMODULORESUMOVENDAS: String(sel.IDMODULORESUMOVENDAS ?? ''),
          IDPERMISSAO: String(sel.IDPERMISSAO ?? ''),
          IDMENU: sel.IDMENU ?? '',
          IDMENUFILHO: sel.IDMENUFILHO ?? '',
          CRIAR: sel.CRIAR ?? 'False',
          ALTERAR: sel.ALTERAR ?? 'False',
          ADMINISTRADOR: sel.ADMINISTRADOR ?? 'False',
          N1: sel.N1 ?? 'False',
          N2: sel.N2 ?? 'False',
          N3: sel.N3 ?? 'False',
          N4: sel.N4 ?? 'False',
          IDUSERULTIMAALTERACAO: String(usuarioLogado?.id ?? '')
        };

        await post(`/criar-perfil-usuario`, payload);

        const ipUsuario = await getIPUsuario();
        const logData = {
          IDFUNCIONARIO: String(usuarioLogado?.id ?? ''),
          PATHFUNCAO: `PERMISSÕES USUARIO / ALTERAÇÃO DE PERMISSÕES Item ${i + 1}/${menuFilhosNovos.length}`,
          DADOS: JSON.stringify(payload),
          IP: ipUsuario
        };

        await post('/log-web', logData);
      }

      let mensagem = `${menuFilhosNovos.length} nova(s) permissão(ões) criada(s) com sucesso!`;

      if (menuFilhosJaExistentes.length > 0) {
        mensagem += ` (${menuFilhosJaExistentes.length} permissão(ões) já existia(m))`;
      }

      Swal.fire({
        icon: 'success',
        title: 'Sucesso',
        text: 'Permissões clonadas com sucesso!',
        confirmButtonText: 'OK'
        // timer: 6000
      });

    } catch (error) {
      console.error('Erro ao processar permissões:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Erro ao processar as permissões do usuário',
        showConfirmButton: false,
        timer: 1500
      });
    }
  };


  return {
    moduloSelecionado,
    setModuloSelecionado,
    funcionarioSelecionado,
    setFuncionarioSelecionado,
    menuPaiSelecionado,
    setMenuPaiSelecionado,
    selectedItems,
    setSelectedItems,
    funcaoSelecionada,
    setFuncaoSelecionada,
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
    handleSubmit
  }
}
