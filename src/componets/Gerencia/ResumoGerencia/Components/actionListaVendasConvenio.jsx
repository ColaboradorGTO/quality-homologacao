import { Fragment, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from '../../../../utils/formatMoeda';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import HeaderTable from '../../../Tables/headerTable';
import { useReactToPrint } from 'react-to-print';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { toFloat } from '../../../../utils/toFloat';

export const ActionListaVendasConvenio = ({ dadosVendasConvenioDesconto }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef()

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Vendas Convênio',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Caixa', 'Nº Venda', 'NFCe', 'Abertura', 'Operador', 'Conveniado', 'CPF', 'Valor Bruto', 'Desconto', 'Valor Liq']],
      body: dados.map(item => [
        item.contador,
        item.IDCAIXAWEB,
        item.IDVENDA,
        item.NFE_INFNFE_IDE_NNF,
        item.DTHORAFECHAMENTO,
        item.NOFUNCIONARIO,
        item.NOCONVENIADO,
        item.CPFCONVENIADO,
        formatMoeda(item.VRBRUTOPAGO),
        formatMoeda(item.VRDESPAGO),
        formatMoeda(item.VRLIQPAGO),
      ]),
      autoPrint: true,
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vendas_desconto.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Caixa', 'Nº Venda', 'NFCe', 'Abertura', 'Operador', 'Conveniado', 'CPF', 'Valor Bruto', 'Desconto', 'Valor Liq'];
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº' },
      { wpx: 100, caption: 'Caixa' },
      { wpx: 100, caption: 'Nº Venda' },
      { wpx: 100, caption: 'NFCe' },
      { wpx: 100, caption: 'Abertura' },
      { wpx: 200, caption: 'Operador' },
      { wpx: 200, caption: 'Conveniado' },
      { wpx: 100, caption: 'CPF' },
      { wpx: 100, caption: 'Valor Bruto' },
      { wpx: 100, caption: 'Desconto' },
      { wpx: 100, caption: 'Valor Liq' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vendas Convênio");
    XLSX.writeFile(workbook, 'vendas_desconto.xlsx');
  };

  const dados = dadosVendasConvenioDesconto.map((item, index) => {
    let contador = index + 1;

    return {
      contador,
      IDCAIXAWEB: `${item.IDCAIXAWEB} - ${item.DSCAIXA}`,
      IDVENDA: item.IDVENDA,
      NFE_INFNFE_IDE_NNF: item.NFE_INFNFE_IDE_NNF,
      DTHORAFECHAMENTO: item.DTHORAFECHAMENTO,
      NOFUNCIONARIO: item.NOFUNCIONARIO,
      NOCONVENIADO: item.NOCONVENIADO,
      CPFCONVENIADO: item.CPFCONVENIADO,

      VRBRUTOCONVENIADO: toFloat(item.VRBRUTOCONVENIADO),
      VRDESCONTOCONVENIADO: toFloat(item.VRDESCONTOCONVENIADO),
      VRRECCONVENIO: toFloat(item.VRRECCONVENIO),
     
    };
  });

  const calcularValorBruto = () => {
    let total = 0;
    for (let dadosConvenio of dados) {
      total += toFloat(dadosConvenio.VRBRUTOCONVENIADO);
    }
    return total;
  }

  const calcularValorDesconto = () => {
    let total = 0;
    for (let dadosConvenio of dados) {
      total += toFloat(dadosConvenio.VRDESCONTOCONVENIADO);
    }
    return total;
  }

  const calcularValorLiquido = () => {
    let total = 0;
    for (let dadosConvenio of dados) {
      total += toFloat(dadosConvenio.VRRECCONVENIO);
    }
    return total;
  }

  const colunaVendasConvenioDesconto = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'IDCAIXAWEB',
      header: 'Caixa ',
      body: row => <th>{row.IDCAIXAWEB}</th>,
      sortable: true,
    },
    {
      field: 'IDVENDA',
      header: 'Nº Venda ',
      body: row => <th>{row.IDVENDA}</th>,
      sortable: true,
    },
    {
      field: 'NFE_INFNFE_IDE_NNF',
      header: 'NFCe ',
      body: row => <th>{row.NFE_INFNFE_IDE_NNF}</th>,
      sortable: true,
    },
    {
      field: 'DTHORAFECHAMENTO',
      header: 'Abertura',
      body: row => <th>{row.DTHORAFECHAMENTO}</th>,
      sortable: true,
    },
    {
      field: 'NOFUNCIONARIO',
      header: 'Operador',
      body: row => <th>{row.NOFUNCIONARIO}</th>,
      sortable: true,
    },
    {
      field: 'NOCONVENIADO',
      header: 'Conveniado',
      body: row => <th>{row.NOCONVENIADO}</th>,
      sortable: true,
    },
    {
      field: 'CPFCONVENIADO',
      header: 'CPF',
      body: row => <th>{row.CPFCONVENIADO}</th>,
      sortable: true,
    },
    {
      field: 'VRBRUTOCONVENIADO',
      header: 'Valor Bruto',
      body: row => <th>{formatMoeda(row.VRBRUTOCONVENIADO)}</th>,
      sortable: true,
    },
    {
      field: 'VRDESCONTOCONVENIADO',
      header: 'Desconto',
      body: row => <th>{formatMoeda(row.VRDESCONTOCONVENIADO)}</th>,
      sortable: true,
    },
    {
      field: 'VRRECCONVENIO',
      header: 'Valor Liq',
      body: row => <th>{formatMoeda(row.VRRECCONVENIO)}</th>,
      sortable: true,
    },
  ]

  const footerGroup = (
    <ColumnGroup>

      <Row>
        <Column footer="Total Vendas Convenio " colSpan={8} footerStyle={{ textAlign: 'center', color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} />
        <Column footer={formatMoeda(calcularValorBruto())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} />
        <Column footer={formatMoeda(calcularValorDesconto())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} />
        <Column footer={formatMoeda(calcularValorLiquido())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} />


      </Row>
    </ColumnGroup>
  )

  return (
    <Fragment>


      <div className="panel" >
        <header className="panel-hdr" >
          <h2>
            Lista de Vendas Convênio Desconto em Folha
          </h2>
        </header>

        <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
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
            title="Vendas Convênio Desconto em Folha"
            value={dados}
            globalFilter={globalFilterValue}
            size="small"
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            footerColumnGroup={footerGroup}
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
          >
            {colunaVendasConvenioDesconto.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}

                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '1rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }}
                bodyStyle={{ fontSize: '1rem' }}

              />
            ))}
          </DataTable>
        </div>
      </div>

    </Fragment>
  )
}