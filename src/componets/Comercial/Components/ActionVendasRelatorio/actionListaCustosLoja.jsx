import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useReactToPrint } from "react-to-print";
import HeaderTable from "../../../Tables/headerTable";


export const ActionListaCustosLoja = ({ dadosCustosLojas }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const dataTableRef = useRef();
  const [rowSelection, setRowSelection] = useState(null);

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

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
      head: [['Nº', 'Empresa', 'QTD Clientes', 'QTD Produtos', 'Venda Bruto (- Desc)', 'Venda Liq (- Voucher)', 'Projeção Mês', 'Custo Total', 'Lucro Total', 'Markup']],
      body: dados.map(item => [
        item.contador,
        item.NOFANTASIA,
        item.VENDEDOR_MATRICULA,
        item.VENDEDOR_NOME,
        item.QTD_VENDAS,
        item.QTD_PRODUTOS,

      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vendas_vendedor.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Empresa', 'QTD Clientes', 'QTD Produtos', 'Venda Bruto (- Desc)', 'Venda Liq (- Voucher)', 'Projeção Mês', 'Custo Total', 'Lucro Total', 'Markup']
    worksheet['!cols'] = [
      { wpx: 100, caption: 'Nº' },
      { wpx: 200, caption: 'Empresa' },
      { wpx: 100, caption: 'QTD Clientes' },
      { wpx: 100, caption: 'QTD Produtos' },
      { wpx: 100, caption: 'Venda Bruto (- Desc)' },
      { wpx: 100, caption: 'Venda Liq (- Voucher)' },
      { wpx: 100, caption: 'Projeção Mês' },
      { wpx: 100, caption: 'Custo Total' },
      { wpx: 100, caption: 'Lucro Total' },
      { wpx: 100, caption: 'Markup' }
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas por Vendedor');
    XLSX.writeFile(workbook, 'vendas_vendedor.xlsx');
  };

  const calcularTotalVlLiquido = (item) => {
    const toFloat = (value) => (isNaN(parseFloat(value)) || value === null || value === undefined) ? 0 : parseFloat(value);
    return toFloat(item.VRTOTALVENDA) - toFloat(item.VRRECVOUCHER)
  }

  const calcularTotalMackup = (item) => {
    const toFloat = (value) => (isNaN(parseFloat(value)) || value === null || value === undefined) ? 0 : parseFloat(value);
    return (toFloat(item.VRTOTALVENDA) / toFloat(item.VRCUSTOTOTAL) - 1) * 100
  }

  const calcularSomaTotalLucro = (item) => {
    const toFloat = (value) => (isNaN(parseFloat(value)) || value === null || value === undefined) ? 0 : parseFloat(value);
    return toFloat(item.VRTOTALVENDA) - toFloat(item.VRCUSTOTOTAL)
  }

  // Função para filtrar dados baseado no globalFilterValue
  const filtrarDados = (dados, filtro) => {
    if (!filtro) return dados;

    return dados.filter(item => {
      return Object.values(item).some(value => {
        if (value === null || value === undefined) return false;
        return value.toString().toLowerCase().includes(filtro.toLowerCase());
      });
    });
  };

  const calcularTotalGeral = (field) => {
    return dados.reduce((total, item) => total + parseFloat(item[field] || 0), 0);
  }

  const calcularTotalPagina = (field) => {
    const dadosFiltrados = filtrarDados(dados, globalFilterValue);
    const firstIndex = first;
    const lastIndex = first + rows;
    const dataPaginada = dadosFiltrados.slice(firstIndex, lastIndex);
    return dataPaginada.reduce((total, item) => total + parseFloat(item[field] || 0), 0);
  }

  const calcularTotalLucroPorPagina = () => {
    const totalPagina = calcularTotalPagina('valorTotalLucro');
    const totalGeral = calcularTotalGeral('valorTotalLucro');

    if (globalFilterValue) {
      return `${formatMoeda(totalPagina)} (${formatMoeda(totalGeral)} total)`;
    }
    return `${formatMoeda(totalPagina)} (${formatMoeda(totalGeral)} total)`;
  }

  const calcularTotalCustoTotalPorPagina = () => {
    const totalPagina = calcularTotalPagina('VRCUSTOTOTAL');
    const totalGeral = calcularTotalGeral('VRCUSTOTOTAL');

    if (globalFilterValue) {
      return `${formatMoeda(totalPagina)} (${formatMoeda(totalGeral)} total)`;
    }
    return `${formatMoeda(totalPagina)} (${formatMoeda(totalGeral)} total)`;
  }

  const calcularTotalProjecaoMesPorPagina = () => {
    const totalPagina = calcularTotalPagina('VRTOTALVENDA');
    const totalGeral = calcularTotalGeral('VRTOTALVENDA');

    if (globalFilterValue) {
      return `${formatMoeda(totalPagina)} (${formatMoeda(totalGeral)} total)`;
    }
    return `${formatMoeda(totalPagina)} (${formatMoeda(totalGeral)} total)`;
  }

  const calcularTotalVendaLiquidaPorPagina = () => {
    const totalPagina = calcularTotalPagina('valorTotalLiquido');
    const totalGeral = calcularTotalGeral('valorTotalLiquido');

    if (globalFilterValue) {
      return `${formatMoeda(totalPagina)} (${formatMoeda(totalGeral)} total)`;
    }
    return `${formatMoeda(totalPagina)} (${formatMoeda(totalGeral)} total)`;
  }

  const calcularTotalVendaBrutaPorPagina = () => {
    const totalPagina = calcularTotalPagina('VRTOTALVENDA');
    const totalGeral = calcularTotalGeral('VRTOTALVENDA');

    if (globalFilterValue) {
      return `${formatMoeda(totalPagina)} (${formatMoeda(totalGeral)} total)`;
    }
    return `${formatMoeda(totalPagina)} (${formatMoeda(totalGeral)} total)`;
  }

  const calcularTotalQtdProdutosPorPagina = () => {
    const totalPagina = calcularTotalPagina('QTD_PRODUTO');
    const totalGeral = calcularTotalGeral('QTD_PRODUTO');

    if (globalFilterValue) {
      return `${totalPagina} (${totalGeral} total)`;
    }
    return `${totalPagina} (${totalGeral} total)`;
  }

  const calcularTotalQtdClientesPorPagina = () => {
    const totalPagina = calcularTotalPagina('QTD_CLIENTE');
    const totalGeral = calcularTotalGeral('QTD_CLIENTE');

    if (globalFilterValue) {
      return `${totalPagina} (${totalGeral} total)`;
    }
    return `${totalPagina} (${totalGeral} total)`;
  }

  const dados = dadosCustosLojas.map((item, index) => {
    let contador = index + 1;
    const valorTotalLiquido = calcularTotalVlLiquido(item);
    const valorTotalMackup = calcularTotalMackup(item);
    const valorTotalLucro = calcularSomaTotalLucro(item);
    return {
      contador,
      NOFANTASIA: item.NOFANTASIA,
      QTD_CLIENTE: item.QTD_CLIENTE,
      QTD_PRODUTO: item.QTD_PRODUTO,
      valorTotalLiquido: valorTotalLiquido,
      VRRECVOUCHER: item.VRRECVOUCHER,
      VALORDESCONTO: item.VALORDESCONTO,
      VRTOTALVENDA: item.VRTOTALVENDA,
      VRCUSTOTOTAL: item.VRCUSTOTOTAL,

      valorTotalLucro: valorTotalLucro,
      valorTotalMackup: valorTotalMackup,
    }
  })

  const colunasVendasCustosLojas = [
    { field: 'contador', header: 'Nº', body: row => <th>{row.contador}</th>, sortable: true },
    {
      field: 'NOFANTASIA',
      header: 'Loja',
      body: row => <p style={{ margin: '0px', width: '200px', fontWeight: 600 }}>{row.NOFANTASIA}</p>,
      sortable: true
    },
    {
      field: 'QTD_CLIENTE',
      header: 'Qtd. Clientes',
      body: row => <th>{row.QTD_CLIENTE}</th>,
      footer: () => {
        return (
          <div>
            <p style={{ fontWeight: 600, }}>{calcularTotalQtdClientesPorPagina()}</p>

          </div>
        )
      },
      sortable: true
    },
    {
      field: 'QTD_PRODUTO',
      header: 'Qtd. Produtos',
      body: row => <th>{row.QTD_PRODUTO}</th>,
      footer: () => {
        return (
          <div>
            <p style={{ fontWeight: 600, }}> {calcularTotalQtdProdutosPorPagina()}</p>
          </div>
        )
      },
      sortable: true
    },
    {
      field: 'VRTOTALVENDA',
      header: 'Venda Bruta (- Desc)',
      body: row => <th>{formatMoeda(row.VRTOTALVENDA)}</th>,
      footer: () => {
        return (
          <div>
            <p style={{ fontWeight: 600, }}>{calcularTotalVendaBrutaPorPagina()}</p>
          </div>
        )
      },
      sortable: true
    },
    {
      field: 'valorTotalLiquido',
      header: 'Venda Líq (- Voucher)',
      body: row => <th>{formatMoeda(row.valorTotalLiquido)}</th>,
      footer: () => {
        return (
          <div>
            <p style={{ fontWeight: 600, }}>{calcularTotalVendaLiquidaPorPagina()}</p>

          </div>
        )
      },
      sortable: true
    },
    {
      field: 'VRTOTALVENDA',
      header: 'Projeção Mês',
      body: row => <th>{formatMoeda(row.VRTOTALVENDA)}</th>,
      footer: () => {
        return (
          <div>
            <p style={{ fontWeight: 600, }}>{calcularTotalProjecaoMesPorPagina()}</p>
          </div>
        )
      },
      sortable: true
    },
    {
      field: 'VRCUSTOTOTAL',
      header: 'Custo Total',
      body: row => <th>{formatMoeda(row.VRCUSTOTOTAL)}</th>,
      footer: () => {
        return (
          <div>
            <p style={{ fontWeight: 600, }}>{calcularTotalCustoTotalPorPagina()}</p>
          </div>
        )
      },
      sortable: true
    },
    {
      field: 'valorTotalLucro',
      header: 'Lucro Total',
      body: row => <th>{formatMoeda(row.valorTotalLucro)}</th>,
      footer: () => {
        return (
          <div>
            <p style={{ fontWeight: 600, }}>{calcularTotalLucroPorPagina()}</p>
          </div>
        )
      },
      sortable: true
    },
    {
      field: 'valorTotalMackup',
      header: 'Mackup',
      body: row => <th >{parseFloat(row.valorTotalMackup).toFixed(2)}%</th>,
      sortable: true
    },
  ]

  return (

    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2>Vendas Custos Por Lojas</h2>
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
            size="small"
            value={dados}
            globalFilter={globalFilterValue}
            sortOrder={-1}
            paginator
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            rowsPerPageOptions={[10, 20, 30, 50, 100, dados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            first={first}
            rows={rows}
            onPage={onPageChange}
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasVendasCustosLojas.map(coluna => (
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