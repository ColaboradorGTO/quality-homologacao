import React, { Fragment, useState, useEffect } from "react"
import { ActionListaVouchersResumido } from "./actionListaVouchersResumido"
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { ButtonType } from "../../../Buttons/ButtonType";
import { AiOutlineSearch } from "react-icons/ai";
import { getDataAtual } from "../../../../utils/dataAtual";
import { get } from "../../../../api/funcRequest";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import { useQuery } from "react-query";


export const ActionPesquisaVoucherResumido = () => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [numeroVoucher, setNumeroVoucher] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    const dataInicial = getDataAtual();
    const dataFinal = getDataAtual();
    setDataPesquisaInicio(dataInicial);
    setDataPesquisaFim(dataFinal);
  }, [])

  const fetchListaResumoVoucher = async ( ) => {
    const urlBase = `/detalhe-voucher-dados-adm?dadosVoucher=${numeroVoucher}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;    
    let urlApi = urlBase.includes('?') ? urlBase : urlBase + '?';
    urlApi = urlApi.replace('&page=1', '').replace('page=1', '');
    try {
      
     animacaoCarregamento('Carregando dados...', true);
     
      const primeiraPagina = 1;
      const primeiraResposta = await get(`${urlApi}&page=${primeiraPagina}`);
      const page = primeiraResposta.page || primeiraPagina;
      const pageSize = primeiraResposta.pageSize || 1000;
      const totalRows = primeiraResposta.rows || primeiraResposta.data?.length || 0;
      const totalPages = Math.ceil(totalRows / pageSize);

      let allData = [...(primeiraResposta.data || [])];

      if (totalPages > 1) {
        for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
          animacaoCarregamento(`Página ${currentPage} de ${totalPages}`, true);
          const responsePage = await get(`${urlApi}&page=${currentPage}`);
          allData.push(...(responsePage.data || []));
        }
      }

      return allData;
    } catch (error) {
      console.error('Erro ao buscar dados da api:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };
   
  const { data: dadosVoucher = [], error: errorVouchers, isLoading: isLoadingVouchers, refetch: refetchListaResumoVoucher } = useQuery(
    ['detalhe-voucher-dados-adm', ],
    () => fetchListaResumoVoucher(),
    {
      enabled: false, 
    }
  );

  const handleClick = () => {
    setCurrentPage(prevPage => prevPage + 1)
    refetchListaResumoVoucher()
    setTabelaVisivel(true)
  }


  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Vouchers Emitidos"]}
        title="Vouchers Emitidos"
        subTitle="Nome da Loja"

        InputFieldDTInicioComponent={InputField}
        labelInputFieldDTInicio={"Data Início"}
        valueInputFieldDTInicio={dataPesquisaInicio}
        onChangeInputFieldDTInicio={e => setDataPesquisaInicio(e.target.value)}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={e => setDataPesquisaFim(e.target.value)}

        InputFieldNumeroVoucherComponent={InputField}
        valueInputFieldNumeroVoucher={numeroVoucher}
        onChangeInputFieldNumeroVoucher={e => setNumeroVoucher(e.target.value)}
        labelInputFieldNumeroVoucher={"Voucher - Nº Venda ou CPF/CNPJ"}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

      />

      {tabelaVisivel &&
        <ActionListaVouchersResumido dadosVoucher={dadosVoucher}/>
      }   
    </Fragment>
  )
}