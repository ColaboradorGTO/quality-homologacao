import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { toFloat } from "../../../../utils/toFloat";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";

export const ActionListaConsolidadoBancoDTW = ({ dadosConciliarBancoConsolidado }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Conciliação  Consolidado'
  });
  

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Grupo', 'BB', 'Itaú', 'Bradesco', 'BRB', 'Caixa', 'Santander', 'R.TED', 'CX. Tesoura', 'C.CredSystem', 'D.PIX', 'Prem. Prom', 'D.Sobra CX', 'Total Bandeira']],
      body: dadosListaConciliarBancoConsolidado.map(item => [
        item.DSSUBGRUPOEMPRESARIAL, 
        formatMoeda(item.TOTALDEPBB), 
        formatMoeda(item.TOTALDEPITAU), 
        formatMoeda(item.TOTALDEPBRAD), 
        formatMoeda(item.TOTALDEPBRB), 
        formatMoeda(item.TOTALDEPCX), 
        formatMoeda(item.TOTALDEPSANT), 
        formatMoeda(item.TOTALDEPTED), 
        formatMoeda(item.TOTALDEPCXTES), 
        formatMoeda(item.TOTALDEPCREDS), 
        formatMoeda(item.TOTALDEPDPIX), 
        formatMoeda(item.TOTALDEPDDIN), 
        formatMoeda(item.TOTALDEPPROM), 
        formatMoeda(item.TOTALDEPTVALOR), 
        formatMoeda(item.TOTALDEPDEVCX), 
        formatMoeda(item.valorDepositadoBandeira)
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('deposito_conciliacao_consolidado.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosExcel);
    const workbook = XLSX.utils.book_new();
    const header = ['Grupo', 'BB', 'Itaú', 'Bradesco', 'BRB', 'Caixa', 'Santander', 'R.TED', 'CX. Tesoura', 'C.CredSystem', 'D.PIX', 'D. Dinheiro', 'Prem. Prom', 'Transp. Valor', 'D.Sobra CX', 'Total Bandeira'];
    worksheet['!cols'] = [
      { wpx: 150, caption: 'Grupo' },
      { wpx: 150, caption: 'BB' },
      { wpx: 150, caption: 'Itaú' },
      { wpx: 150, caption: 'Bradesco' },
      { wpx: 150, caption: 'BRB' },
      { wpx: 150, caption: 'Caixa' },
      { wpx: 150, caption: 'Santander' },
      { wpx: 150, caption: 'R.TED' },
      { wpx: 150, caption: 'CX. Tesoura' },
      { wpx: 150, caption: 'C.CredSystem' },
      { wpx: 150, caption: 'D.PIX' },
      { wpx: 150, caption: 'D. Dinheiro' },
      { wpx: 150, caption: 'Prem. Prom' },
      { wpx: 150, caption: 'Transp. Valor' },
      { wpx: 150, caption: 'D.Sobra CX' },
      { wpx: 200, caption: 'Total Bandeira' } 
    
    ]; 
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Conciliação  Consolidado');
    XLSX.writeFile(workbook, 'deposito_conciliacao_consolidado.xlsx');
  };

  const calcularValorDepositadoBandeira = (item) => {
    return (
      toFloat(item.TOTALDEPBB) + toFloat(item.TOTALDEPBRB) +
      toFloat(item.TOTALDEPBRAD) + toFloat(item.TOTALDEPITAU) +
      toFloat(item.TOTALDEPCX) + toFloat(item.TOTALDEPSANT) +
      toFloat(item.TOTALDEPTED) + toFloat(item.TOTALDEPCXTES) +
      toFloat(item.TOTALDEPCREDS) + toFloat(item.TOTALDEPDPIX) +
      toFloat(item.TOTALDEPDDIN) + toFloat(item.TOTALDEPPROM) +
      toFloat(item.TOTALDEPTVALOR) + toFloat(item.TOTALDEPDEVCX)
    )
  }

  const calcularTotalBB = () => {
    let total = 0
    for(let dados of dadosConciliarBancoConsolidado){
      total += toFloat(dados.TOTALDEPBB)
    }
    return total
  }

  const calcularTotalItau = () => {
    let total = 0
    for(let dados of dadosConciliarBancoConsolidado){
      total += toFloat(dados.TOTALDEPITAU)
    }
    return total
  }

  const calcularTotalBradesco = () => {
    let total = 0
    for(let dados of dadosConciliarBancoConsolidado){
      total += toFloat(dados.TOTALDEPBRAD)
    }
    return total
  }

  const calcularTotalBRB = () => {
    let total = 0
    for(let dados of dadosConciliarBancoConsolidado){
      total += toFloat(dados.TOTALDEPBRB)
    }
    return total
  }

  const calcularTotalCaixa = () => {
    let total = 0
    for(let dados of dadosConciliarBancoConsolidado){
      total += toFloat(dados.TOTALDEPCX)
    }
    return total
  }

  const calcularTotalSantander = () => {
    let total = 0
    for(let dados of dadosConciliarBancoConsolidado){
      total += toFloat(dados.TOTALDEPSANT)
    }
    return total
  }

  const calcularTotalTED = () => {
    let total = 0
    for(let dados of dadosConciliarBancoConsolidado){
      total += toFloat(dados.TOTALDEPTED)
    }
    return total
  }

  const calcularTotalCXTesoura = () => {
    let total = 0
    for(let dados of dadosConciliarBancoConsolidado){
      total += toFloat(dados.TOTALDEPCXTES)
    }
    return total
  }

  const calcularTotalCCredSystem = () => {
    let total = 0
    for(let dados of dadosConciliarBancoConsolidado){
      total += toFloat(dados.TOTALDEPCREDS)
    }
    return total
  }

  const calcularTotalDPix = () => {
    let total = 0
    for(let dados of dadosConciliarBancoConsolidado){
      total += toFloat(dados.TOTALDEPDPIX)
    }
    return total
  }

  const calcularTotalDDinheiro = () => {
    let total = 0
    for(let dados of dadosConciliarBancoConsolidado){
      total += toFloat(dados.TOTALDEPDDIN)
    }
    return total
  }

  const calcularTotalPremioPromocao = () => {
    let total = 0
    for(let dados of dadosConciliarBancoConsolidado){
      total += toFloat(dados.TOTALDEPPROM)
    }
    return total
  }

  const calcularTotalTranspValor = () => {
    let total = 0
    for(let dados of dadosConciliarBancoConsolidado){
      total += toFloat(dados.TOTALDEPTVALOR)
    }
    return total
  }

  const calcularTotalDSobraCX = () => {
    let total = 0
    for(let dados of dadosConciliarBancoConsolidado){
      total += toFloat(dados.TOTALDEPDEVCX)
    }
    return total
  }

  const dadosExcel = dadosConciliarBancoConsolidado.map((item) => {
    const valorDepositadoBandeira = calcularValorDepositadoBandeira(item)

    return {
      DSSUBGRUPOEMPRESARIAL: item.DSSUBGRUPOEMPRESARIAL,
      TOTALDEPBB: formatMoeda(item.TOTALDEPBB),
      TOTALDEPITAU: formatMoeda(item.TOTALDEPITAU),
      TOTALDEPBRAD: formatMoeda(item.TOTALDEPBRAD),
      TOTALDEPBRB: formatMoeda(item.TOTALDEPBRB),
      TOTALDEPCX: formatMoeda(item.TOTALDEPCX),
      TOTALDEPSANT: formatMoeda(item.TOTALDEPSANT),
      TOTALDEPTED: formatMoeda(item.TOTALDEPTED),
      TOTALDEPCXTES: formatMoeda(item.TOTALDEPCXTES),
      TOTALDEPCREDS: formatMoeda(item.TOTALDEPCREDS),
      TOTALDEPDPIX: formatMoeda(item.TOTALDEPDPIX),
      TOTALDEPDDIN: formatMoeda(item.TOTALDEPDDIN),
      TOTALDEPPROM: formatMoeda(item.TOTALDEPPROM),
      TOTALDEPTVALOR: formatMoeda(item.TOTALDEPTVALOR),
      TOTALDEPDEVCX: formatMoeda(item.TOTALDEPDEVCX),
      
      valorDepositadoBandeira: formatMoeda(valorDepositadoBandeira),
    }
  })

  const dadosListaConciliarBancoConsolidado = dadosConciliarBancoConsolidado.map((item) => {
    const valorDepositadoBandeira = calcularValorDepositadoBandeira(item)
    
    return {
      DSSUBGRUPOEMPRESARIAL: item.DSSUBGRUPOEMPRESARIAL,
      TOTALDEPBB: item.TOTALDEPBB,
      TOTALDEPITAU: item.TOTALDEPITAU,
      TOTALDEPBRAD: item.TOTALDEPBRAD,
      TOTALDEPBRB: item.TOTALDEPBRB,
      TOTALDEPCX: item.TOTALDEPCX,
      TOTALDEPSANT: item.TOTALDEPSANT,
      TOTALDEPTED: item.TOTALDEPTED,
      TOTALDEPCXTES: item.TOTALDEPCXTES,
      TOTALDEPCREDS: item.TOTALDEPCREDS,
      TOTALDEPDPIX: item.TOTALDEPDPIX,
      TOTALDEPDDIN: item.TOTALDEPDDIN,
      TOTALDEPPROM: item.TOTALDEPPROM,
      TOTALDEPTVALOR: item.TOTALDEPTVALOR,
      TOTALDEPDEVCX: item.TOTALDEPDEVCX,
      
      valorDepositadoBandeira: valorDepositadoBandeira,
    }
  });
  const calcularTotalBandeira = () => {
    let total = 0
    for(let dados of dadosListaConciliarBancoConsolidado){
      total += calcularValorDepositadoBandeira(dados)
    }
    return total
  }

  
  const colunasConciliarBancoConsolidado = [
    {
      field: 'DSSUBGRUPOEMPRESARIAL',
      header: 'Grupo',
      body: row => <p style={{ width: '200px' }}>{row.DSSUBGRUPOEMPRESARIAL}</p>,
      footer: 'Total',
      sortable: true
    },
    {
      field: 'TOTALDEPBB',
      header: 'BB',
      body: row => <p style={{ color: '' }}>{formatMoeda(row.TOTALDEPBB)}</p>,
      footer: formatMoeda(calcularTotalBB()),
      sortable: true
    },
    {
      field: 'TOTALDEPITAU',
      header: 'Itaú',
      body: row => <p style={{ color: '' }}>{formatMoeda(row.TOTALDEPITAU)}</p>,
      footer: formatMoeda(calcularTotalItau()),
      sortable: true,
    },
    {
      field: 'TOTALDEPBRAD',
      header: 'Bradesco',
      body: row => <p style={{ color: '' }}>{formatMoeda(row.TOTALDEPBRAD)}</p>,
      footer: formatMoeda(calcularTotalBradesco()),
      sortable: true
    },
    {
      field: 'TOTALDEPBRB',
      header: 'BRB',
      body: row => <p style={{ color: '' }}>{formatMoeda(row.TOTALDEPBRB)}</p>,
      footer: formatMoeda(calcularTotalBRB()),
      sortable: true
    },
    {
      field: 'TOTALDEPCX',
      header: 'Caixa',
      body: row => <p style={{ color: '' }}>{formatMoeda(row.TOTALDEPCX)}</p>,
      footer: formatMoeda(calcularTotalCaixa()),
      sortable: true
    },
    {
      field: 'TOTALDEPSANT',
      header: 'Santander',
      body: row => <p style={{ color: '' }}>{formatMoeda(row.TOTALDEPSANT)}</p>,
      footer: formatMoeda(calcularTotalSantander()),
      sortable: true
    },
    {
      field: 'TOTALDEPTED',
      header: 'R. TED',
      body: row => <p style={{ color: '' }}>{formatMoeda(row.TOTALDEPTED)}</p>,
      footer: formatMoeda(calcularTotalTED()),
      sortable: true
    },
    {
      field: 'TOTALDEPCXTES',
      header: 'CX. Tesoura',
      body: row => <p style={{ color: '' }}>{formatMoeda(row.TOTALDEPCXTES)}</p>,
      footer: formatMoeda(calcularTotalCXTesoura()),
      sortable: true
    },
    {
      field: 'TOTALDEPCREDS',
      header: 'C.CredSystem',
      body: row => <p style={{ color: '' }}>{formatMoeda(row.TOTALDEPCREDS)}</p>,
      footer: formatMoeda(calcularTotalCCredSystem()),
      sortable: true
    },
    {
      field: 'TOTALDEPDPIX',
      header: 'D.PIX',
      body: row => <p style={{ color: '' }}>{formatMoeda(row.TOTALDEPDPIX)}</p>,
      footer: formatMoeda(calcularTotalDPix()),
      sortable: true
    },
    {
      field: 'TOTALDEPDDIN',
      header: 'D. Dinheiro',
      body: row => <p style={{ color: '' }}>{formatMoeda(row.TOTALDEPDDIN)}</p>,
      footer: formatMoeda(calcularTotalDDinheiro()),
      sortable: true
    },
    {
      field: 'TOTALDEPPROM',
      header: 'Prem. Prom',
      body: row => <p style={{ color: '' }}>{formatMoeda(row.TOTALDEPPROM)}</p>,
      footer: formatMoeda(calcularTotalPremioPromocao()),
      sortable: true
    },
    {
      field: 'TOTALDEPTVALOR',
      header: 'Transp. Valor',
      body: row => <p style={{ color: '' }}>{formatMoeda(row.TOTALDEPTVALOR)}</p>,
      footer: formatMoeda(calcularTotalTranspValor()),
      sortable: true
    },
    {
      field: 'TOTALDEPDEVCX',
      header: 'D. Sobra CX',
      body: row => <p style={{ color: '' }}>{formatMoeda(row.TOTALDEPDEVCX)}</p>,
      footer: formatMoeda(calcularTotalDSobraCX()),
      sortable: true
    },
    {
      field: 'valorDepositadoBandeira',
      header: 'Total Bandeira',
      body: row => <p style={{ color: '' }}>{formatMoeda(row.valorDepositadoBandeira)}</p>,
      footer: formatMoeda(calcularTotalBandeira()),
      sortable: true
    }

  ]
  return (

    <Fragment>

      <div className="panel">
        <div className="panel-hdr">
          <h2>
            Lista de Depósitos <span class="fw-300"><i> Consolidado Por Marca e Por Bancos</i> Pesquisa pela data do Movimento</span>
          </h2>
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
            value={dadosListaConciliarBancoConsolidado}
            size="small"
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            globalFilter={globalFilterValue}
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dadosListaConciliarBancoConsolidado.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
          >
            {colunasConciliarBancoConsolidado.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}

                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '0.8rem', fontWeight: 600 }}

              />
            ))}
          </DataTable>
        </div>

      </div>
    </Fragment>
  )
}