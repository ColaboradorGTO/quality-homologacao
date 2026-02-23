import { Fragment, useEffect, useState } from "react"
import { ButtonType } from "../../../../Buttons/ButtonType";
import { useQuery } from "react-query";
import { MdMenu, MdOutlineCheck, MdOutlinePayment, MdOutlinePictureAsPdf, MdOutlineVisibility } from "react-icons/md";
import { ResultadoResumo } from "../../../../ResultadoResumo/ResultadoResumo";
import { formatMoeda } from "../../../../../utils/formatMoeda";
import { GrDocumentTxt } from "react-icons/gr";
import { get } from "../../../../../api/funcRequest";
import { toFloat } from "../../../../../utils/toFloat";
import Swal from "sweetalert2";
import { ActionMainNovoPedido } from "../../../../Actions/ActionMainNovoPedido";
import { InputSelectActionPedido } from "../../../../Inputs/InputSelectActionPedido";
import { InputFieldPedido } from "../../../../Buttons/InputActionPedido";
import { InputFieldCheckBox } from "../../.././../Inputs/InputChekBox";
import { useIncluirProutoPedido } from "../../ActionNovoPedido/hooks/useIncluirProdutoPedido";
import { ActionIncluirProdutoPedidoModal } from "../../ActionNovoPedido/IncluirProdutoPedido/actionIncluirProdutoPedidoModal";
import { ActionListaPedidos } from "./actionListaPedidos";
import { FaRegSave } from "react-icons/fa";
import { AiOutlineMenuUnfold } from "react-icons/ai";


export const ActionEditarPedido = ({
  usuarioLogado,
  ID,
  dadosVisualizarPedido,
  dadosDetalhePedido
}) => {
  const [dadosDetalheProdutoPedido, setDadosDetalheProdutoPedido] = useState([]);
  const [botoesVisiveis, setBotoesVisiveis] = useState({
    incluir: true,
    fechar: true,
    salvar: true,
    clonar: false,
    clonarProdutoPedido: false,
    novoPedido: false
  });

  const [camposHabilitados, setCamposHabilitados] = useState(true);
  const [tituloSubheader, setTituloSubheader] = useState('');

  useEffect(() => {
    if (dadosVisualizarPedido && dadosVisualizarPedido.length > 0) {
      const dados = dadosVisualizarPedido[0];
      
      const IdAndamentoPedido = parseInt(dados?.IDANDAMENTO);
      const StCancelaPedido = dados?.STCANCELADO || 'False';
      const IDPEDIDORESUMO = dados?.IDPEDIDO || '';

      // ========== LÓGICA DE VISIBILIDADE ==========
      if (StCancelaPedido === 'True' || (IdAndamentoPedido >= 2 && IdAndamentoPedido < 15)) {
        // Pedido cancelado OU em andamento (setor > COMPRAS)
        setBotoesVisiveis({
          incluir: false,
          fechar: false,
          salvar: false,
          clonar: true,
          clonarProdutoPedido: true,
          novoPedido: true
        });
        setCamposHabilitados(false);
        
        if (IdAndamentoPedido >= 2 && IdAndamentoPedido < 15) {
          setTituloSubheader(`Pedido Nº: ${IDPEDIDORESUMO}`);
        }
        
      } else if (IdAndamentoPedido == 1 || IdAndamentoPedido == 15) {
        // Pedido em inclusão (1) OU retornado para alteração (15)
        setBotoesVisiveis({
          incluir: true,
          fechar: true,
          salvar: true,
          clonar: true,
          clonarProdutoPedido: true,
          novoPedido: true   
        });
        setCamposHabilitados(true);
        
        const tipoOperacao = IdAndamentoPedido === 1 ? 'Inclusão' : 'Alteração';
        setTituloSubheader(`${tipoOperacao} - Pedido Nº: ${IDPEDIDORESUMO}`);
      }
    }
  }, [dadosVisualizarPedido]);

  const { data: optionsModulos = [], error: errorModulos, isLoading: isLoadingModulos, refetch: refetchModulos } = useQuery(
    'menus-usuario-excecao',
    async () => {
      const response = await get(`/menus-usuario-excecao?idUsuario=${usuarioLogado?.id}&idMenuFilho=${ID}`);

      return response.data;
    },
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000, }
  );
  
  const {
    tabelaVisivel,
    setTabelaVisivel,
    tabelaCadastroProduto,
    setTabelaCadastroProduto,
    marcaSelecionada,
    setMarcaSelecionada,
    fornecedorSelecionado,
    setFornecedorSelecionado,
    compradorSelecionado,
    setCompradorSelecionado,
    fiscalSelecionado,
    setFiscalSelecionado,
    enviarSelecionado,
    setEnviarSelecionado,
    condicoesPagamentosSelecionado,
    setCondicoesPagamentosSelecionado,
    obsFornecedor,
    setObsFornecedor,
    obsInterna,
    setObsInterna,
    tipoPedidoSelecionado,
    setTipoPedidoSelecionado,
    vendedor,
    setVendedor,
    emailVendedor,
    setEmailVendedor,
    desconto1,
    setDesconto1,
    desconto2,
    setDesconto2,
    desconto3,
    setDesconto3,
    totalLiq,
    setTotalLiq,
    comissao,
    setComissao,
    transportadoraSelecionada,
    setTransportadoraSelecionada,
    freteSelecionado,
    setFreteSelecionado,
    modalPedidoNota,
    setModalPedidoNota,
    modalPedidoNotaSemPreco,
    setModalPedidoNotaSemPreco,
    arquivoGerado,
    setArquivoGerado,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    dataPesquisaFim,
    setDataPesquisaFim,
    dataPesquisaInicio,
    setDataPesquisaInicio,
    idResumoPedido,
    setIdResumoPedido,
    checked,
    setChecked,
    modalIncluirProdutoPedido,
    setModalIncluirProdutoPedido,
    onIncluirProdutoPedido
  } = useIncluirProutoPedido({ usuarioLogado, optionsModulos });

  const { data: dadosFornecedores = [], error: errorFornecedor, isLoading: isLoadingFornecedor, refetch: refetchFornecedor } = useQuery(
    'fornecedores',
    async () => {
      const response = await get(`/fornecedores`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000, enabled: true, cacheTime: 5 * 60 * 1000 }
  );

  const { data: dadosComprador = [], error: errorComprador, isLoading: isLoadingComprador, refetch: refetchComprador } = useQuery(
    'compradores',
    async () => {
      const response = await get(`/compradores`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000, enabled: true, cacheTime: 5 * 60 * 1000 }
  );



  const { data: dadosMarcas = [], error: errorMarcas, isLoading: isLoadingMarcas, refetch: refetchMarcas } = useQuery(
    'marcasLista',
    async () => {
      const response = await get(`/marcasLista`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000, enabled: true, cacheTime: 5 * 60 * 1000 }
  );
  
  const { data: dadosPagamentos = [], error: errorPagamentos, isLoading: isLoadingPagamentos, refetch: refetchPagamentos } = useQuery(
    'condicaoPagamento',
    async () => {
      const response = await get(`/condicaoPagamento`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000, enabled: true, cacheTime: 5 * 60 * 1000 }
  );

  const { data: dadosTransportador = [], error: errorTransportador, isLoading: isLoadingTransportador, refetch: refetchTransportador } = useQuery(
    'listaTransportador',
    async () => {
      const response = await get(`/listaTransportador`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000, enabled: true, cacheTime: 5 * 60 * 1000 }
  );

;

  const { data: dadosDetalhe = [], error: errorDetalhes, isLoading: isLoadingDetalhes, refetch: refetchListaProdutoPedidos } = useQuery(
    'lista-detalhe-pedidos',
    async () => {
      const response = await get(`/lista-detalhe-pedidos?idPedido=${dadosVisualizarPedido[0]?.IDPEDIDO}`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000, enabled: false }
  );

  // const { data: dadosDetalhePedido= [], error: errorDetalhePedido, isLoading: isLoadingDetalhePedido, refetch: refetchListaDetalhePedidos } = useQuery(
  //   'lista-detalhe-pedidos',
  //   async () => {
  //     const response = await get(`/lista-detalhe-pedidos?idPedido=${dadosVisualizarPedido[0]?.IDPEDIDO}&stTransformado=False`);
  //     return response.data;
  //   },
  //   { staleTime: 5 * 60 * 1000, enabled: false }
  // );


  const { data: dadosProdutosPedidos = [], error: errorProdutosPedido, isLoading: isLoadingProdutosPedidos, refetch: refetchListaCadastroProdutoPedidos } = useQuery(
    'cadastrar-produto-Pedido',
    async () => {
      const response = await get(`/cadastrar-produto-Pedido?idResumoPedido=${dadosVisualizarPedido[0]?.IDPEDIDO}`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000, enabled: false }
  );

  useEffect(() => {
    if(dadosVisualizarPedido && dadosVisualizarPedido.length > 0) {
      
      setDataPesquisaInicio(dadosVisualizarPedido[0]?.DTPEDIDOFORMATADA)
      setDataPesquisaFim(dadosVisualizarPedido[0]?.DTPREVENTREGAFORMATADA)
      setCompradorSelecionado({
        value: dadosVisualizarPedido[0]?.IDCOMPRADOR , 
        label: dadosVisualizarPedido[0]?.NOMECOMPRADOR
      })
    
      setMarcaSelecionada({value: dadosVisualizarPedido[0]?.NOFANTASIA, label: dadosVisualizarPedido[0]?.NOFANTASIA})
      setFornecedorSelecionado({
        value: dadosVisualizarPedido[0]?.IDFORNECEDOR, 
        label: `${dadosVisualizarPedido[0]?.NOFANTASIAFORNECEDOR} / / ${dadosVisualizarPedido[0]?.CNPJFORN} / / ${dadosVisualizarPedido[0]?.NOFORNECEDOR}`
      })
      
      setObsFornecedor(dadosVisualizarPedido[0]?.OBSPEDIDO)
      setObsInterna(dadosVisualizarPedido[0]?.OBSPEDIDO2)
      setVendedor(dadosVisualizarPedido[0]?.NOREPRESETANTE || dadosVisualizarPedido[0]?.NOVENDEDOR)
      setTipoPedidoSelecionado(dadosVisualizarPedido[0]?.MODPEDIDO)
      setEmailVendedor(dadosVisualizarPedido[0]?.EEMAIL || dadosVisualizarPedido[0]?.EEMAILVENDEDOR || dadosVisualizarPedido[0]?.EMAILFORN || '') 
      setCondicoesPagamentosSelecionado({value: dadosVisualizarPedido[0]?.IDCONDICAOPAGAMENTO, label: dadosVisualizarPedido[0]?.DSCONDICAOPAG})
      setEnviarSelecionado({
        value: dadosVisualizarPedido[0]?.TPARQUIVO, 
        label: dadosVisualizarPedido[0]?.TPARQUIVO == 'NE' ? 'NÃO ENVIAR' : dadosVisualizarPedido[0]?.TPARQUIVO == 'ET' ? 'ETIQUETA' : 'ARQUIVO'
      })
      setTipoPedidoSelecionado({value: dadosVisualizarPedido[0]?.TPPEDIDOPADRAO || dadosVisualizarPedido[0]?.MODPEDIDO, label: dadosVisualizarPedido[0]?.MODPEDIDO})
      setTransportadoraSelecionada({value: dadosVisualizarPedido[0]?.IDTRANSPORTADORA, label: dadosVisualizarPedido[0]?.NOMETRANSPORTADORA})
      setFiscalSelecionado({
        value: dadosVisualizarPedido[0]?.TPFISCAL,
        label: dadosVisualizarPedido[0]?.TPFISCAL == 'S' ? 'Simples Nacional' : dadosVisualizarPedido[0]?.TPFISCAL == 'N' ? 'Lucro Presumido' : 'Lucro Real'
      })
      setFreteSelecionado({
        value: dadosVisualizarPedido[0]?.TPFRETE,
        label: dadosVisualizarPedido[0]?.TPFRETE == 'PAGO' ? 'PAGO - CIF' : 'A PAGAR - FOB'
      })
      setDesconto1(toFloat(dadosVisualizarPedido[0]?.DESCPERC01).toFixed(2))
      setDesconto2(toFloat(dadosVisualizarPedido[0]?.DESCPERC02).toFixed(2))
      setDesconto3(toFloat(dadosVisualizarPedido[0]?.DESCPERC03).toFixed(2))
      setTotalLiq(toFloat(dadosVisualizarPedido[0]?.VRTOTALLIQUIDO))
      setIdResumoPedido(dadosVisualizarPedido[0]?.IDPEDIDIO)
    }
  }, [dadosVisualizarPedido])

  const calcularTotal = (field) => {
    return dadosDetalhe.reduce((total, item) => total + toFloat(item[field]), 0);
  };

  const calcularTotalDetalhe = () => {
    const total = calcularTotal('VRTOTALDETALHEPEDIDO');
    return formatMoeda(total);
  }
  
  const calcularTotalQuantidade = () => {
    const total = calcularTotal('QTDTOTAL');
    return total;
  }

  const handleClickPedido = () => {
    setCurrentPage(prevPage => prevPage + 1);
    refetchListaProdutoPedidos()
    setTabelaVisivel(true)
  }

  const handleClickCadastroPedido = () => {
    setCurrentPage(prevPage => prevPage + 1);
    refetchListaCadastroProdutoPedidos()
    setTabelaCadastroProduto(true)
  }
  const handleClickCadstroPedidoPDF = () => {
    setCurrentPage(prevPage => prevPage + 1);
    refetchListaPedidos()
    setModalPedidoNota(true)
  }

  const handleClickDetalhePedido = () => {
    refetchListaDetalhePedidos()
    handleFinalizarCadastro(dadosVisualizarPedido[0]?.IDRESUMOPEDIDIO)
    
  }


  const handleClickPedidoTXT = async () => {    
    Swal.fire({
      title: "Gerando arquivo...",
      html: "Aguarde um momento...",
      showCancelButton: false,
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    try {
    
      const remessaData = await refetchListaCadastroProdutoPedidos();
      await gerarArquivoTxt(remessaData);
      setArquivoGerado(true);
      Swal.close();
    } catch (error) {
      Swal.fire("Erro", "Erro ao gerar arquivo", "error");
    }
  };

  const gerarArquivoTxt = (data) => {
    let textoFinalTXT = "";
    textoFinalTXT = "DESCRIÇÃO;COR;TAMANHO;CÓDIGO BARRAS;QUANTIDADE;PREÇO VENDA;PEDIDO;ESTILO;LOCAL;";

    const txtData = data.map(item => JSON.stringify(item)).join('\n');
    const blob = new Blob([txtData, textoFinalTXT], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dadosVisualizarPedido[0]?.IDPEDIDO}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFinalizarCadastro = async (IDRESUMOPEDIDIO) => {
    if (dadosDetalhePedido!= 0) {
      Swal.fire({
        icon: "warning",
        title: `Existe Itens do Pedido: ${IDRESUMOPEDIDIO} que não foram Transformados em Produtos`,
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }

    try {

      Swal.fire({
        title: 'Certeza que Deseja Finalizar o Pedido?',
        text: 'Você não poderá reverter esta ação!',
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'OK',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-danger',
          loader: 'custom-loader'
        },
        buttonsStyling: false
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const putData = {  
              IDRESUMOPEDIDIO: parseInt(IDRESUMOPEDIDIO),
      
            }
            const response = await put('/cadastrar_produtos/:id', putData)
            
            const textDados = JSON.stringify(putData)
            let textoFuncao = 'FINALIZAR CADASTRO DE TODOS PRODUTOS';
          
            const postData = {  
              IDFUNCIONARIO: usuarioLogado.id,
              PATHFUNCAO:  textoFuncao,
              DADOS: textDados,
              IP: ipUsuario
            }
    
            const responsePost = await post('/log-web', postData)
        
            Swal.fire({
              title: 'Sucesso', 
              text: 'Cadastrado com Sucesso', 
              icon: 'success'
            })
  
            return responsePost;
          } catch (error) {
            
            let textoFuncao = 'ERRO AO CADASTRAR PRODUTO';
          
            const postData = {  
              IDFUNCIONARIO: usuarioLogado.id,
              PATHFUNCAO:  textoFuncao,
              DADOS: 'ERRO AO CADASTAR PRODUTO',
              IP: ipUsuario
            }
  
            const responsePost = await post('/log-web', postData)
          }
        }
      })
    } catch (error) {

      Swal.fire({
        icon: "warning",
        title: `Não Produtos do Pedido: ${IDRESUMOPEDIDIO} para serem cadastrados`,
        showConfirmButton: false,
        timer: 3000
      });
    }
  }

  const handleIncluir = () => {
    setModalIncluirProdutoPedido(true);
  }

  const optionsFiscal = [
    { value: 'S', label: 'Simples Nacional' },
    { value: 'N', label: 'Lucro Presumido' },
    { value: 'R', label: 'Lucro Real' },
  ]

  const optionsEnviar = [
    { value: 'NE', label: 'NÃO ENVIAR' },
    { value: 'ET', label: 'ETIQUETA' },
    { value: 'AR', label: 'ARQUIVO' },
  ]

  const optionsTipoPedido = [
    {value: 'VESTUARIO', label: 'VESTUARIO'},
    {value: 'CALCADOS', label: 'CALÇADOS'},
    {value: 'ARTIGOS', label: 'ARTIGOS'},
    {value: 'ACESSORIOS', label: 'ACESSÓRIOS'},
  ]

  const optionsTipoFrete = [
  { value: 'PAGO', label: 'PAGO - CIF' },
  { value: 'APAGAR', label: 'A PAGAR - FOB' },
  ]
 
  
  return (

    <Fragment>
      <ResultadoResumo
        cardVendas={true}
        valorVendas={formatMoeda(toFloat(dadosVisualizarPedido[0]?.VRTOTALBRUTO))}
        nomeVendas="Valor Bruto Pedido"
        IconVendas={MdOutlinePayment}
        iconSize={100}
        iconColor={"#fff"}

        cardTicketMedio={true}
        valorTicketMedio={formatMoeda(totalLiq)}
        nomeTicketMedio="Valor Líquido Pedido"
        IconTicketMedio={MdOutlinePayment}

        cardCliente={true}
        numeroCliente={toFloat(dadosVisualizarPedido[0]?.QTDTOTPRODUTOS)}
        nomeCliente="QTD Produtos"
        IconNumeroCliente={MdOutlinePayment}
      />

      <ActionMainNovoPedido
        lBinkComponentAnterior={["Home"]}
        linkComponent={["Novo Pedido"]}
        //title={`Pedido Nº: ${dadosVisualizarPedido[0]?.IDPEDIDO}`}
        subTitle={tituloSubheader}

        InputCheckBoxPedido={InputFieldCheckBox}
        labelCheckBoxPedido={"Pedido Por Intermediário"}
        checkedCheckBoxPedido={checked}
        valueCheckBoxPedido={checked}
        onChangeCheckBoxPedido={(e) => setChecked(e.target.checked)}
        

        InputSelectFornecedorComponent={InputSelectActionPedido}
        labelSelectFornecedor={"Lista Fornecedores"}
        optionsFornecedores={[
          { value: '', label: 'selecione' },
          ...dadosFornecedores.map(item => ({
            value: item.IDFORNECEDOR,
            label: `${item.NOFANTASIA} // ${item.NUCNPJ} // ${item.NORAZAOSOCIAL}`

          }))
        ]}
        valueSelectFornecedor={fornecedorSelecionado}
        onChangeSelectFornecedor={(e) => setFornecedorSelecionado(e)}

        InputFieldDTInicioComponent={InputFieldPedido}
        labelInputDTInicio={"Data Pedido"}
        valueInputFieldDTInicio={dataPesquisaInicio}
        onChangeInputFieldDTInicio={(e) => setDataPesquisaInicio(e.target.value)}
       

        InputFieldDTFimComponent={InputFieldPedido}
        labelInputDTFim={"Data Entrega"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={(e) => setDataPesquisaFim(e.target.value)}
        
        InputSelectFiscalComponent={InputSelectActionPedido}
        labelSelectFiscal={"Tipo Fiscal"}
        optionsFiscal={optionsFiscal}
        valueSelectFiscal={fiscalSelecionado}
        onChangeSelectFiscal={(e) => setFiscalSelecionado(e.value)}

        InputSelectEnviarComponent={InputSelectActionPedido}
        labelSelectEnviar={"Enviar"}
        optionsSelectEnviar={optionsEnviar}
        valueSelectEnviar={enviarSelecionado}
        onChangeSelectEnviar={(e) => setEnviarSelecionado(e.value)}

        InputSelectCompradorComponent={InputSelectActionPedido}
        labelSelectComprador={"Comprador"}
        optionsCompradores={dadosComprador.map((item) => {
          return {
            value: item.IDFUNCIONARIO,
            label: item.NOFUNCIONARIO
          }
        })}
        valueSelectComprador={compradorSelecionado}
        onChangeSelectComprador  ={(e) => setCompradorSelecionado(e.value)}
       

        InputSelectMarcasComponent={InputSelectActionPedido}
        labelSelectMarcas={"Marca"}
        optionsMarcas={dadosMarcas.map((item) => {
          return {
            value: item.IDGRUPOEMPRESARIAL,
            label: item.DSGRUPOEMPRESARIAL
          }
        })}
        valueSelectMarca={marcaSelecionada}
        onChangeSelectMarcas={(e) => setMarcaSelecionada(e)}
        
        InputSelectCondicoesPagamentos={InputSelectActionPedido}
        labelSelectCondicoesPagamentos={"Condições de Pagamento"}
        optionsCondicoesPagamentos={dadosPagamentos.map((item) => {
          return {
            value: item.IDCONDICAOPAGAMENTO,
            label: item.DSCONDICAOPAG
          } 
        })}
        valueSelectCondicoesPagamentos={condicoesPagamentosSelecionado}
        onChangeSelectCondicoesPagamentos={(e) => setCondicoesPagamentosSelecionado(e.value)}
        
        InputFieldObsFornecedor={InputFieldPedido}
        labelInputFieldObsFornecedor={"Observação do Fornecedor - Max. 450 caracteres"}
        valueInputFieldObsFornecedor={obsFornecedor}
        onChangeInputFieldObsFornecedor={(e) => setObsFornecedor(e.target.value)}
      

        InputFieldObsInterna={InputFieldPedido}
        labelInputFieldObsInterna={"Observação Interna - Max. 450 caracteres"}
        valueInputFieldObsInterna={obsInterna}
        onChangeInputFieldObsInternas={(e) => setObsInterna(e.target.value)}
       
        InputSelectTipoPedido={InputSelectActionPedido}
        labelSelectTipoPedido={"Tipo de Pedido"}
        optionsTipoPedido={optionsTipoPedido}
        valueSelectTipoPedido={tipoPedidoSelecionado}
        onChangeSelectTipoPedido={(e) => setTipoPedidoSelecionado(e.value)}

        InputFieldVendedor={InputFieldPedido}
        labelInputFieldVendedor={"Vendedor"}
        valueInputFieldVendedor={vendedor}
        onChangeInputFieldVendedor={(e) => setVendedor(e.target.value)}

        InputFieldEmailVendedor={InputFieldPedido}
        labelInputFieldEmailVendedor={"Email do Vendedor"}
        valueInputFieldEmailVendedor={emailVendedor}
        onChangeInputFieldEmailVendedor={(e) => setEmailVendedor(e.target.value)}

        InputFieldDescontoComponent1={InputFieldPedido}
        labelInputFieldDesconto1={"Desconto I(%)"}
        valueInputFieldDesconto1={desconto1}
        onChangeInputFieldDesconto1={(e) => setDesconto1(e.target.value)}
        // readOnlyDesconto1={true}

        InputFieldDescontoComponent2={InputFieldPedido}
        labelInputFieldDesconto2={"Desconto II(%)"}
        valueInputFieldDesconto2={desconto2}
        onChangeInputFieldDesconto2={(e) => setDesconto2(e.target.value)}
        // readOnlyDesconto2={true}

        InputFieldDescontoComponent3={InputFieldPedido}
        labelInputFieldDesconto3={"Desconto III(%)"}
        valueInputFieldDesconto3={desconto3}
        onChangeInputFieldDesconto3={(e) => setDesconto3(e.target.value)}
        // readOnlyDesconto3={true}

        InputFieldTotalLiq={InputFieldPedido}
        labelInputFieldTotalLiq={"Total Liquido"}
        valueInputFieldTotalLiq={formatMoeda(totalLiq)}
        onChangeInputFieldTotalLiq={(e) => setTotalLiq(e.target.value)}
        readOnlyTotalLiq={true}

        InputFieldComissao={InputFieldPedido}
        labelInputFieldComissao={"Comissão (%)"}
        valueInputFieldComissao={comissao}
        onChangeInputFieldComissao={(e) => setComissao(e.target.value)}
        // readOnlyComissao={true}

        InputTransportadora={InputFieldPedido}
        labelTransportadora={"Transportadora"}
        valueTransportadora={transportadoraSelecionada}
        onChangeTransportadora={(e) => setTransportadoraSelecionada(e.value)}
        readOnlyTransportadora={true}

        InputFreteComponent={InputFieldPedido}
        labelFrete={"Tipo Frete"}
        valueFrete={freteSelecionado}
        onChangeFrete={(e) => setFreteSelecionado(e.value)}
        readOnlyFrete={true}
       
        InputSelectTransportadora={InputSelectActionPedido}
        labelSelectTransportadora={"Transportadora"}
        optionsSelectTransportadora={dadosTransportador.map((item) => {
          return {
            value: item.IDTRANSPORTADORA,
            label: `${item.NUCNPJ} - ${item.NOFANTASIA}`
          }
        })}
        valueSelectTransportadora={transportadoraSelecionada}
        onChangeSelectTransportadora={(e) => setTransportadoraSelecionada(e.value)}

        InputSelectFreteComponent={InputSelectActionPedido}
        labelSelectFrete={"Tipo Frete"}
        optionsFrete={optionsTipoFrete}
        valueSelectFrete={freteSelecionado}
        onChangeSelectFrete={(e) => setFreteSelecionado(e.value)}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Incluir Itens"}
        onButtonClickSearch={handleIncluir}
        corSearch={"primary"}
        IconSearch={MdMenu}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Salvar Cabeçalho Pedido"}
        onButtonClickCadastro
        corCadastro={"info"}
        IconCadastro={MdOutlineCheck}

        ButtonTypeCancelar={ButtonType}
        linkCancelar={"Fechar Pedido"}
        onButtonClickCancelar={""}
        corCancelar={"danger"}
        IconCancelar={MdOutlineVisibility}


        ButtonTypePedido={ButtonType}
        linkPedido={"Novo Pedido"}
        onButtonClickPedido
        corPedido={"success"}
        IconPedido={MdOutlinePictureAsPdf}

        ButtonTypeTXT={ButtonType}
        linkTXT={"Clonar Cabeçalho Pedido"}
        onButtonClickTXT
        corTXT={"warning"}
        IconTXT={GrDocumentTxt}
      />
         
      <div className="d-flex panel-tag">
        {botoesVisiveis.incluir && (
          
          <ButtonType 
            textButton={"Incluir Itens"}
            onClickButtonType={handleIncluir}
            cor={"primary"}
            Icon={MdMenu}
          />
        )}

        {botoesVisiveis.salvar && (

          <ButtonType 
            textButton={"Salvar Cabeçalho Pedido"}
            onClickButtonType
            cor={"info"}
            Icon={FaRegSave}
          />
        )}
        {botoesVisiveis.fechar && (

          <ButtonType 
            textButton={"Fechar Pedido"}
            onClickButtonType
            cor={"danger"}
            Icon={AiOutlineMenuUnfold}
          />
        )}

        {botoesVisiveis.novoPedido && (
          <ButtonType 
            textButton={"Novo Pedido"}
            onClickButtonType
            cor={"success"}
            Icon={AiOutlineMenuUnfold}
          />
        )}
      
        {botoesVisiveis.clonar && (

          <ButtonType 
            textButton={"Clonar Cabeçalho Pedido"}
            onClickButtonType
            cor={"warning"}
            Icon={AiOutlineMenuUnfold}
          />
        )}
        {botoesVisiveis.clonarProdutoPedido && (
          <ButtonType 
            textButton={"Clonar Pedido"}
            onClickButtonType
            cor={"secondary"}
            Icon={AiOutlineMenuUnfold}
          />
        )}
      </div>
    
      <ActionIncluirProdutoPedidoModal
        show={modalIncluirProdutoPedido}
        handleClose={() => setModalIncluirProdutoPedido(false)}
        usuarioLogado={usuarioLogado}
        // optionsModulos={optionsModulos}
        fornecedorSelecionado={fornecedorSelecionado}
        tipoPedidoSelecionado={tipoPedidoSelecionado}
        marcaSelecionada={marcaSelecionada}
        idResumoPedido={idResumoPedido}
      />
      <ActionListaPedidos 
        dadosDetalhePedido={dadosDetalhePedido}
        dadosVisualizarPedido={dadosVisualizarPedido}
        setDadosDetalheProdutoPedido={setDadosDetalheProdutoPedido}
        setModalIncluirProdutoPedido={setModalIncluirProdutoPedido}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
      /> 
        
    </Fragment>
  )
}
// 521 e 644