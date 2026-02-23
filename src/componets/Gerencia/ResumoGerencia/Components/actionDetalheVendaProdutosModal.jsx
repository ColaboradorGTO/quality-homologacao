import { Fragment, useRef, useState } from "react"
import { FooterModal } from "../../../Modais/FooterModal/footerModal"
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal"
import Modal from 'react-bootstrap/Modal';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal";

export const ActionDetalheVendaProdutosModal = ({ dadosProdutoModal, show, handleClose }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [size, setSize] = useState('small');
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Relação de Produtos ',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Cód Barras', 'Descrição', 'Vr. Unit', 'QTD', 'Vr. Recebido', 'Vendedor', 'Situação', 'Troca']],
      body: dados.map(item => [
        item.NUCODBARRAS,
        item.DSNOME,
        formatMoeda(item.VUNCOM),
        item.QTD,
        formatMoeda(item.VRTOTALLIQUIDO),
        item.VENDEDOR_NOME,
        item.STCANCELADO == 'True' ? 'ATIVO' : 'INATIVO',
        item.STTROCA

      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('relacao_produtos_venda.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Cód Barras', 'Descrição', 'Vr. Unit', 'QTD', 'Vr. Recebido', 'Vendedor', 'Situação', 'Troca'];
    worksheet['!cols'] = [
      { wpx: 100, caption: ' Cód Barras' },
      { wpx: 300, caption: 'Descrição' },
      { wpx: 100, caption: 'Vr. Unit' },
      { wpx: 100, caption: 'QTD' },
      { wpx: 100, caption: 'Vr. Recebido' },
      { wpx: 100, caption: 'Vendedor' },
      { wpx: 100, caption: 'Situação' },
      { wpx: 100, caption: 'Troca' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Relação de Produtos');
    XLSX.writeFile(workbook, 'relacao_produtos_venda.xlsx');
  }

  const dados = dadosProdutoModal?.map((item) => {
 
    return {
      NUCODBARRAS: item.NUCODBARRAS,
      DSNOME: item.DSNOME,
      VUNCOM: item.VUNCOM,
      QTD: item.QTD,
      VRTOTALLIQUIDO: item.VRTOTALLIQUIDO,
      VENDEDOR_NOME: item.VENDEDOR_NOME,
      STCANCELADO: item.STCANCELADO,
      STTROCA: item.STTROCA

    }
  });

  const colunasProdutoModal = [
    {
      field: 'NUCODBARRAS',
      header: 'Código Barras',
      body: row => <th>{row.NUCODBARRAS}</th>,
      sortable: true,

    },
    {
      field: 'DSNOME',
      header: 'Descrição',
      body: row => <th>{row.DSNOME}</th>,
      sortable: true,

    },
    {
      field: 'VUNCOM',
      header: 'Vr. Unit',
      body: row => <th>{formatMoeda(row.VUNCOM)}</th>,
      sortable: true,

    },
    {
      field: 'QTD',
      header: 'QTD',
      body: row => <th>{row.QTD}</th>,
      sortable: true,
    },
    {
      field: 'VRTOTALLIQUIDO',
      header: 'Vr Recebido',
      body: row => <th>{formatMoeda(row.VRTOTALLIQUIDO)}</th>,
      sortable: true,
    },
    {
      field: 'VENDEDOR_NOME',
      header: 'Vendedor',
      body: row => <th>{row.VENDEDOR_NOME}</th>,
      sortable: true,
    },

    {
      field: 'STCANCELADO',
      header: 'Situação',
      body: row => <th>{row.STCANCELADO == "False" ? "ATIVO" : "CANCELADO"}</th>,
      sortable: true,
    },
    {
      field: 'STTROCA',
      header: 'Troca',
      body: row => <th>{row.STTROCA == "False" ? "NÃO" : "SIM"}</th>,
      sortable: true,
    }
  ]
  return (
    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        className="modal fade"

        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >

        <div className="" role="document">

          <HeaderModal
            title={"Detalhe da Venda"}
            subTitle={"Relação de Produtos da Venda "}
            handleClose={handleClose}
          />

          <Modal.Body>
          <div className="panel">
            <div className="panel-hdr">
              <h2>Lista de Produtos da Venda Nº {dadosProdutoModal[0]?.IDVENDA}</h2>
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
                  title="Vendas por Produto"
                  value={dados}
                  globalFilter={globalFilterValue}
                  size={size}
                  sortOrder={-1}
                  rows={true}
                  showGridlines
                  stripedRows
                  emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
                >
                  {colunasProdutoModal.map(coluna => (
                    <Column
                      key={coluna.field}
                      field={coluna.field}
                      header={coluna.header}
                      body={coluna.body}
                      footer={coluna.footer}
                      sortable={coluna.sortable}
                      headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                      footerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                      bodyStyle={{ fontSize: '0.8rem' }}

                    />
                  ))}
                </DataTable>

              </div>
          </div>
          </Modal.Body>

          <FooterModal
            ButtonTypeFechar={ButtonTypeModal}
            textButtonFechar={"Fechar"}
            onClickButtonFechar={handleClose}
            corFechar="secondary"
          />
        </div>
      </Modal>
    </Fragment>
  )
}