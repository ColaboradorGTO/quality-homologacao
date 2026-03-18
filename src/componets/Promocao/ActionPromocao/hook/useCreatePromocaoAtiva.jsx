import { useCallback, useEffect, useState } from "react"
import { get, post } from "../../../../api/funcRequest"
import { useQuery } from "react-query"
import Swal from "sweetalert2"
import { getDataAtual, getDataTresMesesAtras } from "../../../../utils/dataAtual"
import * as XLSX from 'xlsx';
import { optionsMecanica } from "../../../../../mecanica"
import { useNavigate } from "react-router-dom"
import axios from "axios";

export const useCreatePromocaoAtiva = ({ }) => {
  const [mecanicaSelecionada, setMecanicaSelecionada] = useState(0)
  const [aplicacaoDestinoSelecionada, setAplicacaoDestinoSelecionada] = useState('')
  const [tipoDescontoSelecionado, setTipoDescontoSelecionado] = useState(0)
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState(-1)
  const [subGrupoDestino, setSubGrupoDestino] = useState([])
  const [subGrupoOrigem, setSubGrupoOrigem] = useState([])
  const [subGrupoSelecionado, setSubGrupoSelecionado] = useState(-1)
  const [grupoSelecionado, setGrupoSelecionado] = useState(-1)
  const [grupoSelecionadoDestino, setGrupoSelecionadoDestino] = useState(-1)
  const [grupoSelecionadoOrigem, setGrupoSelecionadoOrigem] = useState(-1)
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
  const [isCheckedGrupo, setIsCheckedGrupo] = useState(false)
  const [isCheckedProduto, setIsCheckedProduto] = useState(true)
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
    'grupoEstrutura',
    async () => {
      const response = await get(`/grupoEstrutura`);
      return response.data;
    },
    {enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 60 * 60 * 1000, }
  );

  const { data: dadosSubGrupo = [], error: errorSubGrupo, isLoading: isLoadingSubGrupo, refetch: refetchSubGrupo } = useQuery(
    'subGrupoEstrutura',
    async () => {
      const response = await get(`/subGrupoEstrutura`);
      return response.data;
    },
    {enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 60 * 60 * 1000, }
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

  const handleFileUpload = async (file, isOrigem) => {
    try {
      const data = await processFile(file);
      
      if (data.length > 1000) {
        Swal.fire({
          icon: 'warning',
          title: 'Limite Excedido',
          html: `
            Limite máximo permitido: 1.000 produtos por promoção.
            Caso contrário, os produtos não serão inseridos na promoção.
          `,
        });
        return; // Interrompe o processamento
      }
      if (isOrigem) {
        setFileProdutoOrigem(JSON.stringify(data));
      } else {
        setFileProdutoDestino(JSON.stringify(data));
      }
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Falha ao processar o arquivo. Verifique o formato.',
      });
    }
  };

  const processFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const content = e.target.result;
          let data = [];

          if (file.name.endsWith('.csv')) {
            data = processCSV(content);
          } else if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
            data = processXLSX(content);
          }

          const filteredData = data.filter(item => item && item.trim() !== '').map(item => item.toString());
          resolve(filteredData);
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Erro na leitura do arquivo'));

      if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
        reader.readAsArrayBuffer(file);
      } else {
        reader.readAsText(file);
      }
    });
  };

  const processCSV = (csvContent) => {
    const contentStr = typeof csvContent === 'string' ? csvContent : new TextDecoder().decode(csvContent);
    const lines = contentStr.split('\n');
    const result = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const firstItem = line.split(',')[0].replace(/"/g, '').trim();
        if (firstItem) {
          result.push(firstItem);
        }
      }
    }
    return result;
  }

  const processXLSX = (xlsxContent) => {
    const workbook = XLSX.read(xlsxContent, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const result = [];
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (row && row.length > 0) {
        const firstCell = row[0]?.toString().trim();
        if (firstCell) {
          result.push(firstCell);
        }
      }
    }
    return result;
  }

  const mostrarProdutosSelecionados = useCallback((tipo) => {
    let produtos = [];
    let titulo = '';

    if (tipo === 'origem') {
      // Produtos do arquivo
      if (fileProdutoOrigem && fileProdutoOrigem.length > 0) {
        try {
          produtos = JSON.parse(fileProdutoOrigem);
        } catch {
          produtos = [];
        }
      }
      // Produto digitado no input
      if (produtoOrigem) {
        produtos = [...produtos, produtoOrigem];
      }
      // Produtos selecionados via checkbox
      if (novoProdutoOrigem && novoProdutoOrigem.length > 0) {
        produtos = [...produtos, ...novoProdutoOrigem];
      }
      titulo = 'Produtos Origem Selecionados';
    } else if (tipo === 'destino') {
      if (fileProdutoDestino && fileProdutoDestino.length > 0) {
        try {
          produtos = JSON.parse(fileProdutoDestino);
        } catch {
          produtos = [];
        }
      }
      if (produtoDestino) {
        produtos = [...produtos, produtoDestino];
      }
      if (novoProdutoDestino && novoProdutoDestino.length > 0) {
        produtos = [...produtos, ...novoProdutoDestino];
      }
      titulo = 'Produtos Destino Selecionados';
    }

    // Remove duplicados
    produtos = [...new Set(produtos.filter(Boolean))];

    if (produtos.length === 0) {
      Swal.fire({
        icon: 'info',
        title: titulo,
        text: 'Nenhum produto informado.',
      });
      return;
    }

    Swal.fire({
      icon: 'info',
      title: `${titulo} (${produtos.length} produtos)`,
      html: `<pre style="text-align:left">${produtos.join('<br>')}</pre>`,
      customClass: {
        container: 'custom-swal',
      },
      confirmButtonText: 'OK'
    });
  }, [fileProdutoOrigem, fileProdutoDestino, produtoOrigem, produtoDestino, novoProdutoOrigem, novoProdutoDestino]);

  const mostrarProdutosSelecionadosOrigem = useCallback(() => {
    let produtos = [];

    // Produtos do arquivo
    if (fileProdutoOrigem && fileProdutoOrigem.length > 0) {
      try {
        produtos = JSON.parse(fileProdutoOrigem);
      } catch {
        produtos = [];
      }
    }
    // Produto digitado no input
    if (produtoOrigem) {
      produtos = [...produtos, produtoOrigem];
    }
    // Produtos selecionados via checkbox
    if (novoProdutoOrigem && novoProdutoOrigem.length > 0) {
      produtos = [...produtos, ...novoProdutoOrigem];
    }

    // Remove duplicados pelo IDPRODUTO se for objeto, ou pelo valor se for string
    produtos = produtos.filter(Boolean);
    const produtosUnicos = [];
    const ids = new Set();
    for (const p of produtos) {
      if (typeof p === 'object' && p !== null && p.IDPRODUTO) {
        if (!ids.has(p.IDPRODUTO)) {
          ids.add(p.IDPRODUTO);
          produtosUnicos.push(p);
        }
      } else if (typeof p === 'string' || typeof p === 'number') {
        if (!ids.has(p)) {
          ids.add(p);
          produtosUnicos.push(p);
        }
      }
    }
    // console.log(fileProdutoOrigem, 'fileProdutoOrigem');
    // console.log('produtosUnicos: createPromocao', produtosUnicos);
    if (produtosUnicos.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Produtos Origem Selecionados',
        text: 'Nenhum produto informado.',
      });
      return;
    }

    setModalPodutoSelecionadoOrigem(true);
    setProdutoOrigemSelecionado(produtosUnicos);
  }, [fileProdutoOrigem, produtoOrigem, novoProdutoOrigem]);

  const mostrarProdutosSelecionadosDestino = useCallback(() => {
    let produtos = [];

    // Produtos do arquivo
    if (fileProdutoDestino && fileProdutoDestino.length > 0) {
      try {
        produtos = JSON.parse(fileProdutoDestino);
      } catch {
        produtos = [];
      }
    }
    // Produto digitado no input
    if (produtoDestino) {
      produtos = [...produtos, produtoDestino];
    }
    // Produtos selecionados via checkbox
    if (novoProdutoDestino && novoProdutoDestino.length > 0) {
      produtos = [...produtos, ...novoProdutoDestino];
    }

    // Remove duplicados pelo IDPRODUTO se for objeto, ou pelo valor se for string
    produtos = produtos.filter(Boolean);
    const produtosUnicos = [];
    const ids = new Set();
    for (const p of produtos) {
      if (typeof p === 'object' && p !== null && p.IDPRODUTO) {
        if (!ids.has(p.IDPRODUTO)) {
          ids.add(p.IDPRODUTO);
          produtosUnicos.push(p);
        }
      } else if (typeof p === 'string' || typeof p === 'number') {
        if (!ids.has(p)) {
          ids.add(p);
          produtosUnicos.push(p);
        }
      }
    }

    if (produtosUnicos.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Produtos Destino Selecionados',
        text: 'Nenhum produto informado.',
      });
      return;
    }

    setModalPodutoSelecionadoDestino(true);
    setProdutoDestinoSelecionado(produtosUnicos);
  }, [fileProdutoDestino, produtoDestino, novoProdutoDestino]);

  const handlePesquisarProdutoOrigem = useCallback(async (tipo) => {
    const produtosOrigem = fileProdutoOrigem && fileProdutoOrigem.length > 0 ? JSON.parse(fileProdutoOrigem) : produtoOrigem ? [produtoOrigem] : [];
    const produtoOrigemArray = Array.isArray(produtosOrigem) ? produtosOrigem : [produtosOrigem];
    const termoPesquisa = produtoOrigemArray[0] || "";

    const { value: tipoPesquisa } = await Swal.fire({
      title: 'Como deseja pesquisar o produto?',
      input: 'radio',
      inputOptions: {
        idProduto: 'ID Produto',
        codBarras: 'Código de Barras',
        dsProduto: 'Descrição do Produto'
      },
      inputValidator: (value) => {
        if (!value) {
          return 'Selecione uma opção!';
        }
      },
      confirmButtonText: 'Pesquisar',
      showCancelButton: true,
      customClass: { container: 'custom-swal' }
    });

    if (!tipoPesquisa) return;

    let response;
    if (tipoPesquisa === 'idProduto') {
      response = await get(`/produto-promocao-ativa?idProduto=${termoPesquisa}`);
    } else if (tipoPesquisa === 'codBarras') {
      response = await get(`/produto-promocao-ativa?codBarras=${termoPesquisa}`);
    } else if (tipoPesquisa === 'dsProduto') {
      response = await get(`/produto-promocao-ativa?dsProduto=${termoPesquisa}`);
    }

    setDadosProdutosPesquisa(response?.data || []);
    setModalProdutoOrigem(true);
  }, [fileProdutoOrigem, produtoOrigem]);

  const handlePesquisarProdutoDestino = useCallback(async (tipo) => {
    const produtosDestino = fileProdutoDestino && fileProdutoDestino.length > 0 ? JSON.parse(fileProdutoDestino) : produtoDestino ? [produtoDestino] : [];
    const produtoDestinoArray = Array.isArray(produtosDestino) ? produtosDestino : [produtosDestino];
    const termoPesquisa = produtoDestinoArray[0] || "";

    if (!termoPesquisa) {
      setDadosProdutosPesquisa([]);
      setModalProdutoDestino(true);
      return;
    }

    const { value: tipoPesquisa } = await Swal.fire({
      title: 'Como deseja pesquisar o produto?',
      input: 'radio',
      inputOptions: {
        idProduto: 'ID Produto',
        codBarras: 'Código de Barras',
        dsProduto: 'Descrição do Produto'
      },
      inputValidator: (value) => {
        if (!value) {
          return 'Selecione uma opção!';
        }
      },
      confirmButtonText: 'Pesquisar',
      showCancelButton: true,
      customClass: { container: 'custom-swal' }
    });

    if (!tipoPesquisa) return;

    let response;
    if (tipoPesquisa === 'idProduto') {
      response = await get(`/produto-promocao-ativa?idProduto=${termoPesquisa}`);
    } else if (tipoPesquisa === 'codBarras') {
      response = await get(`/produto-promocao-ativa?codBarras=${termoPesquisa}`);
    } else if (tipoPesquisa === 'dsProduto') {
      response = await get(`/produto-promocao-ativa?dsProduto=${termoPesquisa}`);
    }

    setDadosProdutosPesquisa(response?.data || []);
    setModalProdutoDestino(true);
  }, [fileProdutoDestino, produtoDestino]);

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

      // if (descricao.length < 20 || descricao.length > 200) {
      //   Swal.fire({
      //     position: 'center',
      //     icon: 'error',
      //     title: 'Descrição deve ter entre 20 e 200 caracteres!',
      //     customClass: {
      //       container: 'custom-swal',
      //     },
      //     showConfirmButton: false,
      //     timer: 3000,
      //   })
      //   return;
      // }

      // Considera produtos de origem e destino vindos do arquivo, input ou seleção manual
      const produtosOrigem = 
        (fileProdutoOrigem && fileProdutoOrigem.length > 0)
          ? JSON.parse(fileProdutoOrigem)
          : produtoOrigem
        ? [produtoOrigem]
        : (produtoOrigemSelecionado && produtoOrigemSelecionado.length > 0)
          ? produtoOrigemSelecionado
          : [];

      const produtosDestino = 
        (fileProdutoDestino && fileProdutoDestino.length > 0)
          ? JSON.parse(fileProdutoDestino)
          : produtoDestino
        ? [produtoDestino]
        : (produtoDestinoSelecionado && produtoDestinoSelecionado.length > 0)
          ? produtoDestinoSelecionado
          : [];

      if (promocoesAtivas && promocoesAtivas.length > 0) {
        const produtoDestinoArray = Array.isArray(produtosDestino) ? produtosDestino : [produtosDestino];
        const idsResumo = promocoesAtivas.map(p => p.IDRESUMOPROMOCAOMARKETING).filter(Boolean);
        const existeAplicaoDestino = promocoesAtivas.some(ap => ap.TPAPARTIRDE == aplicacaoDestinoSelecionada);

        // if (existeAplicaoDestino) {
        //   Swal.fire({
        //     icon: 'warning',
        //     title: 'Aplicação de destino já existe!',
        //     text: `Já existe uma promoção ativa com a mesma aplicação de destino nesta Empresa. Não é permitido cadastrar outra.`,
        //     customClass: { container: 'custom-swal' },
        //     confirmButtonText: 'OK'
        //   });
        //   return;
        // }

        if (idsResumo && idsResumo.length > 0) {
          const idResumo = idsResumo.join(',');
          const responseProdutoExistente = await get(`/detalhe-promocoes-ativas?idResumoPromocao=${idResumo}&dataPesquisaFim=${dataFim}`);

          if (!responseProdutoExistente.data) {
            throw new Error('Falha ao verificar produtos existentes');
          }

          const produtosExistentes = responseProdutoExistente.data.detalhePromo || [];
          const existeProduto = produtosExistentes.some(produto =>
            produtoDestinoArray.includes(produto.IDPRODUTO)
          );

          if (existeProduto) {
            Swal.fire({
              icon: 'warning',
              title: 'Produto já está em uma promoção ativa!',
              text: 'Um dos produtos destino já está vinculado a uma promoção ativa.',
              customClass: { container: 'custom-swal' },
              confirmButtonText: 'OK'
            });
            return;
          }

          const promocoesValidas = responseProdutoExistente.data;
          const promocaoPorParesAtiva = promocoesValidas.some(promo => promo.TPAPARTIRDE == 0);
          const promocaoPorMenosNaPrimeira = promocoesValidas.some(promo => promo.TPAPARTIRDE == 3 && promo.TPAPARTIRDE == 0);
          const promocaoPorParesEmUmProduto = promocoesValidas.some(promo => promo.TPAPARTIRDE == 0 && promo.TPAPARTIRDE == 4);
          const descontoAtivoPromocaoPorEmpresa = promocoesValidas.some(promo => promo.TPFATORPROMO == tipoDescontoSelecionado)

          if (promocaoPorParesEmUmProduto) {
            Swal.fire({
              icon: 'warning',
              title: 'Promoção por pares e em um produto não podem ser usadas juntas!',
              text: 'Não é permitido cadastrar uma promoção por pares e em um produto ao mesmo tempo.',
              customClass: { container: 'custom-swal' },
              confirmButtonText: 'OK'
            });
            return;
          }

          if (descontoAtivoPromocaoPorEmpresa) {
            Swal.fire({
              icon: 'warning',
              title: 'Tipo Desconto já ativo nesta empresa!',
              text: 'Já existe um desconto ativo com o mesmo tipo de desconto nesta empresa. Não é permitido cadastrar outro.',
              customClass: { container: 'custom-swal' },
              confirmButtonText: 'OK'
            });
            return;
          }

          const promocoesValidasNaEmpresaSelecionada = [];
          responseProdutoExistente.data.forEach(item => {
            if (Array.isArray(item.empresaPromocaoMarketing)) {
              item.empresaPromocaoMarketing.forEach(empresa => {
                if (empresa.det.IDEMPRESA == empresaSelecionada) {
                  promocoesValidasNaEmpresaSelecionada.push(empresa.det.IDEMPRESA);
                }
              });
            }
          })

          if (promocaoPorParesAtiva) {
            Swal.fire({
              icon: 'warning',
              title: 'Promoção por pares já existente!',
              text: 'Já existe uma promoção ativa com aplicação destino por pares. Não é permitido cadastrar outra.',
              customClass: { container: 'custom-swal' },
              confirmButtonText: 'OK'
            });
            return;
          }

          if (promocaoPorMenosNaPrimeira) {
            Swal.fire({
              icon: 'warning',
              title: 'Promoção menos na primeira já existente!',
              text: 'Já existe uma promoção ativa com aplicação destino menos na primeira. Não é permitido cadastrar outra.',
              customClass: { container: 'custom-swal' },
              confirmButtonText: 'OK'
            });
            return;
          }

          if (promocoesValidasNaEmpresaSelecionada.length >= 3) {
            Swal.fire({
              icon: 'warning',
              title: 'Limite atingido',
              text: 'Já existem 3 promoções ativas nesta empresa. Não é permitido cadastrar outra..',
              customClass: { container: 'custom-swal' },
              confirmButtonText: 'OK'
            });
            return;
          }
        }
      }

      if (aplicacaoDestinoSelecionada == 0 || aplicacaoDestinoSelecionada == 3) {
        const origem = fileProdutoOrigem && fileProdutoOrigem.length > 0 ? JSON.parse(fileProdutoOrigem) : produtoOrigem ? [produtoOrigem] : [];
        const destino = fileProdutoDestino && fileProdutoDestino.length > 0 ? JSON.parse(fileProdutoDestino) : produtoDestino ? [produtoDestino] : [];
        const iguais = origem.length === destino.length && origem.every((v, i) => v === destino[i]);

        if (!iguais) {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Erro Produtos Origem e Destino',
            text: 'Para Mecânica por pares ou menos na primeira, os produtos de origem e destino devem ser iguais.',
            customClass: {
              container: 'custom-swal',
            },
            showConfirmButton: false,
            timer: 5000,
          });
          return;
        }
      }

      if (aplicacaoDestinoSelecionada == 1) {
        if (produtosDestino.length !== produtosOrigem.length) {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Erro Aplicação Destino',
            text: 'Para Mecânica por todos os produtos, os produtos de origem e destino devem ser iguais.',
            customClass: { container: 'custom-swal' },
            showConfirmButton: false,
            timer: 8000,
          });
          return;
        }
      }

      if (aplicacaoDestinoSelecionada == 4) {

        if (produtosDestino.length !== 1 || produtosOrigem.length !== 1) {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Erro Aplicação Destino',
            text: 'Para Mecânica em um produto, apenas um produto pode ser enviado tanto na origem quanto no destino.',
            customClass: { container: 'custom-swal' },
            showConfirmButton: false,
            timer: 8000,
          });
          return;
        }

       

        const origemId = typeof produtosOrigem[0] === 'object' && produtosOrigem[0] !== null ? produtosOrigem[0].IDPRODUTO : produtosOrigem[0];
        const destinoId = typeof produtosDestino[0] === 'object' && produtosDestino[0] !== null ? produtosDestino[0].IDPRODUTO : produtosDestino[0];
        if (origemId !== destinoId) {
          
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Erro Aplicação Destino',
            text: 'Para Mecânica em um produto, o produto de origem e destino deve ser o mesmo.',
            customClass: { container: 'custom-swal' },
            showConfirmButton: false,
            timer: 8000,
          });
          return;
        }
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
        IDGRUPOEMDESTINO: grupoSelecionadoDestino,
        IDSUBGRUPOEMDESTINO: subGrupoSelecionado,
        IDMARCAEMDESTINO: marcaDestino,
        IDFORNECEDOREMDESTINO: fornecedorSelecionado,
        IDGRUPOEMORIGEM: grupoSelecionadoOrigem,
        IDSUBGRUPOEMORIGEM: subGrupoSelecionado,
        IDMARCAEMORIGEM: marcaOrigem,
        IDFORNECEDOREMORIGEM: fornecedorSelecionado,

        IDPRODUTO: Array.from(new Set([
          ...extractIds(produtosDestino),
          ...extractIds(produtoDestinoSelecionado),
          ...extractIds(novoProdutoDestino),
        ])),
        IDPRODUTODESTINO: Array.from(new Set([
          ...extractIds(produtosDestino),
          ...extractIds(produtoDestinoSelecionado),
          ...extractIds(novoProdutoDestino),
        ])),
        IDPRODUTOORIGEM: Array.from(new Set([
          ...extractIds(produtosOrigem),
          ...extractIds(produtoOrigemSelecionado),
          ...extractIds(novoProdutoOrigem),
        ].filter(Boolean))),
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

      const response = await post('/criar-promocoes-ativas', postData);

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


  const onSubmitEstrutura = async (data) => {
  
    try {
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

      if(!subGrupoDestino && !subGrupoOrigem) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Selecione um subgrupo para origem e destino!',
          customClass: {
            container: 'custom-swal',
          },
          showConfirmButton: false,
          timer: 5000,
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
        STDETPROMODESTINO: "True",
        IDGRUPOEMDESTINO: grupoSelecionadoDestino,
        IDSUBGRUPOEMDESTINO: subGrupoDestino,
        IDMARCAEMDESTINO: marcaDestino,
        IDFORNECEDOREMDESTINO: fornecedorSelecionado,
        IDGRUPOEMORIGEM: grupoSelecionadoOrigem,
        IDSUBGRUPOEMORIGEM: subGrupoOrigem,
        IDMARCAEMORIGEM: marcaOrigem,
        IDFORNECEDOREMORIGEM: fornecedorSelecionado,
        IDPRODUTO: null,
        IDPRODUTODESTINO: null,
        IDPRODUTOORIGEM: null,
  
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

      const responsePost = await post('/log-web', postData)
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
    dadosSubGrupo,
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
    setModalDocumentacao,
    isCheckedGrupo, 
    setIsCheckedGrupo,
    isCheckedProduto,
    setIsCheckedProduto,
    subGrupoDestino,
    setSubGrupoDestino,
    subGrupoOrigem,
    setSubGrupoOrigem,
    onSubmitEstrutura
  }
}
