import { Fragment, useEffect, useState } from "react";
import { ActionListaCaixa } from "../ResumoGerencia/Components/actionListaCaixa";
import { ActionListaVendasPCJ } from "../ResumoGerencia/Components/actionListaVendasPCJ";
import { ActionListaVendasVendedor } from "../ResumoGerencia/Components/actionListaVendasVendedor";
import { ActionListaVendasAtiva } from "../ResumoGerencia/Components/actionListaVendasAtiva";
import { ActionListaVendasCanceladas } from "../ResumoGerencia/Components/actionListaVendasCanceladas";
import { ActionListaVendasConvenio } from "../ResumoGerencia/Components/actionListaVendasConvenio";
import { ActionListaVendasDescontoFuncionario } from "../ResumoGerencia/Components/actionListaVendasDescontoFuncionarios"
import { ActionMain } from "../../Actions/actionMain";
import { InputField } from "../../Buttons/Input";
import { ButtonType } from "../../Buttons/ButtonType";
import { ResultadoResumo } from "../../ResultadoResumo/ResultadoResumo";
import { getDataAtual } from "../../../utils/dataAtual";
import { get } from "../../../api/funcRequest";
import { formatMoeda } from "../../../utils/formatMoeda";
import { AiOutlineSearch } from "react-icons/ai";
import { BsGem } from "react-icons/bs";
import { FaCashRegister, FaRegLightbulb } from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";
import { toFloat } from "../../../utils/toFloat";
import { ActionTabelaMainExtrato } from "./Components/ActionExtrato/actionTabelaMainExtrato";
import { useQuery } from "react-query";
import Swal from "sweetalert2";
import { InputSelectAction } from "../../Inputs/InputSelectAction";
import { useFetchData } from "../../../hooks/useFetchData";


export const ResumoDashBoardGerencia = ({ usuarioLogado }) => {
  const [actionVisivel, setActionVisivel] = useState(true);
  const [resumoVisivel, setResumoVisivel] = useState(false);
  const [dataPesquisa, setDataPesquisa] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [dadosDespesaLoja, setDadosDespesaLoja] = useState([]);
  const [dadosExtratoLoja, setDadosExtratoLoja] = useState([]);
  const [menuFilhoAtual, setMenuFilhoAtual] = useState(null);

  useEffect(() => {
    const menuSalvo = localStorage.getItem('menuFilhoSelecionado');
    if (menuSalvo) {
      const menuParsed = JSON.parse(menuSalvo);
      setMenuFilhoAtual(menuParsed);
    }
  }, []);

  const { data: optionsModulos = [], error: errorModulos, isLoading: isLoadingModulos, refetch: refetchModulos } = useQuery(
    ['menus-usuario-excecao', menuFilhoAtual?.ID],
    async () => {
      const response = await get(`/menus-usuario-excecao?idUsuario=${usuarioLogado?.id}&idMenuFilho=${menuFilhoAtual?.ID}`);

      return response.data;
    },
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000, }
  );

  useEffect(() => {
    const dataInicio = getDataAtual();
    setDataPesquisa(dataInicio);
  }, [usuarioLogado]);

  const empresa = usuarioLogado && usuarioLogado.IDEMPRESA;

  const { data: optionsEmpresas = [] } = useFetchData('empresas', '/empresas');

  const { data: dadosCaixasNaoConferidos = [], error: errorCaixasNaoConferidos, isLoading: isLoadingCaixasNaoConferidos, refetch: refetchCaixasNaoConferidos } = useQuery(
    'lista-caixas-fechados-nao-conferido',
    async () => {
      const idEmpresa = usuarioLogado?.IDEMPRESA;

      const response = await get(`/lista-caixas-fechados-nao-conferido?idEmpresa=${idEmpresa}`);
      return response.data;

    },
    { enabled: Boolean(usuarioLogado?.IDEMPRESA) }
  );

  const retornoListaCaixaFechadosNaoConferidos = () => {
    if (dadosCaixasNaoConferidos.length >= 1) {
      let htmlCaixasNaoConferidos = `<ul>`;
      htmlCaixasNaoConferidos += `<li>&nbsp&nbsp&nbsp&nbsp  Nº do Movimento &nbsp&nbsp&nbsp&nbsp   - &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Caixa - Data Abertura - Falta(m)</li>`;
      htmlCaixasNaoConferidos += `<br>`;

      dadosCaixasNaoConferidos.forEach((caixa) => {
        const dataAbertura = new Date(caixa.DTABERTURA);
        const dataFechamento = new Date(caixa.DTFECHAMENTO);
        const hoje = new Date();

        // Calcula a diferença em dias
        const diffTime = Math.abs(hoje - dataAbertura);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        htmlCaixasNaoConferidos += `<li>${caixa.ID} &nbsp&nbsp - ${caixa.DSCAIXA} - ${caixa.DTABERTURA} - ${diffDays} dia(s)</li>`;
      });

      htmlCaixasNaoConferidos += `</ul>`;

      Swal.fire({
        icon: 'warning',
        title: 'Caixas Fechados e não Conferidos',
        html: htmlCaixasNaoConferidos,
        width: '600px',
        showConfirmButton: true,
        timer: 15000
      }).then((isConfirm) => {
        if (isConfirm) {
          Swal.fire({
            title: 'Bloqueio de Dados',
            text: 'Seus Dados serão bloqueados até que o(s) CAIXA(S) seja(am) CONFIRMADO(S)!',
            icon: 'success',
            timer: 15000
          });
        }
      });
    }
  };

  useEffect(() => {
    if (dadosCaixasNaoConferidos.length > 0 && !isLoadingCaixasNaoConferidos) {
      retornoListaCaixaFechadosNaoConferidos();
    }
  }, [dadosCaixasNaoConferidos, isLoadingCaixasNaoConferidos]);

  const { data: dadosDespesas = [], error: errorDespesas, isLoading: isLoadingDespesas, refetch: refetchDespesas } = useQuery(
    'despesa-lojas-dash',
    async () => {

      const idEmpresa = optionsModulos[0]?.ADMINISTRADOR == "False" ? usuarioLogado?.IDEMPRESA : empresaSelecionada;
      if (idEmpresa) {

        const response = await get(`/despesa-lojas-dash?idEmpresa=${idEmpresa}&dataPesquisa=${dataPesquisa}`);
        return response.data;
      }
      return [];
    },
    { enabled: false }
  );

  const { data: dadosAdiantamento = [], error: errorAdiantamento, isLoading: isLoadingAdiantamento, refetch: refetchAdiantamento } = useQuery(
    'adiantamentos-salarial',
    async () => {
      const idEmpresa = optionsModulos[0]?.ADMINISTRADOR == "False" ? usuarioLogado?.IDEMPRESA : empresaSelecionada;
      if (idEmpresa) {
        const response = await get(`/adiantamentos-salarial?idEmpresa=${idEmpresa}&dataPesquisa=${dataPesquisa}`);
        return response.data;
      }
      return [];
    },
    { enabled: false }
  );

  const { data: dadosQuebraCaixa = [], error: errorQuebraCaixa, isLoading: isLoadingQuebraCaixa, refetch: refetchQuebraCaixa } = useQuery(
    'quebra-caixa-loja-resumo',
    async () => {
      const idEmpresa = optionsModulos[0]?.ADMINISTRADOR == "False" ? usuarioLogado?.IDEMPRESA : empresaSelecionada;
      if (idEmpresa) {
        const response = await get(`/quebra-caixa-loja-resumo?idEmpresa=${idEmpresa}&dataPesquisa=${dataPesquisa}`);
        return response.data;
      }
    },
    { enabled: false }
  );


  const { data: dadosResumoVendas = [], error: errorResumo, isLoading: isLoadingResumo, refetch: refetchResumoVendas } = useQuery(
    'resumoVendaGerencia',
    async () => {
      const idEmpresa = optionsModulos[0]?.ADMINISTRADOR == "False" ? usuarioLogado?.IDEMPRESA : empresaSelecionada;
      if (idEmpresa) {
        const response = await get(`/resumoVendaGerencia?idEmpresa=${idEmpresa}&dataPesquisa=${dataPesquisa}`);
        return response.data;

      }
      return [];
    },
    { enabled: false }
  );


  const dados = dadosResumoVendas.map((item, index) => {
    const totalVenda = toFloat(item.VRRECDINHEIRO) + toFloat(item.VRRECCARTAO) + toFloat(item.VRRECCONVENIO) + toFloat(item.VRRECPOS) + toFloat(item.VRRECCHEQUE);

    return {
      VRRECDINHEIRO: toFloat(item.VRRECDINHEIRO),
      VRRECCARTAO: toFloat(item.VRRECCARTAO),
      VRRECCONVENIO: toFloat(item.VRRECCONVENIO),
      VRRECPOS: toFloat(item.VRRECPOS),
      VRRECCHEQUE: toFloat(item.VRRECCHEQUE),
      QTDVENDAS: toFloat(item.QTDVENDAS),
      VRTICKETWEB: toFloat(item.VRTICKETWEB),
      totalVenda: totalVenda
    }
  })


  const { data: dadosListaCaixa = [], error: errorCaixaMovimento, isLoading: isLoadingCaixaMovimento, refetch: refetchCaixaMovimento } = useQuery(
    'lista-caixas-movimento-gerencia',
    async () => {
      const idEmpresa = optionsModulos[0]?.ADMINISTRADOR == "False" ? usuarioLogado?.IDEMPRESA : empresaSelecionada;
      if (idEmpresa) {
        const response = await get(`/lista-caixas-movimento-gerencia?idEmpresa=${idEmpresa}&dataFechamento=${dataPesquisa}`);
        return response.data;
      }
    },
    { enabled: false }
  );

  const { data: dadosVendasPCJ = [], error: errorVendasPCJ, isLoading: isLoadingPCJ, refetch: refetchPCJ } = useQuery(
    'lista-caixas-movimento-gerencia',
    async () => {
      const idEmpresa = optionsModulos[0]?.ADMINISTRADOR == "False" ? usuarioLogado?.IDEMPRESA : empresaSelecionada;
      if (idEmpresa) {
        const response = await get(`/lista-caixas-movimento-gerencia?idEmpresa=${idEmpresa}&dataFechamento=${dataPesquisa}`);
        return response.data;
      }
    },
    { enabled: false }
  );

  const { data: dadosVendasVendedor = [], error: errorVendasVendedor, isLoading: isLoadingVendasVendedor, refetch: refetchVendasVendedor } = useQuery(
    'vendedor',
    async () => {
      const idEmpresa = optionsModulos[0]?.ADMINISTRADOR == "False" ? usuarioLogado?.IDEMPRESA : empresaSelecionada;
      if (idEmpresa) {
        const response = await get(`/vendedor?idEmpresa=${idEmpresa}&dataFechamento=${dataPesquisa}`);

        return response.data;
      }
    },
    { enabled: false }
  );

  const { data: dadosVendasAtivas = [], error: errorVendasAtivas, isLoading: isLoadingVendasAtivas, refetch: refetchVendasAtivas } = useQuery(
    ['resumo-venda-caixa', 'ativas'],
    async () => {
      
      const idEmpresa = optionsModulos[0]?.ADMINISTRADOR == "False" ? usuarioLogado?.IDEMPRESA : empresaSelecionada;
      if (idEmpresa) {
        const response = await get(`/resumo-venda-caixa?idEmpresa=${idEmpresa}&dataFechamento=${dataPesquisa}&status=False`);
        return response.data;
      }
    },
    { enabled: false }
  );

  const { data: dadosVendasCanceladas = [], error: errorVendasCanceladas, isLoading: isLoadingVendasCanceladas, refetch: refetchVendasCanceladas } = useQuery(
    ['resumo-venda-caixa', 'canceladas'],
    async () => {
     
      const idEmpresa = optionsModulos[0]?.ADMINISTRADOR == "False" ? usuarioLogado?.IDEMPRESA : empresaSelecionada;
      if (idEmpresa) {
        const response = await get(`/resumo-venda-caixa?idEmpresa=${idEmpresa}&dataFechamento=${dataPesquisa}&status=True`);
        return response.data;
      }
    },
    { enabled: false }
  );

  const { data: dadosVendasConvenioDesconto = [], error: errorVendasConvenioDesconto, isLoading: isLoadingVendasConvenioDesconto, refetch: refetchVendasConvenioDesconto } = useQuery(
    'resumo-venda-convenio',
    async () => {
      const idEmpresa = optionsModulos[0]?.ADMINISTRADOR == "False" ? usuarioLogado?.IDEMPRESA : empresaSelecionada;
      if (idEmpresa) {
        const response = await get(`/resumo-venda-convenio?idEmpresa=${idEmpresa}&dataFechamento=${dataPesquisa}`);
        return response.data;
      }
    },
    { enabled: false }
  );

  const { data: dadosVendasConvenioDescontoFuncionario = [], error: errorVendasConvenioDescontoFuncionario, isLoading: isLoadingVendasConvenioDescontoFuncionario, refetch: refetchVendasConvenioDescontoFuncionario } = useQuery(
    'resumo-venda-convenio-desconto',
    async () => {
      const idEmpresa = optionsModulos[0]?.ADMINISTRADOR == "False" ? usuarioLogado?.IDEMPRESA : empresaSelecionada;
      if (idEmpresa) {
        const response = await get(`/resumo-venda-convenio-desconto?statusCancelado=False&idEmpresa=${idEmpresa}&dataPesquisaInicio=${dataPesquisa}&dataPesquisaFim=${dataPesquisa}`);
        return response.data;
      }
    },
    { enabled: false }
  );



  const getListaSaldoExtratoLoja = async () => {
    try {
      const idEmpresa = optionsModulos[0]?.ADMINISTRADOR == "False" ? usuarioLogado?.IDEMPRESA : empresaSelecionada;
      if (idEmpresa) {

        const response = await get(`/extrato-loja-periodo?idEmpresa=${idEmpresa}&dataPesquisaInicio=${dataPesquisa}&dataPesquisaFim=${dataPesquisa}`)

        if (response.data && response.data.length > 0) {
          setDadosExtratoLoja(response.data)
        }
        return response.data;
      }
    } catch (error) {
      console.log('Erro ao buscar marcas: ', error)
    }
  }


  const handleClick = async () => {
    if (empresaSelecionada === '' && optionsModulos[0]?.ADMINISTRADOR === "True") {
      Swal.fire({
        icon: 'warning',
        title: 'Seleção de Empresa',
        text: 'Por favor, selecione uma empresa para realizar a pesquisa.',
        showConfirmButton: true,
      });
      return;
    } else {

      refetchCaixaMovimento()
      refetchPCJ()
      setResumoVisivel(true)
      refetchResumoVendas()
      refetchVendasVendedor()
      refetchVendasAtivas()
      refetchVendasCanceladas()
      refetchVendasConvenioDesconto()
      refetchVendasConvenioDescontoFuncionario()
      refetchQuebraCaixa()
      refetchAdiantamento()
      refetchDespesas()

      // getVendasConvenioFuncionario();
      getListaSaldoExtratoLoja();
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <Fragment>

      {actionVisivel && (
        <ActionMain
          title={"Dashboard Gerencia"}
          subTitle="Movimento de Caixa"
          linkComponentAnterior={["Home"]}
          linkComponent={["Tela Principal"]}

          InputSelectPendenciaComponent={InputSelectAction}
          labelSelectPendencia="Selecione a Empresa"
          optionsPendencia={[
            { value: '', label: 'Todas' },
            ...optionsEmpresas.map((empresa) => ({
              value: empresa.IDEMPRESA,
              label: empresa.NOFANTASIA,
            }))
          ]}
          onChangeSelectPendencia={(e) => setEmpresaSelecionada(e.value)}
          valueSelectPendencia={empresaSelecionada}
          stylePendencia={optionsModulos[0]?.ADMINISTRADOR === "True"}

          InputFieldDTInicioAComponent={InputField}
          labelInputDTInicioA="Data Consulta"
          valueInputFieldDTInicioA={dataPesquisa}
          onChangeInputFieldDTInicioA={(e) => setDataPesquisa(e.target.value)}

          ButtonSearchComponent={ButtonType}
          linkNomeSearch={"Pesquisar"}
          onButtonClickSearch={handleClick}
          corSearch={"primary"}
          IconSearch={AiOutlineSearch}
        />

      )}

      {resumoVisivel && (

        <Fragment>


          <div style={{ marginTop: "1rem" }}>
            <ResultadoResumo
              nomeVendas="Vendas Loja"
              valorVendas={formatMoeda(toFloat(dados[0]?.totalVenda))}
              cardVendas={true}
              IconVendas={MdOutlinePayment}

              nomeDespesas="Despesas"
              cardDespesas={true}
              valorDespesas={formatMoeda(toFloat(dadosDespesaLoja[0]?.VRDESPESA))}
              IconValorDespesas={FaCashRegister}

              nomeTicketMedio="Ticket Médio"
              valorTicketMedio={formatMoeda(toFloat(dados[0]?.VRTICKETWEB))}
              cardTicketMedio={true}
              IconTicketMedio={FaRegLightbulb}

              nomeCliente="Clientes"
              cardCliente={true}
              numeroCliente={toFloat(dados[0]?.QTDVENDAS)}
              IconNumeroCliente={BsGem}

            // iconSize={100}
            // iconColor={"#fff"}
            // empresaUsuario={empresas}
            // dataPesquisa={dataPesquisa}
            />

            <ActionListaCaixa
              dadosListaCaixa={dadosListaCaixa}
              dadosDespesas={dadosDespesas}
              dadosAdiantamento={dadosAdiantamento}
              dadosQuebraCaixa={dadosQuebraCaixa}
            />

            <ActionTabelaMainExtrato
              dadosExtratoLoja={dadosExtratoLoja}
            />

            <ActionListaVendasPCJ
              dadosVendasPCJ={dadosVendasPCJ}
            />

            <ActionListaVendasVendedor
              dadosVendasVendedor={dadosVendasVendedor}
            />

            <ActionListaVendasAtiva
              empresa={empresa}
              dadosVendasAtivas={dadosVendasAtivas}
            />

            <ActionListaVendasCanceladas
              empresa={empresa}
              dadosVendasCanceladas={dadosVendasCanceladas}
            />

            <ActionListaVendasConvenio
              dadosVendasConvenioDesconto={dadosVendasConvenioDesconto}
            />

            <ActionListaVendasDescontoFuncionario
              dadosVendasConvenioDescontoFuncionario={dadosVendasConvenioDescontoFuncionario}
            />
          </div>

        </Fragment>
      )}

    </Fragment>
  )
}