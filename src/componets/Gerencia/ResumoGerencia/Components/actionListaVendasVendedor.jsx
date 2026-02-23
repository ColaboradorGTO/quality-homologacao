import { Fragment, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from '../../../../utils/formatMoeda';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { useReactToPrint } from 'react-to-print';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from '../../../Tables/headerTable';

export const ActionListaVendasVendedor = ({ dadosVendasVendedor }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista de Vendas Vendedor',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Matrícula', 'Nome', 'Qtd Produto', 'Valor Vendido', 'Vourcher Recebido', 'Valor Líquido']],
      body: dadosVendedorVendas.map(item => [
        item.VENDEDOR_MATRICULA,
        item.VENDEDOR_NOME,
        item.QTDVENDIDOVENDEDOR,
        formatMoeda(item.TOTALVENDIDOVENDEDOR),
        formatMoeda(item.Vouchers),
        formatMoeda(item.vrVendidoVendedor),
      ]),
      autoPrint: true,
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vendas_vendedor.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosVendedorVendas);
    const workbook = XLSX.utils.book_new();
    const header = ['Matrícula', 'Nome', 'Qtd Produto', 'Valor Vendido', 'Vourcher Recebido', 'Valor Líquido'];
    worksheet['!cols'] = [
      { wpx: 100, caption: 'Matrícula' },
      { wpx: 250, caption: 'Nome' },
      { wpx: 100, caption: 'Qtd Produto' },
      { wpx: 100, caption: 'Valor Vendido' },
      { wpx: 100, caption: 'Vourcher Recebido' },
      { wpx: 100, caption: 'Valor Líquido' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Lista de Vendas Vendedor");
    XLSX.writeFile(workbook, 'vendas_vendedor.xlsx');
  };

  const dadosVendedorVendas = dadosVendasVendedor.map((item, index) => {
    const totalVendido = parseFloat(item.totalVendido[0].TOTALVENDIDOVENDEDOR) || 0;
    const vouchers = parseFloat(item.Vouchers) || 0;

    let vrVendidoVendedor = totalVendido - vouchers;
    return {
      VENDEDOR_MATRICULA: item.vendedor.VENDEDOR_MATRICULA,
      VENDEDOR_NOME: item.vendedor.VENDEDOR_NOME,
      QTDVENDIDOVENDEDOR: item.totalVendido[0].QTDVENDIDOVENDEDOR,
      TOTALVENDIDOVENDEDOR: parseFloat(item.totalVendido[0].TOTALVENDIDOVENDEDOR),
      Vouchers: parseFloat(item.Vouchers),
      vrVendidoVendedor
    };
  });

  const calcularTotalValorVendido = () => {
    let total = 0;
    for (let dados of dadosVendedorVendas) {
      total += parseFloat(dados.TOTALVENDIDOVENDEDOR);
    }
    return total;
  }

  const calcularTotalVouchers = () => {
    let total = 0;
    for (let dados of dadosVendedorVendas) {
      total += parseFloat(dados.Vouchers);
    }
    return total;
  }

  const calcularTotalVrVendidoVendedor = () => {
    let total = 0;
    for (let dados of dadosVendedorVendas) {
      total += parseFloat(dados.vrVendidoVendedor);
    }
    return total;
  }

  const colunaVendidoVendedor = [
    {
      field: 'VENDEDOR_MATRICULA',
      header: 'Matrícula',
      body: row => <th>{row.VENDEDOR_MATRICULA}</th>,
      sortable: true,
      width: "7%"
    },
    {
      field: 'VENDEDOR_NOME',
      header: 'Nome',
      body: row => <th>{row.VENDEDOR_NOME}</th>,
      sortable: true,
    },
    {
      field: 'QTDVENDIDOVENDEDOR',
      header: 'Qtd Produto',
      body: row => <th>{parseFloat(row.QTDVENDIDOVENDEDOR)}</th>,
      sortable: true,
    },
    {
      field: 'TOTALVENDIDOVENDEDOR',
      header: 'Valor Vendido',
      body: row => <th>{formatMoeda(row.TOTALVENDIDOVENDEDOR)}</th>,
      sortable: true,
    },
    {
      field: 'Vouchers',
      header: 'Vourcher Recebido',
      body: row => <th>{formatMoeda(row.Vouchers)}</th>,
      sortable: true,
    },
    {
      field: 'vrVendidoVendedor',
      header: 'Valor Líquido',
      body: row => <th>{formatMoeda(row.vrVendidoVendedor)}</th>,
      sortable: true,
    },

  ]

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Total Vendas" colSpan={3} style={{ textAlign: 'center' }} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }} />
        <Column footer={formatMoeda(calcularTotalValorVendido())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }} />
        <Column footer={formatMoeda(calcularTotalVouchers())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }} />
        <Column footer={formatMoeda(calcularTotalVrVendidoVendedor())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }} />

      </Row>
    </ColumnGroup>
  )
  return (
    <Fragment>


      <div className="panel" >
        <header className="panel-hdr" >
          <h2 >
            Lista de Vendas Vendedor
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
            title="Vendas por Vendedor"
            size="small"
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            value={dadosVendedorVendas}
            globalFilter={globalFilterValue}
            footerColumnGroup={footerGroup}
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dadosVendedorVendas.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
          >
            {colunaVendidoVendedor.map(coluna => (
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