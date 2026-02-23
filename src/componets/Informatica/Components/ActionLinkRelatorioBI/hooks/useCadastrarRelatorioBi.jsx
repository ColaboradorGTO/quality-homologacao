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

  const {
    data: dadosEmpresas = [],
    error: errorEmpresas,
    isLoading: isLoadingEmpresas,
    refetch: refetchEmpresa,
  } = useQuery(
    'listaEmpresasIformatica',
    async () => {
      const response = await get(`/listaEmpresasIformatica`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 100 },
  );

  const {
    data: dadosBI = [],
    error: errorListaBI,
    isLoading: isLoadingBI,
    refetch,
  } = useQuery(
    'relatorioInformaticaBI?status=True',
    async () => {
      const response = await get(`/relatorioInformaticaBI?status=True`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 },
  );

  const onSubmit = async (data) => {
    if (optionsModulos[0]?.CRIAR === 'False') {
      Swal.fire({
        title: 'Atenção',
        text: 'Você não tem permissão para cadastrar Relatório BI.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    }

    if (!empresaSelecionada || !relatorioSelecionado || !statusSelecionado || !linkRelatorioBI) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Preencha todos os campos!',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 1500,
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

      let textDados = JSON.stringify(postData);
      let textoFuncao = 'INFORMATICA/ATUALIZAR LINK RELATORIO BI';
      const ipUsuario = await getIPUsuario();
      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario,
      };
      const responsePost = await post('/log-web', createData);

      setEmpresaSelecionada([]);
      setRelatorioSelecionado([]);
      setStatusSelecionado('');
      setLinkRelatorioBI('');
      refetchListaRelatorio();
      handleClose();

      return responsePost.data;
    } catch (error) {
      console.error('Erro no bloco catch:', error);
      let textDados = JSON.stringify(postData);
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
    usuarioLogado,
    ipUsuario,
    dadosEmpresas,
    errorEmpresas,
    isLoadingEmpresas,
    refetchEmpresa,
    dadosBI,
    errorListaBI,
    isLoadingBI,
    refetch,
    onSubmit,
    optionsStatus,
  };
};
