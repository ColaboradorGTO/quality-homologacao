// import { get } from "../../../../../api/funcRequest";
// import { useQuery } from 'react-query';

// export const fetchListaVendasPix = async (marcaSelecionada, dataPesquisaInicio, dataPesquisaFim, empresaSelecionada, empresaLivre) => {
//   try {
//     const urlApi = `/vendaPixPeriodo?idMarca=${marcaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idLoja=${empresaSelecionada}&listaEmpresas=${empresaLivre}`;
//     let allData = [];
//     let currentPage = 1;
//     let hasMoreData = true;

//     while (hasMoreData) {
//       const response = await get(`${urlApi}&page=${currentPage}&pageSize=${pageSize}`);
//       allData = [...allData, ...response.data];

//       if (response.data.length < pageSize) {
//         hasMoreData = false;
//       } else {
//         currentPage++;
//       }
//     }

//     setTotalPages(currentPage);
//     // console.log('allData', allData)
//     return allData;
//   } catch (error) {
//     console.error('Erro ao buscar dados:', error);
//     throw error;
//   }
// }

// export const { data: dadosVendasPix = [], error: errorVendasPix, isLoading: isLoadingVendasPix, refetch: refetchVendasPix } = useQuery(
//   ['vendaPixPeriodo', marcaSelecionada, dataPesquisaInicio, dataPesquisaFim, empresaSelecionada, empresaLivre],
//   () => fetchListaVendasPix(marcaSelecionada, dataPesquisaInicio, dataPesquisaFim, empresaSelecionada, empresaLivre),
//   { enabled: false, staleTime: 5 * 60 * 1000 }
// );