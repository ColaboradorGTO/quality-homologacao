import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../utils/formatMoeda";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { toFloat } from "../../../utils/toFloat";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../Tables/headerTable";

export const ActionListaVendasVendedor = ({ dadosVendasVendedor }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Vendas por Vendedor',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Matrícula', 'Nome', 'Qtd Produto', 'Valor Vendido', 'Voucher Recebido', 'Valor Liquido']],
      body: dadosVendedorVendas.map(item => [
        parseFloat(item.VENDEDOR_MATRICULA),
        item.VENDEDOR_NOME, 
        toFloat(item.QTDVENDIDOVENDEDOR), 
        formatMoeda(item.TOTALVENDIDOVENDEDOR), 
        formatMoeda(item.Vouchers), 
        formatMoeda(item.totalVendido), 
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vendas_vendedor.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosVendedorVendas);
    const workbook = XLSX.utils.book_new();
    const header = ['Matrícula', 'Nome', 'Qtd Produto', 'Valor Vendido', 'Voucher Recebido', 'Valor Liquido'];
    worksheet['!cols'] = [
      { wpx: 100, caption: 'Matrícula' },
      { wpx: 200, caption: 'Nome' },
      { wpx: 100, caption: 'Qtd Produto' },
      { wpx: 100, caption: 'Valor Vendido' },
      { wpx: 100, caption: 'Voucher Recebido' },
      { wpx: 100, caption: 'Valor Liquido' },
     
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas por Vendedor');
    XLSX.writeFile(workbook, 'vendas_vendedor.xlsx');
  };

  const dadosVendedorVendas = dadosVendasVendedor.map((item, index) => {
    let contador = index + 1;
    const totalVendido = toFloat(item.totalVendido[0]?.TOTALVENDIDOVENDEDOR);
    const vouchers = toFloat(item.Vouchers);

    let vrVendidoVendedor = totalVendido - vouchers;
    return {
      VENDEDOR_MATRICULA: item.vendedor.VENDEDOR_MATRICULA,
      VENDEDOR_NOME: item.vendedor.VENDEDOR_NOME,
      QTDVENDIDOVENDEDOR: item.totalVendido[0]?.QTDVENDIDOVENDEDOR,
      TOTALVENDIDOVENDEDOR: parseFloat(item.totalVendido[0]?.TOTALVENDIDOVENDEDOR),
      Vouchers: parseFloat(item.Vouchers),
      vrVendidoVendedor
    };
  });

  const calcularTotalVendido = () => {
    let total = 0;
    for (let dados of dadosVendedorVendas) {
      total += parseFloat(dados?.TOTALVENDIDOVENDEDOR);
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

  const calcularTotalValorLiquido = () => {
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
      body: row => <th> {row.VENDEDOR_MATRICULA}</th>,
      sortable: true,

    },
    {
      field: 'VENDEDOR_NOME',
      header: 'Nome',
      body: row => <th> {row.VENDEDOR_NOME}</th>,
      sortable: true,
    },
    {
      field: 'QTDVENDIDOVENDEDOR',
      header: 'Qtd Produto',
      body: row => <th> {toFloat(row.QTDVENDIDOVENDEDOR)}</th>,
      footer: 'Total Vendas',
      sortable: true,
    },
    {
      field: 'TOTALVENDIDOVENDEDOR',
      header: 'Valor Vendido',
      body: row => <th> {formatMoeda(row.TOTALVENDIDOVENDEDOR)}</th>,
      footer: formatMoeda(calcularTotalVendido()),
      sortable: true,
    },
    {
      field: 'Vouchers',
      header: 'Vourcher Recebido',
      body: row => <th> {formatMoeda(row.Vouchers)}</th>,
      footer: formatMoeda(calcularTotalVouchers()),
      sortable: true,
    },
    {
      field: 'vrVendidoVendedor',
      header: 'Valor Líquido',
      body: row => <th> {formatMoeda(row.vrVendidoVendedor)}</th>,
      footer: formatMoeda(calcularTotalValorLiquido()),
      sortable: true,
    },

  ]

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Total Vendas" colSpan={3} style={{ textAlign: 'center' }} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', fontWeight: 'bold'  }} />
        <Column footer={formatMoeda(calcularTotalVendido())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', fontWeight: 'bold'  }} />
        <Column footer={formatMoeda(calcularTotalVouchers())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', fontWeight: 'bold'  }} />
        <Column footer={formatMoeda(calcularTotalValorLiquido())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', fontWeight: 'bold'  }} />

      </Row>
    </ColumnGroup>
  )

  return (
    <Fragment>

      <div className="panel" >
        <div className="panel" >
          <header className="panel-hdr tituloListVendasCaixa" >
            <h2 id="TituloLoja" >
              Lista de Vendas Vendedor
            </h2>
          </header>
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
              title="Vendas por Loja"
              size="small"
              value={dadosVendedorVendas}
              globalFilter={globalFilterValue}
              sortField="VRTOTALPAGO"
              footerColumnGroup={footerGroup}
              sortOrder={-1}
              paginator={true}
              rows={10}
              rowsPerPageOptions={[5, 10, 20, 50, 100, dadosVendedorVendas.length]}
              paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
              currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
              filterDisplay="menu"
              showGridlines
              stripedRows
              emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
            >
              {colunaVendidoVendedor.map(coluna => (
                <Column
                  key={coluna.field}
                  field={coluna.field}
                  header={coluna.header}
                  body={coluna.body}
                  // footer={coluna.footer}
                  sortable={coluna.sortable}
                  headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                  // footerStyle={{ color: '#212529', backgroundColor: "#fcfcfc", border: '1px solid #ccc', fontSize: '0.8rem' }}
                  bodyStyle={{ fontSize: '0.8rem' }}

                />
              ))}
            </DataTable>
          </div>

        </div>
      </div>

    </Fragment>
  )
}