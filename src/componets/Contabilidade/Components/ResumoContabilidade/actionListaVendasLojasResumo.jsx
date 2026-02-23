import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { GrView } from "react-icons/gr";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { get } from "../../../../api/funcRequest";
import { toFloat } from "../../../../utils/toFloat";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";
import { ActionFechamentoLojaModal } from "../actionFechamentoLojaModal";


export const ActionListaVendasLojasResumo = ({ dadosTotalVendasEmpresa, dataPesquisa }) => {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [dadosDetalheFechamento, setDadosDetalheFechamento] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista de Vendas Por Loja',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Data', 'Loja', 'Dinheiro', 'Cartão', 'POS', 'Fatura', 'Despesa', 'Disponível']],
      body: dados.map(item => [item.dataPesquisa, item.NOFANTASIA, item.totalBruto, item.VALORTOTALDINHEIRO, item.VALORTOTALCARTAO, item.VALORTOTALPOS, item.VALORTOTALPIX, item.VALORTOTALCONVENIO, item.VALORTOTALFATURAPIX, item.VALORTOTALFATURA, item.totalDespesasAdiantamento, item.totalDisponivel]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vendas_loja.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosExcel);
    const workbook = XLSX.utils.book_new();
    const header = ['Data', 'Loja', 'Dinheiro', 'Cartão', 'POS', 'Fatura', 'Despesa', 'Disponível'];
    worksheet['!cols'] = [
      { wpx: 100, caption: 'Data' }, 
      { wpx: 200, caption: 'Loja' },
      { wpx: 100, caption: 'Dinheiro' },
      { wpx: 100, caption: 'Cartão' },
      { wpx: 100, caption: 'POS' },
      { wpx: 100, caption: 'Fatura' },
      { wpx: 100, caption: 'Despesa' },
      { wpx: 100, caption: 'Disponível' }
      
    ]; 
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista de Vendas Por Loja');
    XLSX.writeFile(workbook, 'vendas_loja.xlsx');
  };

  const calcularDespesasAdiantamento = (item) => {
    return (
      toFloat(item?.VALORTOTALDESPESA) +
      toFloat(item?.VALORTOTALADIANTAMENTOSALARIAL)
    );
  }

  const calcularTotalDisponivel = (item) => {
    return (
      (toFloat(item.VALORTOTALDINHEIRO) +
        toFloat(item.VALORTOTALFATURA)) -
      toFloat(item.VALORTOTALDESPESA) +
      toFloat(item.VALORTOTALADIANTAMENTOSALARIAL)
    )
  }
  const calcularTotalBruto = (item) => {
    return (
      toFloat(item?.VALORTOTALDINHEIRO) +
      toFloat(item?.VALORTOTALCARTAO) +
      toFloat(item?.VALORTOTALPOS) +
      toFloat(item?.VALORTOTALPIX) +
      toFloat(item?.VALORTOTALCONVENIO)
    )
  }

 

  const dadosExcel = Array.isArray(dadosTotalVendasEmpresa) ? dadosTotalVendasEmpresa.map((item, index) => {
    let contador = index + 1;
    const totalDespesasAdiantamento = calcularDespesasAdiantamento(item);
    const totalDisponivel = calcularTotalDisponivel(item);
    const totalBruto = calcularTotalBruto(item);
    return {

      dataPesquisa: dataPesquisa,
      NOFANTASIA: item.NOFANTASIA,
      totalBruto: formatMoeda(totalBruto),
      VALORTOTALDINHEIRO: formatMoeda(item.VALORTOTALDINHEIRO),
      VALORTOTALCARTAO: formatMoeda(item.VALORTOTALCARTAO),
      VALORTOTALPOS: formatMoeda(item.VALORTOTALPOS),
      VALORTOTALPIX: formatMoeda(item.VALORTOTALPIX),
      VALORTOTALCONVENIO: formatMoeda(item.VALORTOTALCONVENIO),
      VALORTOTALFATURAPIX: formatMoeda(item.VALORTOTALFATURAPIX),
      VALORTOTALFATURA: formatMoeda(item.VALORTOTALFATURA),
      totalDespesasAdiantamento: formatMoeda(totalDespesasAdiantamento),
      totalDisponivel: formatMoeda(totalDisponivel), 
      
    }
  }): [];

  const dados = Array.isArray(dadosTotalVendasEmpresa) ? dadosTotalVendasEmpresa.map((item, index) => {
    let contador = index + 1;
    const totalDespesasAdiantamento = calcularDespesasAdiantamento(item);
    const totalDisponivel = calcularTotalDisponivel(item);
    const totalBruto = calcularTotalBruto(item);
    return {

      dataPesquisa: dataPesquisa,
      NOFANTASIA: item.NOFANTASIA,
      totalBruto: totalBruto,
      VALORTOTALDINHEIRO: item.VALORTOTALDINHEIRO,
      VALORTOTALCARTAO: item.VALORTOTALCARTAO,
      VALORTOTALPOS: item.VALORTOTALPOS,
      VALORTOTALPIX: item.VALORTOTALPIX,
      VALORTOTALCONVENIO: item.VALORTOTALCONVENIO,
      VALORTOTALFATURAPIX: item.VALORTOTALFATURAPIX,
      VALORTOTALFATURA: item.VALORTOTALFATURA,
      totalDespesasAdiantamento: totalDespesasAdiantamento,
      totalDisponivel: totalDisponivel, 
      
      VALORTOTALDESPESA: item.VALORTOTALDESPESA,
      IDEMPRESA: item.IDEMPRESA,
      VALORTOTALADIANTAMENTOSALARIAL: item.VALORTOTALADIANTAMENTOSALARIAL,
      
    }
  }): [];
  
  const calcularTotal = (field) => {
    return dados.reduce((total, item) => total + parseFloat(item[field]), 0);
  };

  const calcularValorTotalDinheiro = () => {
    return calcularTotal('VALORTOTALDINHEIRO');
  }

  const calcularValorTotalCartao = () => {
    return calcularTotal('VALORTOTALCARTAO');
  }

  const calcularValorTotalPos = () => {
    return calcularTotal('VALORTOTALPOS');
  }

  const calcularValorTotalFatura = () => {
    return calcularTotal('VALORTOTALFATURA');
  }

  const calcularValorTotalDespesas = () => {
    return calcularTotal('totalDespesasAdiantamento');
  }

  const calcularValorTotalDisponivel = () => {
    return calcularTotal('totalDisponivel');
  }

  const colunasVendasPagamento = [
    {
      field: 'dataPesquisa',
      header: 'Data',
      body: row => <th style={{ color: 'blue', width: 100 }}>{row.dataPesquisa}</th>,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Loja',
      body: row => <p style={{ color: 'blue',width: '180px', fontWeight: 600 }}>{row.NOFANTASIA}</p>,
      footer: <th style={{ fontWeight: 700 }} >{'Total'}</th>,
      sortable: true,
    },

    {
      field: 'VALORTOTALDINHEIRO',
      header: 'Dinheiro',
      body: row => <th style={{ color: 'blue' }}>{formatMoeda(row.VALORTOTALDINHEIRO)}</th>,
      footer: <th style={{ fontWeight: 700 }} >{formatMoeda(calcularValorTotalDinheiro())}</th>,
      sortable: true,
    },
    {
      field: 'VALORTOTALCARTAO',
      header: 'Cartão',
      body: row => <th style={{ color: 'blue' }}>{formatMoeda(row.VALORTOTALCARTAO)}</th>,
      footer: <th style={{ fontWeight: 700 }} >{formatMoeda(calcularValorTotalCartao())}</th>,
      sortable: true,
    },
    {
      field: 'VALORTOTALPOS',
      header: 'POS',
      body: row => <th style={{ color: 'blue' }}>{formatMoeda(row.VALORTOTALPOS)}</th>,
      footer: <th style={{ fontWeight: 700 }} >{formatMoeda(calcularValorTotalPos())}</th>,
      sortable: true,
    },
    {
      field: 'VALORTOTALFATURA',
      header: 'Fatura',
      body: row => <th style={{ color: 'blue' }}>{formatMoeda(row.VALORTOTALFATURA)}</th>,
      footer: <th style={{ fontWeight: 700 }} >{formatMoeda(calcularValorTotalFatura())}</th>,
      sortable: true,
    },
    {
      field: 'totalDespesasAdiantamento',
      header: 'Despesa',
      body: row => <th style={{ color: 'red' }}>{formatMoeda(row.totalDespesasAdiantamento)}</th>,
      footer: <th style={{ fontWeight: 700, color: 'red' }}>{formatMoeda(calcularValorTotalDespesas())}</th>,
      sortable: true,
    },

    {
      field: 'totalDisponivel',
      header: 'Disponível',
      body: row => <th style={{ color: 'blue' }}>{formatMoeda(row.totalDisponivel)}</th>,
      footer: <th style={{ fontWeight: 700 }} >{formatMoeda(calcularValorTotalDisponivel())}</th>,
      sortable: true,
    },
    {
      field: 'contador',
      header: 'Opções',
      body: (row) => (
        <div>
          <ButtonTable
            titleButton={"Detalhar Fechamento"}
            onClickButton={() => handleClickEdit(row)}
            Icon={GrView}
            iconSize={25}
            iconColor={"#fff"}
            cor={"success"}
            width="40px"
            height="40px"
          />

        </div>
      ),
      sortable: true,
    }
  ]
 
  const handleEdit = async (IDEMPRESA) => {
    try {
      const response = await get(`/detalheFechamento?idEmpresa=${IDEMPRESA}&dataPesquisa=${dataPesquisa}`);

      if (response.data && response.data.length > 0) {
        setDadosDetalheFechamento(response.data);
        setModalVisivel(true);
      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da venda: ', error);
    }
  };

  const handleClickEdit = (row) => {
    if (row && row.IDEMPRESA) {
      handleEdit(row.IDEMPRESA);
    }
  };

  return (
    <Fragment>

      <div className="panel">
        <div className="panel-hdr mb-4">

          <h3>Lista de Vendas Por Loja</h3>
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
            title="Vendas por Loja"
            value={dados}
            globalFilter={globalFilterValue}
            size="small"
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasVendasPagamento.map(coluna => (
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

      <ActionFechamentoLojaModal
        show={modalVisivel}
        handleClose={() => setModalVisivel(false)}
        dadosDetalheFechamento={dadosDetalheFechamento}
        dataPesquisa={dataPesquisa}
      />
    </Fragment>
  )

}

