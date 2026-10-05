import Swal from "sweetalert2";
import { get, post } from "../../../../api/funcRequest";
import { buscarTodasPaginas } from "../../../../services/paginatedFetch";

export const TAMANHO_LOTE_PRODUTOS = 1000;

export const buscarMenusExcecao = async (idUsuario, idMenuFilho) => {
  const response = await get(`/menus-usuario-excecao?idUsuario=${idUsuario}&idMenuFilho=${idMenuFilho}`);
  return response.data;
};

export const buscarMecanicasAtivas = async () => {
  const response = await get(`/mecanicas-ativas`);
  return response.data;
};

export const buscarGrupoEstrutura = async () => {
  const response = await get(`/grupoEstrutura`);
  return response.data;
};

export const buscarSubGrupoEstrutura = async () => {
  const response = await get(`/subGrupoEstrutura`);
  return response.data;
};

export const buscarMarcas = async () => {
  const response = await get(`/marcasLista`);
  return response.data;
};

export const buscarEmpresasPorMarca = async (idMarca) => {
  const response = await get(`/listaEmpresaComercial?idMarca=${idMarca}`);
  return response.data;
};

export const buscarProdutosSubGrupo = (subGrupos) => (
  buscarTodasPaginas(`/produto-subGrupo?idSubGrupo=${subGrupos.join(',')}`)
);

export const pesquisarProdutoPromocaoAtiva = async (tipoPesquisa, termo) => {
  const response = await get(`/produto-promocao-ativa?${tipoPesquisa}=${termo}`);
  return response?.data || [];
};

// Retorna os detalhes das promoções vigentes, ou [] quando não há promoção vigente
export const buscarDetalhesPromocoesVigentes = async ({ dataInicio, dataFim }) => {
  const filtroDataInicio = dataInicio ? `dataPesquisaInicio=${dataInicio}&` : '';
  const responsePromocao = await get(`/promocoes-ativas?${filtroDataInicio}dataPesquisaFim=${dataFim}`);
  const idsResumo = (responsePromocao.data || []).map((p) => p.IDRESUMOPROMOCAOMARKETING).filter(Boolean);

  if (idsResumo.length === 0) return [];

  const responseDetalhe = await get(`/detalhe-promocoes-ativas?idResumoPromocao=${idsResumo.join(',')}&dataPesquisaFim=${dataFim}`);
  if (!responseDetalhe.data) {
    throw new Error('Falha ao verificar produtos existentes');
  }
  return responseDetalhe.data;
};

export const criarMecanica = async (postData) => {
  const response = await post('/criar-mecanica', postData);
  return response.data;
};

export const criarPromocaoEstrutura = async (postData) => {
  const response = await post('/criar-promocoes-ativas-subGrupo', postData);
  return response.data;
};

export const criarPromocaoEstruturaProduto = async (postData) => {
  const response = await post('/criar-promocoes-ativas-subGrupo-produto', postData);
  return response.data;
};

const montarHtmlProgresso = ({ loteAtual, totalLotes, produtosEnviados, totalProdutos }) => {
  const percentual = Math.min(100, Math.round((produtosEnviados / totalProdutos) * 100));
  return `
    <div style="text-align:left">
      <p>Enviando lote <b>${loteAtual}</b> de <b>${totalLotes}</b></p>
      <p>Produtos enviados: <b>${produtosEnviados}</b> de <b>${totalProdutos}</b> (faltam ${totalProdutos - produtosEnviados})</p>
      <div style="background:#e0e0e0;border-radius:4px;overflow:hidden;height:10px;margin-top:8px;">
        <div style="background:#3085d6;height:100%;width:${percentual}%;transition:width .3s;"></div>
      </div>
    </div>
  `;
};

// Envia os produtos em lotes para a MESMA promoção: o 1º lote cria a promoção e retorna o
// IDRESUMOPROMOCAOMARKETING; os lotes seguintes reenviam esse ID para apenas anexar os produtos.
export const criarPromocaoProdutoEmLotes = async (basePostData, idsProdutoDestino, idsProdutoOrigem) => {
  const totalProdutos = Math.max(idsProdutoDestino.length, idsProdutoOrigem.length, 1);
  const totalLotes = Math.max(1, Math.ceil(totalProdutos / TAMANHO_LOTE_PRODUTOS));
  const atualizarProgresso = (loteAtual, produtosEnviados) => {
    if (Swal.isVisible()) {
      Swal.update({ html: montarHtmlProgresso({ loteAtual, totalLotes, produtosEnviados, totalProdutos }) });
    }
  };

  // Bloqueia a tela: sem fechar por fora, sem ESC, sem botões
  Swal.fire({
    title: 'Processando sua promoção...',
    html: montarHtmlProgresso({ loteAtual: 1, totalLotes, produtosEnviados: 0, totalProdutos }),
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false,
    showConfirmButton: false,
    showCancelButton: false,
    showCloseButton: false,
    didOpen: () => Swal.showLoading(),
  });

  let idPromocaoCriada = null;
  let response = null;

  try {
    for (let lote = 0; lote < totalLotes; lote++) {
      const inicio = lote * TAMANHO_LOTE_PRODUTOS;
      const fim = inicio + TAMANHO_LOTE_PRODUTOS;
      atualizarProgresso(lote + 1, Math.min(inicio, totalProdutos));

      const lotePostData = {
        ...basePostData,
        IDPRODUTO: idsProdutoDestino.slice(inicio, fim),
        IDPRODUTODESTINO: idsProdutoDestino.slice(inicio, fim),
        IDPRODUTOORIGEM: idsProdutoOrigem.slice(inicio, fim),
        ...(idPromocaoCriada && { IDRESUMOPROMOCAOMARKETING: idPromocaoCriada }),
      };

      response = await post('/criar-promocoes-ativas', lotePostData);

      if (!idPromocaoCriada) {
        idPromocaoCriada = response?.data?.IDRESUMOPROMOCAOMARKETING;
        if (!idPromocaoCriada) {
          throw new Error('Não foi possível obter o ID da promoção criada para continuar o envio dos lotes.');
        }
      }

      atualizarProgresso(lote + 1, Math.min(fim, totalProdutos));
    }
  } finally {
    Swal.close();
  }

  return { data: response.data, totalLotes };
};
