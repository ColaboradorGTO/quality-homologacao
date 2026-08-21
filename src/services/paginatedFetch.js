import { get } from '../api/funcRequest';
import { animacaoCarregamento, fecharAnimacaoCarregamento, foiCancelado } from '../utils/animationCarregamento';

export const buscarTodasPaginas = async (urlBase, { mensagemCarregamento = 'Carregando dados...' } = {}) => {
  const controller = new AbortController();
  let allData = [];

  try {
    animacaoCarregamento(mensagemCarregamento, true, true, () => controller.abort());

    const primeiraPagina = 1;
    const primeiraResposta = await get(`${urlBase}&page=${primeiraPagina}`, { signal: controller.signal });
    const pageSize = primeiraResposta.pageSize || 1000;
    const totalRows = primeiraResposta.rows || primeiraResposta.data?.length || 0;
    const totalPages = Math.ceil(totalRows / pageSize);

    allData = [...(primeiraResposta.data || [])];

    if (totalPages > 1) {
      for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
        if (foiCancelado()) break;
        animacaoCarregamento(`Página ${currentPage} de ${totalPages}`, true, true);
        const responsePage = await get(`${urlBase}&page=${currentPage}`, { signal: controller.signal });
        allData.push(...(responsePage.data || []));
      }
    }

    return allData;
  } catch (error) {
    if (error.code === 'ERR_CANCELED') {
      return allData;
    }
    console.error('Erro ao buscar dados paginados:', error);
    throw error;
  } finally {
    fecharAnimacaoCarregamento();
  }
};
