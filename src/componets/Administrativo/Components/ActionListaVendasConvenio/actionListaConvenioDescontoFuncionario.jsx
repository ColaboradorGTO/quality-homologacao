import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { dataFormatada, dataHoraFormatada } from "../../../../utils/dataFormatada";
import { formatMoeda } from "../../../../utils/formatMoeda";
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { toFloat } from "../../../../utils/toFloat";

export const ActionListaConvenioDescontoFuncionario = ({ dadosVendasConvenioFuncionario }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Vend Convenio Desc Funcionario',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['ID','Loja','Data', 'CPF', 'Funcionário', 'Vr.Bruto NF', 'Vr.Desconto NF', 'Vr.Líquido NF', 'Vr.Bruto', 'Vr.Desconto', 'Vr.Líquido', 'Vr.Dinheiro', 'Vr.Cartão', 'Vr.POS', 'Vr.Voucher','Vr.Convênio']],
      body: dadosListaConvenio.map(item => [
        item.contador,
        item.NOFANTASIA,
        item.DTLANCAMENTO,
        item.NUCPF,
        item.NOFUNCIONARIO,
        formatMoeda(item.VPROD),
        formatMoeda(item.VDESC),
        formatMoeda(item.VNF),
        formatMoeda(item.VRBRUTO),
        formatMoeda(item.VRDESCONTO),
        formatMoeda(item.VRLIQUIDO),
        formatMoeda(item.VRRECDINHEIRO),
        formatMoeda(item.VRRECCARTAO),
        formatMoeda(item.VRRECPOS),
        formatMoeda(item.VRRECVOUCHER),
        formatMoeda(item.VRRECCONVENIO),

      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vendas_convenio_desconto_funcionario.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosListaConvenio.map(item => ({
      'N': item.contador,
      'Loja': item.NOFANTASIA,
      'Data': dataFormatada(item.DTLANCAMENTO),
      'CPF': item.NUCPF,
      'Funcionário': item.NOFUNCIONARIO,
      'Vr.Bruto NF': formatMoeda(item.VPROD),
      'Vr.Desconto NF': formatMoeda(item.VDESC),
      'Vr.Líquido NF': formatMoeda(item.VNF),
      'Vr.Bruto': formatMoeda(item.VRBRUTO),
      'Vr.Desconto': formatMoeda(item.VRDESCONTO),
      'Vr.Líquido': formatMoeda(item.VRLIQUIDO),
      'Vr.Dinheiro': formatMoeda(item.VRRECDINHEIRO),
      'Vr.Cartão': formatMoeda(item.VRRECCARTAO),
      'Vr.POS': formatMoeda(item.VRRECPOS),
      'Vr.Voucher': formatMoeda(item.VRRECVOUCHER),
      'Vr.Convênio': formatMoeda(item.VRRECCONVENIO)
    })));
    const workbook = XLSX.utils.book_new();
    const header = ['ID','Loja','Data', 'CPF', 'Funcionário', 'Vr.Bruto NF', 'Vr.Desconto NF', 'Vr.Líquido NF', 'Vr.Bruto', 'Vr.Desconto', 'Vr.Líquido', 'Vr.Dinheiro', 'Vr.Cartão', 'Vr.POS', 'Vr.Voucher','Vr.Convênio'];
    worksheet['!cols'] = [
      {wpx: 50, caption: 'Nº'},
      {wpx: 200, caption: 'Loja'},
      {wpx: 100, caption: 'Data'},
      {wpx: 100, caption: 'CPF'},
      {wpx: 250, caption: 'Funcionário'},
      {wpx: 100, caption: 'Vr.Bruto NF'},
      {wpx: 100, caption: 'Vr.Desconto NF'},
      {wpx: 100, caption: 'Vr.Líquido NF'},
      {wpx: 100, caption: 'Vr.Bruto'},
      {wpx: 100, caption: 'Vr.Desconto'},
      {wpx: 100, caption: 'Vr.Líquido'},
      {wpx: 100, caption: 'Vr.Dinheiro'},
      {wpx: 100, caption: 'Vr.Cartão'},
      {wpx: 100, caption: 'Vr.POS'},
      {wpx: 100, caption: 'Vr.Voucher'},
      {wpx: 100, caption: 'Vr.Convênio'}
    ];
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Venda Conv Desc Funcionario');
    XLSX.writeFile(workbook, 'vendas_convenio_desconto_funcionario.xlsx');
  };


  const cacularTotalValorBrutoNF = () => {
    let total = 0;
    for (let dados of dadosVendasConvenioFuncionario) {
      total += toFloat(dados.VPROD)
    }
    return total
  }

  const cacularTotalValorDescontoNF = () => {
    let total = 0;
    for (let dados of dadosVendasConvenioFuncionario) {
      total += toFloat(dados.VDESC)
    }
    return total
  }

  const cacularTotalValorLiquidoNF = () => {
    let total = 0;
    for (let dados of dadosVendasConvenioFuncionario) {
      total += toFloat(dados.VNF)
    }
    return total
  }

  const cacularTotalValorBruto = () => {
    let total = 0;
    for (let dados of dadosVendasConvenioFuncionario) {
      total += toFloat(dados.VRBRUTO)
    }
    return total
  }

  const cacularTotalValorDesconto = () => {
    let total = 0;
    for (let dados of dadosVendasConvenioFuncionario) {
      total += toFloat(dados.VRDESCONTO)
    }
    return total
  }

  const cacularTotalValorLiquido = () => {
    let total = 0;
    for (let dados of dadosVendasConvenioFuncionario) {
      total += toFloat(dados.VRLIQUIDO)
    }
    return total
  }

  const cacularTotalValorRecebidoDinheiro = () => {
    let total = 0;
    for (let dados of dadosVendasConvenioFuncionario) {
      total += toFloat(dados.VRRECDINHEIRO)
    }
    return total
  }

  const cacularTotalValorRecebidoCartao = () => {
    let total = 0;
    for (let dados of dadosVendasConvenioFuncionario) {
      total += toFloat(dados.VRRECCARTAO)
    }
    return total
  }

  const cacularTotalValorRecebidoPOS = () => {
    let total = 0;
    for (let dados of dadosVendasConvenioFuncionario) {
      total += toFloat(dados.VRRECPOS)
    }
    return total
  }

  const cacularTotalValorRecebidoVoucher = () => {
    let total = 0;
    for (let dados of dadosVendasConvenioFuncionario) {
      total += toFloat(dados.VRRECVOUCHER)
    }
    return total
  }

  const cacularTotalValorRecebidoConvenio = () => {
    let total = 0;
    for (let dados of dadosVendasConvenioFuncionario) {
      total += toFloat(dados.VRRECCONVENIO)
    }
    return total
  }
  const dadosListaConvenio = dadosVendasConvenioFuncionario.map((item, index) => {
    let contador = index + 1;
    console.log(item)
    return {
      NOFANTASIA: item.NOFANTASIA,
      NumeroVenda: item.NumeroVenda,
      DTLANCAMENTO: item.DTLANCAMENTO,
      NUCPF: item.NUCPF,
      NOFUNCIONARIO: item.NOFUNCIONARIO,
      VRBRUTO: toFloat(item.VRBRUTO),
      VRDESCONTO: toFloat(item.VRDESCONTO),
      VRLIQUIDO: toFloat(item.VRLIQUIDO),
      VRRECDINHEIRO: toFloat(item.VRRECDINHEIRO),
      VRRECCARTAO: toFloat(item.VRRECCARTAO),
      VRRECPOS: toFloat(item.VRRECPOS),
      VRRECCHEQUE: toFloat(item.VRRECCHEQUE),
      VRRECVOUCHER: toFloat(item.VRRECVOUCHER),
      VRRECCONVENIO: toFloat(item.VRRECCONVENIO),
      VPROD: toFloat(item.VPROD),
      VDESC: toFloat(item.VDESC),
      VNF: toFloat(item.VNF),
      contador

    }
  });

  const colunasConvenio = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th style={{ color: 'blue' }}> {row.contador} </th>,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Empresa',
      body: row => <p style={{ color: 'blue', width: '200px', margin: '0px', fontWeight: 600 }}> {row.NOFANTASIA}</p>,
      sortable: true,
    },
    {
      field: 'NumeroVenda',
      header: 'Nº Venda',
      body: row => <p style={{ color: 'blue', width: '100px', margin: '0px', fontWeight: 600 }}> {row.NumeroVenda}</p>,
      sortable: true,
    },
    {
      field: 'DTLANCAMENTO',
      header: 'Data',
      body: row => <th style={{ color: 'blue' }}> {dataHoraFormatada(row.DTLANCAMENTO)}</th>,
      sortable: true,
    },
    {
      field: 'NUCPF',
      header: 'CPF',
      body: row => <th style={{ color: 'blue' }}> {row.NUCPF}</th>,
      sortable: true,
    },
    {
      field: 'NOFUNCIONARIO',
      header: 'Funcionário',
      body: row => <p style={{ color: 'blue', width: '250px', margin: '0px', fontWeight: 600 }}> {row.NOFUNCIONARIO}</p>,
      footer: 'Total Valores',
      sortable: true,
    },
    {
      field: 'VPROD',
      header: 'Vr. Bruto NF',
      body: row => <p style={{ color: 'blue', width: '150px', fontWeight: 600  }}> {formatMoeda(row.VPROD)}</p>,
      footer: formatMoeda(cacularTotalValorBrutoNF()),
      sortable: true,
    },
    {
      field: 'VDESC',
      header: 'Vr. Desconto NF',
      body: row => <p style={{ color: 'blue', width: '150px', fontWeight: 600 }}> {formatMoeda(row.VDESC)}</p>,
      footer: formatMoeda(cacularTotalValorDescontoNF()),
      sortable: true,
    },
    {
      field: 'VNF',
      header: 'Vr Líquido NF',
      body: row => <p style={{ color: 'blue',width: '100px', fontWeight: 600  }}> {formatMoeda(row.VNF)}</p>,
      footer: formatMoeda(cacularTotalValorLiquidoNF()),
      sortable: true,
    },
    {
      field: 'VRBRUTO',
      header: 'Vr Bruto',
      body: row => <p style={{ color: 'blue', width: '100px', fontWeight: 600 }}> {formatMoeda(row.VRBRUTO)}</p>,
      footer: formatMoeda(cacularTotalValorBruto()),
      sortable: true,
    },
    {
      field: 'VRDESCONTO',
      header: 'Vr Desconto',
      body: row => <th style={{ color: 'blue' }}> {formatMoeda(row.VRDESCONTO)}</th>,
      footer: formatMoeda(cacularTotalValorDesconto()),
      sortable: true,
    },
    {
      field: 'VRLIQUIDO',
      header: 'Vr Líquido',
      body: row => <th style={{ color: 'blue' }}> {formatMoeda(row.VRLIQUIDO)}</th>,
      footer: formatMoeda(cacularTotalValorLiquido()),
      sortable: true,
    },
    {
      field: 'VRRECDINHEIRO',
      header: 'Vr Dinheiro',
      body: row => <th style={{ color: 'blue' }}> {formatMoeda(row.VRRECDINHEIRO)}</th>,
      footer: formatMoeda(cacularTotalValorRecebidoDinheiro()),
      sortable: true,
    },
    {
      field: 'VRRECCARTAO',
      header: 'Vr Cartão',
      body: row => <th style={{ color: 'blue' }}> {formatMoeda(row.VRRECCARTAO)}</th>,
      footer: formatMoeda(cacularTotalValorRecebidoCartao()),
      sortable: true,
    },
    {
      field: 'VRRECPOS',
      header: 'Vr POS',
      body: row => <th style={{ color: 'blue' }}> {formatMoeda(row.VRRECPOS)}</th>,
      footer: formatMoeda(cacularTotalValorRecebidoPOS()),
      sortable: true,
    },
    {
      field: 'VRRECVOUCHER',
      header: 'Vr Voucher',
      body: row => <th style={{ color: 'blue' }}> {formatMoeda(row.VRRECVOUCHER)}</th>,
      footer: formatMoeda(cacularTotalValorRecebidoVoucher()),
      sortable: true,
    },
    {
      field: 'VRRECCONVENIO',
      header: 'Vr Convênio',
      body: row => <th style={{ color: 'blue' }}> {formatMoeda(row.VRRECCONVENIO)}</th>,
      footer: formatMoeda(cacularTotalValorRecebidoConvenio()),
      sortable: true,
    },
  ]

  return (
    <Fragment>

      <div className="panel">
        <div className="panel-hdr">
          <h2 >
            Lista Vendas Desconto Funcionários
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
            value={dadosListaConvenio}
            globalFilter={globalFilterValue}
            size="small"
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            sortField="VRTOTALPAGO"
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dadosListaConvenio.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasConvenio.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}

                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '1rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }}
                bodyStyle={{ fontSize: '0.8rem' }}

              />
            ))}
          </DataTable>
        </div>
      </div>
    </Fragment>
  )
}