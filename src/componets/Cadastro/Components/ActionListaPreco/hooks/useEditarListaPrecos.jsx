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
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
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

  console.log(dadosListaLoja?.map((item) => item), 'dadosListaLoja')
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

    // ✅ DADOS PRINCIPAIS: Mesma lógica do jQuery
    const IDRESUMOLISTAPRECO = Number(dadosListaLoja[0]?.listaPreco.IDRESUMOLISTAPRECO);
    const NOMELISTA = nomeListaPreco; // Usar o estado do nome da lista
    const IDUSERALTERACAO = usuarioLogado?.id; // Para edição (modo edit)
    const STATIVO = statusSelecionado?.value;

    // ✅ MAPEAMENTO DAS LOJAS: Equivale ao map do jQuery
    let dadosDetalheLista = [];

    // Mapear as empresas selecionadas (equivale às lojas selecionadas no jQuery)
    if (empresaSelecionada && empresaSelecionada.length > 0) {
      empresaSelecionada.forEach((empresa) => {
        // Buscar o detalhe existente para esta empresa (se houver)
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

    // ✅ ESTRUTURA FINAL: Exatamente igual ao jQuery
    const dadosLista = [{
      IDRESUMOLISTAPRECO,
      NOMELISTA,
      IDUSERCRIACAO: '', // Vazio para edição (modo edit)
      IDUSERALTERACAO,
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
      title: 'Atualizando...',
      text: 'Por favor aguarde.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      // ✅ CHAMADA PUT: Equivale ao ajaxPut do jQuery
      const response = await put('/listas-de-precos', dadosLista);

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

        // Equivale ao modal hide e pesquisa do jQuery
        handleClose();
        refetchListaCores();
        
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
      console.error('Erro ao atualizar lista de preço:', error);
      Swal.close();

      // ✅ TRATAMENTO DE ERRO: Mesma lógica do jQuery
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Erro ao atualizar a lista de preço, tente novamente!',
        customClass: {
          container: 'custom-swal',
        },
      });
    }

    // Log da operação (mantendo o log original)
    try {
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
    situacao,
    dadosEmpresas,
    selectedIds,
    setSelectedIds,
    selectAllChecked,
    setSelectAllChecked,
    onSubmit,
  }
}