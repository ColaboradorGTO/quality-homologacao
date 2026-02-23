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
import { toFloat } from "../../../../../utils/toFloat";
import { formatMoeda } from "../../../../../utils/formatMoeda";

export const ActionTabelaMainExtratoCopia = ({
  dadosExtratoLojaPeriodo,
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

  const dados = dadosExtratoLojaPeriodo.map((item) => {
    let saldoAnterior = 0
    const saldoAnteriorVendas = saldoAnterior + parseFloat(item.venda.VRRECDINHEIRO ?? 0)
    const saldoAnteriorFaturas = parseFloat(saldoAnteriorVendas) + parseFloat(item.totalFaturas[0].VRRECEBIDO ?? 0)
    const saldoAnteriorDespesas =  saldoAnteriorFaturas - parseFloat(item.despesas[0]?.VRDESPESA ?? 0)
    const saldoAnteriorAdiantamentos = saldoAnteriorDespesas - parseFloat(item.adiantamentos.VRVALORDESCONTO ?? 0)
   
    const calcularTotalDinheiroInformado = () => {
      if (item.quebracaixa[0].VRAJUSTDINHEIRO > 0) {
        return toFloat(item.quebracaixa[0].VRAJUSTDINHEIRO);
      } else {
        return toFloat(item.quebracaixa[0].VRRECDINHEIRO);
      }
    };

    const totalQuebraCaixa = calcularTotalDinheiroInformado() - toFloat(item.quebracaixa[0].VRFISICODINHEIRO ?? 0);
    const saldoAnteriorQuebra = saldoAnteriorAdiantamentos + totalQuebraCaixa ?? 0;
    const saldoAnteriorDepositos = saldoAnteriorQuebra - parseFloat(item.totalDepositos[0]?.VRDEPOSITO ?? 0);
    const calcularSaldoExtrato = () => {
      let saldoAnteriorExtrato = 0;
      if (item.ajusteextrato.STCANCELADO == 'False') {
        saldoAnteriorExtrato + parseFloat(item.ajusteextrato[0]?.VRCREDITO) 
        
      } else {
        saldoAnteriorExtrato - parseFloat(item.ajusteextrato[0]?.VRDEBITO)
      }      
    }

    const totalSaldoAnteriorExtrato = calcularSaldoExtrato();
    return {

      VRRECDINHEIRO: item.venda.VRRECDINHEIRO,
      DTHORAFECHAMENTOFORMATADA: item.venda.DTHORAFECHAMENTOFORMATADA,
    
      DTPROCESSAMENTOFORMATADA: item.totalFaturas[0]?.DTPROCESSAMENTOFORMATADA,
      VRRECEBIDO: item.totalFaturas[0]?.VRRECEBIDO,
      saldoAnteriorFaturas: toFloat(saldoAnteriorFaturas),

      IDAJUSTEEXTRATO: item.ajusteextrato[0]?.IDAJUSTEEXTRATO,
      DTCADASTROFORMATADA: item.ajusteextrato[0]?.DTCADASTROFORMATADA,
      VRDEBITO: item.ajusteextrato[0]?.VRDEBITO,
      VRCREDITO: item.ajusteextrato[0]?.VRCREDITO,
      HISTORICO: item.ajusteextrato[0]?.HISTORICO,
      STCANCELADO: item.ajusteextrato[0]?.STCANCELADO,
      totalSaldoAnteriorExtrato: totalSaldoAnteriorExtrato,
    
      DTDESPESAFORMATADA: item.despesas[0]?.DTDESPESAFORMATADA,
      DSHISTORIO: item.despesas[0]?.DSHISTORIO,
      DSCATEGORIA: item.despesas[0]?.DSCATEGORIA,
      VRDESPESA: item.despesas[0]?.VRDESPESA,
      DSPAGOA: item.despesas[0]?.DSPAGOA,
      saldoAnteriorDespesas: saldoAnteriorDespesas,
     
      DTLANCAMENTOADIANTAMENTO: item.adiantamentos.DTLANCAMENTOADIANTAMENTO,
      NOFUNCIONARIO: item.adiantamentos.NOFUNCIONARIO,
      DSMOTIVO: item.adiantamentos.DSMOTIVO,
      VRVALORDESCONTO: item.adiantamentos.VRVALORDESCONTO,
      saldoAnteriorAdiantamentos: saldoAnteriorAdiantamentos,

      IDMOV: item.quebracaixa[0].IDMOV,
      DTMOVCAIXA: item.quebracaixa[0].DTMOVCAIXA,
      FUNCIONARIOMOV: item.quebracaixa[0].FUNCIONARIOMOV,
      VRFISICODINHEIRO: item.quebracaixa[0].VRFISICODINHEIRO,
      VRRECDINHEIRO: item.quebracaixa[0].VRRECDINHEIRO,
      VRAJUSTDINHEIRO: item.quebracaixa[0].VRAJUSTDINHEIRO,
      totalQuebraCaixa: totalQuebraCaixa,
      saldoAnteriorQuebra: saldoAnteriorQuebra,

      IDDEPOSITOLOJA: item.totalDepositos[0]?.IDDEPOSITOLOJA,
      DTDEPOSITOFORMATADA: item.totalDepositos[0]?.DTDEPOSITOFORMATADA,
      DTMOVIMENTOCAIXAFORMATADA: item.totalDepositos[0]?.DTMOVIMENTOCAIXAFORMATADA,
      FUNCIONARIO: item.totalDepositos[0]?.FUNCIONARIO,
      VRDEPOSITO: item.totalDepositos[0]?.VRDEPOSITO,
      DSBANCO: item.totalDepositos[0]?.DSBANCO,
      STCANCELADO: item.totalDepositos[0]?.STCANCELADO,
      STCONFERIDO: item.totalDepositos[0]?.STCONFERIDO,
      NUDOCDEPOSITO: item.totalDepositos[0]?.NUDOCDEPOSITO,
      saldoAnteriorDepositos: saldoAnteriorDepositos,

      saldoAnteriorVendas: saldoAnteriorVendas,
      
    }
  });

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
                  <table className="table table-bordered table-hover table-responsive-lg table-striped w-100">
                    <thead className="bg-primary-700">
                      <tr>
                        <th>
                          Dt. Lançamento
                        </th>
                        <th>
                          Histórico
                        </th>
                        <th>
                          Pago A
                        </th>
                        <th>
                          Despesa
                        </th>
                        <th>
                          Débito
                        </th>
                        <th>
                          Crédito
                        </th>
                        <th>
                          Saldo 
                        </th>
                        <th>
                          Situação
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {dados.map((item, index) => (
                        <Fragment>
                          
                          <tr key={index} className="table-success">
                            <td>{item.DTHORAFECHAMENTOFORMATADA}</td>
                            <td>Mov. Dinheiro do Caixa {item.DTHORAFECHAMENTOFORMATADA}</td>
                            <td>Vendas Dinheiro</td>
                            <td></td>
                            <td>0,00</td>
                            <td>{item.VRRECDINHEIRO}</td>
                            <td>{item.saldoAnteriorVendas}</td>
                            <td></td>
                           
                          </tr>

                          <tr className="table-success">
                           
                            <td>{item.DTPROCESSAMENTOFORMATADA}</td>
                            <td>Mov. Fatura {item.DTPROCESSAMENTOFORMATADA}</td>
                            <td>Recebimento de Faturas</td>
                            <td></td>
                            <td>0,00</td>
                            <td>{item.VRRECEBIDO}</td>
                            <td>{item.saldoAnteriorFaturas}</td>
                            <td></td>
                         
                          </tr>

                          <tr className="table-danger">
                           
                            <td>{item.DTDESPESAFORMATADA}</td>
                            <td>{item.DSHISTORIO}</td>
                            <td>{item.DSPAGOA}</td>
                            <td>{item.DSCATEGORIA}</td>
                            <td>{item.VRDESPESA}</td>
                            <td>0,00</td>
                            <td>{item.saldoAnteriorDespesas ? item.saldoAnteriorDespesas : 0}</td>
                            <td></td>
                         
                          </tr>
                          
                          <tr className="table-danger">
                           
                            <td>{item.DTLANCAMENTOADIANTAMENTO}</td>
                            <td>Adiantamento de Salário </td>
                            <td>{item.NOFUNCIONARIO}</td>
                            <td>{item.DSMOTIVO}</td>
                            <td>{item.VRVALORDESCONTO}</td>
                            <td>0,00</td>
                            <td>{item.saldoAnteriorDespesas ? item.saldoAnteriorDespesas : 0}</td>
                            <td></td>
                         
                          </tr>

                          <tr className="table-primary">
                           
                            <td>{item.DTMOVCAIXA}</td>
                            <td>Quebra Caixa Mov.: {item.IDMOV} </td>
                            <td>Operador: {item.FUNCIONARIOMOV}</td>
                            <td></td>
                            <td>0,00</td>
                            <td>{formatMoeda(item.totalQuebraCaixa)}</td>
                            <td>{item.saldoAnteriorQuebra ? item.saldoAnteriorQuebra : 0}</td>
                            <td></td>
                         
                          </tr>

                          <tr className="table-warning">
                           
                            <td>{item.DTDEPOSITOFORMATADA}</td>
                            <td>{item.FUNCIONARIO} Dep. Dinh  - Data do Movimento: {item.DTMOVIMENTOCAIXAFORMATADA} </td>
                            <td>{item.DSBANCO} {item.NUDOCDEPOSITO}</td>
                            <td></td>
                            <td style={{}}>{item.VRDEPOSITO}</td>
                            <td>0,00</td>
                           
                            <td>{formatMoeda(item.saldoAnteriorDepositos) ? formatMoeda(item.saldoAnteriorDepositos) : 0}</td>
                     
                            <td style={{color: item.STCONFERIDO == 'False' || item.STCONFERIDO == null || item.STCONFERIDO == '' ? 'red' : 'blue' }} >
                              {item.STCONFERIDO == 'False' || item.STCONFERIDO == null || item.STCONFERIDO == '' ? 'Sem Conferir' : 'Conferido'}
                            </td>
                         
                          </tr>

                          <tr className="table-secondary">
                           
                            <td>{item.DTCADASTROFORMATADA}</td>
                            <td>{item.HISTORICO} </td>
                            <td>Ajuste de Extrato</td>
                            <td style={{color: 'red'}}>{item.VRDEBITO}</td>
                            <td style={{color: 'red'}}>{item.VRCREDITO}</td>
                            <td>0,00</td>
                           
                            <td>{formatMoeda(item.totalSaldoAnteriorExtrato) ? formatMoeda(item.totalSaldoAnteriorExtrato) : 0}</td>
                            <td style={{color: item.STCANCELADO == 'False' ? 'blue' : 'red' }} >
                              {item.STCANCELADO == 'False' ? 'Ativo' : 'Cancelado'}
                            </td>
                            
                         
                          </tr>

                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </Fragment>

            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </Fragment>
  );
};

