import React, { Fragment, useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BsGem } from "react-icons/bs";
import { FaCashRegister, FaRegLightbulb, FaRegMoneyBillAlt,} from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";
import { ResultadoResumo } from "../../../ResultadoResumo/ResultadoResumo";
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { ButtonType } from "../../../Buttons/ButtonType";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { getDataAtual } from "../../../../utils/dataAtual";
import { toFloat } from "../../../../utils/toFloat";
import { ActionListaVendasLojasResumo } from "./actionListaVendasLojasResumo";
import { ActionListaTransacoesLojas } from "./actionListaTransacoesLojas";
import { useQuery } from "react-query";
import { get } from "../../../../api/funcRequest";


export const ResumoDashBoardFinaneiro = () => {
  const [dataPesquisa, setDataPesquisa] = useState('');
  const [isQueryData, setIsQueryData] = useState(false);

  useEffect(() => {
    const dataAtual = getDataAtual();
    setDataPesquisa(dataAtual);
  }, [])

  const { data: dadosResumoVendas = [], error: errorGrupo, isLoading: isLoadingGrupo, refetch: refetchResumoVendas } = useQuery(
    'venda-total',
    async () => {
      const response = await get(`/venda-total?dataPesquisa=${dataPesquisa}`);
      return response.data;
    },
    { enabled: Boolean(isQueryData), staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  );

  const { data: dadosTotalVendasEmpresa = [], error: errorVendaEmpresa, isLoading: isLoadingEmpresa, refetch: refetchTotalVendasEmpresa } = useQuery(
    'venda-total-empresa',
    async () => {
      const response = await get(`/venda-total-empresa?dataPesquisa=${dataPesquisa}`);
      return response.data;
    },
    { enabled: Boolean(isQueryData), staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  );

  const { data: dadosTransacoesEmpresas = [], error: errorTransacoes, isLoading: isLoadingTransacoes, refetch: refetchTransacoes } = useQuery(
    'venda-pagamentos',
    async () => {
      const response = await get(`/venda-pagamentos?dataPesquisa=${dataPesquisa}`);
      return response.data;
    },
    { enabled: Boolean(isQueryData), staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  );

  const calcularTotalDespesasAdiantamento = (item) => {

    return (
      toFloat(item.VALORTOTALDESPESA) +
      toFloat(item.VALORTOTALADIANTAMENTOSALARIAL)
    );
  }

  const calcularTotalRealizado = (item) => {

    return (
      toFloat(item.VALORTOTALDINHEIRO) +
      toFloat(item.VALORTOTALCARTAO) +
      toFloat(item.VALORTOTALCONVENIO) +
      toFloat(item.VALORTOTALPOS) 

    );
  }

  const dadosVendasResumo = Array.isArray(dadosResumoVendas) ? dadosResumoVendas.map((item, index) => {
    let contador = index + 1;
    const totalDespesasAdiantamento = calcularTotalDespesasAdiantamento(item);
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
      totalDespesasAdiantamento:totalDespesasAdiantamento,
      totalRealizado: totalRealizado,
      contador
    }
  }): [];

 
  const handleClick = () => {
    setIsQueryData(true);
    refetchResumoVendas(dataPesquisa)
    refetchTotalVendasEmpresa(dataPesquisa)
    refetchTransacoes(dataPesquisa)
  }

  return (
    <Fragment>
      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Tela Principal"]}
        title="Tela Principal"
        subTitle="Dashboard Financeiro"

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
        valorDespesas={formatMoeda(toFloat(dadosVendasResumo[0]?.totalDespesasAdiantamento))}
        cardDespesas={true}
        IconValorDespesas={FaCashRegister}

        nomeEcommerce="Total Realizado - Vendas"
        valorEcommerce={formatMoeda(toFloat(dadosVendasResumo[0]?.totalRealizado).toFixed(2))}
        cardEcommerce={true}
        IconValorEcommerce={FaCashRegister}

        nomeVoucher="Convênio"
        valorVoucher={formatMoeda(toFloat(dadosVendasResumo[0]?.VALORTOTALCONVENIO))}
        cardVoucher={true}
        IconVoucher={BsGem}

        iconSize={100}
        iconColor="white"
      />

      <ActionListaVendasLojasResumo dadosTotalVendasEmpresa={dadosTotalVendasEmpresa} dataPesquisa={dataPesquisa} />

      <ActionListaTransacoesLojas dadosTransacoesEmpresas={dadosTransacoesEmpresas} dataPesquisa={dataPesquisa} />
    </Fragment>
  )
}