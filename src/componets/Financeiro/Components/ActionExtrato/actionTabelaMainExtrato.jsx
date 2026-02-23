import { Fragment, useState } from "react";
import { DataTable } from 'primereact/datatable';
import { Accordion } from "react-bootstrap";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { ActionListaVendas } from "./actionListaVendas";
import { ActionListaTotalFaturas } from "./actionListaTotalFaturas";
import { ActionListaDespesas } from "./actionListaDespesa";
import { ActionListaAdiantamentos } from "./actionListaAdiantamentos";
import { ActionListaQuebra } from "./actionListaQuebra";
import { ActionListaTotalDeposito } from "./actionListaTotalDeposito";
import { ActionListaAjuste } from "./actionListaAjuste";

export const ActionTabelaMainExtrato = ({
  dadosVendas,
  dadosExtratoQuebra,
  dadosTotalDepositos,
  dadosTotalFaturas,
  dadosTotalDespesas,
  dadosTotalAdiantamentos,
  dadosAjusteExtrato,
  dadosExtratoLoja,

  saldoAnteriorVendas,
  saldoAnteriorDespesas,
}) => {
  const [tabelaVendas, setTabelaVendas] = useState(true);
  const [tabelaTotalFaturas, setTabelaTotalFaturas] = useState(true);
  const [tabelaDespesas, setTabelaDespesas] = useState(true);
  const [tabelaAdiantamentos, setTabelaAdiantamentos] = useState(true);
  const [tabelaQuebra, setTabelaQuebra] = useState(true);
  const [tabelaTotalDepositos, setTabelaTotalDepositos] = useState(true);
  const [tabelaAjuste, setTabelaAjuste] = useState(true);
  const [calcularSaldoVendas, setCalcularSaldoVendas] = useState();

  const dados = dadosExtratoLoja.map((item) => ({

    VRRECDINHEIRO: item.venda.VRRECDINHEIRO,
    DTHORAFECHAMENTOFORMATADA: item.venda.DTHORAFECHAMENTOFORMATADA,
    IDAJUSTEEXTRATO: item.ajusteextrato.IDAJUSTEEXTRATO,
    DTCADASTROFORMATADA: item.ajusteextrato.DTCADASTROFORMATADA,
    VRDEBITO: item.ajusteextrato.VRDEBITO,
    VRCREDITO: item.ajusteextrato.VRCREDITO,
    HISTORICO: item.ajusteextrato.HISTORICO,
    STCANCELADO: item.ajusteextrato.STCANCELADO,
    DTDESPESAFORMATADA: item.despesas.DTDESPESAFORMATADA,
    DSHISTORIO: item.despesas.DSHISTORIO,
    DSCATEGORIA: item.despesas.DSCATEGORIA,
    VRDESPESA: item.despesas.VRDESPESA,
    DSPAGOA: item.despesas.DSPAGOA,
    DTLANCAMENTOADIANTAMENTO: item.adiantamentos.DTLANCAMENTOADIANTAMENTO,
    NOFUNCIONARIO: item.adiantamentos.NOFUNCIONARIO,
    DSMOTIVO: item.adiantamentos.DSMOTIVO,
    VRVALORDESCONTO: item.adiantamentos.VRVALORDESCONTO,
    saldoAnterior: 0
  }));
  



  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column header="Dt. Lançamento" />
        <Column header="Histórico" />
        <Column header="Pago A" />
        <Column header="Despesa" />
        <Column header="Débito" />
        <Column header="Crédito" />
        <Column header="Saldo" />
        <Column header="Situação" />
      </Row>
    </ColumnGroup>
  );

  const adiantamentosGroup = (rowData) => (
    <Row>
      <Column field="DTLANCAMENTOADIANTAMENTO" body={<p>{rowData.DTLANCAMENTOADIANTAMENTO}</p>} />
      <Column body={<p style={{ margin: '0px' }}>Adiantamento de Salário</p>} />
      <Column body={<p style={{ margin: '0px' }}>{rowData.NOFUNCIONARIO}</p>} />
      <Column body={<p style={{ margin: '0px' }}>{rowData.DSMOTIVO}</p>} />
      <Column body={<p style={{ margin: '0px' }}>{rowData.VRVALORDESCONTO}</p>} />
      <Column body={<p style={{ margin: '0px' }}>0,00</p>} />
      <Column body={<p style={{ margin: '0px' }}>0,00</p>} />
      <Column body={<p style={{ margin: '0px' }}></p>} />
    </Row>
  );

  const vendasGroup = (rowData) => (
    <Row>
      <Column field="DTHORAFECHAMENTOFORMATADA" body={<p>{rowData.DTHORAFECHAMENTOFORMATADA}</p>} />
      <Column body={<p style={{ margin: '0px' }}>Mov. Dinheiro do Caixa {rowData.DTHORAFECHAMENTOFORMATADA}</p>} />
      <Column body={<p style={{ margin: '0px' }}>Vendas Dinheiro</p>} />
      <Column body={<p style={{ margin: '0px' }}></p>} />
      <Column body={<p style={{ margin: '0px' }}>0,00</p>} />
      <Column body={<p style={{ margin: '0px' }}>{rowData.VRRECDINHEIRO}</p>} />
      <Column body={<p style={{ margin: '0px' }}>saldoAnterior</p>} />
      <Column body={<p style={{ margin: '0px' }}></p>} />
    </Row>
  );

  const despesasGroup = (rowData) => (
    <Row>
      <Column field="DTDESPESAFORMATADA" body={<p>{rowData.DTDESPESAFORMATADA}</p>} />
      <Column body={<p style={{ margin: '0px' }}>{rowData.DSHISTORIO}</p>} />
      <Column body={<p style={{ margin: '0px' }}>{rowData.DSPAGOA}</p>} />
      <Column body={<p style={{ margin: '0px' }}>{rowData.DSCATEGORIA}</p>} />
      <Column body={<p style={{ margin: '0px' }}>{rowData.VRDESPESA}</p>} />
      <Column body={<p style={{ margin: '0px' }}>0,00</p>} />
      <Column body={<p style={{ margin: '0px' }}>saldoAnterior</p>} />
      <Column body={<p style={{ margin: '0px' }}></p>} />
    </Row>
  );

  const ajusteGroup = (rowData) => (
    <Row>
      <Column field="DTCADASTROFORMATADA" body={<p>{rowData.DTCADASTROFORMATADA}</p>} />
      <Column body={<p style={{ margin: '0px' }}>{rowData.HISTORICO}</p>} />
      <Column body={<p style={{ margin: '0px' }}>Ajuste de Extrato</p>} />
      <Column body={<p style={{ margin: '0px' }}></p>} />
      <Column body={<p style={{ margin: '0px' }}>{rowData.VRDEBITO}</p>} />
      <Column body={<p style={{ margin: '0px' }}>{rowData.VRCREDITO}</p>} />
      <Column body={<p style={{ margin: '0px' }}>saldoAnterior</p>} />
      <Column body={<p style={{ color: rowData.STCANCELADO === 'True' ? 'blue' : 'red', margin: '0px' }}>{rowData.STCANCELADO === 'False' ? 'Ativo' : 'Cancelado'}</p>} />
    </Row>
  );

  return (
    <Fragment>
      <div className="row">
        <Accordion defaultActiveKey="0" className="col-xl-12">
          <Accordion.Item eventKey="0" id="panel-1" className="panel">
            <header className="panel-hdr">
              <h2>Lista de Extrato do Dia</h2>
            </header>
            <Accordion.Body className="panel-container show">
              
     
                <Fragment>
                {tabelaVendas  && (
                  <ActionListaVendas dadosVendas={dadosVendas} />
                )}
                  {tabelaTotalFaturas && dadosTotalFaturas.length > 0 && (
               
                    <ActionListaTotalFaturas dadosTotalFaturas={dadosTotalFaturas} dadosVendas={dadosVendas}/>
                  )}
                  {tabelaDespesas && dadosTotalDespesas.length > 0 &&  (
                 
                    <ActionListaDespesas dadosTotalDespesas={dadosTotalDespesas} dadosVendas={dadosVendas} dadosTotalFaturas={dadosTotalFaturas}/>
                  )}
                  {tabelaAdiantamentos && dadosTotalAdiantamentos.length > 0 && (
                 
                    <ActionListaAdiantamentos dadosTotalAdiantamentos={dadosTotalAdiantamentos} dadosVendas={dadosVendas} dadosTotalFaturas={dadosTotalFaturas} dadosTotalDespesas={dadosTotalDespesas}/>
                  )}
                  {tabelaQuebra && dadosExtratoQuebra.length > 0 && (
                    
                    <ActionListaQuebra dadosExtratoQuebra={dadosExtratoQuebra} dadosVendas={dadosVendas} dadosTotalFaturas={dadosTotalFaturas} dadosTotalDespesas={dadosTotalDespesas} dadosTotalAdiantamentos={dadosTotalAdiantamentos}/>
                  )}
                  {tabelaTotalDepositos && dadosTotalDepositos.length > 0 && (
                    
                   <ActionListaTotalDeposito dadosTotalDepositos={dadosTotalDepositos} dadosVendas={dadosVendas} dadosTotalFaturas={dadosTotalFaturas} dadosTotalDespesas={dadosTotalDespesas} dadosTotalAdiantamentos={dadosTotalAdiantamentos} dadosExtratoQuebra={dadosExtratoQuebra}/>
                  )}
                  {tabelaAjuste && dadosAjusteExtrato.length > 0 && (
                    
                    <ActionListaAjuste dadosAjusteExtrato={dadosAjusteExtrato} dadosVendas={dadosVendas}/> 
                  )}
                </Fragment>

            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </Fragment>
  );
};