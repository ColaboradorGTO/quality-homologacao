import Swal from "sweetalert2"
import { useEffect, useState } from "react"
import axios from "axios"
import { get, post } from "../../../../../api/funcRequest"
import { situacao } from "../../../../../../parceiro.json"
import { useQuery } from "react-query"
import { getDataAtual } from "../../../../../utils/dataAtual"


export const useCriarListaPrecos = ({optionsModulos, usuarioLogado }) => {
  const [descricao, setDescricao] = useState('')
  const [statusSelecionado, setStatusSelecionado] = useState({ value: 'True', label: 'ATIVO' })
  const [ipUsuario, setIpUsuario] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState([]);
  const [nomeListaPreco, setNomeListaPreco] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [dataCriacao, setDataCriacao] = useState('');

  useEffect(() => {
    const dataAtual = getDataAtual();
    setDataCriacao(dataAtual);
  }, [])

  const { data: dadosEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch: refetchEmpresas } = useQuery(
    ['empresas'],
    async () => {
      const response = await get(`/empresas`);

      return response.data;
    },
    { enabled: true, staleTime: 60 * 60 * 1000, }
  );

  const getIPUsuario = async () => {
    let usuarioIP = null;

    try {
      const { data: ipWhoisData } = await axios.get("https://ifconfig.me/ip");
      usuarioIP = ipWhoisData?.ip;
    } catch (error) {
      console.error("Erro ao buscar IP via ifconfig.me:", error);
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

    if (optionsModulos[0]?.CRIAR == 'False') {
      Swal.fire({
        icon: 'info',
        title: 'Acesso Negado!',
        html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para criar Lista de Preços!`,
        timer: 5000,
        customClass: {
          container: 'custom-swal',
        },
      });
      return;
    }

    // ✅ DADOS PRINCIPAIS: Para criação (modo create)
    const NOMELISTA = nomeListaPreco;
    const IDUSERCRIACAO = usuarioLogado?.id; // Para criação
    const STATIVO = statusSelecionado?.value;

    // ✅ MAPEAMENTO DAS LOJAS: Equivale ao map do jQuery
    let dadosDetalheLista = [];

    // Mapear as empresas selecionadas
    if (empresaSelecionada && empresaSelecionada.length > 0) {
      empresaSelecionada.forEach((empresa) => {
        const IDGRUPOEMPRESARIAL = empresa.IDGRUPOEMPRESARIAL ? Number(empresa.IDGRUPOEMPRESARIAL) : '';
        const IDEMPRESA = empresa.IDEMPRESA ? Number(empresa.IDEMPRESA) : '';
        const STATIVOLOJA = empresa.STATIVO;

        dadosDetalheLista.push({
          IDDETALHELISTAPRECO: '', // Vazio para criação
          IDRESUMOLISTAPRECO: '', // Será gerado pelo backend
          IDGRUPOEMPRESARIAL,
          IDEMPRESA,
          STATIVO: STATIVOLOJA
        });
      });
    }

    // ✅ ESTRUTURA FINAL: Exatamente igual ao jQuery para modo 'create'
    const dadosLista = [{
      IDRESUMOLISTAPRECO: '', // Vazio para criação
      NOMELISTA,
      IDUSERCRIACAO,
      IDUSERALTERACAO: '', // Vazio para criação
      STATIVO,
      lojas: dadosDetalheLista
    }];

    // ✅ VALIDAÇÕES: Mesma lógica do jQuery
    if (!dadosLista[0]?.NOMELISTA.length || dadosLista[0]?.NOMELISTA.length < 10) {
      Swal.fire({
        icon: 'warning',
        title: 'Atenção',
        text: 'Lista Sem Nome ou Nome Muito Curto, favor adicionar o nome da lista e tentar novamente!',
        timer: 10000,
        showConfirmButton: true,
        customClass: {
          container: 'custom-swal',
        },
      });
      return;
    }

    if (!dadosDetalheLista.length) {
      Swal.fire({
        icon: 'warning',
        title: 'Atenção', 
        text: 'Lista Sem Lojas Selecionadas, favor selecionar as lojas e tentar novamente!',
        timer: 10000,
        showConfirmButton: true,
        customClass: {
          container: 'custom-swal',
        },
      });
      return;
    }

    // ✅ LOADING: Equivale ao setTimeout do jQuery
    const loadingAlert = Swal.fire({
      title: 'Criando...',
      text: 'Por favor aguarde.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      // ✅ CHAMADA POST: Equivale ao ajaxPost do jQuery para modo 'create'
      const response = await post('/listas-de-precos', dadosLista);

      Swal.close();

      // ✅ TRATAMENTO DE SUCESSO: Mesma lógica do jQuery
      if (response.typeMsg === "success") {
        await Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: response.msg,
          customClass: {
            container: 'custom-swal',
          }
        });

        // Limpar formulário após criação bem-sucedida
        setNomeListaPreco('');
        setEmpresaSelecionada([]);
        setSelectedIds([]);
        setSelectAllChecked(false);
        setStatusSelecionado({ value: 'True', label: 'ATIVO' });
        
        return response;
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Atenção',
          text: response.msg,
          customClass: {
            container: 'custom-swal',
          },
        });
      }

    } catch (error) {
      console.error('Erro ao criar lista de preço:', error);
      Swal.close();

      // ✅ TRATAMENTO DE ERRO: Mesma lógica do jQuery
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Erro ao criar a lista de preço, tente novamente!',
        customClass: {
          container: 'custom-swal',
        },
      });
    }

    // Log da operação (mantendo o log original)
    try {
      const textDados = JSON.stringify(dadosLista);
      let textFuncao = 'CADASTRO / CRIAÇÃO DE LISTA DE PREÇOS';
      const ipUsuario = await getIPUsuario();
      const createtLog = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textFuncao,
        DADOS: textDados,
        IP: ipUsuario || 'Indisponível'
      };

      await post('/log-web', createtLog);
    } catch (logError) {
      console.error('Erro ao criar log:', logError);
    }
  }


  return {
    descricao,
    setDescricao,
    statusSelecionado,
    setStatusSelecionado,
    empresaSelecionada,
    setEmpresaSelecionada,
    nomeListaPreco,
    setNomeListaPreco,
    dataCriacao,
    setDataCriacao,
    situacao,
    dadosEmpresas,
    selectedIds,
    setSelectedIds,
    selectAllChecked,
    setSelectAllChecked,
    onSubmit,
  }
}