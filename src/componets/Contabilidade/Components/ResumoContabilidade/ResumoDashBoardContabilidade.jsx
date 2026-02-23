import React, { Fragment, useEffect, useRef, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BsGem } from "react-icons/bs";
import { FaCashRegister, FaRegLightbulb, FaRegMoneyBillAlt, FaSearch } from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";
import { ResultadoResumo } from "../../../ResultadoResumo/ResultadoResumo";
import { get } from "../../../../api/funcRequest";
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { ButtonType } from "../../../Buttons/ButtonType";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { getDataAtual } from "../../../../utils/dataAtual";
import { toFloat } from "../../../../utils/toFloat";
import { ActionListaVendasLojasResumo } from "./actionListaVendasLojasResumo";
import { ActionListaTransacoesLojas } from "./actionListaTransacoesLojas";
import { useQuery } from 'react-query';

export const ResumoDashBoardContabilidade = () => {
  const [resumoVisivel, setResumoVisivel] = useState(false);
  const [dataPesquisa, setDataPesquisa] = useState('');
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(1000)
  const [isLoadingPesquisa, setIsLoadingPesquisa] = useState(true)

  useEffect(() => {
    const dataAtual = getDataAtual();
    setDataPesquisa(dataAtual);

  }, [])


  const { data: dadosResumoVendas = [],  refetch: refetchResumoVendas } = useQuery(
    'venda-total',
    async () => {
      const response = await get(`/venda-total?dataPesquisa=${dataPesquisa}`);   
      return response.data;
    },
    {
      enabled: Boolean(dataPesquisa), staleTime: 5 * 60 * 1000, 
    }
  );

  const calcularTotalDespesasAdiantamento = (item) => {

    return (

      toFloat(item.VALORTOTALDESPESA) +
      toFloat(item.VALORTOTALADIANTAMENTOSALARIAL)
    );
  }

  const calcularTotalRealizado = (item) => {

    return (
      (toFloat(item.VALORTOTALDINHEIRO) +
      toFloat(item.VALORTOTALCARTAO) +
      toFloat(item.VALORTOTALCONVENIO) +
      toFloat(item.VALORTOTALPOS) +
      toFloat(item.VALORTOTALFATURA)) - 
      toFloat(item.VALORTOTALDESPESA)
    );
  }

  const dadosVendasResumo = Array.isArray(dadosResumoVendas) ? dadosResumoVendas.map((item, index) => {
    let contador = index + 1;
    const totalDespesasAdiantamento = calcularTotalDespesasAdiantamento(item) ;
    const totalRealizado = calcularTotalRealizado(item);
    return {
      VALORTOTALADIANTAMENTOSALARIAL: parseFloat(item.VALORTOTALADIANTAMENTOSALARIAL),
      VALORTOTALCARTAO: item.VALORTOTALCARTAO,
      VALORTOTALCONVENIO: item.VALORTOTALCONVENIO,
      VALORTOTALDESPESA: item.VALORTOTALDESPESA,
      VALORTOTALDINHEIRO: parseFloat(item.VALORTOTALDINHEIRO),
      VALORTOTALFATURA: item.VALORTOTALFATURA,
      VALORTOTALPOS: item.VALORTOTALPOS,
      VALORTOTALVOUCHER: item.VALORTOTALVOUCHER,
      totalDespesasAdiantamento: toFloat(totalDespesasAdiantamento),
      totalRealizado: toFloat(totalRealizado),
      contador
    }
  }): [];


  const { data: dadosTotalVendasEmpresa = [], error: erroTotalVendas, isLoading: isLoadingTotalVendas, refetch: refetchTotalVendasEmpresa } = useQuery(
    'venda-total-empresa',
    async () => {
      const response = await get(`/venda-total-empresa?dataPesquisa=${dataPesquisa}`);
      return response.data;
    },
    {
     enabled: Boolean(dataPesquisa), staleTime: 5 * 60 * 1000, 
    }
  );

  const { data: dadosTransacoesEmpresas = [], error: erroTransacoesEmpresa, isLoading: isLoadingTransacoesEmpresas, refetch } = useQuery(
    'venda-pagamentos',
    async () => {
      const response = await get(`/venda-pagamentos?dataPesquisa=${dataPesquisa}`);
      return response.data;
    },
    {
      enabled: Boolean(dataPesquisa), staleTime: 5 * 60 * 1000, 
    }
  );


 
  const handleClick = () => {
    setResumoVisivel(true);
    setIsLoadingPesquisa(true);
    setCurrentPage(+1);
    refetchResumoVendas()
    refetchTotalVendasEmpresa()
    refetch()

  }


  return (
    <Fragment>
      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Tela Principal"]}
        title="Tela Principal"
        subTitle="Dashboard Contabilidade"

        InputFieldDTInicioComponent={InputField}
        labelInputFieldDTInicio={"Data Consulta"}
        valueInputFieldDTInicio={dataPesquisa}
        onChangeInputFieldDTInicio={(e) => setDataPesquisa(e.target.value)}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Atualizar Dados"}
        onButtonClickSearch={handleClick}
        IconSearch={AiOutlineSearch}
        corSearch={"primary"}
      />

    
        <Fragment>

          <ResultadoResumo
            nomeVendas="Dinheiro"
            valorVendas={formatMoeda(toFloat(dadosVendasResumo[0]?.VALORTOTALDINHEIRO))}
            cardVendas={true}
            IconVendas={FaRegMoneyBillAlt}

            nomeCartao="Cartão"
            valorCartao={formatMoeda(toFloat(dadosVendasResumo[0]?.VALORTOTALCARTAO))}
            cardCartao={true}
            IconCartao={MdOutlinePayment}

            nomeCliente="POS"
            cardCliente={true}
            numeroCliente={formatMoeda(toFloat(dadosVendasResumo[0]?.VALORTOTALPOS))}
            IconNumeroCliente={BsGem}

            nomeTicketMedio="Fatura"
            valorTicketMedio={formatMoeda(toFloat(dadosVendasResumo[0]?.VALORTOTALFATURA))}
            cardTicketMedio={true}
            IconTicketMedio={FaRegLightbulb}

            nomeDespesas="Despesas"
            valorDespesas={formatMoeda(dadosVendasResumo[0]?.totalDespesasAdiantamento)}
            cardDespesas={true}
            IconValorDespesas={FaCashRegister}

            nomeEcommerce="Total Realizado"
            valorEcommerce={formatMoeda(dadosVendasResumo[0]?.totalRealizado)}
            cardEcommerce={true}
            IconValorEcommerce={FaCashRegister}

            // nomeVoucher="Convênio"
            // valorVoucher={formatMoeda(toFloat(dadosVendasResumo[0]?.VALORTOTALCONVENIO))}
            // cardVoucher={true}
            // IconVoucher={BsGem}

            iconSize={100}
            iconColor="white"
          />

          <ActionListaVendasLojasResumo dadosTotalVendasEmpresa={dadosTotalVendasEmpresa} dataPesquisa={dataPesquisa} />

          {/* <ActionListaTransacoesLojas dadosTransacoesEmpresas={dadosTransacoesEmpresas} dataPesquisa={dataPesquisa} /> */}
        </Fragment>
  


    </Fragment>
  )
}