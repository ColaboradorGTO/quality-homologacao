import { useQuery } from "react-query";

export const cadastroCliente = () => {
  const fetchListaClientes = async () => {
    try {
      
      const urlApi = `/lista-cliente-credsystem?idEmpresa=${empresaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquiaFim=${dataPesquisaFim}`;
      const response = await get(urlApi);
      
      if (response.data.length && response.data.length === pageSize) {
        let allData = [...response.data];
        animacaoCarregamento(`Carregando... Página ${currentPage} de ${response.data.length}`, true);
  
        async function fetchNextPage(currentPage) {
          try {
            currentPage++;
            const responseNextPage = await get(`${urlApi}&page=${currentPage}&pageSize=${pageSize}`);
            if (responseNextPage.length) {
              allData.push(...responseNextPage.data);
              return fetchNextPage(currentPage);
            } else {
              return allData;
            }
          } catch (error) {
            console.error('Erro ao buscar próxima página:', error);
            throw error;
          }
        }
  
        await fetchNextPage(currentPage);
        return allData;
      } else {
       
        console.log('Dados retornados:', response.data);
        return response.data;
      }
  
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosListaCliente = [], error: erroCliente, isLoading: isLoadingCliente, refetch: refetchListaClientes } = useQueryy(
    'lista-cliente-credsystem',
    () => fetchListaClientes(empresaSelecionada, dataPesquisaInicio, dataPesquisaFim, currentPage, pageSize),
    { enabled: false, staleTime: 5 * 60 * 1000 }
  );


  const dadosCliente = dadosListaCliente.map((item) => {
    return {
      BAIRRO_RESIDNCL: item.BAIRRO_RESIDNCL,
      CEP_RESIDNCL: item.CEP_RESIDNCL,
      CIDADE_RESIDNCL: item.CIDADE_RESIDNCL,
      COD_LOJA_PRC_CRD: item.COD_LOJA_PRC_CRD,
      COMPL_RESIDNCL: item.COMPL_RESIDNCL,
      CPF_CLIENTE: item.CPF_CLIENTE,
      DDD_CELULAR: item.DDD_CELULAR,
      DDD_CMRCL: item.DDD_CMRCL,
      DDD_RESIDNCL: item.DDD_RESIDNCL,
      DT_ALTERACAO: item.DT_ALTERACAO,
      DT_CADASTRO: item.DT_CADASTRO,
      DT_INCLUSAO_DW: item.DT_INCLUSAO_DW,
      DT_NASCIMENTO: item.DT_NASCIMENTO,
      EMAIL_CLI_CMRCL: item.EMAIL_CLI_CMRCL,
      EMAIL_CLI_PRTCLR: item.EMAIL_CLI_PRTCLR,
      END_RESIDNCL: item.END_RESIDNCL,
      NOME_CLIENTE: item.NOME_CLIENTE,
      NOME_EMP_FIELDD: item.NOME_EMP_FIELDD,
      NOME_MAE: item.NOME_MAE,
      NOME_PARC_CRED: item.NOME_PARC_CRED,
      NUM_CELULAR: item.NUM_CELULAR,
      NUM_CMRCL: item.NUM_CMRCL,
      NUM_RESIDNCL: item.NUM_RESIDNCL,
      NUM_TEL_RESIDNCL: item.NUM_TEL_RESIDNCL,
      RESIDNCL: item.RESIDNCL,
      SEXO_CLIENTE: item.SEXO_CLIENTE,
      TP_END_RESIDNCL: item.TP_END_RESIDNCL
    }
  })

  const exportToExcelCliente = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosCliente);
    const workbook = XLSX.utils.book_new();
    const header = [
      'BAIRRO_RESIDNCL',
      'CEP_RESIDNCL',
      'CIDADE_RESIDNCL',
      'COD_LOJA_PRC_CRD',
      'COMPL_RESIDNCL',
      'CPF_CLIENTE',
      'DDD_CELULAR',
      'DDD_CMRCL',
      'DDD_RESIDNCL',
      'DT_ALTERACAO',
      'DT_CADASTRO',
      'DT_INCLUSAO_DW',
      'DT_NASCIMENTO',
      'EMAIL_CLI_CMRCL',
      'EMAIL_CLI_PRTCLR',
      'END_RESIDNCL',
      'NOME_CLIENTE',
      'NOME_EMP_FIELDD',
      'NOME_MAE',
      'NOME_PARC_CRED',
      'NUM_CELULAR',
      'NUM_CMRCL',
      'NUM_RESIDNCL',
      'NUM_TEL_RESIDNCL',
      'RESIDNCL',
      'SEXO_CLIENTE',
      'TP_END_RESIDNCL'
    ];
    worksheet['!cols'] = [
      { wpx: 200, caption: 'BAIRRO_RESIDNCL' },
      { wpx: 100, caption: 'CEP_RESIDNCL' },
      { wpx: 200, caption: 'CIDADE_RESIDNCL' },
      { wpx: 100, caption: 'COD_LOJA_PRC_CRD' },
      { wpx: 100, caption: 'COMPL_RESIDNCL' },
      { wpx: 100, caption: 'CPF_CLIENTE' },
      { wpx: 100, caption: 'DDD_CELULAR' },
      { wpx: 100, caption: 'DDD_CMRCL' },
      { wpx: 100, caption: 'DDD_RESIDNCL' },
      { wpx: 100, caption: 'DT_ALTERACAO' },
      { wpx: 100, caption: 'DT_CADASTRO' },
      { wpx: 100, caption: 'DT_INCLUSAO_DW' },
      { wpx: 150, caption: 'DT_NASCIMENTO' },
      { wpx: 200, caption: 'EMAIL_CLI_CMRCL' },
      { wpx: 200, caption: 'EMAIL_CLI_PRTCLR' },
      { wpx: 200, caption: 'END_RESIDNCL' },
      { wpx: 300, caption: 'NOME_CLIENTE' },
      { wpx: 250, caption: 'NOME_EMP_FIELDD' },
      { wpx: 200, caption: 'NOME_MAE' },
      { wpx: 100, caption: 'NOME_PARC_CRED' },
      { wpx: 100, caption: 'NUM_CELULAR' },
      { wpx: 100, caption: 'NUM_CMRCL' },
      { wpx: 100, caption: 'NUM_RESIDNCL' },
      { wpx: 100, caption: 'NUM_TEL_RESIDNCL' },
      { wpx: 100, caption: 'RESIDNCL' },
      { wpx: 100, caption: 'SEXO_CLIENTE' },
      { wpx: 100, caption: 'TP_END_RESIDNCL' }
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista Cliente CredSystem');
    XLSX.writeFile(workbook, 'lista_cliente_credSystem.xlsx');
  };
}