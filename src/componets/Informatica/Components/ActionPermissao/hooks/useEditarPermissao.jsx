import { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { post, put, get } from "../../../../../api/funcRequest";
import {  Departamentos } from '../../../../../../parceiro.json';

export const useCopiarPermissaoUsuario = ({
  selectedItems,
  setSelectedItems,
  usuarioLogado,
  usuarioOrigem, 
  usuarioDestino,
  usuarioDestinoSelecionado,
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
  const [departamentoSelecionado, setDepartamentoSelecionado] = useState('');

 
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

  const handleSubmit = async () => {
    if (optionsModulos[0]?.ALTERAR === 'False') {
      Swal.fire({
        icon: 'error',
        title: 'Atenção',
        html: `${usuarioLogado?.NOFUNCIONARIO} Você não tem permissão para alterar as permissões de usuário.`,
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }


    if (!usuarioDestino) {
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

      const response = await get(`/menus-filho-usuario?idUsuario=${usuarioDestino}&idMenuFilho=${encodeURIComponent(selectedItems.map(item => item.IDMENUFILHO).join(','))}`);

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

      const responseFuncionario = await get(`/funcionarios-loja-ativos?byId=${usuarioDestino}`);
      const funcionarioDestino = responseFuncionario.data?.[0];

      if(funcionarioDestino?.DEPARTAMENTO === null || funcionarioDestino?.DEPARTAMENTO === undefined || funcionarioDestino?.DEPARTAMENTO == '') {
  
        // Criar opções para o select
        const departamentosOptions = Departamentos.reduce((acc, dept) => {
          acc[dept.value] = dept.label;
          return acc;
        }, {});

        const { value: departamentoEscolhido } = await Swal.fire({
          icon: 'warning',
          title: 'Atenção',
          html: `
            O funcionário selecionado não possui departamento cadastrado.<br>
            Por favor, selecione um departamento:
          `,
          input: 'select',
          inputOptions: departamentosOptions,
          inputPlaceholder: 'Selecione um departamento',
          showCancelButton: true,
          confirmButtonText: 'Confirmar',
          cancelButtonText: 'Cancelar',
          inputValidator: (value) => {
            return new Promise((resolve) => {
              if (value) {
                resolve();
              } else {
                resolve('Você precisa selecionar um departamento!');
              }
            });
          }
        });

        if (!departamentoEscolhido) {
          return; // Usuário cancelou
        }

        // Definir o departamento selecionado
        setDepartamentoSelecionado({ 
          value: departamentoEscolhido, 
          label: departamentosOptions[departamentoEscolhido] 
        });
      } else {
        // Se já tem departamento, manter o atual
        setDepartamentoSelecionado({ 
          value: funcionarioDestino.DEPARTAMENTO, 
          label: Departamentos.find(d => d.value === funcionarioDestino.DEPARTAMENTO)?.label || funcionarioDestino.DEPARTAMENTO 
        });
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
          IDUSUARIO: Number(usuarioDestino),
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
        const putFuncionarioData = {
          ID: parseInt(usuarioDestino),
          DEPARTAMENTO: departamentoSelecionado?.value,
        }

        await put('/funcionario-departamento/:id', putFuncionarioData);
        
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