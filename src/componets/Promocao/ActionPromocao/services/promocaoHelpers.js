// Valor enviado ao backend quando o filtro (grupo, subgrupo, marca, fornecedor) não é utilizado
export const SEM_FILTRO = -1;

export const MECANICA_QTD_VALOR_FINAL = "PROMOÇÃO POR EM UM PRODUTO // QUANTIDADE VALOR // VALOR FINAL";

export const TIPO_CADASTRO = {
  ESTRUTURA: 'estrutura',
  PRODUTO: 'produto',
  ESTRUTURA_PRODUTO: 'estruturaProduto',
};

export const normalizeToArray = (value) => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined || value === "") return [];
  return [value];
};

export const obterIdProduto = (produto) => (
  typeof produto === 'object' && produto !== null ? produto.IDPRODUTO : produto
);

export const extrairIdsProduto = (produtos) => (
  normalizeToArray(produtos).map(obterIdProduto).filter(Boolean)
);

// fileProduto é armazenado como string JSON (ou [] quando vazio)
export const lerProdutosArquivo = (fileProduto) => {
  if (!fileProduto || fileProduto.length === 0) return [];
  try {
    return JSON.parse(fileProduto);
  } catch {
    return [];
  }
};

export const unirProdutosSemDuplicados = (produtos) => {
  const ids = new Set();
  return produtos.filter(Boolean).filter((produto) => {
    const id = obterIdProduto(produto);
    if (!id || ids.has(id)) return false;
    ids.add(id);
    return true;
  });
};

// Produtos informados pelo arquivo; na ausência dele, pelo input; por fim, pela seleção do modal
export const obterProdutosInformados = ({ fileProduto, produtoDigitado, produtoSelecionado = [] }) => {
  const produtosArquivo = lerProdutosArquivo(fileProduto);
  if (produtosArquivo.length > 0) return produtosArquivo;
  if (produtoDigitado) return [produtoDigitado];
  return produtoSelecionado.length > 0 ? produtoSelecionado : [];
};

export const saoMesmosProdutos = (origem, destino) => {
  const idsOrigem = origem.map((produto) => String(obterIdProduto(produto))).sort();
  const idsDestino = destino.map((produto) => String(obterIdProduto(produto))).sort();
  return idsOrigem.length === idsDestino.length && idsOrigem.every((id, i) => id === idsDestino[i]);
};

export const sanitizarDecimal = (texto) => {
  let valor = texto.replace(/,/g, '.').replace(/[^0-9.]/g, '');
  const primeiroPonto = valor.indexOf('.');
  if (primeiroPonto !== -1) {
    valor = valor.substring(0, primeiroPonto + 1) + valor.substring(primeiroPonto + 1).replace(/\./g, '');
  }
  if (valor.length > 1 && valor.startsWith('0') && !valor.startsWith('0.')) {
    valor = valor.replace(/^0+/, '') || '0';
  }
  return valor;
};

export const montarArvoreSubGrupos = (dadosSubGrupo) => {
  const gruposMap = new Map();

  dadosSubGrupo.forEach((subgrupo) => {
    const grupoId = subgrupo.IDGRUPOESTRUTURA;
    if (!gruposMap.has(grupoId)) {
      gruposMap.set(grupoId, {
        key: `grupo_${grupoId}`,
        label: subgrupo.DSGRUPOESTRUTURA,
        children: [],
      });
    }

    gruposMap.get(grupoId).children.push({
      key: `subgrupo_${subgrupo.IDSUBGRUPOESTRUTURA}`,
      label: `${subgrupo.IDSUBGRUPOESTRUTURA} - ${subgrupo.DSSUBGRUPOESTRUTURA} `,
      data: subgrupo,
    });
  });

  return Array.from(gruposMap.values());
};

export const extrairSubGruposDaArvore = (nosSelecionados) => (
  Object.keys(nosSelecionados)
    .filter((key) => key.startsWith('subgrupo_'))
    .map((key) => Number(key.replace('subgrupo_', '')))
);

const coletarIdsDetalhe = (listaEmpresas, campoProduto) => {
  const ids = [];
  (listaEmpresas || []).forEach(({ det }) => {
    if (!det) return;
    if (det.IDPRODUTO) ids.push(det.IDPRODUTO.toString());
    if (det[campoProduto]) {
      det[campoProduto].toString().split(',').forEach((id) => {
        const idLimpo = id.trim();
        if (idLimpo) ids.push(idLimpo);
      });
    }
  });
  return ids;
};

export const extrairIdsProdutosDaPromocao = (promocao) => {
  const ids = [
    ...coletarIdsDetalhe(promocao.empresaPromocaoDestino, 'IDPRODUTODESTINO'),
    ...coletarIdsDetalhe(promocao.empresaPromocaoOrigem, 'IDPRODUTOORIGEM'),
  ];
  return [...new Set(ids)].map(Number);
};

const agruparProdutosPorSubGrupo = (produtos) => {
  const produtosPorSubgrupo = {};
  produtos.forEach((produto) => {
    if (!produto) return;
    const idSub = Number(produto.IDSUBGRUPO);
    const idProd = Number(produto.IDPRODUTO);
    if (!idSub || !idProd) return;
    if (!produtosPorSubgrupo[idSub]) produtosPorSubgrupo[idSub] = [];
    produtosPorSubgrupo[idSub].push(idProd);
  });
  return produtosPorSubgrupo;
};

// Gera os detalhes de origem/destino: subgrupo com produtos selecionados vira um detalhe por produto;
// subgrupo sem produto selecionado vira um único detalhe pelo subgrupo inteiro
export const gerarDetalhesEstruturaProduto = (subGrupos, produtos, sufixo) => {
  const produtosPorSubgrupo = agruparProdutosPorSubGrupo(produtos);
  const detalhes = [];

  subGrupos.forEach((idSubGrupo) => {
    if (!idSubGrupo || idSubGrupo === SEM_FILTRO) return;

    const base = {
      [`IDGRUPOEM${sufixo}`]: SEM_FILTRO,
      [`IDMARCAEM${sufixo}`]: SEM_FILTRO,
      [`IDFORNECEDOREM${sufixo}`]: SEM_FILTRO,
      STATIVO: "True",
    };
    const produtosDoSubgrupo = produtosPorSubgrupo[idSubGrupo] || [];

    if (produtosDoSubgrupo.length > 0) {
      produtosDoSubgrupo.forEach((idProduto) => {
        detalhes.push({ ...base, [`IDSUBGRUPOEM${sufixo}`]: SEM_FILTRO, [`IDPRODUTO${sufixo}`]: String(idProduto) });
      });
    } else {
      detalhes.push({ ...base, [`IDSUBGRUPOEM${sufixo}`]: idSubGrupo, [`IDPRODUTO${sufixo}`]: null });
    }
  });

  return detalhes;
};

export const calcularStatusEstruturaProduto = (detalhes) => {
  const temProdutos = detalhes.some((item) => item.IDPRODUTODESTINO || item.IDPRODUTOORIGEM);
  const temEstrutura = detalhes.some((item) =>
    (item.IDSUBGRUPOEMDESTINO && item.IDSUBGRUPOEMDESTINO !== SEM_FILTRO) ||
    (item.IDSUBGRUPOEMORIGEM && item.IDSUBGRUPOEMORIGEM !== SEM_FILTRO)
  );

  return {
    STESTRUTURA: temEstrutura && !temProdutos ? "True" : "False",
    STESTRUTURAPRODUTO: temEstrutura && temProdutos ? "True" : "False",
    STPRODUTO: temProdutos && !temEstrutura ? "True" : "False",
  };
};
