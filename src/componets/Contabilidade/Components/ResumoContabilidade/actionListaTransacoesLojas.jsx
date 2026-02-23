import { Fragment, useEffect, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";
import { dataFormatada } from "../../../../utils/dataFormatada";


export const ActionListaTransacoesLojas = ({ dadosTransacoesEmpresas, dataPesquisa }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();
  const [size, setSize] = useState('small')
  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista de Transações Por Loja',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Data', 'Loja', 'Autorizador', 'Tipo Pagamento', 'QTD Cupons', 'Valor']],
      body: dados.map(item => [item.dataPesquisa, item.NOFANTASIA, item.NOAUTORIZADOR, item.DSTIPOPAGAMENTO, parseFloat(item.QTDE), formatMoeda(item.VALORRECEBIDO)]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('transacoes_loja.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Data', 'Loja', 'Autorizador', 'Tipo Pagamento', 'QTD Cupons', 'Valor'];
    worksheet['!cols'] = [
      { wpx: 100, caption: 'Data' }, 
      { wpx: 200, caption: 'Loja' },
      { wpx: 100, caption: 'Autorizador' },
      { wpx: 180, caption: 'Tipo Pagamento' },
      { wpx: 100, caption: 'QTD Cupons' },
      { wpx: 100, caption: 'Valor' }
      
    ]; 
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista de Transações Por Loja');
    XLSX.writeFile(workbook, 'transacoes_loja.xlsx');
  };

  const calcularQuantidadeCupons = (item) => {
    let total = 0;
    for (let venda of dadosTransacoesEmpresas) {
      total += parseFloat(venda.QTDE);
    }
    return total;
  }

  const calcularValorRecebido = (item) => {
    let total = 0;
    for (let venda of dadosTransacoesEmpresas) {
      total += parseFloat(venda.VALORRECEBIDO);
    }
    return total;
  }

  const dados = Array.isArray(dadosTransacoesEmpresas) ? dadosTransacoesEmpresas.map((item, index) => {
  
    return {
     
      dataPesquisa: dataPesquisa,
      NOFANTASIA: item.NOFANTASIA,
      NOAUTORIZADOR: item.NOAUTORIZADOR,
      DSTIPOPAGAMENTO: item.DSTIPOPAGAMENTO,
      QTDE: parseFloat(item.QTDE),
      VALORRECEBIDO: formatMoeda(item.VALORRECEBIDO),
    }
  }): [];

  const colunasTransacoes = [
    {
      field: 'dataPesquisa',
      header: 'Data',
      body: row => <th style={{ color: 'blue' }}>{row.dataPesquisa}</th>,
      sortable: true,
      dataKey: 'dataPesquisa',
    },
    {
      field: 'NOFANTASIA',
      header: 'Loja',
      body: row => <th style={{ color: 'blue' }}>{row.NOFANTASIA}</th>,
      sortable: true,
      dataKey: 'NOFANTASIA',
    },
    {
      field: 'NOAUTORIZADOR',
      header: 'Autorizador',
      body: row => <th style={{ color: 'blue' }}>{row.NOAUTORIZADOR}</th>,
      sortable: true,
      dataKey: 'NOAUTORIZADOR',
    },
    {
      field: 'DSTIPOPAGAMENTO',
      header: 'Tipo Pagamento',
      body: row => <th style={{ color: 'blue' }}>{row.DSTIPOPAGAMENTO}</th>,
      footer: 'Total',
      sortable: true,
      dataKey: 'DSTIPOPAGAMENTO',
    },
    {
      field: 'QTDE',
      header: 'QTD Cupons',
      body: row => <th style={{ color: 'blue' }}>{row.QTDE}</th>,
      footer: calcularQuantidadeCupons(),
      sortable: true,
    },
    {
      field: 'VALORRECEBIDO',
      header: 'Valor',
      body: row => <th style={{ color: 'blue' }}>{row.VALORRECEBIDO}</th>,
      footer: formatMoeda(calcularValorRecebido()),
      sortable: true,
    },
  ]

 


  return (
    <Fragment>

      <div className="panel">
        <div className="panel-hdr mb-4">

          <h3>Lista de Transações Por Loja QTD Cupons</h3>
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
            title="Lista de Transações Por Loja"
            value={dados}
            globalFilter={globalFilterValue}
            size={size}
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[5, 10, 20, 50, 100, dados.length]}
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasTransacoes.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}

                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '0.8rem' }}

              />
            ))}
          </DataTable>

        </div>
      </div>
    </Fragment>
  )
}