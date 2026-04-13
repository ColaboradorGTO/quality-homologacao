import Swal from "sweetalert2"
import { useEffect, useState } from "react"
import axios from "axios"
import { get, put, post } from "../../../../../api/funcRequest"
import { situacao } from "../../../../../../parceiro.json"
import { useQuery } from "react-query"


export const useEditarListaPrecos = ({optionsModulos, usuarioLogado, dadosListaLoja }) => {
  const [descricao, setDescricao] = useState('')
  const [statusSelecionado, setStatusSelecionado] = useState([])
  const [ipUsuario, setIpUsuario] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState([]);
  const [nomeListaPreco, setNomeListaPreco] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const { data: dadosEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch: refetchEmpresas } = useQuery(
    ['empresas'],
    async () => {
      const response = await get(`/empresas`);

      return response.data;
    },
    { enabled: true, staleTime: 60 * 60 * 1000, }
  );

  useEffect(() => {
    if (dadosListaLoja && dadosListaLoja.length > 0) {
      const empresas = dadosListaLoja[0]?.detalheLista?.map(detalhe => ({
        IDEMPRESA: detalhe.loja?.IDEMPRESA,
        NOFANTASIA: detalhe.loja?.NOFANTASIA,
        STATIVO: detalhe.loja?.STATIVO,
        IDGRUPOEMPRESARIAL: detalhe.loja?.IDGRUPOEMPRESARIAL,
      })) || [];
      
      const empresaIds = empresas.map(empresa => empresa.IDEMPRESA);
      
      setEmpresaSelecionada(empresas);
      setSelectedIds(empresaIds);
      
      if (dadosEmpresas.length > 0 && empresaIds.length === dadosEmpresas.length) {
        setSelectAllChecked(true);
      }
    }
  }, [dadosListaLoja, dadosEmpresas]);



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

  useEffect(() => {
    if (dadosListaLoja && dadosListaLoja.length > 0) { 
      setStatusSelecionado({ value: dadosListaLoja[0]?.listaPreco.STATIVO == 'True' ? 'True' : 'False', label: dadosListaLoja[0]?.listaPreco.STATIVO == 'True' ? 'ATIVO' : 'INATIVO' })
      setNomeListaPreco(dadosListaLoja[0]?.listaPreco.NOMELISTA)
    }
  }, [dadosListaLoja])
  
  const onSubmit = async () => {

    if (optionsModulos[0]?.ALTERAR == 'False') {
      Swal.fire({
        icon: 'info',
        title: 'Acesso Negado!',
        html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para alterar Lista de Preços!`,
        timer: 5000,
        customClass: {
          container: 'custom-swal',
        },
      });
      return;
    }

    const IDRESUMOLISTAPRECO = Number(dadosListaLoja[0]?.listaPreco.IDRESUMOLISTAPRECO);
    const NOMELISTA = nomeListaPreco;
    const IDUSERALTERACAO = usuarioLogado?.id; 
    const STATIVO = statusSelecionado?.value;

    let dadosDetalheLista = [];

    if (empresaSelecionada && empresaSelecionada.length > 0) {
      empresaSelecionada.forEach((empresa) => {
        const detalheExistente = dadosListaLoja?.find(item => 
          item.detalheLista?.some(detalhe => detalhe.IDEMPRESA === empresa.IDEMPRESA)
        );

        const IDDETALHELISTAPRECO = detalheExistente?.detalheLista?.find(
          detalhe => detalhe.IDEMPRESA === empresa.IDEMPRESA
        )?.IDDETALHELISTAPRECO || '';
        
        const IDGRUPOEMPRESARIAL = empresa.IDGRUPOEMPRESARIAL ? Number(empresa.IDGRUPOEMPRESARIAL) : '';
        const IDEMPRESA = empresa.IDEMPRESA ? Number(empresa.IDEMPRESA) : '';
        const STATIVOLOJA = empresa.STATIVO;

        dadosDetalheLista.push({
          IDDETALHELISTAPRECO: IDDETALHELISTAPRECO ? Number(IDDETALHELISTAPRECO) : '',
          IDRESUMOLISTAPRECO,
          IDGRUPOEMPRESARIAL,
          IDEMPRESA,
          STATIVO: STATIVOLOJA
        });
      });
    }

    const dadosLista = {
      IDRESUMOLISTAPRECO,
      NOMELISTA,
      IDUSERCRIACAO: dadosListaLoja[0]?.listaPreco.IDUSERCRIACAO,
      IDUSERALTERACAO: usuarioLogado?.id,
      STATIVO,
      lojas: dadosDetalheLista
    };

    
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

    const loadingAlert = Swal.fire({
      title: 'Atualizando...',
      text: 'Por favor aguarde.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const response = await put('/lista-de-preco/:id', dadosLista);

      const textDados = JSON.stringify(dadosLista);
      const textFuncao = 'CADASTRO / ALTERAÇÃO DE LISTA DE PREÇOS';
      const ipUsuario = await getIPUsuario();
      const createtLog = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textFuncao,
        DADOS: textDados,
        IP: ipUsuario || 'Indisponível'
      };

      await post('/log-web', createtLog);
      
      Swal.fire({
        icon: 'success',
        title: 'Sucesso',
        text: 'Lista de preço atualizada com sucesso!',
        timer: 5000,
        customClass: {
          container: 'custom-swal',
        },
      })
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar lista de preço:', error);
      Swal.close();
      const textDados = JSON.stringify(dadosLista);
      let textFuncao = 'CADASTRO / ALTERAÇÃO DE LISTA DE PREÇOS';
      const ipUsuario = await getIPUsuario();
      const createtLog = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textFuncao,
        DADOS: textDados,
        IP: ipUsuario || 'Indisponível'
      };
  
      await post('/log-web', createtLog);
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Erro ao atualizar a lista de preço, tente novamente!',
        customClass: {
          container: 'custom-swal',
        },
      });
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
    situacao,
    dadosEmpresas,
    selectedIds,
    setSelectedIds,
    selectAllChecked,
    setSelectAllChecked,
    onSubmit,
  }
}