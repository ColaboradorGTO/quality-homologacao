import { Fragment, useRef, useState } from "react"
import { formatMoeda } from "../../../../utils/formatMoeda"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import HeaderTable from "../../../Tables/headerTable"
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { toFloat } from "../../../../utils/toFloat";


export const ActionListaMapaCaixa = ({ dadosDespesas, dadosAdiantamentoSalarial,  dadosResumoVoucher, dadosDetalheFatura }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Mapa de Caixas Por Loja',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Despesas', 'Tipo Despesa', 'Mat/Usuário', 'Histórico', 'Pago a', 'Valor']],
      body: dados.map(item => [
        item.contador,
        item.DSCATEGORIA, 
        item.NOFUNCIONARIO, 
        item.DSHISTORIO, 
        item.DSPAGOA, 
        item.VRDESPESA
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('mapa_caixa_por_loja.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['contador', 'Tipo Despesa', 'Mat/Usuário', 'Histórico', 'Pago a', 'Valor'];
    worksheet['!cols'] = [
      { wpx: 50, caption: 'contador' },
      { wpx: 200, caption: 'Tipo Despesa' },
      { wpx: 100, caption: 'Mat/Usuário' },
      { wpx: 200, caption: 'Histórico' },
      { wpx: 200, caption: 'Pago a' },
      { wpx: 100, caption: 'Valor' }
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Mapa de Caixas Por Loja');
    XLSX.writeFile(workbook, 'mapa_caixa_por_loja.xlsx');
  };

  const dados = Array.isArray(dadosDespesas) ? dadosDespesas.map((item, index) => {
    let contador = index + 1;
    item.contador,
    item.IDCATEGORIARECEITADESPESA, 
    item.NOFUNCIONARIO, 
    item.DSHISTORIO, 
    item.DSPAGOA, 
    item.VRDESPESA
    return {
      contador,
      IDCATEGORIARECDESP: item.IDCATEGORIARECEITADESPESA,
      DSCATEGORIA: item.DSCATEGORIA,
      NOFUNCIONARIO: item.NOFUNCIONARIO,
      DSHISTORIO: item.DSHISTORIO,
      DSPAGOA: item.DSPAGOA,
      VRDESPESA: item.VRDESPESA,
      IDDESPESASLOJA: item.IDDESPESASLOJA,
    }
  }) : [];

  const calcularTotalDespesas = () => {
    let total = 0;
    for (let resultado of dados) {
      total += parseFloat(resultado.VRDESPESA);
    }
    return total;
  }

  const colunasEmpresas = [
    {
      field: 'contador',
      header: 'Despesas',
      body: row => <th> {row.contador}</th>,
      sortable: true,
    },
    {
      field: 'IDCATEGORIARECEITADESPESA',
      header: 'Tipo Despesa',
      body: row => <th > {row.IDCATEGORIARECEITADESPESA} - {row.DSCATEGORIA} </th>,
      sortable: true,
    },
    {
      field: 'NOFUNCIONARIO',
      header: 'Mat./ Usuário',
      body: row => <th > {row.NOFUNCIONARIO} </th>,
      sortable: true,
    },
    {
      field: 'DSHISTORIO',
      header: 'Histórico',
      body: row => <th > {row.DSHISTORIO} </th>,
      sortable: true,
    },
    {
      field: 'DSPAGOA',
      header: 'Pago a',
      body: row => <th > {row.DSPAGOA} </th>,
      footer: 'Total Despesas',
      sortable: true,
    },
    {
      field: 'VRDESPESA',
      header: 'Valor',
      body: row => (
        <th >
          {formatMoeda(row.VRDESPESA)}
        </th>
      ),
      footer: formatMoeda(calcularTotalDespesas()),
      sortable: true,
    },

  ]

  const dadosAdiantamentos =  dadosAdiantamentoSalarial.map((item, index) => {
  
    return {
      IDADIANTAMENTOSALARIO: item.IDADIANTAMENTOSALARIO,
      VRVALORDESCONTO: toFloat(item.VRVALORDESCONTO),
      TXTMOTIVO: item.TXTMOTIVO,
      IDFUNCIONARIO: item.IDFUNCIONARIO,
      NOFUNCIONARIO: item.NOFUNCIONARIO,
      NOLOGIN: item.NOLOGIN,
    }
  });

  const calcularTotalAdiantamento = () => {
    let total = 0;
    for(let resultado of dadosAdiantamentos) {
      total += toFloat(resultado.VRVALORDESCONTO); 
    }
    return total;
  }

  const dadosVoucher =  dadosResumoVoucher.map((item, index) => {

    return {
      VRVOUCHER: toFloat(item.VRVOUCHER),
    }
  });

  const calcularTotalVoucher = () => {
    let total = 0;
    for(let resultado of dadosVoucher) {
      total += toFloat(resultado.VRVOUCHER); 
    }
    return total;
  }

  const dadosFatura = dadosDetalheFatura.map((item, index) => {
    return {
      VRRECEBIDO: toFloat(item.VRRECEBIDO),
    }
  });

  const calcularTotalFaturas = () => {
    return dadosFatura.reduce((total, item) =>
      total + toFloat(item.VRRECEBIDO), 0
    )
  }

  const footerGroup = (
    <ColumnGroup>

      <Row> 
        <Column footer="Total Despesas" colSpan={5} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', textAlign: 'center' }} />
        <Column footer={formatMoeda(calcularTotalDespesas())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} /> 
        {/* <Column footer={""} colSpan={1}  footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }}/> */}
      </Row>
      <Row> 
        <Column footer="" colSpan={5} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', textAlign: 'center' }} />
        <Column footer={""} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} /> 
        {/* <Column footer={""} colSpan={1}  footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }}/> */}
      </Row>
      <Row> 
        <Column footer="Total Despesa de Adiantamento" colSpan={5} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', textAlign: 'center' }} />
        <Column footer={formatMoeda(calcularTotalAdiantamento())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} /> 
        {/* <Column footer={""} colSpan={1}  footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }}/> */}
      </Row>
      <Row> 
        <Column footer="" colSpan={5} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', textAlign: 'center' }} />
        <Column footer={""} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} /> 
        {/* <Column footer={""} colSpan={1}  footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }}/> */}
      </Row>
      <Row> 
        <Column footer="Total Voucher" colSpan={5} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', textAlign: 'center' }} />
        <Column footer={formatMoeda(calcularTotalVoucher())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} /> 
        {/* <Column footer={""} colSpan={1}  footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }}/> */}
      </Row>
      <Row> 
        <Column footer="" colSpan={5} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', textAlign: 'center' }} />
        <Column footer={""} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} /> 
        {/* <Column footer={""} colSpan={1}  footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }}/> */}
      </Row>
      <Row> 
        <Column footer="Total Faturas" colSpan={5} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', textAlign: 'center' }} />
        <Column footer={formatMoeda(calcularTotalFaturas())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} /> 
        {/* <Column footer={""} colSpan={1}  footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }}/> */}
      </Row>
      </ColumnGroup>
  )

  return (

    <Fragment>

      <div className="panel">
        <div className="panel-hdr">

          <h2 style={{ color: "" }}>Mapa de Fechamento de Caixas Por Período  </h2>
        </div>
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
            title="Vendas por Loja"
            value={dados}
            globalFilter={globalFilterValue}
            size="small"
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            sortOrder={-1}
            rows={dados.length}
            paginator={true}
            footerColumnGroup={footerGroup}
            rowsPerPageOptions={[5, 10, 20, 50, 100]}
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasEmpresas.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}

                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '0.8rem'}}

              />
            ))}
          </DataTable>
        </div>
      </div>
    </Fragment>
  )
}