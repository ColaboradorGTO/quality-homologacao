import Swal from "sweetalert2";
import { extrairIdsProdutosDaPromocao, normalizeToArray, obterIdProduto, saoMesmosProdutos, SEM_FILTRO } from "./promocaoHelpers";

export const LIMITE_PROMOCOES_POR_EMPRESA = 3;

export const exibirErro = (title, text, timer = 3000) => Swal.fire({
  position: 'center',
  icon: 'error',
  title,
  text,
  customClass: { container: 'custom-swal' },
  showConfirmButton: false,
  timer,
});

export const exibirAviso = ({ title, text, html }) => Swal.fire({
  icon: 'warning',
  title,
  text,
  html,
  customClass: { container: 'custom-swal' },
  confirmButtonText: 'OK',
});

export const exibirErroCadastro = (error, timer = 3000) => Swal.fire({
  position: 'top-end',
  icon: 'error',
  title: 'Erro ao Cadastrar Promoção!',
  text: error.message || 'Ocorreu um erro durante o cadastro',
  customClass: { container: 'custom-swal' },
  showConfirmButton: false,
  timer,
});

export const exibirSucessoCadastro = (title = 'Cadastro realizado com sucesso!', timer = 1500) => Swal.fire({
  position: 'center',
  icon: 'success',
  title,
  customClass: { container: 'custom-swal' },
  showConfirmButton: false,
  timer,
});

export const exibirProcessandoPromocao = () => {
  let timerInterval;
  Swal.fire({
    title: 'Processando sua promoção...',
    html: 'Aguarde enquanto enviamos os dados <b></b>',
    timerProgressBar: true,
    timer: 30000,
    didOpen: () => {
      Swal.showLoading();
      timerInterval = setInterval(() => {
        const b = Swal.getHtmlContainer()?.querySelector('b');
        if (b) b.textContent = `${Math.floor(Swal.getTimerLeft() / 1000)}s`;
      }, 100);
    },
    willClose: () => clearInterval(timerInterval),
  });
};

export const validarPermissaoAlterar = (optionsModulos) => {
  if (optionsModulos[0]?.ALTERAR == 'False') {
    Swal.fire({
      title: 'Acesso Negado',
      text: 'Você não tem permissão para acessar esta funcionalidade.',
      icon: 'warning',
      timer: 3000,
      customClass: { container: 'custom-swal' },
    });
    return false;
  }
  return true;
};

export const validarMecanica = (mecanicaSelecionada) => {
  if (!mecanicaSelecionada) {
    exibirErro('Selecione uma mecânica!');
    return false;
  }
  return true;
};

export const validarEmpresa = (empresaSelecionada) => {
  if (!empresaSelecionada || empresaSelecionada.length == 0) {
    exibirErro('Selecione uma empresa!');
    return false;
  }
  return true;
};

export const validarPeriodo = (dataInicio, dataFim) => {
  if (dataFim < dataInicio) {
    exibirErro('Data fim inválida!', 'A data fim deve ser maior ou igual à data início.');
    return false;
  }
  return true;
};

export const validarDescricao = (descricao) => {
  if (descricao.length > 80) {
    exibirErro('Descrição deve ter no máximo 80 caracteres!');
    return false;
  }
  return true;
};

export const validarProdutosIguaisPares = (origem, destino) => {
  if (!saoMesmosProdutos(origem, destino)) {
    exibirErro('Erro Produtos Origem e Destino', 'Para Mecânica por pares ou menos na primeira, os produtos de origem e destino devem ser iguais.', 8000);
    return false;
  }
  return true;
};

// Regras por aplicação destino (TPAPARTIRDE): 0/3 = pares/menos na primeira, 1 = todos os produtos, 4 = em um produto
export const validarProdutosPorAplicacaoDestino = ({ aplicacaoDestino, produtosOrigem, produtosDestino, origemPares = produtosOrigem, destinoPares = produtosDestino }) => {
  if ((aplicacaoDestino == 0 || aplicacaoDestino == 3) && !validarProdutosIguaisPares(origemPares, destinoPares)) {
    return false;
  }

  if (aplicacaoDestino == 1 && produtosDestino.length !== produtosOrigem.length) {
    exibirErro('Erro Aplicação Destino', 'Para Mecânica por todos os produtos, os produtos de origem e destino devem ser iguais.', 8000);
    return false;
  }

  if (aplicacaoDestino == 4) {
    if (produtosDestino.length !== 1 || produtosOrigem.length !== 1) {
      exibirErro('Erro Aplicação Destino', 'Para Mecânica em um produto, apenas um produto pode ser enviado tanto na origem quanto no destino.', 8000);
      return false;
    }
    if (obterIdProduto(produtosOrigem[0]) !== obterIdProduto(produtosDestino[0])) {
      exibirErro('Erro Aplicação Destino', 'Para Mecânica em um produto, o produto de origem e destino deve ser o mesmo.', 8000);
      return false;
    }
  }

  return true;
};

const idsNumericos = (produtos) => normalizeToArray(produtos).map((produto) => Number(obterIdProduto(produto)));

const idsSubGrupoValidos = (valores) => normalizeToArray(valores)
  .map(Number)
  .filter((v) => !Number.isNaN(v) && v !== SEM_FILTRO);

const listarProdutosDestino = (produtosDestino) => normalizeToArray(produtosDestino).map(obterIdProduto).join(', ');

// Produto destino já vinculado a uma promoção vigente que atende alguma das empresas selecionadas
export const validarProdutoEmPromocaoDaEmpresa = (promocoesVigentes, produtosDestino, empresaSelecionada) => {
  const idsDestino = idsNumericos(produtosDestino);
  const idsEmpresas = normalizeToArray(empresaSelecionada).map(Number);

  const existeProduto = promocoesVigentes.some((promocao) => {
    const temProdutoEmComum = extrairIdsProdutosDaPromocao(promocao).some((id) => idsDestino.includes(id));
    if (!temProdutoEmComum) return false;

    const idsEmpresasDaPromocao = (Array.isArray(promocao.empresa) ? promocao.empresa : [])
      .map((item) => Number(item?.det?.IDEMPRESA))
      .filter((id) => !Number.isNaN(id));

    return idsEmpresasDaPromocao.some((id) => idsEmpresas.includes(id));
  });

  if (existeProduto) {
    exibirAviso({
      title: 'Produto já está em uma promoção ativa!',
      text: `Produtos  Nº ${listarProdutosDestino(produtosDestino)} já está vinculado a uma promoção ativa nesta empresa.`,
    });
    return false;
  }
  return true;
};

// Produto destino já vinculado a qualquer promoção vigente
export const validarProdutoEmPromocao = (promocoesVigentes, produtosDestino) => {
  const idsDestino = idsNumericos(produtosDestino);
  const existeProduto = promocoesVigentes
    .flatMap(extrairIdsProdutosDaPromocao)
    .some((id) => idsDestino.includes(id));

  if (existeProduto) {
    exibirAviso({
      title: 'Produto já está em uma promoção ativa!',
      text: `Produtos  Nº ${listarProdutosDestino(produtosDestino)} destino já está vinculado a uma promoção ativa.`,
    });
    return false;
  }
  return true;
};

export const validarConflitoSubGrupos = (promocoesVigentes, subGrupoDestino, subGrupoOrigem) => {
  const subgruposDestinoAtivos = promocoesVigentes.flatMap((promo) =>
    idsSubGrupoValidos((promo.empresaPromocaoDestino || []).map((item) => item?.det?.IDSUBGRUPOEMDESTINO))
  );
  const subgruposOrigemAtivos = promocoesVigentes.flatMap((promo) =>
    idsSubGrupoValidos((promo.empresaPromocaoOrigem || []).map((item) => item?.det?.IDSUBGRUPOEMORIGEM))
  );

  const conflitos = [...new Set([
    ...idsSubGrupoValidos(subGrupoDestino).filter((id) => subgruposDestinoAtivos.includes(id)),
    ...idsSubGrupoValidos(subGrupoOrigem).filter((id) => subgruposOrigemAtivos.includes(id)),
  ])];

  if (conflitos.length > 0) {
    exibirAviso({
      title: 'Subgrupo já está em promoção ativa',
      html: `Nº em conflito: <b>${conflitos.join(', ')}</b><br/>Ajuste os subgrupos para continuar.`,
    });
    return false;
  }
  return true;
};

// Regras de convivência com as promoções vigentes (mecânica, tipo de desconto e limite por empresa).
// validarMecanicasExclusivas: cadastro por estrutura hoje não valida "pares x em um produto" nem "menos na primeira".
export const validarRegrasPromocoesVigentes = (promocoesVigentes, {
  aplicacaoDestino,
  tipoDesconto,
  empresaSelecionada,
  campoEmpresa = 'empresa',
  validarMecanicasExclusivas = true,
}) => {
  const paresComEmUmProduto = promocoesVigentes.some((promo) =>
    (promo.TPAPARTIRDE == 0 && aplicacaoDestino == 4) ||
    (promo.TPAPARTIRDE == 4 && aplicacaoDestino == 0)
  );
  if (validarMecanicasExclusivas && paresComEmUmProduto) {
    exibirAviso({
      title: 'Promoção por pares e em um produto não podem ser usadas juntas!',
      text: 'Não é permitido cadastrar uma promoção por pares e em um produto ao mesmo tempo.',
    });
    return false;
  }

  if (promocoesVigentes.some((promo) => promo.TPFATORPROMO == tipoDesconto)) {
    exibirAviso({
      title: 'Tipo Desconto já ativo nesta empresa!',
      text: 'Já existe um desconto ativo com o mesmo tipo de desconto nesta empresa. Não é permitido cadastrar outro.',
    });
    return false;
  }

  if (promocoesVigentes.some((promo) => promo.TPAPARTIRDE == 0)) {
    exibirAviso({
      title: 'Promoção por pares já existente!',
      text: 'Já existe uma promoção ativa com aplicação destino por pares. Não é permitido cadastrar outra.',
    });
    return false;
  }

  if (validarMecanicasExclusivas && promocoesVigentes.some((promo) => promo.TPAPARTIRDE == 3)) {
    exibirAviso({
      title: 'Promoção menos na primeira já existente!',
      text: 'Já existe uma promoção ativa com aplicação destino menos na primeira. Não é permitido cadastrar outra.',
    });
    return false;
  }

  const promocoesNaEmpresa = promocoesVigentes
    .flatMap((item) => (Array.isArray(item[campoEmpresa]) ? item[campoEmpresa] : []))
    .filter((empresa) => empresa.det.IDEMPRESA == empresaSelecionada);

  if (promocoesNaEmpresa.length >= LIMITE_PROMOCOES_POR_EMPRESA) {
    exibirAviso({
      title: 'Limite atingido',
      text: `Já existem ${LIMITE_PROMOCOES_POR_EMPRESA} promoções ativas nesta empresa. Não é permitido cadastrar outra..`,
    });
    return false;
  }

  return true;
};
