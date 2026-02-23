import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal";
import { FooterModal } from "../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal";
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const ActionListaLojaModal = ({ dadosListaLoja, show, handleClose }) => {
  const [modalListaLoja, setModalListaLoja] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();


  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista de Preço',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'ID Lista', 'Nome Loja', 'Status']],
      body: dados.map(item => [
        item.contador,
        item.IDEMPRESA,
        item.NOFANTASIA,
        item.STATIVO == 'True' ? 'ATIVA' : 'INATIVA'
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('lista_preco_loja.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'ID Lista', 'Nome Loja', 'Status']
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº' },
      { wpx: 100, caption: 'ID Lista' },
      { wpx: 300, caption: 'Nome Loja' },
      { wpx: 100, caption: 'Status' },
  
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista de Preço');
    XLSX.writeFile(workbook, 'lista_preco_loja.xlsx');
  };

  const dados = dadosListaLoja.flatMap((item) => {
    return item.detalheLista.map((detalhe, index) => {
      let contador = index + 1;
    
      return {
        contador,
        IDEMPRESA: detalhe.loja?.IDEMPRESA,
        NOFANTASIA: detalhe.loja?.NOFANTASIA,
        STATIVO: detalhe.loja?.STATIVO,
      }

    })
  })


  const colunasListaPreco = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'IDEMPRESA',
      header: 'ID Loja',
      body: row => <th>{row.IDEMPRESA}</th>,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Nome Loja',
      body: row => {
        return (
          <th>{row.NOFANTASIA}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'STATIVO',
      header: 'Situação',
      body: row => {
        return (
          <th style={{ color: row.STATIVO == 'True' ? 'blue' : 'red' }} >{row.STATIVO == 'True' ? 'ATIVA' : 'INATIVA'}</th>
        )
      },
      sortable: true,
    },

  ]


  return (
    <Fragment>
      <div className="card">
        <Modal
          show={show}
          onHide={handleClose}
          class="modal-content"
          size="xl"
          centered
        >

          <HeaderModal
            title={`Lista de Lojas: ${dadosListaLoja[0]?.listaPreco.NOMELISTA}`}
           
            handleClose={handleClose}
            size={"xl"}
          />

          <Modal.Body>
            <div className="">
              <p style={{fontWeight: 500}}>Número da Lista: <b>{dadosListaLoja[0]?.listaPreco.IDRESUMOLISTAPRECO}</b></p>
              <p style={{fontWeight: 500}}>Nome da Lista: <b>{dadosListaLoja[0]?.listaPreco.NOMELISTA}</b></p>
              <p style={{fontWeight: 500}}>Quantidade de Lojas na Lista: <b>{dadosListaLoja[0]?.detalheLista.length}</b></p>
              <p style={{fontWeight: 500}}>Lojas da Lista de Preço: <b></b></p>
            </div>
            <div className="panel">
             
              <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                <HeaderTable
                  globalFilterValue={globalFilterValue}
                  onGlobalFilterChange={onGlobalFilterChange}
                  handlePrint={handlePrint}
                  exportToExcel={exportToExcel}
                  exportToPDF={exportToPDF}
                />

              </div>
              <div className="card mb-4" ref={dataTableRef}>
                
                <DataTable
                  title="Vendas por Loja"
                  value={dados}
                  globalFilter={globalFilterValue}
                  size="small"
                  sortOrder={-1}
                  paginator={true}
                  rows={10}
                  showGridlines
                  stripedRows
                  emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
                >
                  {colunasListaPreco.map(coluna => (
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
              ButtonTypeFechar={ButtonTypeModal}
              onClickButtonFechar={handleClose}
              textButtonFechar={"Fechar"}
              corFechar={"secondary"}
            />
        </Modal>
      </div>
    </Fragment>
  )
}