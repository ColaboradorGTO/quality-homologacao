import { Fragment, useRef, useState } from "react"
import { ButtonTable } from "../../ButtonsTabela/ButtonTable";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { get } from "../../../api/funcRequest";
import { GrView } from "react-icons/gr";
import { formatMoeda } from "../../../utils/formatMoeda";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { ActionRelacaoProdutosModal } from "./Components/actionRelacaoRecebimentosModal";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../Tables/headerTable";
import Swal from "sweetalert2";

export const ActionListaVendasDescontoFuncionario = ({ dadosVendasConvenioFuncionario }) => {
  const [modalPagamentoVisivel, setModalPagamentoVisivel] = useState(false)
  const [dadosPagamentoModal, setDadosPagamentoModal] = useState([])
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Desconto Funcionario',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Caixa', 'Nº Venda', 'NFCe', 'Abertura', 'Operador', 'Conveniado', 'CPF', 'Valor Bruto', 'Desconto', 'Valor Liq']],
      body: dadosConvenioVendasDescontoFuncionario.map(item => [
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
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('desconto_funcionario.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosConvenioVendasDescontoFuncionario.map(item => ({
      'Nº': item.contador,
      'Caixa': item.IDCAIXAWEB ? 'CAIXA WEB' : 'CAIXA WEB',
      'Nº Venda': item.IDVENDA,
      'NFCe': item.NFE_INFNFE_IDE_NNF,
      'Abertura': item.DTHORAFECHAMENTO,
      'Operador': item.NOFUNCIONARIO,
      'Conveniado': item.NOCONVENIADO,
      'CPF': item.CPFCONVENIADO,
      'Valor Bruto': formatMoeda(item.VRBRUTOPAGO),
      'Desconto': formatMoeda(item.VRDESPAGO),
      'Valor Líquido': formatMoeda(item.VRLIQPAGO),
    })));
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Caixa', 'Nº Venda', 'NFCe', 'Abertura', 'Operador', 'Conveniado', 'CPF', 'Valor Bruto', 'Desconto', 'Valor Líquido']
    worksheet['!cols'] = [
      { wpx: 50, caption: 'Nº' },
      { wpx: 100, caption: 'Caixa' },
      { wpx: 100, caption: 'Nº Venda' },
      { wpx: 100, caption: 'NFCe' },
      { wpx: 100, caption: 'Abertura' },
      { wpx: 250, caption: 'Operador' },
      { wpx: 250, caption: 'Conveniado' },
      { wpx: 100, caption: 'CPF' },
      { wpx: 100, caption: 'Valor Bruto' },
      { wpx: 100, caption: 'Desconto' },
      { wpx: 100, caption: 'Valor Líquido' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Desconto Funcionario');
    XLSX.writeFile(workbook, 'desconto_funcionario.xlsx');
  };


  const dadosConvenioVendasDescontoFuncionario = dadosVendasConvenioFuncionario.map((item, index) => {
    let contador = index + 1;
    let vrTotalFaturaLoja = 0;
    vrTotalFaturaLoja + item.TOTALVENDAPROD;

    return {
      IDCAIXAWEB: item.IDCAIXAWEB + ' - ' + item.DSCAIXA,
      DSCAIXA: item.DSCAIXA,
      IDVENDA: item.IDVENDA,
      NFE_INFNFE_IDE_NNF: item.NFE_INFNFE_IDE_NNF,
      DTHORAFECHAMENTO: item.DTHORAFECHAMENTO,
      NOFUNCIONARIO: item.NOFUNCIONARIO,
      NOCONVENIADO: item.NOCONVENIADO,
      CPFCONVENIADO: item.CPFCONVENIADO,

      VRBRUTOPAGO: item.VRBRUTOPAGO,
      VRDESPAGO: item.VRDESPAGO,
      VRLIQPAGO: item.VRLIQPAGO,
      contador,
      vrTotalFaturaLoja
    };
  });

  const calcularTotalVrBruto = () => {
    let total = 0;
    for (let dados of dadosConvenioVendasDescontoFuncionario) {
      total += parseFloat(dados.VRBRUTOPAGO);
    }
    return total;
  }

  const calcularTotalVrDesconto = () => {
    let total = 0;
    for (let dados of dadosConvenioVendasDescontoFuncionario) {
      total += parseFloat(dados.VRDESPAGO);
    }
    return total;
  }

  const calcularTotalVrLiq = () => {
    let total = 0;
    for (let dados of dadosConvenioVendasDescontoFuncionario) {
      total += parseFloat(dados.VRLIQPAGO);
    }
    return total;
  }

  const colunaVendasConvenioDescontoFuncionario = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th> {row.contador}</th>,
      sortable: true,
    },
    {
      field: 'IDCAIXAWEB',
      header: 'Caixa ',
      body: row => <th> {row.IDCAIXAWEB}</th>,
      sortable: true,
    },
    {
      field: 'IDVENDA',
      header: 'Nº Venda ',
      body: row => <th> {row.IDVENDA}</th>,
      sortable: true,
    },
    {
      field: 'NFE_INFNFE_IDE_NNF',
      header: 'NFCe ',
      body: row => <th> {row.NFE_INFNFE_IDE_NNF}</th>,
      sortable: true,
    },
    {
      field: 'DTHORAFECHAMENTO',
      header: 'Abertura',
      body: row => <th> {row.DTHORAFECHAMENTO}</th>,
      sortable: true,
    },
    {
      field: 'NOFUNCIONARIO',
      header: 'Operador',
      body: row => <th> {row.NOFUNCIONARIO}</th>,
      sortable: true,
    },
    {
      field: 'NOCONVENIADO',
      header: 'Conveniado',
      body: row => <th> {row.NOCONVENIADO}</th>,
      footer: 'Total Vendas Convenio Desconto',
      sortable: true,
    },
    {
      field: 'CPFCONVENIADO',
      header: 'CPF',
      body: row => <th> {row.CPFCONVENIADO}</th>,
      sortable: true,
    },
    {
      field: 'VRBRUTOPAGO',
      header: 'Valor Bruto',
      body: row => <th> {formatMoeda(row.VRBRUTOPAGO)}</th>,
      footer: formatMoeda(calcularTotalVrBruto()),
      sortable: true,
    },
    {
      field: 'VRDESPAGO',
      header: 'Desconto',
      body: row => <th> {formatMoeda(row.VRDESPAGO)}</th>,
      footer: formatMoeda(calcularTotalVrDesconto()),
      sortable: true,
    },
    {
      field: 'VRLIQPAGO',
      header: 'Valor Liq',
      body: row => <th> {formatMoeda(row.VRLIQPAGO)}</th>,
      footer: formatMoeda(calcularTotalVrLiq()),
      sortable: true,
    },
    {

      header: 'Opções',
      body: row => (
        <div>
          <ButtonTable
            titleButton={"Detalhar Recebimentos"}
            Icon={GrView}
            cor={"primary"}
            iconSize={18}
            onClickButton={() => handleClickPagamento(row)}
            width="30px"
            height="30px"
          />

        </div>
      ),
      sortable: true,
    },
  ]

  const handleEditPagamento = async (IDVENDA) => {
    try {
      const response = await get(`/vendas-recebimentos?idVenda=${IDVENDA}`)
      if (response.data && response.data.length > 0) {
        setDadosPagamentoModal(response.data)
        setModalPagamentoVisivel(true)
 
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Sem Recebimentos',
          text: 'Esta venda não possui recebimentos para exibir.',
          confirmButtonText: 'OK',
          customClass: {
            container: 'custom-swal',
          },
        })
        return;
      }
    } catch (error) {
      console.log(error, 'não foi possivel pegar os dados da tabela')
    }
  }
  const handleClickPagamento = (row) => {
    if (row.IDVENDA) {
      handleEditPagamento(row.IDVENDA)
    }
  }


  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Total Vendas Convenio Desconto" colSpan={8} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', fontWeight: 'bold' }} />
        <Column footer={formatMoeda(calcularTotalVrBruto())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', fontWeight: 'bold' }} />
        <Column footer={formatMoeda(calcularTotalVrDesconto())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', fontWeight: 'bold' }} />
        <Column footer={formatMoeda(calcularTotalVrLiq())} colSpan={2} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem', fontWeight: 'bold' }} />
      </Row>
    </ColumnGroup>
  )

  return (
    <Fragment>
      <div className="panel" >

        <header className="panel-hdr tituloListVendasCaixa" >
          <h2 id="TituloLoja" >
            Lista de Vendas Com Desconto Funcionários e PN
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
            title="Lista de Vendas Com Desconto Funcionários e PN"
            value={dadosConvenioVendasDescontoFuncionario}
            globalFilter={globalFilterValue}
            size="small"
            sortOrder={-1}
            paginator={true}
            footerColumnGroup={footerGroup}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dadosConvenioVendasDescontoFuncionario.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunaVendasConvenioDescontoFuncionario.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}
                body={coluna.body}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '0.8rem' }}

              />
            ))}
          </DataTable>
        </div>

      </div>

      <ActionRelacaoProdutosModal
        show={modalPagamentoVisivel}
        handleClose={() => setModalPagamentoVisivel(false)}
        dadosPagamentoModal={dadosPagamentoModal}
      />
    </Fragment>
  )
}