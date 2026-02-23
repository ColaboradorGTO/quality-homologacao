import { Fragment, useEffect, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { MdAdd } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { FaLockOpen } from "react-icons/fa";

import { getUmdiaAntes } from "../../../utils/dataAtual";
import { toFloat } from "../../../utils/toFloat";
import { formatMoeda } from "../../../utils/formatMoeda";
import { Row } from "primereact/row";
import { ColumnGroup } from "primereact/columngroup";
import Accordion from 'react-bootstrap/Accordion';


export const ActionListaExtratoLoja = ({ dadosExtratoLojaPeriodo }) => {
  const [modalAjuste, setAjusteModal] = useState(false);

  const dataUmdiaAntes = getUmdiaAntes();
  const dados = dadosExtratoLojaPeriodo.map((item) => {
    const saldoAnterior = parseFloat(item.primeiraVendaSaldo.SALDO) + parseFloat(item.primeiraVendaSaldo.TOTALQUEBRA);

    const totalSaldoAnterior = parseFloat(item.primeiraVendaSaldo.SALDO) + parseFloat(item.venda.VRRECDINHEIRO);
    
    return {
      SALDO: item.primeiraVendaSaldo.SALDO,
      TOTALQUEBRA: item.primeiraVendaSaldo.TOTALQUEBRA,

      VRRECDINHEIRO: item.venda.VRRECDINHEIRO,
      DTHORAFECHAMENTOFORMATADA: item.venda.DTHORAFECHAMENTOFORMATADA,

      DTPROCESSAMENTOFORMATADA: item.totalFaturas[0]?.DTPROCESSAMENTOFORMATADA,
      VRRECEBIDO: item.totalFaturas[0]?.VRRECEBIDO,

      DTDESPESAFORMATADA: item.despesas.DTDESPESAFORMATADA,
      DSPAGOA: item.despesas.DSPAGOA,
      DSHISTORIO: item.despesas.DSHISTORIO,
      DSCATEGORIA: item.despesas.DSCATEGORIA,
      VRDESPESA: item.despesas.VRDESPESA,

      DTLANCAMENTOADIANTAMENTO: item.adiantamentos.DTLANCAMENTOADIANTAMENTO,
      NOFUNCIONARIO: item.adiantamentos.NOFUNCIONARIO,
      DSMOTIVO: item.adiantamentos.DSMOTIVO,
      VRVALORDESCONTO: item.adiantamentos.VRVALORDESCONTO,

      IDMOV: item.quebracaixa.IDMOV,
      DTMOVCAIXA: item.quebracaixa.DTMOVCAIXA,
      FUNCIONARIOMOV: item.quebracaixa.FUNCIONARIOMOV,
      VRFISICODINHEIRO: item.quebracaixa.VRFISICODINHEIRO,
      // VRRECDINHEIRO: item.quebracaixa.VRRECDINHEIRO,
      VRAJUSTDINHEIRO: item.quebracaixa.VRAJUSTDINHEIRO,

      IDDEPOSITOLOJA: item.totalDepositos.IDDEPOSITOLOJA,
      DTDEPOSITOFORMATADA: item.totalDepositos.DTDEPOSITOFORMATADA,
      FUNCIONARIO: item.totalDepositos.FUNCIONARIO,
      VRDEPOSITO: item.totalDepositos.VRDEPOSITO,
      DSBANCO: item.totalDepositos.DSBANCO,
      STCANCELADO: item.totalDepositos.STCANCELADO,
      STCONFERIDO: item.totalDepositos.STCONFERIDO,
      NUDOCDEPOSITO: item.totalDepositos.NUDOCDEPOSITO,

      IDAJUSTEEXTRATO: item.ajusteextrato.IDAJUSTEEXTRATO,
      DTCADASTROFORMATADA: item.ajusteextrato.DTCADASTROFORMATADA,
      VRDEBITO: item.ajusteextrato.VRDEBITO,
      VRCREDITO: item.ajusteextrato.VRCREDITO,
      HISTORICO: item.ajusteextrato.HISTORICO,
      STCANCELADO: item.ajusteextrato.STCANCELADO,

      saldoAnterior: saldoAnterior,
      totalSaldoAnterior: totalSaldoAnterior,

    }
  });

  const colunasSaldoLoja = [
    {
      field: 'DTHORAFECHAMENTOFORMATADA',
      header: 'Dt. Lançamento',
      body: row => <p>{row.DTHORAFECHAMENTOFORMATADA}</p>,
      sortable: true,
    },
    {
      field: 'DTHORAFECHAMENTOFORMATADA',
      header: 'Histórico',
      body: row => <p style={{ width: "13rem" }}> Mov. Dinherio do Caixa {row.DTHORAFECHAMENTOFORMATADA}</p>,
      sortable: true,
    },
    {
      field: '',
      header: 'Pago A',
      body: row => <p style={{ width: "7rem" }}>Vendas Dinheiro</p>,
      sortable: true,
    },
    {
      header: 'Despesa'
    },
    {
      field: '',
      header: 'Débito',
      body: row => <p style={{ fontWeight: 600 }}>0,00</p>,
      sortable: true,
    },
    {
      field: 'VRRECDINHEIRO',
      header: 'Crédito',
      body: row => <p style={{ fontWeight: 600 }}>{formatMoeda(row.VRRECDINHEIRO)}</p>,
      sortable: true,
    },
    {
      field: 'saldoAnterior',
      header: 'Saldo',
      body: row => <p style={{ fontWeight: 600 }}>{formatMoeda(row.VRRECDINHEIRO)}</p>,
      sortable: true,
    },
    {
      field: '',
      header: 'Situação',
      body: row => <p style={{ fontWeight: 600 }}></p>,
      sortable: true,
    },
  ]
  const colunasResultadoExtratoLoja = [
    {
      field: 'DTPROCESSAMENTOFORMATADA',
      body: row => <p>{row.DTPROCESSAMENTOFORMATADA}</p>,
      sortable: true,
    },
    {
      field: 'DTPROCESSAMENTOFORMATADA',
      body: row => <p style={{ width: "13rem" }}> Mov. Fatura {row.DTPROCESSAMENTOFORMATADA}</p>,
      sortable: true,
    },
    {
      field: '',

      body: row => <p style={{ width: "7rem" }}>Recebimento de Faturas</p>,
      sortable: true,
    },
    {
      body: row => <p style={{ width: "7rem" }}></p>,
    },
    {
      field: '',

      body: row => <p style={{ fontWeight: 600 }}>0,00</p>,
      sortable: true,
    },
    {
      field: 'VRRECEBIDO',
      body: row => <p style={{ fontWeight: 600 }}>{formatMoeda(row.VRRECEBIDO)}</p>,
      sortable: true,
    },
    {
      field: 'saldoAnterior',

      body: row => <p style={{ fontWeight: 600 }}>{formatMoeda(row.saldoAnterior)} {row.VRRECEBIDO}</p>,
      sortable: true,
    },
    {
      field: '',

      body: row => <p style={{ fontWeight: 600 }}></p>,
      sortable: true,
    },
  ]

  return (

    <Fragment>
      <div className="row" >
            <Accordion defaultActiveKey="0" className="col-xl-12" >
              <Accordion.Item eventKey="0" id="panel-1" className="panel" >
                <header className="panel-hdr tituloListVendasCaixa" >
                  <h2 id="TituloLoja" >
                  Lista de Extrato do Dia
                  </h2>
                </header>
                <Accordion.Body className="panel-container show">

                  <div className="card">
                    <DataTable
                      title="Vendas por Loja"
                      value={dados}
                      selectionMode={"single"}
                      dataKey="IDEMPRESA"
                      sortField="VRTOTALPAGO"
                      sortOrder={-1}
                      showGridlines
                      stripedRows
                      emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
                    >
                      {colunasSaldoLoja.map(coluna => (
                        <Column
                          key={coluna.field}
                          field={coluna.field}
                          header={coluna.header}
                          body={coluna.body}
                          footer={coluna.footer}
                          sortable={coluna.sortable}
                          headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                          footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                          bodyStyle={{ fontSize: '0.8rem', backgroundColor: '#c0f0eb', border: '1px solid #89e3da' }} />
                      ))}
                    </DataTable>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>  

    </Fragment>
  )
}