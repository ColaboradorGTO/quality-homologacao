import { Fragment, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from '../../../../utils/formatMoeda';
import { ButtonTable } from '../../../ButtonsTabela/ButtonTable';
import { get } from '../../../../api/funcRequest';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'react-bootstrap';
import { GrView } from 'react-icons/gr';
import { FaProductHunt } from 'react-icons/fa';
import { MdOutlineAttachMoney } from 'react-icons/md';
import { ActionRelacaoRecebimentosModal } from './actionRelacaoRecebimentosModal';
import { ActionDetalheVendaProdutosModal } from './actionDetalheVendaProdutosModal';
import { ActionDetalheVendaModal } from './actionDetalheVendaModal';
import HeaderTable from '../../../Tables/headerTable';
import { useReactToPrint } from 'react-to-print';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const ActionListaVendasCanceladas = ({ dadosVendasCanceladas, empresa }) => {
  const [modalProdutoVisivel, setModalProdutoVisivel] = useState(false)
  const [modalVendaVisivel, setModalVendaVisivel] = useState(false)
  const [modalPagamentoVisivel, setModalPagamentoVisivel] = useState(false)
  const [dadosProdutoModal, setDadosProdutoModal] = useState([])
  const [dadosVendas, setDadosVendas] = useState([])
  const [dadosPagamentoModal, setDadosPagamentoModal] = useState([])
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef()

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Vendas Ativas',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Caixa', 'Nº Venda', 'NFCe', 'Abertura', 'Operador', 'Valor', 'Nota']],
      body: dados.map(item => [
        item.contador,
        item.IDCAIXAWEB,
        item.IDVENDA,
        item.NFE_INFNFE_IDE_NNF,
        item.DTHORAFECHAMENTO,
        item.NOFUNCIONARIO,
        formatMoeda(item.VRTOTALPAGO),
      ]),
      autoPrint: true,
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vendas_ativas.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Caixa', 'Nº Venda', 'NFCe', 'Abertura', 'Operador', 'Valor', 'Nota'];
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº' },
      { wpx: 100, caption: 'Caixa' },
      { wpx: 100, caption: 'Nº Venda' },
      { wpx: 100, caption: 'NFCe' },
      { wpx: 100, caption: 'Abertura' },
      { wpx: 200, caption: 'Operador' },
      { wpx: 100, caption: 'Valor' },
      { wpx: 100, caption: 'Nota' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vendas Ativas");
    XLSX.writeFile(workbook, 'vendas_ativas.xlsx');
  };

  const dados = dadosVendasCanceladas.map((item, index) => {
    let contador = index + 1;

    return {
      IDCAIXAWEB: `${item.IDCAIXAWEB} - ${item.DSCAIXA}`,
      IDVENDA: item.IDVENDA,
      NFE_INFNFE_IDE_NNF: item.NFE_INFNFE_IDE_NNF,
      DTHORAFECHAMENTO: item.DTHORAFECHAMENTO,
      NOFUNCIONARIO: item.NOFUNCIONARIO,
      NOFUNCIOCANCEL: item.NOFUNCIOCANCEL,
      STCONFERIDO: item.STCONFERIDO,
      VRTOTALPAGO: parseFloat(item.VRTOTALPAGO),
      VRTOTALDESCONTO: parseFloat(item.VRTOTALDESCONTO),
      VRTOTALVENDA: parseFloat(item.VRTOTALVENDA),
      STCONTINGENCIA: item.STCONTINGENCIA == 'False' ? 'Contigência' : 'Emitida',
      TXTMOTIVOCANCELAMENTO: item.TXTMOTIVOCANCELAMENTO,
      contador
    };
  });

  const calcularValorTotal = () => {
    let total = 0;
    for (let dadosCancelados of dados) {
      total += parseFloat(dadosCancelados.VRTOTALPAGO);
    }
    return total;
  }
  const colunaVendasCanceladas = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'IDCAIXAWEB',
      header: 'Caixa',
      body: row => <p style={{ margin: 0, fontWeight: 600, width: '150px' }}>{row.IDCAIXAWEB}</p>,
      sortable: true,
    },
    {
      field: 'IDVENDA',
      header: 'Nº Venda',
      body: row => <p style={{ margin: 0, fontWeight: 600, width: '150px' }}>{row.IDVENDA}</p>,
      sortable: true,
    },
    {
      field: 'NFE_INFNFE_IDE_NNF',
      header: 'NFCe',
      body: row => <th>{row.NFE_INFNFE_IDE_NNF}</th>,
      sortable: true,
    },
    {
      field: 'DTHORAFECHAMENTO',
      header: 'Abertura',
      body: row => <th>{row.DTHORAFECHAMENTO}</th>,
      sortable: true,
    },
    {
      field: 'NOFUNCIONARIO',
      header: 'Operador',
      body: row => <p style={{ margin: 0, fontWeight: 600, width: '200px' }}>{row.NOFUNCIONARIO}</p>,
      footer: 'Total Vendas Canceladas',
      sortable: true,
    },
    {
      field: 'VRTOTALPAGO',
      header: 'Valor',
      body: row => <th>{formatMoeda(row.VRTOTALPAGO)}</th>,
      footer: formatMoeda(calcularValorTotal()),
      sortable: true,
    },
    {
      field: 'STCONTINGENCIA',
      header: 'Nota',
      body: row => (
        <th style={{ color: row.STCONTINGENCIA == 'Contigência' ? 'red' : 'blue' }}>
          {row.STCONTINGENCIA}
        </th>
      ),
      sortable: true,
    },
    {
      field: 'TXTMOTIVOCANCELAMENTO',
      header: 'Motivo',
      body: row => <p style={{ margin: 0, fontWeight: 600, width: '200px' }}>{row.TXTMOTIVOCANCELAMENTO}</p>,
      sortable: true,
    },

    {
      header: 'Opções',
      body: (row) => (
        <div className="p-1 "
          style={{ justifyContent: "space-between", display: "flex" }}
        >
          <div className="p-1">
            <ButtonTable
              titleButton={"Detalhar Venda"}
              onClickButton={() => handleClickVenda(row)}
              Icon={GrView}
              iconSize={25}
              width="35px"
              height="35px"
              cor={"info"}
            />
          </div>
          <div className="p-1">
            <ButtonTable
              titleButton={"Detalhar Produtos"}
              onClickButton={() => handleClickProduto(row)}
              Icon={FaProductHunt}
              iconSize={25}
              width="35px"
              height="35px"
              cor={"warning"}
            />
          </div>
          <div className="p-1">
            <ButtonTable
              titleButton={"Detalhar Recebimentos"}
              onClickButton={() => handleClickPagamento(row)}
              Icon={MdOutlineAttachMoney}
              iconSize={25}
              width="35px"
              height="35px"
              cor={"success"}
            />
          </div>
        </div>
      ),
    },

  ]

  const handleClickVenda = async (row) => {
    if (row && row.IDVENDA && empresa) {
      handleEditVenda(row.IDVENDA, empresa);
    }
  }

  const handleEditVenda = async (IDVENDA, empresa) => {

    try {
      const response = await get(`/resumo-venda-caixa-detalhado?idVenda=${IDVENDA}&idEmpresa=${empresa}`)
      if (response.data) {
        setDadosVendas(response.data)
        setModalVendaVisivel(true)
      }
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ")
    }

  }

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
    if (row && row.IDVENDA) {
      handleEditPagamento(row.IDVENDA)
    }
  }

  const handleEditProduto = async (IDVENDA, empresa) => {
    try {
      const response = await get(`/detalhe-venda?idVenda=${IDVENDA}&idEmpresa=${empresa}`)
      if (response.data) {
        setDadosProdutoModal(response.data)
        setModalProdutoVisivel(true)
      }
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ")
    }
  }

  const handleClickProduto = async (row) => {
    if (row && row.IDVENDA && empresa) {
      handleEditProduto(row.IDVENDA, empresa)
    }
  }

  const footerGroup = (
    <ColumnGroup>
      <Row>
        <Column footer="Total Vendas Cancelada " colSpan={6} footerStyle={{ textAlign: 'center', color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} />
        <Column footer={formatMoeda(calcularValorTotal())} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} />
        <Column footer={""} colSpan={4} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} />
      </Row>
    </ColumnGroup>
  )

  return (
    <Fragment>


      <div className="panel" >
        <header className="panel-hdr" >
          <h2 >
            Lista de Vendas Canceladas
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
            title="Vendas Canceladas"
            value={dados}
            size="small"
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            globalFilter={globalFilterValue}
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
            {colunaVendasCanceladas.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}

                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '1rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '1rem' }}

              />
            ))}
          </DataTable>
        </div>

      </div>


      {modalVendaVisivel && (
        <ActionDetalheVendaModal
          show={modalVendaVisivel}
          handleClose={() => setModalVendaVisivel(false)}
          dadosVendas={dadosVendas}
        />
      )}

      {modalProdutoVisivel && (

        <ActionDetalheVendaProdutosModal
          show={modalProdutoVisivel}
          handleClose={() => setModalProdutoVisivel(false)}
          dadosProdutoModal={dadosProdutoModal}
        />
      )}

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