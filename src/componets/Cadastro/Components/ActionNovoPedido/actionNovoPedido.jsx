import { Fragment, useEffect, useState } from "react"
import { ActionMainEditarNovoPedido } from "../../../Actions/ActionMainEditarNovoPedido"
import { ButtonType } from "../../../Buttons/ButtonType";
import { useQuery } from "react-query";
import { InputFieldAction } from "../../../Buttons/InputAction";
import { MdMenu, MdOutlineCheck, MdOutlinePayment, MdOutlinePictureAsPdf, MdOutlineVisibility } from "react-icons/md";
import { ResultadoResumo } from "../../../ResultadoResumo/ResultadoResumo";
import { ActionListaNovoPedido } from "./actionListaNovoPedido";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { GrDocumentTxt } from "react-icons/gr";
import { get } from "../../../../api/funcRequest";
import { ActionListaProdutosParaCadastro } from "./actionListaProdutosParaCadastro";
import { toFloat } from "../../../../utils/toFloat";
import { ActionPDFPedido } from "./ActionPDF/actionPDFPedido";
import Swal from "sweetalert2";
import { ActionMainNovoPedido } from "../../../Actions/ActionMainNovoPedido";


export const ActionNovoPedido = ({dadosVisualizarPedido, dadosDetalhePedido}) => {
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('')
  const [dataPesquisaFim, setDataPesquisaFim] = useState('')
  const [tabelaVisivel, setTabelaVisivel] = useState(true);
  const [tabelaCadastroProduto, setTabelaCadastroProduto] = useState(true);
  const [marcaSelecionada, setMarcaSelecionada] = useState('')
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState('')
  const [compradorSelecionado, setCompradorSelecionado] = useState('')
  const [fiscalSelecionado, setFiscalSelecionado] = useState('')
  const [enviarSelecionado, setEnviarSelecionado] = useState('')
  const [condicoesPagamentosSelecionado, setCondicoesPagamentosSelecionado] = useState('')
  const [obsFornecedor, setObsFornecedor] = useState('')
  const [obsInterna, setObsInterna] = useState('')
  const [tipoPedidoSelecionado, setTipoPedidoSelecionado] = useState('')
  const [vendedor, setVendedor] = useState('')
  const [emailVendedor, setEmailVendedor] = useState('')
  const [desconto1, setDesconto1] = useState('')
  const [desconto2, setDesconto2] = useState('')
  const [desconto3, setDesconto3] = useState('')
  const [totalLiq, setTotalLiq] = useState('')
  const [comissao, setComissao] = useState('')
  const [transportadoraSelecionada, setTransportadoraSelecionada] = useState('')
  const [freteSelecionado, setFreteSelecionado] = useState('')
  const [modalPedidoNota, setModalPedidoNota] = useState(false);
  const [modalPedidoNotaSemPreco, setModalPedidoNotaSemPreco] = useState(false);
  const [arquivoGerado, setArquivoGerado] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);


  useEffect(() => {
    if(dadosVisualizarPedido && dadosVisualizarPedido.length > 0) {
      
      setDataPesquisaInicio(dadosVisualizarPedido[0].DTPEDIDOFORMATADA)
      setDataPesquisaFim(dadosVisualizarPedido[0].DTPREVENTREGAFORMATADA)
      setCompradorSelecionado(dadosVisualizarPedido[0].NOMECOMPRADOR)
      setMarcaSelecionada(dadosVisualizarPedido[0].NOFANTASIA)
      setFornecedorSelecionado(dadosVisualizarPedido[0].NOFANTASIAFORNECEDOR)
      setFiscalSelecionado(dadosVisualizarPedido[0].TPFISCAL == 'S' ? 'Simples Nacional' : dadosVisualizarPedido[0].TPFISCAL == 'N' ? 'Lucro Presumido' : 'Lucro Real')
      setEnviarSelecionado(dadosVisualizarPedido[0].TPARQUIVO == 'NE' ? 'NÃO ENVIAR' : dadosVisualizarPedido[0].TPARQUIVO == 'ET' ? 'ETIQUETA' : 'ARQUIVO')
      setCondicoesPagamentosSelecionado(dadosVisualizarPedido[0].DSCONDICAOPAG)
      setObsFornecedor(dadosVisualizarPedido[0].OBSPEDIDO)
      setObsInterna(dadosVisualizarPedido[0].OBSPEDIDO2)
      setTipoPedidoSelecionado(dadosVisualizarPedido[0].MODPEDIDO)
      setVendedor(dadosVisualizarPedido[0].NOVENDEDOR)
      setEmailVendedor(dadosVisualizarPedido[0].EEMAILVENDEDOR)
      setDesconto1(dadosVisualizarPedido[0].DESCPERC01)
      setDesconto2(dadosVisualizarPedido[0].DESCPERC02)
      setDesconto3(dadosVisualizarPedido[0].DESCPERC03)
      setTotalLiq(dadosVisualizarPedido[0].VRTOTALLIQUIDO)
      setComissao(dadosVisualizarPedido[0].PERCCOMISSAO)
      setTransportadoraSelecionada(dadosVisualizarPedido[0].NOMETRANSPORTADORA)
      setFreteSelecionado(dadosVisualizarPedido[0].TPFRETE == 'PAGO' ? 'PAGO - CIF' : 'A PAGAR - FOB')

    }
  }, [dadosVisualizarPedido])

  
  
  const { data: dadosDetalhe = [], error: errorMarcas, isLoading: isLoadingMarcas, refetch: refetchListaProdutoPedidos } = useQuery(
    'lista-detalhe-pedidos',
    async () => {
      const response = await get(`/lista-detalhe-pedidos?idPedido=${dadosVisualizarPedido[0]?.IDPEDIDO}`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000, enabled: false }
  );

  const { data: dadosDetalhesPedidos = [], error: errorDetalhePedido, isLoading: isLoadingDetalhePedido, refetch: refetchListaDetalhePedidos } = useQuery(
    'lista-detalhe-pedidos',
    async () => {
      const response = await get(`/lista-detalhe-pedidos?idPedido=${dadosVisualizarPedido[0]?.IDPEDIDO}&stTransformado=False`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000, enabled: false }
  );

  const { data: dadosPedido = [], error: errorPedido, isLoading: isLoadingPedido, refetch: refetchListaPedidos } = useQuery(
    'lista-pedidos',
    async () => {
      const response = await get(`/lista-pedidos?idPedido=${dadosVisualizarPedido[0]?.IDPEDIDO}`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000, enabled: false }
  );

  const { data: dadosProdutosPedidos = [], error: errorProdutosPedido, isLoading: isLoadingProdutosPedidos, refetch: refetchListaCadastroProdutoPedidos } = useQuery(
    'cadastrar-produto-Pedido',
    async () => {
      const response = await get(`/cadastrar-produto-Pedido?idResumoPedido=${dadosVisualizarPedido[0]?.IDPEDIDO}`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000, enabled: false }
  );

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
    if (dadosDetalhesPedidos != 0) {
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


  return (

    <Fragment>
      <ResultadoResumo
        cardVendas={true}
        valorVendas={calcularTotalDetalhe()}
        nomeVendas="Valor Bruto Pedido"
        IconVendas={MdOutlinePayment}
        iconSize={100}
        iconColor={"#fff"}

        cardTicketMedio={true}
        valorTicketMedio={calcularTotalDetalhe()}
        nomeTicketMedio="Valor Líquido Pedido"
        IconTicketMedio={MdOutlinePayment}

        cardCliente={true}
        numeroCliente={calcularTotalQuantidade()}
        nomeCliente="QTD Produtos"
        IconNumeroCliente={MdOutlinePayment}
      />

      <ActionMainEditarNovoPedido
        lBinkComponentAnterior={["Home"]}
        linkComponent={["Novo Pedido"]}
        title="Novo Pedido"
        subTitle="Nome da Loja"


        InputFieldDTInicioComponent={InputFieldAction}
        labelInputDTInicio={"Data Pedido"}
        valueInputFieldDTInicio={dataPesquisaInicio}
        onChangeInputFieldDTInicio={(e) => setDataPesquisaInicio(e.target.value)}
        readOnlyDTInicio={true}

        InputFieldDTFimComponent={InputFieldAction}
        labelInputDTFim={"Data Entrega"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={(e) => setDataPesquisaFim(e.target.value)}
        readOnlyDTFim={true}


        InputFieldComprador={InputFieldAction}
        labelInputFieldComprador={"Comprador"}
        valueInputFieldComprador={compradorSelecionado}
        onChangeInputFieldComprador={(e) => setCompradorSelecionado(e.value)}
        readOnlyComprador={true}

        InputMarcasComponent={InputFieldAction}
        labelMarcas={"Marca"}
        valueMarca={marcaSelecionada}
        onChangeMarcas={(e) => setMarcaSelecionada(e.target.value)}
        readOnlyMarcas={true}

        InputFornecedorComponent={InputFieldAction}
        labelFornecedor={"Lista Fornecedores"}
        valueFornecedor={fornecedorSelecionado}
        onChangeFornecedor={(e) => setFornecedorSelecionado(e.value)}
        readOnlyFornecedor={true}

        InputFiscalComponent={InputFieldAction}
        labelFiscal={"Fiscal"}
        valueFiscal={fiscalSelecionado}
        onChangeFiscal={(e) => setFiscalSelecionado(e.value)}
        readOnlyFiscal={true}

        InputEnviarComponent={InputFieldAction}
        labelEnviar={"Enviar"}
        valueEnviar={enviarSelecionado}
        onChangeEnviar={(e) => setEnviarSelecionado(e.value)}
        readOnlyEnviar={true}

        InputCondicoesPagamentos={InputFieldAction}
        labelCondicoesPagamentos={"Condições de Pagamento"}
        valueCondicoesPagamentos={condicoesPagamentosSelecionado}
        onChangeCondicoesPagamentos={(e) => setCondicoesPagamentosSelecionado(e.value)}
        readOnlyCondicoesPagamentos={true}

        InputFieldObsFornecedor={InputFieldAction}
        labelInputFieldObsFornecedor={"Observação  Fornecedor "}
        valueInputFieldObsFornecedor={obsFornecedor}
        onChangeInputFieldObsFornecedor={(e) => setObsFornecedor(e.target.value)}
        readOnlyObsFornecedor={true}

        InputFieldObsInterna={InputFieldAction}
        labelInputFieldObsInterna={"Observação Interna "}
        valueInputFieldObsInterna={obsInterna}
        onChangeInputFieldObsInternas={(e) => setObsInterna(e.target.value)}
        readOnlyObsInterna={true}

        InputTipoPedido={InputFieldAction}
        labelTipoPedido={"Tipo de Pedido"}
        valueTipoPedido={tipoPedidoSelecionado}
        onChangeTipoPedido={(e) => setTipoPedidoSelecionado(e.value)}
        readOnlyTipoPedido={true}

        InputFieldVendedor={InputFieldAction}
        labelInputFieldVendedor={"Vendedor"}
        valueInputFieldVendedor={vendedor}
        onChangeInputFieldVendedor={(e) => setVendedor(e.target.value)}
        readOnlyVendedor={true}

        InputFieldEmailVendedor={InputFieldAction}
        labelInputFieldEmailVendedor={"Email do Vendedor"}
        valueInputFieldEmailVendedor={emailVendedor}
        onChangeInputFieldEmailVendedor={(e) => setEmailVendedor(e.target.value)}
        readOnlyEmailVendedor={true}

        InputFieldDescontoComponent1={InputFieldAction}
        labelInputFieldDesconto1={"Desconto I(%)"}
        valueInputFieldDesconto1={desconto1}
        onChangeInputFieldDesconto1={(e) => setDesconto1(e.target.value)}
        readOnlyDesconto1={true}

        InputFieldDescontoComponent2={InputFieldAction}
        labelInputFieldDesconto2={"Desconto II(%)"}
        valueInputFieldDesconto2={desconto2}
        onChangeInputFieldDesconto2={(e) => setDesconto2(e.target.value)}
        readOnlyDesconto2={true}

        InputFieldDescontoComponent3={InputFieldAction}
        labelInputFieldDesconto3={"Desconto III(%)"}
        valueInputFieldDesconto3={desconto3}
        onChangeInputFieldDesconto3={(e) => setDesconto3(e.target.value)}
        readOnlyDesconto3={true}

        InputFieldTotalLiq={InputFieldAction}
        labelInputFieldTotalLiq={"Total Liquido"}
        valueInputFieldTotalLiq={formatMoeda(totalLiq)}
        onChangeInputFieldTotalLiq={(e) => setTotalLiq(e.target.value)}
        readOnlyTotalLiq={true}

        InputFieldComissao={InputFieldAction}
        labelInputFieldComissao={"Comissão (%)"}
        valueInputFieldComissao={comissao}
        onChangeInputFieldComissao={(e) => setComissao(e.target.value)}
        readOnlyComissao={true}

        InputTransportadora={InputFieldAction}
        labelTransportadora={"Transportadora"}
        valueTransportadora={transportadoraSelecionada}
        onChangeTransportadora={(e) => setTransportadoraSelecionada(e.value)}
        readOnlyTransportadora={true}

        InputFreteComponent={InputFieldAction}
        labelFrete={"Tipo Frete"}
        valueFrete={freteSelecionado}
        onChangeFrete={(e) => setFreteSelecionado(e.value)}
        readOnlyFrete={true}
       

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Produtos do Pedido"}
        onButtonClickSearch={() => handleClickPedido()}
        corSearch={"primary"}
        IconSearch={MdMenu}

        ButtonTypeCancelar={ButtonType}
        linkCancelar={"Prévia Cadastro Produtos"}
        onButtonClickCancelar={""}
        corCancelar={"success"}
        IconCancelar={MdOutlineVisibility}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Finalizar Cadastro dos Produtos"}
        onButtonClickCadastro={() => handleClickDetalhePedido()}
        corCadastro={"danger"}
        IconCadastro={MdOutlineCheck}

        ButtonTypePedido={ButtonType}
        linkPedido={"Pedido de Compra PDF"}
        onButtonClickPedido={() => handleClickCadstroPedidoPDF()}
        corPedido={"info"}
        IconPedido={MdOutlinePictureAsPdf}

        ButtonTypeTXT={ButtonType}
        linkTXT={"Pedido de Compra TXT"}
        onButtonClickTXT={() => handleClickPedidoTXT()}
        corTXT={"warning"}
        IconTXT={GrDocumentTxt}
      />



      <div id="resultadoListaPdido"
        style={{ backgroundColor: "#fff", padding: "15px" }}
      >

        <ActionListaNovoPedido dadosVisualizarPedido={dadosVisualizarPedido} dadosDetalhe={dadosDetalhe} />

      </div>

      {tabelaCadastroProduto && (
        <ActionListaProdutosParaCadastro dadosProdutosPedidos={dadosProdutosPedidos}/>
      )}

      
      <ActionPDFPedido 
        show={modalPedidoNota}
        handleClose={() => setModalPedidoNota(false)}
        dadosPedido={dadosPedido}
        dadosDetalhesPedidos={dadosDetalhesPedidos}
      />
      
      {/* <ActionPDFPedidoSemPreco
        show={modalPedidoNotaSemPreco}
        handleClose={() => setModalPedidoNotaSemPreco(false)}
        dadosPedidoSemPreco={dadosPedidoSemPreco}
        dadosDetalhePedido={dadosDetalhePedido}
      /> */}
    </Fragment>
  )
}