import { Fragment, useRef, useState } from "react";;
import { toFloat } from "../../../../utils/toFloat";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";

export const ActionListaExtratoContaCorrenteLoja = ({
  dadosExtratoLojaPeriodo,
}) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Extrato de conta Corrente',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Dt.Lanç', 'Histórico', 'Pago A', 'Despesa', 'Débito', 'Crédito', 'Saldo']],
      body: processarDadosExtrato().map(item => [
        item.dtLancamento,
        item.historico,
        item.pagoA,
        formatMoeda(item.despesa),
        formatMoeda(item.debito),
        formatMoeda(item.credito),
        formatMoeda(item.saldo)
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('extrato_conta_corrente.pdf');
  };

  const exportToExcel = () => {
    const dados = processarDadosExtrato().map(item => ({
      'Dt.Lanç': item.dtLancamento,
      'Histórico': item.historico,
      'Pago A': item.pagoA,
      'Despesa': item.despesa,
      'Débito': formatMoeda(item.debito),
      'Crédito': formatMoeda(item.credito),
      'Saldo': formatMoeda(item.saldo)
    }));
    const worksheet = XLSX.utils.json_to_sheet(dados, { header: ['Dt.Lanç', 'Histórico', 'Pago A', 'Despesa', 'Débito', 'Crédito', 'Saldo'] });
    const workbook = XLSX.utils.book_new();
    worksheet['!cols'] = [
      { wpx: 100 },
      { wpx: 250 },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 100 },
      { wpx: 100 }
    ];
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Extrato');
    XLSX.writeFile(workbook, 'extrato_conta_corrente.xlsx');
  }



  let saldoAnterior = 0;
  const venda = dadosExtratoLojaPeriodo[0]?.primeiraVendaSaldo.SALDO;
  const totalQuebra = dadosExtratoLojaPeriodo[0]?.primeiraVendaSaldo.TOTALQUEBRA;
  saldoAnterior = toFloat(venda) + toFloat(totalQuebra);

  const processarDadosExtrato = () => {
    let saldoAtual = saldoAnterior;
    const dadosProcessados = [];

    dadosExtratoLojaPeriodo.forEach((ret, i) => {

      if (i > 0) {
        // Primeira linha de espaço
        dadosProcessados.push({
          id: `espaco-${i}-1`,
          tipo: 'espaco',
          dtLancamento: '',
          historico: '',
          pagoA: '',
          despesa: '',
          debito: 0,
          credito: 0,
          saldo: 0,
          situacao: '',
          opcao: '',
          className: 'linha-espaco'
        });

      }

      // Vendas Dinheiro
      saldoAtual += toFloat(ret['venda']['VRRECDINHEIRO']);
      dadosProcessados.push({
        id: `venda-${i}`,
        tipo: 'venda',
        dtLancamento: ret['venda']['DTHORAFECHAMENTOFORMATADA'],
        historico: `Mov. Dinheiro do Caixa ${ret['venda']['DTHORAFECHAMENTOFORMATADA']}`,
        pagoA: 'Vendas Dinheiro',
        despesa: '',
        debito: 0,
        credito: toFloat(ret['venda']['VRRECDINHEIRO']),
        saldo: saldoAtual,
        situacao: '',
        opcao: '',
        className: 'table-success'
      });

      // Faturas
      if (ret['totalFaturas'].length > 0) {
        saldoAtual += toFloat(ret['totalFaturas'][0]['VRRECEBIDO']);
        dadosProcessados.push({
          id: `fatura-${i}`,
          tipo: 'fatura',
          dtLancamento: ret['totalFaturas'][0]['DTPROCESSAMENTOFORMATADA'],
          historico: `Mov. Fatura ${ret['totalFaturas'][0]['DTPROCESSAMENTOFORMATADA']}`,
          pagoA: 'Recebimento de Faturas',
          despesa: '',
          debito: 0,
          credito: toFloat(ret['totalFaturas'][0]['VRRECEBIDO']),
          saldo: saldoAtual,
          situacao: '',
          opcao: '',
          className: 'table-success'
        });
      }

      // Despesas
      ret['despesas'].forEach((despesa, j) => {
        saldoAtual -= toFloat(despesa['VRDESPESA']);
        dadosProcessados.push({
          id: `despesa-${i}-${j}`,
          tipo: 'despesa',
          dtLancamento: despesa['DTDESPESAFORMATADA'],
          historico: despesa['DSHISTORIO'],
          pagoA: despesa['DSPAGOA'],
          despesa: despesa['DSCATEGORIA'],
          debito: Math.abs(toFloat(despesa['VRDESPESA'])),
          credito: 0,
          saldo: saldoAtual,
          situacao: '',
          opcao: '',
          className: 'table-danger'
        });
      });

      // Adiantamentos
      ret['adiantamentos'].forEach((adiantamento, j) => {
        saldoAtual -= toFloat(adiantamento['VRVALORDESCONTO']);
        dadosProcessados.push({
          id: `adiantamento-${i}-${j}`,
          tipo: 'adiantamento',
          dtLancamento: adiantamento['DTLANCAMENTOADIANTAMENTO'],
          historico: 'Adiantamento de Salário',
          pagoA: adiantamento['NOFUNCIONARIO'],
          despesa: adiantamento['DSMOTIVO'],
          debito: Math.abs(toFloat(adiantamento['VRVALORDESCONTO'])),
          credito: 0,
          saldo: saldoAtual,
          situacao: '',
          opcao: '',
          className: 'table-danger'
        });
      });

      // Quebra Caixa
      ret['quebracaixa'].forEach((quebra, j) => {
        const totalDinheiroInformado = toFloat(quebra['VRAJUSTDINHEIRO']) > 0
          ? toFloat(quebra['VRAJUSTDINHEIRO'])
          : toFloat(quebra['VRRECDINHEIRO']);

        const totalQuebraCaixa = totalDinheiroInformado - toFloat(quebra['VRFISICODINHEIRO']);
        saldoAtual += totalQuebraCaixa;

        dadosProcessados.push({
          id: `quebra-${i}-${j}`,
          tipo: 'quebra',
          dtLancamento: quebra['DTMOVCAIXA'],
          historico: `Quebra Caixa Mov.: ${quebra['IDMOV']}`,
          pagoA: `Operador: ${quebra['FUNCIONARIOMOV']}`,
          despesa: '',
          debito: totalQuebraCaixa > 0 ? 0 : Math.abs(totalQuebraCaixa),
          credito: totalQuebraCaixa > 0 ? totalQuebraCaixa : 0,
          saldo: saldoAtual,
          situacao: '',
          opcao: '',
          className: 'table-primary'
        });
      });

      // Depósitos
      ret['totalDepositos'].forEach((deposito, j) => {
        saldoAtual -= toFloat(deposito['VRDEPOSITO']);
        dadosProcessados.push({
          id: `deposito-${i}-${j}`,
          tipo: 'deposito',
          dtLancamento: deposito['DTDEPOSITOFORMATADA'],
          historico: `${deposito['FUNCIONARIO']} Dep. Dinh ${deposito['DTDEPOSITOFORMATADA']}`,
          pagoA: `${deposito['DSBANCO']} - ${deposito['NUDOCDEPOSITO']}`,
          despesa: '',
          debito: Math.abs(toFloat(deposito['VRDEPOSITO'])),
          credito: 0,
          saldo: saldoAtual,
          situacao: deposito['STCONFERIDO'] === 'False' || !deposito['STCONFERIDO'] ? 'Sem Conferir' : 'Conferido',
          opcao: '',
          className: 'table-warning'
        });
      });

      // Ajustes
      ret['ajusteextrato'].forEach((ajuste, j) => {
        if (ajuste['STCANCELADO'] === 'False') {
          if (toFloat(ajuste['VRCREDITO']) > 0) {
            saldoAtual -= toFloat(ajuste['VRCREDITO']);
          } else {
            saldoAtual += toFloat(ajuste['VRDEBITO']);
          }
        }

        dadosProcessados.push({
          id: `ajuste-${i}-${j}`,
          tipo: 'ajuste',
          dtLancamento: ajuste['DTCADASTROFORMATADA'],
          historico: ajuste['HISTORICO'],
          pagoA: 'Ajuste de Extrato',
          despesa: '',
          debito: Math.abs(toFloat(ajuste['VRDEBITO'])),
          credito: toFloat(ajuste['VRCREDITO']),
          saldo: saldoAtual,
          situacao: ajuste['STCANCELADO'] === 'False' ? 'Ativo' : 'Cancelado',
          opcao: '',
          className: 'table-secondary'
        });
      });
    });

    return dadosProcessados;
  };

  // Template para data com formatação
  const dtLancamentoTemplate = (rowData) => (
    <span style={{ fontSize: '12px' }}>{rowData.dtLancamento}</span>
  );

  const linhaEspacoTemplate = (rowData) => {
    if (rowData.tipo === 'espaco') {
      return <span>&nbsp;</span>; // Espaço em branco
    }
    return rowData.dtLancamento;
  };

  const historicoTemplate = (rowData) => {
    if (rowData.tipo === 'espaco') {
      return <span>&nbsp;</span>;
    }
    return <span style={{ fontSize: '12px' }}><b>{rowData.historico}</b></span>;
  };

  const debitoTemplate = (rowData) => {
    if (rowData.tipo === 'espaco') {
      return <span>&nbsp;</span>;
    }

    return (
      <span
        style={{
          textAlign: 'right',
          fontSize: '12px',
          color: rowData.debito > 0 ? '' : 'inherit'
        }}
      >
        <b>{rowData.debito > 0 ? formatMoeda(rowData.debito) : '0,00'}</b>
      </span>
    );
  };

  const creditoTemplate = (rowData) => {
    if (rowData.tipo === 'espaco') {
      return <span>&nbsp;</span>;
    }

    return (
      <span style={{ textAlign: 'right', fontSize: '12px' }}>
        <b>{rowData.credito > 0 ? formatMoeda(rowData.credito) : '0,00'}</b>
      </span>
    );
  };

  const saldoTemplate = (rowData) => {
    if (rowData.tipo === 'espaco') {
      return <span>&nbsp;</span>;
    }

    return (
      <span
        style={{
          textAlign: 'right',
          fontSize: '12px',
          color: rowData.tipo === 'deposito' ? '' : 'inherit'
        }}
      >
        <b>{formatMoeda(rowData.saldo)}</b>
      </span>
    );
  };

  // Template para situação com cores condicionais
  const situacaoTemplate = (rowData) => {
    if (!rowData.situacao) return null;

    let color = 'blue';
    if (rowData.situacao === 'Sem Conferir' || rowData.situacao === 'Cancelado') {
      color = 'red';
    }

    return (
      <label style={{ color, fontSize: '12px', textAlign: 'center' }}>
        {rowData.situacao}
      </label>
    );
  };

  // Template para aplicar classe CSS nas linhas
  const rowClassName = (rowData) => {
    if (rowData.tipo === 'espaco') {
      return 'linha-espaco'; // Classe CSS para espaçamento
    }
    return rowData.className || '';
  };

  return (
    <div className="panel">
      <div className="panel-hdr">
        <h2>Extrato de Conta Corrente</h2>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <HeaderTable
          globalFilterValue={globalFilterValue}
          onGlobalFilterChange={onGlobalFilterChange}
          handlePrint={handlePrint}
          exportToExcel={exportToExcel}
          exportToPDF={exportToPDF}
        />
      </div>
      <div className="card" ref={dataTableRef}>
        <DataTable
          value={processarDadosExtrato()}
          size="small"
          showGridlines
          stripedRows
          rowClassName={rowClassName}
          emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          globalFilter={globalFilterValue}
          header={
            <table className="table table-bordered  table-responsive-lg table-striped w-100">

              <thead style={{ width: '100%' }}>
                <tr>
                  <th>Informativo</th>
                </tr>
                <tr>
                  <td colspan="9"><b >Extrato a partir do dia 11 de dezembro de 2020</b ></td>
                </tr>
              </thead>
              <tbody>
                <tr class="table-primary" style={{ width: '100%' }}>
                  <td colspan="4" style={{ textAlign: "right", fontSize: "12px" }}><b>Saldo Anterior</b></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td style={{ textAlign: "right", fontSize: "12px" }}><b> {`${formatMoeda(saldoAnterior)}`}</b></td>
                  <td colSpan={2}></td>
                </tr>

                <tr>
                  <td colspan="9"></td>
                </tr>

                <tr>
                  <td colspan="9"></td>
                </tr>
              </tbody>
            </table>
          }
        >
          <Column
            field="dtLancamento"
            header="Dt. Lançamento"
            body={dtLancamentoTemplate}
            headerStyle={{ backgroundColor: "#7a59ad", color: 'white', fontSize: '1rem', fontWeight: 'bold' }}
            bodyStyle={{ fontSize: '1rem', fontWeight: 'bold', textAlign: 'left' }}
          />

          <Column
            field="historico"
            header="Histórico"
            body={historicoTemplate}
            headerStyle={{ backgroundColor: "#7a59ad", color: 'white', fontSize: '1rem', fontWeight: 'bold' }}
            bodyStyle={{ fontSize: '1rem', fontWeight: 'bold', textAlign: 'left' }}
          />

          <Column
            field="pagoA"
            header="Pago A"
            headerStyle={{ backgroundColor: "#7a59ad", color: 'white', fontSize: '1rem', fontWeight: 'bold' }}
            bodyStyle={{ fontSize: '1rem', fontWeight: 'bold' }}
          />

          <Column
            field="despesa"
            header="Despesa"
            headerStyle={{ backgroundColor: "#7a59ad", color: 'white', fontSize: '1rem', fontWeight: 'bold' }}
            bodyStyle={{ fontSize: '1rem', fontWeight: 'bold', textAlign: 'center' }}
          />

          <Column
            field="debito"
            header="Débito"
            body={debitoTemplate}
            headerStyle={{ backgroundColor: "#7a59ad", color: 'white', fontSize: '1rem', fontWeight: 'bold' }}
            bodyStyle={{ fontSize: '1rem', fontWeight: 'bold', textAlign: 'right' }}
          />

          <Column
            field="credito"
            header="Crédito"
            body={creditoTemplate}
            headerStyle={{ backgroundColor: "#7a59ad", color: 'white', fontSize: '1rem', fontWeight: 'bold' }}
            bodyStyle={{ fontSize: '1rem', fontWeight: 'bold', textAlign: 'right' }}
          />

          <Column
            field="saldo"
            header="Saldo"
            body={saldoTemplate}
            headerStyle={{ backgroundColor: "#7a59ad", color: 'white', fontSize: '1rem', fontWeight: 'bold' }}
            bodyStyle={{ fontSize: '1rem', fontWeight: 'bold', textAlign: 'right' }}
          />

          <Column
            field="situacao"
            header="Situação"
            body={situacaoTemplate}
            headerStyle={{ backgroundColor: "#7a59ad", color: 'white', fontSize: '1rem', fontWeight: 'bold' }}
            bodyStyle={{ fontSize: '1rem', fontWeight: 'bold', textAlign: 'center' }}
          />

          <Column
            field="opcao"
            header="Opção"
            headerStyle={{ backgroundColor: "#7a59ad", color: 'white', fontSize: '1rem', fontWeight: 'bold' }}
            bodyStyle={{ fontSize: '1rem', fontWeight: 'bold' }}
          />
        </DataTable>
      </div>
    </div>
  );
};