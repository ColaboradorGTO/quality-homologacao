import { Fragment, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { formatMoeda } from "../../../utils/formatMoeda";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { useRef } from "react";
import HeaderTable from "../../Tables/headerTable";
import { formatarPorcentagem } from "../../../utils/formatarPorcentagem";

export const ActionListaVendasPCJ = ({ dadosVendasPCJ }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Vendas Período - PCJ Marca',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº Mov', 'Caixa', 'Abertura', 'Operador', 'CPF', 'Total CredS 1-8', 'Total CredS 7-8', '% PCJ']],
      body: dadosExcel.map(item => [item.ID, item.DSCAIXA, item.DTABERTURA, item.NOFUNCIONARIO, item.NUCPF, formatMoeda(item.TOTALPCJ18), formatMoeda(item.TOTALPCJ78), formatarPorcentagem(item.pcjTotal)]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vendas_pcj.pdf');

  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosExcel);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº Mov', 'Caixa', 'Abertura', 'Operador', 'CPF', 'Total CredS 1-8', 'Total CredS 7-8', '% PCJ'];
    worksheet['!cols'] = [
      { wpx: 150, caption: 'Nº Mov' },
      { wpx: 100, caption: 'Caixa' },
      { wpx: 150, caption: 'Abertura' },
      { wpx: 250, caption: 'Operador' },
      { wpx: 100, caption: 'CPF' },
      { wpx: 100, caption: 'Total CredS 1-8' },
      { wpx: 150, caption: 'Total CredS 7-8' },
      { wpx: 100, caption: '% PCJ' }];


    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas Período - PCJ Marca');
    XLSX.writeFile(workbook, 'vendas_pcj.xlsx');
  };

  const calcularTotalVendido = (item) => {
    const toFloat = (value) => (isNaN(parseFloat(value)) || value === null || value === undefined) ? 0 : parseFloat(value);

    return (
      toFloat(item.venda?.[0]['venda-movimento']?.TOTALVENDIDODINHEIRO) +
      toFloat(item.venda?.[0]['venda-movimento']?.TOTALVENDIDOCARTAO) +
      toFloat(item.venda?.[0]['venda-movimento']?.TOTALVENDIDOPOS) +
      toFloat(item.venda?.[0]['venda-movimento']?.TOTALVENDIDOCONVENIO) +
      toFloat(item.venda?.[0]['venda-movimento']?.TOTALVENDIDOPIX) +
      toFloat(item.venda?.[0]['venda-movimento']?.TOTALVENDIDOMOOVPAY)

    );
  }

  const calcularTotalVrDisponivel = (item) => {
    const toFloat = (value) => (isNaN(parseFloat(value)) || value === null || value === undefined) ? 0 : parseFloat(value);

    return (
      toFloat(item.venda?.[0]?.['venda-movimento']?.TOTALVENDIDODINHEIRO) +
      toFloat(item.fatura?.[0]?.['fatura-movimento']?.TOTALRECEBIDOFATURA)
    )
  }

  const calcularTotalPCJTotal = (item) => {
    const toFloat = (value) => (isNaN(parseFloat(value)) || value === null || value === undefined) ? 0 : parseFloat(value)

    const vrPCJ18 = toFloat(item.vendapcj?.[0]?.['venda-pcj']?.TOTALPCJ18);
    const vrPCJ78 = toFloat(item.vendapcj?.[0]?.['venda-pcj']?.TOTALPCJ78);

    const totalPCJ = vrPCJ18 !== 0 ? (vrPCJ78 / vrPCJ18) * 100 : 0;

    return totalPCJ;

  }
  
  const dadosExcel = dadosVendasPCJ.map((item) => {
    let pcjTotal = calcularTotalPCJTotal(item)
    return {

      ID: item.caixa?.ID,
      DSCAIXA: item.caixa?.DSCAIXA,
      DTABERTURA: item.caixa?.DTABERTURA,
      NOFUNCIONARIO: item.caixa?.NOFUNCIONARIO,
      NUCPF: item.caixa?.NUCPF,
      TOTALPCJ18: item.vendapcj?.[0]?.['venda-pcj']?.TOTALPCJ18,
      TOTALPCJ78: item.vendapcj?.[0]?.['venda-pcj']?.TOTALPCJ78,
      pcjTotal: pcjTotal
    }
  });


  const dadosMovLojaDia = dadosVendasPCJ.map((item, index) => {
    let totalVendido = calcularTotalVendido(item);
    let vrDisponivel = calcularTotalVrDisponivel(item);
    let pcjTotal = calcularTotalPCJTotal(item)
    let contador = index + 1;
    return {
      IDCAIXAWEB: item.caixa?.IDCAIXAWEB,
      ID: item.caixa?.ID,
      DSCAIXA: item.caixa?.DSCAIXA,
      DTABERTURA: item.caixa?.DTABERTURA,
      NOFUNCIONARIO: item.caixa?.NOFUNCIONARIO,
      NUCPF: item.caixa?.NUCPF,
      STFECHADO: item.caixa?.STFECHADO,
      VRRECDINHEIRO: item.caixa?.VRRECDINHEIRO,


      TOTALRECEBIDOFATURA: item.fatura?.[0]?.['fatura-movimento']?.TOTALRECEBIDOFATURA,
      TOTALRECEBIDOFATURAPIX: item.faturapix?.[0]?.['fatura-movimento-pix']?.TOTALRECEBIDOFATURAPIX,

      TOTALVENDIDODINHEIRO: parseFloat(item.venda?.[0]?.['venda-movimento']?.TOTALVENDIDODINHEIRO),
      TOTALVENDIDOCARTAO: parseFloat(item.venda?.[0]?.['venda-movimento']?.TOTALVENDIDOCARTAO),
      TOTALVENDIDOPOS: parseFloat(item.venda?.[0]?.['venda-movimento']?.TOTALVENDIDOPOS),
      TOTALVENDIDOPIX: parseFloat(item.venda?.[0]?.['venda-movimento']?.TOTALVENDIDOPIX),
      TOTALVENDIDOMOOVPAY: parseFloat(item.venda?.[0]?.['venda-movimento']?.TOTALVENDIDOMOOVPAY),
      TOTALVENDIDOVOUCHER: item.venda?.[0]?.['venda-movimento']?.TOTALVENDIDOVOUCHER,
      TOTALVENDIDOCONVENIO: parseFloat(item.venda?.[0]?.['venda-movimento']?.TOTALVENDIDOCONVENIO),
      TOTALVENDIDO: item.venda?.[0]?.['venda-movimento']?.TOTALVENDIDO,
      TOTALNOTA: item.venda?.[0]?.['venda-movimento']?.TOTALNOTA,

      TOTALPCJ18: item.vendapcj?.[0]?.['venda-pcj']?.TOTALPCJ18,
      TOTALPCJ78: item.vendapcj?.[0]?.['venda-pcj']?.TOTALPCJ78,

      totalVendido: totalVendido,
      vrDisponivel: vrDisponivel,
      pcjTotal: pcjTotal

    };
  });

  const calcularTotalPCJ18 = () => {
    let total = 0;
    for (let dados of dadosMovLojaDia) {
      total += parseFloat(dados.TOTALPCJ18);

    }
    return total;
  }

  const calcularTotalPCJ78 = () => {
    let total = 0;
    for (let dados of dadosMovLojaDia) {
      total += parseFloat(dados.TOTALPCJ78);

    }
    return total;
  }

  const calcularValorTotalPCJTotal = () => {
    let total = 0;
    for (let dados of dadosMovLojaDia) {
      total += parseFloat(dados.pcjTotal);

    }
    return total;
  }

  const colunaVendasPCJ = [
    {
      field: 'ID',
      header: 'Nº Movimento',
      body: row => <th> {row.ID}</th>,
      sortable: true,

    },
    {
      field: 'IDCAIXAWEB',
      header: 'Caixa',
      body: row => <th> {`${row.IDCAIXAWEB} - ${row.DSCAIXA}`}</th>,
      sortable: true,
    },
    {
      field: 'DTABERTURA',
      header: 'Abertura',
      body: row => <th> {row.DTABERTURA}</th>,
      sortable: true,
    },
    {
      field: 'NOFUNCIONARIO',
      header: 'Operador',
      body: row => <th> {row.NOFUNCIONARIO}</th>,
      sortable: true,
    },
    {
      field: 'NUCPF',
      header: 'CPF',
      body: row => <th> {row.NUCPF}</th>,
      footer: 'Total dos Caixas',
      sortable: true,
    },
    {
      field: 'TOTALPCJ18',
      header: 'Total CredS 1-8',
      body: row => <th> {formatMoeda(row.TOTALPCJ18)}</th>,
      footer: formatMoeda(calcularTotalPCJ18()),
      sortable: true,
    },
    {
      field: 'TOTALPCJ78',
      header: 'Total CredS 7-8',
      body: row => <th> {formatMoeda(row.TOTALPCJ78)}</th>,
      footer: formatMoeda(calcularTotalPCJ78()),
      sortable: true,
    },
    {
      field: 'pcjTotal',
      header: '% PCJ',

      body: row => (
        <th style={{ color: row.pcjTotal === 0 ? 'red' : 'blue' }}>
          {formatMoeda(row.pcjTotal)}
        </th>
      ),
      footer: formatMoeda(calcularValorTotalPCJTotal()),
      sortable: true,
    },

  ]

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Total dos Caixas " colSpan={5} footerStyle={{ textAlign: 'center', color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', fontWeight: 'bold' }} />
        <Column footer={formatMoeda(calcularTotalPCJ18())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', fontWeight: 'bold' }} />
        <Column footer={formatMoeda(calcularTotalPCJ78())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', fontWeight: 'bold' }} />
        <Column footer={formatMoeda(calcularValorTotalPCJTotal())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', fontWeight: 'bold' }} />


      </Row>
    </ColumnGroup>
  )

  return (
    <Fragment>
      <div className="panel" >


        <header className="panel-hdr " >
          <h2 id="TituloLoja" >
            Lista de Vendas PCJ
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
            value={dadosMovLojaDia}
            globalFilter={globalFilterValue}
            sortField="VRTOTALPAGO"
            footerColumnGroup={footerGroup}
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[5, 10, 20, 50, 100, dadosMovLojaDia.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunaVendasPCJ.map(coluna => (
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