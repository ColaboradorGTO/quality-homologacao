import Swal from 'sweetalert2';
import { get, post } from '../../../../../api/funcRequest';
import { useQuery } from 'react-query';
import axios from 'axios';
import { useState } from 'react';

export const useCadastrarRelatorioBi = ({ handleClose, refetchListaRelatorio, optionsModulos, usuarioLogado }) => {
  const [linkRelatorioBI, setLinkRelatorioBI] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState([]);
  const [relatorioSelecionado, setRelatorioSelecionado] = useState([]);
  const [statusSelecionado, setStatusSelecionado] = useState('');
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

  const { data: dadosBI = [], error: errorListaBI, isLoading: isLoadingBI, refetch } = useQuery(
    'relatorioInformaticaBI?status=True',
    async () => {
      const response = await get(`/relatorioInformaticaBI?status=True`);
      return response.data;
    },
    { staleTime: 60 * 60 * 1000, cacheTime: 60 * 60 * 1000 },
  );

  const onSubmit = async (data) => {
    if (optionsModulos[0]?.CRIAR === 'False') {
      Swal.fire({
        title: 'Atenção',
        html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para cadastrar Relatório BI.`,
        icon: 'warning',
        confirmButtonText: 'OK',
        customClass: {
          container: 'custom-swal',
        }
      });
      return;
    }

    const postData = {
      IDRELATORIOBI: relatorioSelecionado?.[0]?.value,
      IDEMPRESA: empresaSelecionada?.[0]?.value,
      LINK: String(linkRelatorioBI),
      STATIVO: String(statusSelecionado),
    };

    try {
      const response = await post('/criarlinkRelatorioBI', postData);
      
      let textDados = JSON.stringify(postData);
      let textoFuncao = 'INFORMATICA/ATUALIZAR LINK RELATORIO BI';
      const ipUsuario = await getIPUsuario();
      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario,
      };
      
      await post('/log-web', createData);
      
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Relatório atualizado com sucesso!',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 1500,
      });
      setEmpresaSelecionada([]);
      setRelatorioSelecionado([]);
      setStatusSelecionado('');
      setLinkRelatorioBI('');
      refetchListaRelatorio();
      handleClose();

      return response.data;
    } catch (error) {
      const textDados = JSON.stringify(postData);
      let textoFuncao = 'INFORMATICA/ERRO AO ATUALIZAR LINK RELATORIO BI';
      const ipUsuario = await getIPUsuario();
      
      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario,
      };
      
      const responsePost = await post('/log-web', createData);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Erro ao atualizar Relatório!',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 1500,
      });
      
      console.error('Erro no bloco catch:', error);
      return responsePost.data;
    }
  };

  const optionsStatus = [
    { value: 'True', label: 'Ativo' },
    { value: 'False', label: 'Inativo' },
  ];

  return {
    linkRelatorioBI,
    setLinkRelatorioBI,
    empresaSelecionada,
    setEmpresaSelecionada,
    relatorioSelecionado,
    setRelatorioSelecionado,
    statusSelecionado,
    setStatusSelecionado,
    dadosBI,
    errorListaBI,
    isLoadingBI,
    refetch,
    onSubmit,
    optionsStatus,
  };
};
