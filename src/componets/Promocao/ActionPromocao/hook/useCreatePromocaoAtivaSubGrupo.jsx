import { useCallback, useEffect, useState } from "react"
import { get, post } from "../../../../api/funcRequest"
import { useQuery } from "react-query"
import Swal from "sweetalert2"
import { getDataAtual, getDataTresMesesAtras } from "../../../../utils/dataAtual"
import * as XLSX from 'xlsx';
import { optionsMecanica } from "../../../../../mecanica"
import { useNavigate } from "react-router-dom"
import axios from "axios";

export const useCreatePromocaoAtivaSubGrupo = ({ }) => {
  const [mecanicaSelecionada, setMecanicaSelecionada] = useState(0)
  const [aplicacaoDestinoSelecionada, setAplicacaoDestinoSelecionada] = useState('')
  const [tipoDescontoSelecionado, setTipoDescontoSelecionado] = useState(0)
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(-1)
  const [subGrupoSelecionado, setSubGrupoSelecionado] = useState(-1)
  const [grupoSelecionado, setGrupoSelecionado] = useState(-1)
  const [marcaSelecionada, setMarcaSelecionada] = useState(-1)
  const [empresaSelecionada, setEmpresaSelecionada] = useState([])
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [qtdInicio, setQtdInicio] = useState(0)
  const [qtdFim, setQtdFim] = useState('')
  const [vrDesconto, setVrDesconto] = useState(0)
  const [porcentoDesconto, setPorcentoDesconto] = useState(0)
  const [valorInicio, setValorInicio] = useState(0)
  const [valorFim, setValorFim] = useState(0)
  const [produtoOrigem, setProdutoOrigem] = useState('')
  const [fileProdutoOrigem, setFileProdutoOrigem] = useState([])
  const [marcaOrigem, setMarcaOrigem] = useState(-1)
  const [produtoDestino, setProdutoDestino] = useState('')
  const [fileProdutoDestino, setFileProdutoDestino] = useState([])
  const [marcaDestino, setMarcaDestino] = useState(-1)
  const [descricao, setDescricao] = useState('')
  const [precoProduto, setPrecoProduto] = useState(0)
  const [dadosPromocoesAtivas, setDadosPromocoesAtivas] = useState([])
  const [modalVisivel, setModalVisivel] = useState(false)
  const [mecanicaSelecionadaEdicao, setMecanicaSelecionadaEdicao] = useState('');
  const [isEditandoMecanica, setIsEditandoMecanica] = useState(true);
  const [btnSalvar, setBtnSalvar] = useState(true);
  const [ipUsuario, setIpUsuario] = useState('');
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [dadosProdutosPesquisa, setDadosProdutosPesquisa] = useState([]);
  const [modalProduto, setModalProduto] = useState(false);
  const [produtoDestinoSelecionado, setProdutoDestinoSelecionado] = useState([]);
  const [produtoOrigemSelecionado, setProdutoOrigemSelecionado] = useState([]);
  const [novoProdutoDestino, setNovoProdutoDestino] = useState([]);
  const [novoProdutoOrigem, setNovoProdutoOrigem] = useState([]);
  const [modalProdutoDestino, setModalProdutoDestino] = useState(false);
  const [modalProdutoOrigem, setModalProdutoOrigem] = useState(false);
  const [modalProdutoDaPromocao, setModalProdutoDaPromocao] = useState(false);
  const [statusProdutoOrigem, setStatusProdutoOrigem] = useState([]);
  const [statusProdutoDestino, setStatusProdutoDestino] = useState([]);
  const [modalPodutoSelecionadoDestino, setModalPodutoSelecionadoDestino] = useState(false);
  const [modalPodutoSelecionadoOrigem, setModalPodutoSelecionadoOrigem] = useState(false);
  const [modalEmpresasPromocao, setModalEmpresasPromocao] = useState(false);
  const [dadosEmpresasPromocoes, setDadosEmpresasPromocoes] = useState([]);
  const [modalDocumentacao, setModalDocumentacao] = useState(false);
  const [modalPodutoSelecionadoDestinoCSV, setModalPodutoSelecionadoDestinoCSV] = useState(false);
  const [modalPodutoSelecionadoOrigemCSV, setModalPodutoSelecionadoOrigemCSV] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const usuarioArmazenado = localStorage.getItem('usuario');

    if (usuarioArmazenado) {
      try {
        const parsedUsuario = JSON.parse(usuarioArmazenado);
        setUsuarioLogado(parsedUsuario);
      } catch (error) {
        console.error('Erro ao parsear o usuário do localStorage:', error);
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

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
    const dataInicial = getDataAtual()
    const dataFinal = getDataAtual()
    setDataInicio(dataInicial)
    setDataFim(dataFinal)
  }, [])


  const { data: dadosMecanicas = [], error: errorMecanicas, isLoading: isLoadingMecanica, refetch: refetchMecanica } = useQuery(
    'fornecedor-produto',
    async () => {
      const response = await get(`/mecanicas-ativas`);
      return response.data;
    },
    { staleTime: 1000 * 60 * 60, cacheTime: 1000 * 60 * 60, }
  );

  const { data: dadosFornecedorProduto = [], error: errorFornecedor, isLoading: isLoadingFornecedor, refetch: refetchFornecedor } = useQuery(
    'fornecedor-produto',
    async () => {
      const response = await get(`/fornecedor-produto`);
      return response.data;
    },
    { staleTime: 1000 * 60 * 60, cacheTime: 1000 * 60 * 60, }
  );

  const { data: dadosGrupo = [], error: errorGrupo, isLoading: isLoadingGrupo, refetch: refetchGrupo } = useQuery(
    'subGrupoEstrutura',
    async () => {
      const response = await get(`/subGrupoEstrutura`);
      return response.data;
    },
    { staleTime: 1000 * 60 * 60, cacheTime: 1000 * 60 * 60, }
  );

  const { data: optionsMarcas = [], error: errorMarcas, isLoading: isLoadingMarcas, refetch: refetchMarcas } = useQuery(
    'marcasLista',
    async () => {
      const response = await get(`/marcasLista`);
      return response.data;
    },
    { staleTime: 1000 * 60 * 60, cacheTime: 1000 * 60 * 60, }
  );

  const { data: optionsEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch: refetchEmpresas } = useQuery(
    ['listaEmpresaComercial', marcaSelecionada],
    async () => {
      if (marcaSelecionada) {
        const response = await get(`/listaEmpresaComercial?idMarca=${marcaSelecionada}`);
        return response.data;
      } else {
        return [];
      }
    },
    { enabled: false, staleTime: 1000 * 60 * 60 }
  );

  useEffect(() => {
    if (marcaSelecionada) {
      refetchEmpresas();
    }
    refetchMarcas()
  }, [marcaSelecionada, refetchEmpresas]);


  const onSubmit = async (data) => {

    try {

      const responsePromocao = await get(`/promocoes-ativas?dataPesquisaFim=${dataFim}`);
      const promocoesAtivas = responsePromocao.data;
      setDadosPromocoesAtivas(promocoesAtivas);

      if (!mecanicaSelecionada) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Selecione uma mecânica!',
          customClass: {
            container: 'custom-swal',
          },
          showConfirmButton: false,
          timer: 3000,
        })
        return;
      }

      if (!empresaSelecionada || empresaSelecionada.length == 0) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Selecione uma empresa!',
          customClass: {
            container: 'custom-swal',
          },
          showConfirmButton: false,
          timer: 3000,
        })
        return;
      }

      if (descricao.length > 80) {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Descrição deve ter no máximo 80 caracteres!',
            customClass: {
              container: 'custom-swal',
            },
            showConfirmButton: false,
            timer: 3000,
          })
          return;
      }

      // Helper to extract only IDPRODUTO from array or value
      const extractIds = arr => {
        if (!arr) return [];
        if (Array.isArray(arr)) {
          return arr
            .map(item => typeof item === 'object' && item !== null && item.IDPRODUTO ? item.IDPRODUTO : item)
            .filter(Boolean);
        }
        if (typeof arr === 'object' && arr !== null && arr.IDPRODUTO) {
          return [arr.IDPRODUTO];
        }
        return [arr];
      };

      const postData = {
        TPAPARTIRDE: aplicacaoDestinoSelecionada,
        TPAPLICADOA: mecanicaSelecionada,
        TPFATORPROMO: tipoDescontoSelecionado,
        APARTIRDEQTD: Number(qtdInicio),
        APARTIRDOVLR: valorInicio,
        FATORPROMOVLR: vrDesconto,
        FATORPROMOPERC: porcentoDesconto,
        VLPRECOPRODUTO: Number(precoProduto),
        DTHORAINICIO: dataInicio,
        DTHORAFIM: dataFim + ' 23:59:59',
        DSPROMOCAOMARKETING: descricao.toUpperCase(),
        IDEMPRESA: empresaSelecionada,
        STATIVO: "True",
        STEMPRESAPROMO: "True",
        STDETPROMOORIGEM: "True",
        STDETPROMODESTINO: "True",
        IDGRUPOEMDESTINO: grupoSelecionado,
        IDSUBGRUPOEMDESTINO: subGrupoSelecionado,
        IDMARCAEMDESTINO: marcaDestino,
        IDFORNECEDOREMDESTINO: fornecedorSelecionado,
        IDGRUPOEMORIGEM: grupoSelecionado,
        IDSUBGRUPOEMORIGEM: subGrupoSelecionado,
        IDMARCAEMORIGEM: marcaOrigem,
        IDFORNECEDOREMORIGEM: fornecedorSelecionado,

  
      };

      let timerInterval;
      Swal.fire({
        title: 'Processando sua promoção...',
        html: 'Aguarde enquanto enviamos os dados <b></b>',
        timerProgressBar: true,
        timer: 30000,
        didOpen: () => {
          Swal.showLoading();
          timerInterval = setInterval(() => {
            const content = Swal.getHtmlContainer();
            if (content) {
              const b = content.querySelector('b');
              if (b) {
                b.textContent = `${Math.floor(Swal.getTimerLeft() / 1000)}s`;
              }
            }
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        }
      });

      const response = await post('/criar-promocoes-ativas-subGrupo', postData);

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Cadastro realizado com sucesso!',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 1500,
      });

      return response.data;
    } catch (error) {
      console.error('Erro ao cadastrar promoção:', error);
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Erro ao Cadastrar Promoção!',
        text: error.message || 'Ocorreu um erro durante o cadastro',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 3000,
      });
      return null;
    }
  };


  const handleSalvarMecanica = async () => {
    // if(optionsModulos[0]?.ALTERAR == 'False') {
    //     Swal.fire({
    //     title: 'Acesso Negado',
    //     text: 'Você não tem permissão para acessar esta funcionalidade.',
    //     icon: 'warning',
    //     timer: 3000,
    //     customClass: {
    //         container: 'custom-swal',
    //     }
    //     })
    //     return;
    // }
    const putData = {
      DESCRICAO: mecanicaSelecionadaEdicao,
      APLICACAODESTINO: aplicacaoDestinoSelecionada,
      MECANICA: mecanicaSelecionada,
      TIPODESCONTO: tipoDescontoSelecionado
    }

    try {
      const response = await post('/criar-mecanica', putData)

      const textDados = JSON.stringify(putData)
      let textoFuncao = 'PROMOÇÃO/CRIANDO UM NOVA MECÂNICA';
      const ipUsuario = await getIPUsuario();
      const postData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }

      Swal.fire({
        title: 'Sucesso',
        text: `Mecânica ${mecanicaSelecionadaEdicao} criada com sucesso!`,
        icon: 'success',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })

      await post('/log-web', postData)
      
      refetchMecanica();
      return response.data;

    } catch (error) {

      let textoFuncao = 'PROMOÇÃO/ERRO AO CRIAR UMA NOVA MECÂNICA';
      const ipUsuario = await getIPUsuario();
      const postData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: 'Erro ao criar mecânica',
        IP: ipUsuario
      }

      const responsePost = await post('/log-web', postData)

      Swal.fire({
        title: 'Erro',
        text: `Erro ao Tentar criar a mecânica ${mecanicaSelecionadaEdicao}. Verifique os dados e tente novamente.`,
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })

      return responsePost.data;
    }

  }

  return {
    mecanicaSelecionada,
    setMecanicaSelecionada,
    aplicacaoDestinoSelecionada,
    setAplicacaoDestinoSelecionada,
    tipoDescontoSelecionado,
    setTipoDescontoSelecionado,
    fornecedorSelecionado,
    setFornecedorSelecionado,
    subGrupoSelecionado,
    setSubGrupoSelecionado,
    grupoSelecionado,
    setGrupoSelecionado,
    marcaSelecionada,
    setMarcaSelecionada,
    empresaSelecionada,
    setEmpresaSelecionada,
    dataInicio,
    setDataInicio,
    dataFim,
    setDataFim,
    qtdInicio,
    setQtdInicio,
    qtdFim,
    setQtdFim,
    vrDesconto,
    setVrDesconto,
    porcentoDesconto,
    setPorcentoDesconto,
    valorInicio,
    setValorInicio,
    valorFim,
    setValorFim,
    produtoOrigem,
    setProdutoOrigem,
    fileProdutoOrigem,
    setFileProdutoOrigem,
    produtoDestino,
    setProdutoDestino,
    fileProdutoDestino,
    setFileProdutoDestino,
    descricao,
    setDescricao,
    precoProduto,
    setPrecoProduto,
    dadosFornecedorProduto,
    dadosGrupo,
    optionsMarcas,
    optionsEmpresas,
    optionsMecanica,
    dadosMecanicas,
    mostrarProdutosSelecionados,
    handleFileUpload,
    dadosPromocoesAtivas,
    modalVisivel,
    setModalVisivel,
    mecanicaSelecionadaEdicao,
    setMecanicaSelecionadaEdicao,
    isEditandoMecanica,
    setIsEditandoMecanica,
    btnSalvar,
    setBtnSalvar,
    ipUsuario,
    usuarioLogado,
    handleSalvarMecanica,
    onSubmit,
    dadosProdutosPesquisa,
    handlePesquisarProdutoOrigem,
    handlePesquisarProdutoDestino,
    modalProduto,
    setModalProduto,
    novoProdutoDestino,
    setNovoProdutoDestino,
    novoProdutoOrigem,
    setNovoProdutoOrigem,
    produtoDestinoSelecionado,
    setProdutoDestinoSelecionado,
    produtoOrigemSelecionado,
    setProdutoOrigemSelecionado,
    modalProdutoDestino,
    setModalProdutoDestino,
    modalProdutoOrigem,
    setModalProdutoOrigem,
    modalProdutoDaPromocao,
    setModalProdutoDaPromocao,
    statusProdutoOrigem,
    setStatusProdutoOrigem,
    statusProdutoDestino,
    setStatusProdutoDestino,
    setModalPodutoSelecionadoDestino,
    modalPodutoSelecionadoDestino,
    setModalPodutoSelecionadoOrigem,
    modalPodutoSelecionadoOrigem,
    setModalEmpresasPromocao,
    modalEmpresasPromocao,
    setDadosEmpresasPromocoes,
    dadosEmpresasPromocoes,
    mostrarProdutosSelecionadosOrigem,
    mostrarProdutosSelecionadosDestino,
    modalDocumentacao,

    modalPodutoSelecionadoDestinoCSV, setModalPodutoSelecionadoDestinoCSV,
    modalPodutoSelecionadoOrigemCSV, setModalPodutoSelecionadoOrigemCSV,
    setModalDocumentacao
  }
}
