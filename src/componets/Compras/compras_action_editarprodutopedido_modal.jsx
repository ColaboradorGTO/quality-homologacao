import { Fragment } from "react"


export const ComprasActionEditarProdutoPedidoModal = () => {
  return (

    <Fragment>
      <div id="resultadoprodpedido"></div>

      <div className="form-group">
        <input type="hidden" name="IDDetPedidoCad" id="IDDetPedidoCad" value="0" />
        <input type="hidden" name="IDResPedidoEdit" id="IDResPedidoEdit" value="" />
        <div className="row">
          <div className="col-sm-12 col-xl-12">
            <label className="form-label" htmlFor="empresa">Pedido para a Marca</label>
            <div className="input-group">
              <input type="text" id="nomemarcapedido" name="nomemarcapedido" className="form-control input" value="" readOnly />
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="form-group">
        <div className="row">
          <div className="col-sm-6 col-xl-2">
            <label className="form-label" htmlFor="strep">Reposição</label>
            <div className="input-group">
              {/* <select className="select form-control" name="streposicao" id="streposicao" onChange="selecaoreposicao();"> */}
              <select className="select form-control" name="streposicao" id="streposicao" >
                <option value="False">NÃO</option>
                <option value="True">SIM</option>
              </select>
            </div>
          </div>
          <div className="col-sm-6 col-xl-6">
            <label className="form-label" htmlFor="noprod">Descrição Produto</label>
            <div className="input-group">
              {/* <input type="text" id="dsprodpedido" name="dsprodpedido" className="form-control" maxlength="50" value="" onblur="replaceSpecialChars();"> */}
              <input type="text" id="dsprodpedido" name="dsprodpedido" className="form-control" maxLength={50} value="" />
            </div>
          </div>
          <div className="col-sm-3 col-xl-2">
            <label className="form-label" htmlFor="vrhojecusto">Vr Custo</label>
            <div className="input-group">
              <input type="text" id="vrcustohoje" name="vrcustohoje" className="form-control" value="0" readOnly />
            </div>
          </div>
          <div className="col-sm-3 col-xl-2">
            <label className="form-label" htmlFor="vrhojevenda">Vr Venda</label>
            <div className="input-group">
              <input type="text" id="vrvendahoje" name="vrvendahoje" className="form-control" value="0" readOnly />
            </div>
          </div>
        </div>
      </div>
      <div className="form-group">
        <div className="row">
          <div className="col-sm-2 col-xl-2">
            <label className="form-label" htmlFor="qtdpedidoprod">Quantidade</label>
            <div className="input-group">
              {/* <input type="text" id="qtdprodpedido" name="qtdprodpedido" className="form-control" value="0" onblur="atualiza_valor_QtdUnit();"> */}
              <input type="text" id="qtdprodpedido" name="qtdprodpedido" className="form-control" value="0" />
            </div>
          </div>
          <div className="col-sm-2 col-xl-2">
            <label className="form-label" htmlFor="qtdcaixas">QTD Caixas</label>
            <div className="input-group">
              <input type="text" id="qtdcaixa" name="qtdcaixa" className="form-control" value="0" />
            </div>
          </div>
          <div className="col-sm-2 col-xl-2">
            <label className="form-label" htmlFor="txtrefer">Referência</label>
            <div className="input-group">
              <input type="text" id="refproduto" name="refproduto" className="form-control" value="" />
            </div>
          </div>
          <div className="col-sm-6 col-xl-6">
            <label className="form-label" htmlFor="nofab">Fabricante</label>
            <div className="input-group">
              <select className="select form-control" name="fabprod" id="fabprod">
                <option value=""> </option>

              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="form-group">
        <div className="row">
          <div className="col-sm-4 col-xl-4">
            <label className="form-label" htmlFor="tpunid">Unidade</label>
            <div className="input-group">
              <select className="select form-control" name="unidprod" id="unidprod">
                <option value=""> </option>

              </select>
            </div>
          </div>
          <div className="col-sm-4 col-xl-4">
            <label className="form-label" htmlFor="tpcor">Cor</label>
            <div className="input-group">
              <select className="select form-control" name="corprod" id="corprod">
                <option value=""> </option>

              </select>
            </div>
          </div>
          <div className="col-sm-4 col-xl-4">
            <label className="form-label" htmlFor="tptecido">Tipo de Tecido</label>
            <div className="input-group">
              <select className="select form-control" name="tptecidoprod" id="tptecidoprod">
                <option value=""> </option>

              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="form-group">
        <div className="row">
          <div className="col-sm-4 col-xl-4">
            <label className="form-label" htmlFor="tpcat">Categoria Grade</label>
            <div className="input-group">
              {/* <select className="select form-control" name="categoriaprod" id="categoriaprod" onChange="selecionagradepedido();"> */}
              <select className="select form-control" name="categoriaprod" id="categoriaprod" >
                <option value=""> </option>

              </select>
            </div>
          </div>
          <div className="col-sm-4 col-xl-4">
            <label className="form-label" htmlFor="tpestrut">Estrutura</label>
            <div className="input-group">
              {/* <select className="select form-control" name="estruturaprod" id="estruturaprod" onChange="selecionaestilogrupo();"> */}
              <select className="select form-control" name="estruturaprod" id="estruturaprod" >
                <option value=""> </option>

              </select>
            </div>
          </div>
          <div className="col-sm-4 col-xl-4">
            <label className="form-label" htmlFor="tpestilo">Estilos</label>
            <div className="input-group">
              <select className="select form-control" name="estiloprod" id="estiloprod" >
                <option value=""> </option>

              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="form-group">
        <div className="row">
          <div className="col-sm-3 col-xl-3">
            <label className="form-label" htmlFor="tpcatprod">Categorias</label>
            <div className="input-group">
              <select className="select form-control" name="prodcategorias" id="prodcategorias">
                <option value=""> </option>
              </select>
            </div>
          </div>
          <div className="col-sm-3 col-xl-3">
            <label className="form-label" htmlFor="locexp">Local Exposição</label>
            <div className="input-group">
              <select className="select form-control" name="localexp" id="localexp">
                <option value=""> </option>

              </select>
            </div>
          </div>
          <div className="col-sm-3 col-xl-3">
            <label className="form-label" htmlFor="ecommercest">E-commerce</label>
            <div className="input-group">
              <select className="select form-control" name="stecommerce" id="stecommerce">
                <option value="True">SIM</option>
                <option value="False">NÃO</option>
              </select>
            </div>
          </div>
          <div className="col-sm-3 col-xl-3">
            <label className="form-label" htmlFor="redesocialst">Rede Social</label>
            <div className="input-group">
              <select className="select form-control" name="stredesocial" id="stredesocial" >
                <option value="True">SIM</option>
                <option value="False">NÃO</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="form-group">
        <div className="row">
          <div className="col-sm-2 col-xl-2">
            <label className="form-label" htmlFor="vrbrutounit">Vr Bruto</label>
            <div className="input-group">
              {/* <input type="text" id="vrunitbruto" name="vrunitbruto" className="form-control" value="0" onblur="atualiza_valor_QtdUnit();" /> */}
              <input type="text" id="vrunitbruto" name="vrunitbruto" className="form-control" value="0" />
            </div>
          </div>
          <div className="col-sm-2 col-xl-2">
            <label className="form-label" htmlFor="percdescontoI">Desconto I (%)</label>
            <div className="input-group">
              {/* <input type="text" id="descprodI" name="descprodI" className="form-control" value="0" onblur="atualiza_valor_QtdUnit();"> */}
              <input type="text" id="descprodI" name="descprodI" className="form-control" value="0" />
            </div>
          </div>
          <div className="col-sm-2 col-xl-2">
            <label className="form-label" htmlFor="percdescontoII">Desconto II (%)</label>
            <div className="input-group">
              {/* <input type="text" id="descprodII" name="descprodII" className="form-control" value="0" onblur="atualiza_valor_QtdUnit();"> */}
              <input type="text" id="descprodII" name="descprodII" className="form-control" value="0" />
            </div>
          </div>
          <div className="col-sm-2 col-xl-2">
            <label className="form-label" htmlFor="percdescontoIII">Desconto III (%)</label>
            <div className="input-group">
              {/* <input type="text" id="descprodIII" name="descprodIII" className="form-control" value="0" onblur="atualiza_valor_QtdUnit();" /> */}
              <input type="text" id="descprodIII" name="descprodIII" className="form-control" value="0" />
            </div>
          </div>
          <div className="col-sm-2 col-xl-2">
            <label className="form-label" htmlFor="vrliqunit">Vr Liq</label>
            <div className="input-group">
              {/* <input type="text" id="vrunitliq" name="vrunitliq" className="form-control" value="0" onblur="atualiza_valor_QtdUnit();"> */}
              <input type="text" id="vrunitliq" name="vrunitliq" className="form-control" value="0" />
            </div>
          </div>
          <div className="col-sm-2 col-xl-2">
            <label className="form-label" htmlFor="vrsugunit">Vr Sugerido</label>
            <div className="input-group">
              <input type="text" id="vrunitsug" name="vrunitsug" className="form-control" value="0" />
              <input type="hidden" id="vrunitsugfixo" name="vrunitsugfixo" className="form-control" value="0" />
            </div>
          </div>
        </div>
      </div>
      <div className="form-group">
        <div className="row">
          <div className="col-sm-4 col-xl-4">
            <label className="form-label" htmlFor="vrtotalunit">Vr Total</label>
            <div className="input-group">
              <input type="text" id="vrunittotal" name="vrunittotal" className="form-control" value="0" readOnly />
            </div>
          </div>
          <div className="col-sm-8 col-xl-8">
            <label className="form-label" htmlFor="txtobs">Obs</label>
            <div className="input-group">
              <input type="text" id="obsprodunit" name="obsprodunit" className="form-control" value="" />
            </div>
          </div>
        </div>
      </div>
      <div className="form-group">
        <div className="row">
          <div className="col-sm-12 col-xl-12">
            <label className="form-label" htmlFor="vrtotalunit">QTD/TAMANHOS</label>
          </div>
        </div>
        <div className="row" id="resultadoqtdtamanhos">

        </div>
      </div>
      <div className="form-group">
        <div className="row">
          <div className="col-sm-12 col-xl-12">
            <div id="tudo"></div>
          </div>
        </div>
      </div>

    </Fragment>
  )
}

{/* 
  <script>
    $("#vrunitbruto").mask('#.##0,00', {reverse: true});
    $("#descprodI").mask('#.##0,00', {reverse: true});
    $("#descprodII").mask('#.##0,00', {reverse: true});
    $("#descprodIII").mask('#.##0,00', {reverse: true});
    $("#vrunitliq").mask('#.##0,00', {reverse: true});
    $("#vrunitsug").mask('#.##0,00', {reverse: true});
    $("#vrunittotal").mask('#.##0,00', {reverse: true});
    $("#vrcustohoje").mask('#.##0,00', {reverse: true});
    $("#vrvendahoje").mask('#.##0,00', {reverse: true});
  </script> */}
