import { Fragment, useRef, useState } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { GrFormView } from "react-icons/gr";
import { get } from "../../../../../api/funcRequest";
import { ButtonTable } from "../../../../ButtonsTabela/ButtonTable";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useReactToPrint } from "react-to-print";
import HeaderTable from "../../../../Tables/headerTable";

export const ActionVoucherEmProcessamentoModal = ({
  show,
  handleClose,
  dadosVoucherProcessamento,
  setTabelaVisivelVoucherSelecionados,
  optionsModulos,
  usuarioLogado
}) => {

  const [dadosDetalheVoucher, setDadosDetalheVoucher] = useState([])
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Vouchers em Processamento',
  });

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Data Criação', 'Nº Voucher', 'Cliente',  'Tipo Troca', 'Status Voucher', 'Dias Passados'];
    worksheet['!cols'] = [
      { wpx: 50, caption: 'Nº' },
      { wpx: 150, caption: 'Data Criação' },
      { wpx: 250, caption: 'Nº Voucher' },
      { wpx: 250, caption: 'Cliente' },
      { wpx: 250, caption: 'Tipo Troca' },
      { wpx: 250, caption: 'Status Voucher' },
      { wpx: 250, caption: 'Dias Passados' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vouchers Em Processamento');
    XLSX.writeFile(workbook, 'vouchers_processamento.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Data Criação', 'Nº Voucher', 'Cliente',  'Tipo Troca', 'Status Voucher', 'Dias Passados']],
      body: dados.map(item => [
        item.contador, 
        item.DTINVOUCHERFORMATADO, 
        item.NUVOUCHER, 
        item.DSRAZAOSOCIALEMPRESAORIGEM,
        item.STTIPOTROCA,
        item.STSTATUS,
        item.DIFERENCAEMDIAS
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('vouchers_em_processamento.pdf');
  };


  const dados = dadosVoucherProcessamento.map((item, index) => {
    let contador = index + 1;
    const DATAHORAVOUCHER = new Date(item.voucher?.DTINVOUCHER);
    const DATAHORAATUAL = new Date();
    const DIFERENCAEMDIAS = Math.ceil(Math.abs(DATAHORAATUAL - DATAHORAVOUCHER.getTime()) / (1000 * 60 * 60 * 24));


    return {
      contador,
      DTINVOUCHER: item.voucher?.DTINVOUCHER,
      DTINVOUCHERFORMATADO: item.voucher?.DTINVOUCHERFORMATADO,
      NUVOUCHER: item.voucher?.NUVOUCHER,
      DSNOMERAZAOSOCIAL: item.voucher?.DSNOMERAZAOSOCIAL,
      STTIPOTROCA: item.voucher?.STTIPOTROCA,
      STSTATUS: item.voucher?.STSTATUS,
      IDVOUCHER: item.voucher?.IDVOUCHER,
      DIFERENCAEMDIAS
    }
  });

  const colunasVouchersModal = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th style={{ color: 'blue' }}>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'DTINVOUCHERFORMATADO',
      header: 'Data Criação',
      body: row => <th style={{ color: 'blue' }}>{row.DTINVOUCHERFORMATADO}</th>,
      sortable: true,
    },
    {
      field: 'NUVOUCHER',
      header: 'Nº voucher',
      body: row => <th style={{ color: 'blue' }}>{row.NUVOUCHER}</th>,
      sortable: true,
    },
    {
      field: 'DSNOMERAZAOSOCIAL',
      header: 'Cliente',
      body: row => <th style={{ color: 'blue' }}>{row.DSNOMERAZAOSOCIAL}</th>,
      sortable: true,
    },
    {
      field: 'STTIPOTROCA',
      header: 'Tipo Troca',
      body: row => <th style={{ color: 'red' }}>{row.STTIPOTROCA}</th>,
      sortable: true,
    },
    {
      field: 'STSTATUS',
      header: 'Status Voucher',
      body: row => <th style={{ color: 'blue' }}>{row.STSTATUS}</th>,
      sortable: true,
    },
    {
      field: 'DIFERENCAEMDIAS',
      header: 'Dias Passados',
      body: row => <th>{row.DIFERENCAEMDIAS}</th>,
      sortable: true,
    },
    {
      field: 'IDVOUCHER',
      header: 'Opções',
      body: (row) => (
        <div style={{ display: "flex", justifyContent: "space-around", width: '7rem' }}>
          <div>

            <ButtonTable
              titleButton={"Visualizar Voucher"}
              onClickButton={() => handleClickDetalhar(row)}
              Icon={GrFormView}
              iconSize={25}
              iconColor={"#fff"}
              cor={"success"}
              width="40px"
              height="40px"
            />
          </div>
        </div>
      ),
      sortable: true,
    },
  ]

  const handleClickDetalhar = async (row) => {
    if (row.IDVOUCHER) {
      handleDetalhar(row.IDVOUCHER);
    }
  }

  const handleDetalhar = async (IDVOUCHER) => {
    try {
      const response = await get(`/detalheVoucherDados?idVoucher=${IDVOUCHER}&idEmpresa=${usuarioLogado?.IDEMPRESA}&idSubGrupoEmpresa=${usuarioLogado?.IDGRUPOEMPRESARIAL}`);
      if (response.data) {
        setDadosDetalheVoucher(response.data)
        localStorage.setItem('dadosDetalheVoucher', JSON.stringify(response.data));
        setTabelaVisivelVoucherSelecionados(true);
        handleClose()
      }

    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ")
    }
  }

  const handleConfirmar = async () => {
    try {
      const response = await get(`/detalheVoucherDados?idEmpresa=${usuarioLogado?.IDEMPRESA}&stStatus='EM ANALISE`);
      if (response.data) {
        setDadosDetalheVoucher(response.data)
        localStorage.setItem('dadosDetalheVoucher', JSON.stringify(response.data));
        handleClose()
      }
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ")
    }
  }
 
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
            title={"Trocas em Processamento"}
            subTitle={"ou Não Liberadas"}
            handleClose={handleClose}
          />

          <Modal.Body>

            <div className="panel">
              <div className="panel-hdr">
                <h2>Vouchers </h2>
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
                  value={dados}
                  sortOrder={-1}
                  paginator={true}
                  rows={10}
                  globalFilter={globalFilterValue}
                  selectionMode="single"
                  selection={rowSelection}
                  onSelectionChange={(e) => setRowSelection(e.value)}
                  rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
                  paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                  currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
                  filterDisplay="menu"
                  showGridlines
                  stripedRows
                  emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
                >
                  {colunasVouchersModal.map(coluna => (
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

          </Modal.Body>

          <FooterModal
            ButtonTypeConfirmar={ButtonTypeModal}
            textButtonConfirmar={"Verificar Todos"}
            onClickButtonConfirmar={handleConfirmar}
            corConfirmar="success"

            ButtonTypeFechar={ButtonTypeModal}
            onClickButtonFechar={handleClose}
            textButtonFechar={"Prosseguir"}
            corFechar="secondary"
          />

        </div>
      </Modal>
    </Fragment>
  )
}