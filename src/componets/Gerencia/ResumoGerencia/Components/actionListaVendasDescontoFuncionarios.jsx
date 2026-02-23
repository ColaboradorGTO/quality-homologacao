import { Fragment, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from '../../../ButtonsTabela/ButtonTable';
import { formatMoeda } from '../../../../utils/formatMoeda';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { GrView } from 'react-icons/gr';
import { get } from '../../../../api/funcRequest';
import HeaderTable from '../../../Tables/headerTable';
import { useReactToPrint } from 'react-to-print';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { ActionRelacaoRecebimentosModal } from './actionRelacaoRecebimentosModal';

export const ActionListaVendasDescontoFuncionario = ({ dadosVendasConvenioDescontoFuncionario }) => {
  const [modalPagamentoVisivel, setModalPagamentoVisivel] = useState(false)
  const [dadosPagamentoModal, setDadosPagamentoModal] = useState([])
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef()

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Vendas Desconto Funcionarios',
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
    doc.save('vendas_desconto_funcionarios.pdf');
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vendas Desconto Funcionarios");
    XLSX.writeFile(workbook, 'vendas_desconto_funcionarios.xlsx');
  };

  const dados = dadosVendasConvenioDescontoFuncionario.map((item, index) => {
    let contador = index + 1;
    

    return {
      contador,
      IDCAIXAWEB:` ${item.IDCAIXAWEB} - ${item.DSCAIXA}`,
      IDVENDA: item.IDVENDA,
      NFE_INFNFE_IDE_NNF: item.NFE_INFNFE_IDE_NNF,
      DTHORAFECHAMENTO: item.DTHORAFECHAMENTO,
      NOFUNCIONARIO: item.NOFUNCIONARIO,
      NOCONVENIADO: item.NOCONVENIADO,
      CPFCONVENIADO: item.CPFCONVENIADO,

      VRBRUTOPAGO: item.VRBRUTOPAGO,
      VRDESPAGO: item.VRDESPAGO,
      VRLIQPAGO: item.VRLIQPAGO,
      
    };
  });

  const calcularValorBruto = () => {
    let total = 0;
    for (let dadosDesconto of dados) {
      total += parseFloat(dadosDesconto.VRBRUTOPAGO);
    }
    return total;
  }

  const calcularValorDesconto = () => {
    let total = 0;
    for (let dadosDesconto of dados) {
      total += parseFloat(dadosDesconto.VRDESPAGO);
    }
    return total;
  }

  const calcularValorLiquido = () => {
    let total = 0;
    for (let dadosDesconto of dados) {
      total += parseFloat(dadosDesconto.VRLIQPAGO);
    }
    return total;
  }

  const colunaVendasConvenioDescontoFuncionario = [
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
      body: row => <th >{row.DTHORAFECHAMENTO}</th>,
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
      footer: 'Total Vendas Convenio Desconto',
      sortable: true,
    },
    {
      field: 'VRBRUTOPAGO',
      header: 'Valor Bruto',
      body: row => <th>{formatMoeda(row.VRBRUTOPAGO)}</th>,
      footer: formatMoeda(calcularValorBruto()),
      sortable: true,
    },
    {
      field: 'VRDESPAGO',
      header: 'Desconto',
      body: row => <th>{formatMoeda(row.VRDESPAGO)}</th>,
      footer: formatMoeda(calcularValorDesconto()),
      sortable: true,
    },
    {
      field: 'VRLIQPAGO',
      header: 'Valor Liq',
      body: row => <th>{formatMoeda(row.VRLIQPAGO)}</th>,
      footer: formatMoeda(calcularValorLiquido()),
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
            width='35px'
            height='35px'
            onClickButton={() => handleClickPagamento(row)}
          />

        </div>
      ),
      sortable: true,
    },

  ]

  const handleEditPagamento = async (IDVENDA) => {
    try {
      const response = await get(`/vendas-recebimentos?idVenda=${IDVENDA}`)
      if (response.data) {
        setDadosPagamentoModal(response.data)
        setModalPagamentoVisivel(true)

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
        <Column footer="Total Vendas Convenio Desconto" colSpan={8} footerStyle={{ textAlign: 'center', color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} />
        <Column footer={formatMoeda(calcularValorBruto())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} />
        <Column footer={formatMoeda(calcularValorDesconto())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} />
        <Column footer={formatMoeda(calcularValorLiquido())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} />
        <Column footer={""} colSpan={1} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }}/>

      </Row>
    </ColumnGroup>
  )

  return (
    <Fragment>


      <div className="panel" >
        <header className="panel-hdr" >
          <h2>
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
             paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
          >
            {colunaVendasConvenioDescontoFuncionario.map(coluna => (
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
      {modalPagamentoVisivel && (
        <ActionRelacaoRecebimentosModal
          show={modalPagamentoVisivel}
          handleClose={() => setModalPagamentoVisivel(false)}
          dadosPagamentoModal={dadosPagamentoModal}
        />
      )}
    </Fragment>
  )
}