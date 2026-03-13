import { Fragment, useEffect, useState, useRef } from "react"

import { ButtonType } from "../../../Buttons/ButtonType";
import { useQuery } from "react-query";
import { MdMenu, MdOutlineCheck, MdOutlinePayment, MdOutlinePictureAsPdf, MdOutlineVisibility } from "react-icons/md";
import { ResultadoResumo } from "../../../ResultadoResumo/ResultadoResumo";
import { ActionListaNovoPedidos } from "./actionListaNovoPedidos";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { GrDocumentTxt } from "react-icons/gr";
import { get } from "../../../../api/funcRequest";
// import { ActionListaProdutosParaCadastro } from "./actionListaProdutosParaCadastro";
import { toFloat } from "../../../../utils/toFloat";
// import { ActionPDFPedido } from "./ActionPDF/actionPDFPedido";
import Swal from "sweetalert2";
import { ActionMainNovoPedido } from "../../../Actions/ActionMainNovoPedido";
import { InputSelectActionPedido } from "../../../Inputs/InputSelectActionPedido";
import { InputFieldPedido } from "../../../Buttons/InputActionPedido";
import { ActionIncluirProdutoPedidoModal } from "./IncluirProdutoPedido/actionIncluirProdutoPedidoModal";
import { InputFieldCheckBox } from "../../../Inputs/InputChekBox";
import { useIncluirProutoPedido } from "./hooks/useIncluirProdutoPedido";
import { optionsTipoFrete, optionsTipoPedido, optionsEnviar, optionsFiscal } from "../../../../../parceiro.json"
import { Alert } from "../../../Inputs/alert";
import { set } from "date-fns";

export const ActionPesquisaNovoPedido = ({
  usuarioLogado,
  ID,
  dadosVisualizarPedido, 
  dadosDetalhePedido
}) => {
  
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
    disabledChecked, 
    setDisabledChecked,
    modalIncluirProdutoPedido,
    setModalIncluirProdutoPedido,
    onIncluirProdutoPedido,
    verificaDadosDoFornecedorSelecionado,
    pendenciasFornecedor,
    dadosFornecedores,
    dadosComprador,
    dadosMarcas,
    dadosPagamentos,
    dadosTransportador,
    dadosDetalhe, 
    dadosDetalhesPedidos,
    dadosProdutosPedidos,
    clonarCabecalho,
    handleIncluir
  } = useIncluirProutoPedido({ usuarioLogado, optionsModulos });

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

  
 const handleVerificar = async () => {
    const existe = await verificaDadosDoFornecedorSelecionado ();
    if (existe) {
        console.log('Fornecedor válido!');
    } else {
        console.log('Fornecedor não existe!');
    }
};

  useEffect(() => {
    if (fornecedorSelecionado?.value) {
      verificaDadosDoFornecedorSelecionado ();
    }
  }, [fornecedorSelecionado]);

  const handleClickClonarCabecalho = async () => {

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

      <ActionMainNovoPedido
        lBinkComponentAnterior={["Home"]}
        linkComponent={["Novo Pedido"]}
        title="Novo Pedido"
        subTitle="Nome da Loja"

        InputCheckBoxPedido={InputFieldCheckBox}
        labelCheckBoxPedido={"Pedido Por Intermediário"}
        checkedCheckBoxPedido={checked}
        valueCheckBoxPedido={checked}
        onChangeCheckBoxPedido={(e) => setChecked(e.target.checked)}
        disabledCheckBoxTipoPedido={disabledChecked}
        

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
        onChangeSelectFornecedor={(e) => {
          setFornecedorSelecionado(e)
          handleVerificar()
        }}

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

        Alerta={Alert}
        messageAlerta={pendenciasFornecedor}
        text
        indiceAlerta

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Incluir Itens"}
        onButtonClickSearch={handleIncluir}
        corSearch={"primary"}
        IconSearch={MdMenu}

        ButtonTypeCancelar={ButtonType}
        linkCancelar={"Fechar Pedido"}
        onButtonClickCancelar={""}
        corCancelar={"danger"}
        IconCancelar={MdOutlineVisibility}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Novo Pedido"}
        onButtonClickCadastro={() => handleClickDetalhePedido()}
        corCadastro={"success"}
        IconCadastro={MdOutlineCheck}

        ButtonTypePedido={ButtonType}
        linkPedido={"Clonar Peidido"}
        onButtonClickPedido={() => handleClickClonarCabecalho()}
        corPedido={"warning"}
        IconPedido={MdOutlinePictureAsPdf}

        // ButtonTypeTXT={ButtonType}
        // linkTXT={"Pedido de Compra TXT"}
        // onButtonClickTXT={() => handleClickPedidoTXT()}
        // corTXT={"warning"}
        // IconTXT={GrDocumentTxt}
      />

        {/* {console.log(pendenciasFornecedor, 'len')} */}

      <div id="resultadoListaPdido"
        style={{ backgroundColor: "#fff", padding: "15px" }}
      >

        {/* <ActionListaNovoPedidos dadosVisualizarPedido={dadosVisualizarPedido} dadosDetalhe={dadosDetalhe} /> */}

      </div>

      {/* {tabelaCadastroProduto && (
        <ActionListaProdutosParaCadastro dadosProdutosPedidos={dadosProdutosPedidos}/>
      )} */}

      
      {/* <ActionPDFPedido 
        show={modalPedidoNota}
        handleClose={() => setModalPedidoNota(false)}
        dadosPedido={dadosPedido}
        dadosDetalhesPedidos={dadosDetalhesPedidos}
      /> */}
      
      {/* <ActionPDFPedidoSemPreco
        show={modalPedidoNotaSemPreco}
        handleClose={() => setModalPedidoNotaSemPreco(false)}
        dadosPedidoSemPreco={dadosPedidoSemPreco}
        dadosDetalhePedido={dadosDetalhePedido}
      /> */}

      <ActionIncluirProdutoPedidoModal
        show={modalIncluirProdutoPedido}
        handleClose={() => setModalIncluirProdutoPedido(false)}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
        fornecedorSelecionado={fornecedorSelecionado}
        tipoPedidoSelecionado={tipoPedidoSelecionado}
        marcaSelecionada={marcaSelecionada}
        idResumoPedido={idResumoPedido}
      />

    </Fragment>
  )
}
// 521 e 644