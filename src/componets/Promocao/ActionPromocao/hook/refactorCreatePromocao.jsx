import { useCallback, useEffect, useState } from "react"
import { useQuery } from "react-query"
import Swal from "sweetalert2"
import { getDataAtual } from "../../../../utils/dataAtual"
import { optionsMecanicaCompleta } from "../../../../../mecanica"
import { registrarLogAuditoria } from "../../../../services/auditLog"
import {
  buscarDetalhesPromocoesVigentes,
  buscarEmpresasPorMarca,
  buscarGrupoEstrutura,
  buscarMarcas,
  buscarMecanicasAtivas,
  buscarSubGrupoEstrutura,
  criarMecanica,
  criarPromocaoEstrutura,
  criarPromocaoEstruturaProduto,
  criarPromocaoProdutoEmLotes,
  pesquisarProdutoPromocaoAtiva,
} from "../services/promocaoService"
import {
  exibirErro,
  exibirErroCadastro,
  exibirProcessandoPromocao,
  exibirSucessoCadastro,
  validarConflitoSubGrupos,
  validarDescricao,
  validarEmpresa,
  validarMecanica,
  validarPeriodo,
  validarPermissaoAlterar,
  validarProdutoEmPromocao,
  validarProdutoEmPromocaoDaEmpresa,
  validarProdutosIguaisPares,
  validarProdutosPorAplicacaoDestino,
  validarRegrasPromocoesVigentes,
} from "../services/promocaoValidacao"
import {
  ehErroModeloPlanilha,
  exibirArquivoProcessado,
  exibirErroArquivo,
  exibirErroModeloPlanilha,
  exibirLimiteProdutosExcedido,
  lerArquivoProdutos,
  LIMITE_MAXIMO_PRODUTOS,
} from "../services/promocaoPlanilha"
import {
  calcularStatusEstruturaProduto,
  extrairIdsProduto,
  gerarDetalhesEstruturaProduto,
  MECANICA_QTD_VALOR_FINAL,
  normalizeToArray,
  obterProdutosInformados,
  SEM_FILTRO,
  TIPO_CADASTRO,
  unirProdutosSemDuplicados,
} from "../services/promocaoHelpers"

const UMA_HORA = 1000 * 60 * 60;

const OPCOES_TIPO_PESQUISA = {
  idProduto: 'ID Produto',
  codBarras: 'Código de Barras',
  dsProduto: 'Descrição do Produto'
};

const perguntarTipoPesquisa = async () => {
  const { value } = await Swal.fire({
    title: 'Como deseja pesquisar o produto?',
    input: 'radio',
    inputOptions: OPCOES_TIPO_PESQUISA,
    inputValidator: (valor) => !valor && 'Selecione uma opção!',
    confirmButtonText: 'Pesquisar',
    showCancelButton: true,
    customClass: { container: 'custom-swal' }
  });
  return value;
};

export const useCreatePromocaoAtiva = ({ usuarioLogado, optionsModulos }) => {
  // Mecânica
  const [mecanicaSelecionada, setMecanicaSelecionada] = useState(0)
  const [aplicacaoDestinoSelecionada, setAplicacaoDestinoSelecionada] = useState('')
  const [tipoDescontoSelecionado, setTipoDescontoSelecionado] = useState(0)
  const [tipoPromocao, setTipoPromocao] = useState('')
  const [mecanicaSelecionadaEdicao, setMecanicaSelecionadaEdicao] = useState('');
  const [isEditandoMecanica, setIsEditandoMecanica] = useState(true);
  const [btnSalvar, setBtnSalvar] = useState(true);

  // Dados gerais da promoção
  const [marcaSelecionada, setMarcaSelecionada] = useState(SEM_FILTRO)
  const [empresaSelecionada, setEmpresaSelecionada] = useState([])
  const [dataInicio, setDataInicio] = useState(getDataAtual)
  const [dataFim, setDataFim] = useState(getDataAtual)
  const [descricao, setDescricao] = useState('')
  const [qtdInicio, setQtdInicio] = useState(0)
  const [valorInicio, setValorInicio] = useState(0)
  const [vrDesconto, setVrDesconto] = useState(0)
  const [porcentoDesconto, setPorcentoDesconto] = useState(0)
  const [precoProduto, setPrecoProduto] = useState(0)
  const [tipoCadastro, setTipoCadastro] = useState(TIPO_CADASTRO.PRODUTO)

  // Cadastro por produto
  const [produtoOrigem, setProdutoOrigem] = useState('')
  const [produtoDestino, setProdutoDestino] = useState('')
  const [fileProdutoOrigem, setFileProdutoOrigem] = useState([])
  const [fileProdutoDestino, setFileProdutoDestino] = useState([])
  const [produtoOrigemSelecionado, setProdutoOrigemSelecionado] = useState([]);
  const [produtoDestinoSelecionado, setProdutoDestinoSelecionado] = useState([]);
  const [novoProdutoOrigem, setNovoProdutoOrigem] = useState([]);
  const [novoProdutoDestino, setNovoProdutoDestino] = useState([]);
  const [dadosProdutosPesquisa, setDadosProdutosPesquisa] = useState([]);

  // Cadastro por estrutura / estrutura + produto
  const [subGrupoOrigem, setSubGrupoOrigem] = useState([])
  const [subGrupoDestino, setSubGrupoDestino] = useState([])
  const [subGrupoProdutoOrigem, setSubGrupoProdutoOrigem] = useState([])
  const [subGrupoProdutoDestino, setSubGrupoProdutoDestino] = useState([])
  const [produtoSelecionadoEstProdOrigem, setProdutoSelecionadoEstProdOrigem] = useState([]);
  const [produtoSelecionadoEstProdDestino, setProdutoSelecionadoEstProdDestino] = useState([]);

  // Modais
  const [modalProdutoOrigem, setModalProdutoOrigem] = useState(false);
  const [modalProdutoDestino, setModalProdutoDestino] = useState(false);
  const [modalProdutoSelecionadoOrigem, setModalProdutoSelecionadoOrigem] = useState(false);
  const [modalProdutoSelecionadoDestino, setModalProdutoSelecionadoDestino] = useState(false);
  const [modalEstProdOrigem, setModalEstProdOrigem] = useState(false);
  const [modalEstProdDestino, setModalEstProdDestino] = useState(false);
  const [modalDocumentacao, setModalDocumentacao] = useState(false);

  const { data: dadosMecanicas = [], refetch: refetchMecanica } = useQuery(
    'mecanicas-ativas',
    buscarMecanicasAtivas,
    { staleTime: UMA_HORA, cacheTime: UMA_HORA, }
  );

  const { data: dadosGrupo = [] } = useQuery(
    'grupoEstrutura',
    buscarGrupoEstrutura,
    { staleTime: UMA_HORA, cacheTime: UMA_HORA, }
  );

  const { data: dadosSubGrupo = [] } = useQuery(
    'subGrupoEstrutura',
    buscarSubGrupoEstrutura,
    { staleTime: UMA_HORA, cacheTime: UMA_HORA, }
  );

  const { data: optionsMarcas = [] } = useQuery(
    'marcasLista',
    buscarMarcas,
    { staleTime: UMA_HORA, cacheTime: UMA_HORA, }
  );

  const { data: optionsEmpresas = [] } = useQuery(
    ['listaEmpresaComercial', marcaSelecionada],
    () => buscarEmpresasPorMarca(marcaSelecionada),
    { enabled: Boolean(marcaSelecionada), staleTime: UMA_HORA }
  );

  const isQtdInicioBloqueada = mecanicaSelecionada == 1 && mecanicaSelecionadaEdicao !== MECANICA_QTD_VALOR_FINAL;

  // Mantém preenchido apenas o campo de benefício do tipo de desconto selecionado
  useEffect(() => {
    if (tipoDescontoSelecionado == 0) {
      setVrDesconto(0);
      setValorInicio(0);
      setPorcentoDesconto(0)
    } else if (tipoDescontoSelecionado == 1) {
      setPorcentoDesconto(0)
      setPrecoProduto(0);
      setValorInicio(0);
    } else if (tipoDescontoSelecionado == 2) {
      setVrDesconto(0);
      setPrecoProduto(0);
      setValorInicio(0);
    }

    if (isQtdInicioBloqueada) {
      setQtdInicio(0);
    }
  }, [mecanicaSelecionada, tipoDescontoSelecionado, mecanicaSelecionadaEdicao]);

  const handleChangeMecanica = useCallback((opcao) => {
    setTipoPromocao(opcao.value)
    setMecanicaSelecionada(opcao.MECANICA);
    setMecanicaSelecionadaEdicao(opcao.label)
    setAplicacaoDestinoSelecionada(opcao.APLICAODESTINO);
    setTipoDescontoSelecionado(opcao.TIPODESCONTO);
  }, []);

  const handleEditarMecanica = () => {
    const mecanica = dadosMecanicas.find(option => option.ID == mecanicaSelecionada);
    if (mecanica) {
      setMecanicaSelecionadaEdicao(mecanica.DESCRICAO);
      setIsEditandoMecanica(false);
      setBtnSalvar(false);
    }
  };

  const handlePorcentoDesconto = (value) => {
    if (isNaN(value) || value == "" || typeof value !== "number") {
      setPorcentoDesconto(0);
      return;
    }
    setPorcentoDesconto(Math.max(0, Math.min(Number(value), 99)));
  }

  const lados = {
    origem: {
      fileProduto: fileProdutoOrigem,
      setFileProduto: setFileProdutoOrigem,
      produtoDigitado: produtoOrigem,
      setProdutoDigitado: setProdutoOrigem,
      novosProdutos: novoProdutoOrigem,
      setProdutoSelecionado: setProdutoOrigemSelecionado,
      setModalSelecionados: setModalProdutoSelecionadoOrigem,
      setModalPesquisa: setModalProdutoOrigem,
      tituloSelecionados: 'Produtos Origem Selecionados',
      abrirPesquisaSemTermo: false,
    },
    destino: {
      fileProduto: fileProdutoDestino,
      setFileProduto: setFileProdutoDestino,
      produtoDigitado: produtoDestino,
      setProdutoDigitado: setProdutoDestino,
      novosProdutos: novoProdutoDestino,
      setProdutoSelecionado: setProdutoDestinoSelecionado,
      setModalSelecionados: setModalProdutoSelecionadoDestino,
      setModalPesquisa: setModalProdutoDestino,
      tituloSelecionados: 'Produtos Destino Selecionados',
      abrirPesquisaSemTermo: true,
    },
  };

  const handleFileUpload = async (file, lado) => {
    const { setFileProduto } = lados[lado];
    const limparArquivo = () => {
      setFileProduto([]);
      document.querySelectorAll('input[type="file"]').forEach(input => { input.value = ''; });
    };

    try {
      const produtos = await lerArquivoProdutos(file);

      if (produtos.length > LIMITE_MAXIMO_PRODUTOS) {
        limparArquivo();
        exibirLimiteProdutosExcedido(produtos.length);
        return;
      }

      await exibirArquivoProcessado(produtos.length);
      setFileProduto(JSON.stringify(produtos));
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      limparArquivo();
      if (ehErroModeloPlanilha(error)) {
        exibirErroModeloPlanilha(error);
      } else {
        exibirErroArquivo();
      }
    }
  };

  const handleArquivoProdutoChange = (e, lado) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file, lado);
      lados[lado].setProdutoDigitado('');
    } else {
      lados[lado].setFileProduto([]);
    }
  };

  const handleVisualizarProdutosSelecionados = (lado) => {
    const { fileProduto, produtoDigitado, setProdutoDigitado, novosProdutos, setProdutoSelecionado, setModalSelecionados, tituloSelecionados } = lados[lado];
    const produtosUnicos = unirProdutosSemDuplicados([
      ...obterProdutosInformados({ fileProduto }),
      produtoDigitado,
      ...novosProdutos,
    ]);
    setProdutoDigitado('');

    if (produtosUnicos.length === 0) {
      Swal.fire({ icon: 'info', title: tituloSelecionados, text: 'Nenhum produto informado.' });
      return;
    }

    setModalSelecionados(true);
    setProdutoSelecionado(produtosUnicos);
  };

  const handlePesquisarProduto = async (lado) => {
    const { fileProduto, produtoDigitado, setModalPesquisa, abrirPesquisaSemTermo } = lados[lado];
    const termoPesquisa = obterProdutosInformados({ fileProduto, produtoDigitado })[0] || "";

    if (!termoPesquisa && abrirPesquisaSemTermo) {
      setDadosProdutosPesquisa([]);
      setModalPesquisa(true);
      return;
    }

    const tipoPesquisa = await perguntarTipoPesquisa();
    if (!tipoPesquisa) return;

    setDadosProdutosPesquisa(await pesquisarProdutoPromocaoAtiva(tipoPesquisa, termoPesquisa));
    setModalPesquisa(true);
  };

  const onSubmit = async () => {
    if (!validarMecanica(mecanicaSelecionada) || !validarEmpresa(empresaSelecionada)
      || !validarPeriodo(dataInicio, dataFim) || !validarDescricao(descricao)) return;

    const produtosOrigem = obterProdutosInformados({ fileProduto: fileProdutoOrigem, produtoDigitado: produtoOrigem, produtoSelecionado: produtoOrigemSelecionado });
    const produtosDestino = obterProdutosInformados({ fileProduto: fileProdutoDestino, produtoDigitado: produtoDestino, produtoSelecionado: produtoDestinoSelecionado });

    if (produtosOrigem.length === 0 || produtosDestino.length === 0) {
      exibirErro('Origem e destino obrigatórios!', 'Selecione ao menos um produto de origem e um produto de destino.');
      return;
    }

    const isAplicadoAQuantidade = mecanicaSelecionada == 2; // TPAPLICADOA = 2
    const isAplicadoAValor = mecanicaSelecionada == 1;      // TPAPLICADOA = 1
    const isACadaN = aplicacaoDestinoSelecionada == 2;      // TPAPARTIRDE = 2 ("a cada N" / último após entrada)

    // Só o campo de início do tipo é preenchido; nos tipos "a cada N" por valor, N e Y coexistem.
    const apartirDeQtdFinal = (isAplicadoAQuantidade || isACadaN) ? Number(qtdInicio) : 0;
    const apartirDoVlrFinal = isAplicadoAValor ? Number(valorInicio) : 0;
    const fatorPromoPercFinal = tipoDescontoSelecionado == 2 ? Number(porcentoDesconto) : 0;

    if (isACadaN && apartirDeQtdFinal < 1) {
      exibirErro('Atenção!', '"A cada N" precisa de N = 1 ou mais. Com N = 0 a promoção nunca dá desconto. verifique o campo QTD Aparti de', 5000);
      return;
    }

    if (tipoDescontoSelecionado == 2 && !(fatorPromoPercFinal > 0 && fatorPromoPercFinal <= 100)) {
      exibirErro('Percentual inválido!', 'O percentual de desconto deve ser maior que 0 e no máximo 100 (100 = brinde).');
      return;
    }

    try {
      const promocoesVigentes = await buscarDetalhesPromocoesVigentes({ dataInicio, dataFim });

      if (!validarProdutoEmPromocaoDaEmpresa(promocoesVigentes, produtosDestino, empresaSelecionada)) return;
      if (!validarRegrasPromocoesVigentes(promocoesVigentes, {
        aplicacaoDestino: aplicacaoDestinoSelecionada,
        tipoDesconto: tipoDescontoSelecionado,
        empresaSelecionada,
      })) return;

      if (!validarProdutosPorAplicacaoDestino({
        aplicacaoDestino: aplicacaoDestinoSelecionada,
        produtosOrigem,
        produtosDestino,
        origemPares: obterProdutosInformados({ fileProduto: fileProdutoOrigem, produtoDigitado: produtoOrigem }),
        destinoPares: obterProdutosInformados({ fileProduto: fileProdutoDestino, produtoDigitado: produtoDestino }),
      })) return;

      const idsProdutoDestino = [...new Set([
        ...extrairIdsProduto(produtosDestino),
        ...extrairIdsProduto(produtoDestinoSelecionado),
        ...extrairIdsProduto(novoProdutoDestino),
      ])];
      const idsProdutoOrigem = [...new Set([
        ...extrairIdsProduto(produtosOrigem),
        ...extrairIdsProduto(produtoOrigemSelecionado),
        ...extrairIdsProduto(novoProdutoOrigem),
      ])];

      const basePostData = {
        TPAPARTIRDE: aplicacaoDestinoSelecionada,
        TPAPLICADOA: mecanicaSelecionada,
        TPFATORPROMO: tipoDescontoSelecionado,
        APARTIRDEQTD: apartirDeQtdFinal,
        APARTIRDOVLR: apartirDoVlrFinal,
        FATORPROMOVLR: tipoDescontoSelecionado == 1 ? Number(vrDesconto) : 0,
        FATORPROMOPERC: fatorPromoPercFinal,
        VLPRECOPRODUTO: tipoDescontoSelecionado == 0 ? Number(precoProduto) : 0,
        DTHORAINICIO: `${dataInicio} 00:00:00`,
        DTHORAFIM: `${dataFim} 23:59:59`,
        DSPROMOCAOMARKETING: descricao.toUpperCase(),
        IDEMPRESA: empresaSelecionada,
        STATIVO: "True",
        STESTRUTURA: "False",
        STPRODUTO: "True",
        STESTRUTURAPRODUTO: "False",
        STEMPRESAPROMO: "True",
        STDETPROMOORIGEM: "True",
        STDETPROMODESTINO: "True",
        IDGRUPOEMDESTINO: SEM_FILTRO,
        IDSUBGRUPOEMDESTINO: SEM_FILTRO,
        IDMARCAEMDESTINO: SEM_FILTRO,
        IDFORNECEDOREMDESTINO: SEM_FILTRO,
        IDGRUPOEMORIGEM: SEM_FILTRO,
        IDSUBGRUPOEMORIGEM: SEM_FILTRO,
        IDMARCAEMORIGEM: SEM_FILTRO,
        IDFORNECEDOREMORIGEM: SEM_FILTRO,
        NUTIPOPROMOCAO: Number(tipoPromocao)
      };

      const { data, totalLotes } = await criarPromocaoProdutoEmLotes(basePostData, idsProdutoDestino, idsProdutoOrigem);

      exibirSucessoCadastro(totalLotes > 1
        ? `Cadastro realizado com sucesso! (${totalLotes} lotes enviados)`
        : 'Cadastro realizado com sucesso!'
      ).then(() => window.location.reload());

      return data;
    } catch (error) {
      console.error('Erro ao cadastrar promoção:', error);
      exibirErroCadastro(error);
      return null;
    }
  };

  const onSubmitEstrutura = async () => {
    if (!validarMecanica(mecanicaSelecionada) || !validarEmpresa(empresaSelecionada) || !validarDescricao(descricao)) return;

    let postData = null;
    try {
      const promocoesVigentes = await buscarDetalhesPromocoesVigentes({ dataFim });

      if (!validarConflitoSubGrupos(promocoesVigentes, subGrupoDestino, subGrupoOrigem)) return;
      if (!validarRegrasPromocoesVigentes(promocoesVigentes, {
        aplicacaoDestino: aplicacaoDestinoSelecionada,
        tipoDesconto: tipoDescontoSelecionado,
        empresaSelecionada,
        campoEmpresa: 'empresaPromocaoMarketing',
        validarMecanicasExclusivas: false,
      })) return;

      if ((aplicacaoDestinoSelecionada == 0 || aplicacaoDestinoSelecionada == 3)
        && !validarProdutosIguaisPares(produtoSelecionadoEstProdOrigem, produtoSelecionadoEstProdDestino)) return;

      postData = {
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
        STESTRUTURA: "True",
        STPRODUTO: "False",
        STESTRUTURAPRODUTO: "False",
        STEMPRESAPROMO: "True",
        STDETPROMOORIGEM: "True",
        STDETPROMODESTINO: "True",
        IDGRUPOEMDESTINO: SEM_FILTRO,
        IDSUBGRUPOEMDESTINO: subGrupoDestino,
        IDMARCAEMDESTINO: SEM_FILTRO,
        IDFORNECEDOREMDESTINO: SEM_FILTRO,
        IDGRUPOEMORIGEM: SEM_FILTRO,
        IDSUBGRUPOEMORIGEM: subGrupoOrigem,
        IDMARCAEMORIGEM: SEM_FILTRO,
        IDFORNECEDOREMORIGEM: SEM_FILTRO,
        IDPRODUTO: null,
        IDPRODUTODESTINO: null,
        IDPRODUTOORIGEM: null,
        NUTIPOPROMOCAO: Number(tipoPromocao)
      };

      exibirProcessandoPromocao();
      const data = await criarPromocaoEstrutura(postData);
      exibirSucessoCadastro();

      await registrarLogAuditoria({
        idFuncionario: usuarioLogado?.id,
        pathFuncao: 'PROMOÇÃO/CRIAR PROMOÇÃO SUBGRUPO',
        dados: postData
      })

      return data;
    } catch (error) {
      console.error('Erro ao cadastrar promoção:', error);
      exibirErroCadastro(error);

      await registrarLogAuditoria({
        idFuncionario: usuarioLogado?.id,
        pathFuncao: 'PROMOÇÃO/ERRO AO CRIAR PROMOÇÃO SUBGRUPO',
        dados: postData
      })
      return null;
    }
  };

  const onSubmitEstruturaProduto = async () => {
    if (!validarMecanica(mecanicaSelecionada) || !validarEmpresa(empresaSelecionada) || !validarDescricao(descricao)) return;

    let postData = null;
    try {
      const promocoesVigentes = await buscarDetalhesPromocoesVigentes({ dataFim });

      if (!validarProdutoEmPromocao(promocoesVigentes, produtoSelecionadoEstProdDestino)) return;
      if (!validarConflitoSubGrupos(promocoesVigentes, subGrupoProdutoDestino, subGrupoProdutoOrigem)) return;
      if (!validarRegrasPromocoesVigentes(promocoesVigentes, {
        aplicacaoDestino: aplicacaoDestinoSelecionada,
        tipoDesconto: tipoDescontoSelecionado,
        empresaSelecionada,
      })) return;

      if (!validarProdutosPorAplicacaoDestino({
        aplicacaoDestino: aplicacaoDestinoSelecionada,
        produtosOrigem: produtoSelecionadoEstProdOrigem,
        produtosDestino: produtoSelecionadoEstProdDestino,
      })) return;

      const temProduto = extrairIdsProduto(produtoSelecionadoEstProdDestino).length > 0
        || extrairIdsProduto(produtoSelecionadoEstProdOrigem).length > 0;
      const temSubGrupo = subGrupoProdutoDestino.length > 0 || subGrupoProdutoOrigem.length > 0;

      if (!temSubGrupo) {
        Swal.fire({
          position: "center",
          icon: "warning",
          title: temProduto ? "Seleção inválida" : "Seleção obrigatória",
          text: temProduto
            ? "Para selecionar produto, é obrigatório selecionar subgrupo de origem e/ou destino."
            : "Selecione ao menos um subgrupo (com ou sem produto).",
          customClass: { container: "custom-swal" },
          showConfirmButton: true
        });
        return;
      }

      const detalhesDestino = gerarDetalhesEstruturaProduto(
        normalizeToArray(subGrupoProdutoDestino).map(Number),
        normalizeToArray(produtoSelecionadoEstProdDestino),
        'DESTINO'
      );
      const detalhesOrigem = gerarDetalhesEstruturaProduto(
        normalizeToArray(subGrupoProdutoOrigem).map(Number),
        normalizeToArray(produtoSelecionadoEstProdOrigem),
        'ORIGEM'
      );

      if (detalhesDestino.length === 0 && detalhesOrigem.length === 0) {
        Swal.fire({
          icon: "warning",
          title: "Seleção obrigatória",
          text: "Selecione ao menos um subgrupo ou produto."
        });
        return;
      }

      postData = {
        DSPROMOCAOMARKETING: descricao,
        DTHORAINICIO: dataInicio,
        DTHORAFIM: dataFim,
        TPAPLICADOA: mecanicaSelecionada,
        APARTIRDEQTD: Number(qtdInicio),
        APARTIRDOVLR: valorInicio,
        TPFATORPROMO: tipoDescontoSelecionado,
        FATORPROMOVLR: vrDesconto,
        FATORPROMOPERC: porcentoDesconto,
        TPAPARTIRDE: aplicacaoDestinoSelecionada,
        VLPRECOPRODUTO: Number(precoProduto),
        STEMPRESAPROMO: "True",
        STDETPROMOORIGEM: detalhesOrigem.length > 0 ? "True" : "False",
        STDETPROMODESTINO: detalhesDestino.length > 0 ? "True" : "False",
        ...calcularStatusEstruturaProduto([...detalhesDestino, ...detalhesOrigem]),
        STATIVO: "True",
        IDEMPRESA: empresaSelecionada,
        detalhesDestino,
        detalhesOrigem,
        NUTIPOPROMOCAO: Number(tipoPromocao)
      };

      exibirProcessandoPromocao();
      const data = await criarPromocaoEstruturaProduto(postData);
      exibirSucessoCadastro(undefined, 5000);

      await registrarLogAuditoria({
        idFuncionario: usuarioLogado?.id,
        pathFuncao: 'PROMOÇÃO/SUBGRUPO PRODUTO',
        dados: postData
      })

      return data;
    } catch (error) {
      console.error('Erro ao cadastrar promoção:', error);
      exibirErroCadastro(error, 5000);

      await registrarLogAuditoria({
        idFuncionario: usuarioLogado?.id,
        pathFuncao: 'PROMOÇÃO/ERROR SUBGRUPO PRODUTO',
        dados: postData
      })
      return null;
    }
  };

  const handleSalvarMecanica = async () => {
    if (!validarPermissaoAlterar(optionsModulos)) return;

    const postData = {
      DESCRICAO: mecanicaSelecionadaEdicao,
      APLICACAODESTINO: aplicacaoDestinoSelecionada,
      MECANICA: mecanicaSelecionada,
      TIPODESCONTO: tipoDescontoSelecionado
    }

    try {
      const data = await criarMecanica(postData)

      await registrarLogAuditoria({
        idFuncionario: usuarioLogado?.id,
        pathFuncao: 'PROMOÇÃO/CRIANDO UM NOVA MECÂNICA',
        dados: postData
      })

      Swal.fire({
        title: 'Sucesso',
        text: `Mecânica ${mecanicaSelecionadaEdicao} criada com sucesso!`,
        icon: 'success',
        timer: 3000,
        customClass: { container: 'custom-swal' }
      })

      refetchMecanica();
      return data;
    } catch (error) {
      await registrarLogAuditoria({
        idFuncionario: usuarioLogado?.id,
        pathFuncao: 'PROMOÇÃO/ERRO AO CRIAR UMA NOVA MECÂNICA',
        dados: postData
      })

      Swal.fire({
        title: 'Erro',
        text: `Erro ao Tentar criar a mecânica ${mecanicaSelecionadaEdicao}. Verifique os dados e tente novamente.`,
        icon: 'error',
        timer: 3000,
        customClass: { container: 'custom-swal' }
      })
    }
  }

  return {
    // mecânica
    optionsMecanicaCompleta,
    mecanicaSelecionada,
    tipoDescontoSelecionado,
    mecanicaSelecionadaEdicao,
    setMecanicaSelecionadaEdicao,
    isEditandoMecanica,
    btnSalvar,
    isQtdInicioBloqueada,
    handleChangeMecanica,
    handleEditarMecanica,
    handleSalvarMecanica,

    // dados gerais
    optionsMarcas,
    optionsEmpresas,
    dadosGrupo,
    dadosSubGrupo,
    marcaSelecionada,
    setMarcaSelecionada,
    empresaSelecionada,
    setEmpresaSelecionada,
    dataInicio,
    setDataInicio,
    dataFim,
    setDataFim,
    descricao,
    setDescricao,
    qtdInicio,
    setQtdInicio,
    valorInicio,
    setValorInicio,
    vrDesconto,
    setVrDesconto,
    porcentoDesconto,
    handlePorcentoDesconto,
    precoProduto,
    setPrecoProduto,
    tipoCadastro,
    setTipoCadastro,

    // cadastro por produto
    produtoOrigem,
    setProdutoOrigem,
    produtoDestino,
    setProdutoDestino,
    fileProdutoOrigem,
    setFileProdutoOrigem,
    fileProdutoDestino,
    setFileProdutoDestino,
    produtoOrigemSelecionado,
    setProdutoOrigemSelecionado,
    produtoDestinoSelecionado,
    setProdutoDestinoSelecionado,
    novoProdutoOrigem,
    setNovoProdutoOrigem,
    novoProdutoDestino,
    setNovoProdutoDestino,
    dadosProdutosPesquisa,
    handleArquivoProdutoChange,
    handleVisualizarProdutosSelecionados,
    handlePesquisarProduto,

    // cadastro por estrutura
    subGrupoOrigem,
    setSubGrupoOrigem,
    subGrupoDestino,
    setSubGrupoDestino,
    setSubGrupoProdutoOrigem,
    setSubGrupoProdutoDestino,
    produtoSelecionadoEstProdOrigem,
    setProdutoSelecionadoEstProdOrigem,
    produtoSelecionadoEstProdDestino,
    setProdutoSelecionadoEstProdDestino,

    // modais
    modalProdutoOrigem,
    setModalProdutoOrigem,
    modalProdutoDestino,
    setModalProdutoDestino,
    modalProdutoSelecionadoOrigem,
    setModalProdutoSelecionadoOrigem,
    modalProdutoSelecionadoDestino,
    setModalProdutoSelecionadoDestino,
    modalEstProdOrigem,
    setModalEstProdOrigem,
    modalEstProdDestino,
    setModalEstProdDestino,
    modalDocumentacao,
    setModalDocumentacao,

    // ações
    onSubmit,
    onSubmitEstrutura,
    onSubmitEstruturaProduto,
  }
}
