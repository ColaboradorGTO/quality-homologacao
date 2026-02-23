import { Fragment, useEffect, useState } from "react";
import { AiOutlineSearch, AiOutlineUser } from "react-icons/ai";
import { getDataAtual } from "../../../../utils/dataAtual";
import { ActionListaVendasLoja } from "./actionListaVendaLoja";
import { get } from "../../../../api/funcRequest";
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { ButtonType } from "../../../Buttons/ButtonType";
import { ResultadoResumo } from "../../../ResultadoResumo/ResultadoResumo";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { MdOutlinePayment } from "react-icons/md";
import { BsGem, BsGlobe } from "react-icons/bs";
import { FaCashRegister, FaRegLightbulb } from "react-icons/fa";
import { toFloat } from "../../../../utils/toFloat";
import { useQuery } from 'react-query';

export const ResumoDashBoardComercial = ({ }) => {
  const [clickContador, setClickContador] = useState(0);
  const [dataPesquisa, setDataPesquisa] = useState(''); 

  useEffect(() => {
    const dataAtual = getDataAtual()
    setDataPesquisa(dataAtual);
  }, []);

  const { data: dadosVendasResumo = [],  refetch: refetchResumoVendas } = useQuery(
    'venda-total',
    async () => {
      const response = await get(`/venda-total?dataPesquisa=${dataPesquisa}`);   
      return response.data;
    },
    {
      enabled: Boolean(dataPesquisa), staleTime: 60 * 60 * 1000, 
    }
  );


  const calcularTotalRealizado = (item) => {
    

    return (

      toFloat(item.VALORTOTALDINHEIRO) + 
      toFloat(item.VALORTOTALCARTAO) + 
      toFloat(item.VALORTOTALCONVENIO) + 
      toFloat(item.VALORTOTALPOS) + 
      toFloat(item.VALORTOTALFATURA) + 
      toFloat(item.VALORTOTALDESPESA) 
    );
  }

  const dados = dadosVendasResumo.map((item) => {

    const totalDespesaAdiantamento = parseFloat(item.VALORTOTALDESPESA) + parseFloat(item.VALORTOTALADIANTAMENTOSALARIAL);
    const totalRealizado = calcularTotalRealizado(item);
  
    return {
      VALORTOTALDINHEIRO: toFloat(item[0]?.VALORTOTALDINHEIRO),
      VALORTOTALCARTAO: toFloat(item[0]?.VALORTOTALCARTAO),
      VALORTOTALCONVENIO: toFloat(item[0]?.VALORTOTALCONVENIO),
      VALORTOTALPOS: toFloat(item[0]?.VALORTOTALPOS),
      VALORTOTALVOUCHER: toFloat(item[0]?.VALORTOTALVOUCHER),
      VALORTOTALFATURA: toFloat(item[0]?.VALORTOTALFATURA),
      VALORTOTALDESPESA: toFloat(item[0]?.VALORTOTALDESPESA),
      VALORTOTALADIANTAMENTOSALARIAL: toFloat(item[0]?.VALORTOTALADIANTAMENTOSALARIAL),

      totalDespesaAdiantamento: totalDespesaAdiantamento,
      totalRealizado: totalRealizado
    }
  })

  const { data: dadosVendasPagamentos = [], error: erroTotalVendas, isLoading: isLoadingTotalVendas, refetch: refetchVendas } = useQuery(
    'venda-total-empresa',
    async () => {
      const response = await get(`/venda-total-empresa?dataPesquisa=${dataPesquisa}`);
      return response.data;
    },
    {
     enabled: Boolean(dataPesquisa), staleTime: 60 * 60 * 1000, 
    }
  );
  

  const handleClick = () => {
    refetchResumoVendas();
    refetchVendas();
  }


  return (
    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Tela Principal"]}
        title="Dashboard Comercial"
        subTitle="Nome da Loja"

        InputFieldDTConsultaComponent={InputField}
        labelInputFieldDTConsulta={"Data Consulta"}
        valueDTCosulta={dataPesquisa}
        onChangeInputFieldDTConsulta={(e) => setDataPesquisa(e.target.value)}
      
        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}
      />

      <ResultadoResumo
        nomeVendas="Dinheiro"
        valorVendas={formatMoeda(dadosVendasResumo[0]?.VALORTOTALDINHEIRO)}
        cardVendas={true}
        IconVendas={AiOutlineUser}
        iconSize={100}
        iconColor={"#fff"}


        nomeCartao="Cartão"
        valorCartao={formatMoeda(dadosVendasResumo[0]?.VALORTOTALCARTAO)}
        cardCartao={true}
        IconCartao={MdOutlinePayment}

        nomeCliente="POS"
        numeroCliente={formatMoeda(dadosVendasResumo[0]?.VALORTOTALPOS)}
        cardCliente={true}
        IconNumeroCliente={BsGem}

        nomeTicketMedio="Fatura"
        valorTicketMedio={formatMoeda(dadosVendasResumo[0]?.VALORTOTALFATURA)}
        cardTicketMedio={true}
        IconTicketMedio={FaRegLightbulb}

        nomeDespesas="Despesas"
        valorDespesas={formatMoeda(dados[0]?.totalDespesaAdiantamento)}
        cardDespesas={true}
        IconValorDespesas={FaCashRegister}

        nomeEcommerce="Total Realizado"
        valorEcommerce={formatMoeda(dados[0]?.totalRealizado)}
        cardEcommerce={true}
        IconValorEcommerce={BsGlobe}
      />

      <ActionListaVendasLoja dadosVendasPagamentos={dadosVendasPagamentos} dataPesquisa={dataPesquisa} />
          

    </Fragment>
  )
}