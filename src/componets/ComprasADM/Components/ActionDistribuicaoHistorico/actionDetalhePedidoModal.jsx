import { Fragment, useRef, useState } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const ActionDetalhePedidoModal = ({ show, handleClose, dadosDetalhePedido }) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();
  
  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Detalhe do Pedido',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº Det Pedido', 'Produto', 'Marca', 'Estrutura Mercadológica', 'Categorias', 'Tecido', 'Cor', 'Estilo', 'Tamanho']],
      body: dados.map(item => [
        item.IDPEDIDOCOMPRA,
        item.DSPRODUTO,
        item.DSFABRICANTE,
        item.DSSUBGRUPOESTRUTURA,
        item.DSCATEGORIAS,
        item.DSTIPOTECIDO,
        item.DSCOR,
        item.DSESTILO,
        item.DSTAMANHO
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('detalhe_pedido.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº Det Pedido', 'Produto', 'Marca', 'Estrutura Mercadológica', 'Categorias', 'Tecido', 'Cor', 'Estilo', 'Tamanho'];
    worksheet['!cols'] = [
      { wpx: 100, caption: 'Nº Det Pedido' },
      { wpx: 150, caption: 'Produto' },
      { wpx: 200, caption: 'Marca' },
      { wpx: 200, caption: 'Estrutura Mercadológica' },
      { wpx: 200, caption: 'Categorias' },
      { wpx: 200, caption: 'Tecido' },
      { wpx: 200, caption: 'Cor' },
      { wpx: 200, caption: 'Estilo' },
      { wpx: 200, caption: 'Tamanho' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Detalhe do Pedido');
    XLSX.writeFile(workbook, 'detalhe_pedido.xlsx');
  };

  const dados = dadosDetalhePedido.map((item, index) => {

    return {
      IDDETALHEPEDIDO: item.IDDETALHEPEDIDO,
      DSPRODUTO: item.DSPRODUTO,
      DSFABRICANTE: item.DSFABRICANTE,
      DSSUBGRUPOESTRUTURA: item.DSSUBGRUPOESTRUTURA,
      DSCATEGORIAS: item.DSCATEGORIAS,
      DSTIPOTECIDO: item.DSTIPOTECIDO,
      DSCOR: item.DSCOR,
      DSESTILO: item.DSESTILO,
      DSTAMANHO: item.DSTAMANHO,
      
    }
  });


  const colunasPedidos = [

    {
      field: 'IDDETALHEPEDIDO',
      header: 'Nº Det Pedido',
      body: row => <th>{row.IDDETALHEPEDIDO}</th>,
      sortable: true,
    },
    {
      field: 'DSPRODUTO',
      header: 'Produto',
      body: row => <th>{row.DSPRODUTO}</th>,
      sortable: true,
    },
    {
      field: 'DSFABRICANTE',
      header: 'Marca',
      body: row => <th>{row.DSFABRICANTE}</th>,
      sortable: true,
    },
    {
      field: 'DSSUBGRUPOESTRUTURA',
      header: 'Estrutura Mercadológica',
      body: row => <th>{row.DSSUBGRUPOESTRUTURA}</th>,
      sortable: true,
    },
    {
      field: 'DSCATEGORIAS',
      header: 'Categorias',
      body: row => <th>{row.DSCATEGORIAS}</th>,
      sortable: true,
    },
    {
      field: 'DSTIPOTECIDO',
      header: 'Tecido',
      body: row => <th>{row.DSTIPOTECIDO}</th>,
      sortable: true,
    },
    {
      field: 'DSCOR',
      header: 'Cor',
      body: row => <th>{row.DSCOR}</th>,
      sortable: true,
    },
    {
      field: 'DSESTILO',
      header: 'Estilo',
      body: row => <th>{row.DSESTILO}</th>,
      sortable: true,
    },
    {
      field: 'DSTAMANHO',
      header: 'Tamanho',
      body: row => <th>{row.DSTAMANHO}</th>,
      sortable: true,
    },

  ]



  return (

    <Fragment>

      <Modal
        show={show}
        onHide={handleClose}
        class="modal-content"
        size="xl"
        centered
      >

        <HeaderModal
          title={"Detalhe do Pedido de Compra"}
          subTitle={"Detalhe do Pedido de Compra"}
          handleClose={handleClose}
        />


        <Modal.Body>
          <div className="panel" style={{ marginTop: "5rem" }}>
            <div className="panel-hdr">
              <h2>Detalhe do Pedido Compra </h2>
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
            <div className="card mb-4" ref={dataTableRef}>
              <DataTable
                title=""
                value={dados}
                size="small"
                globalFilter={globalFilterValue}
                sortOrder={-1}
                paginator={true}
                rows={10}
                rowsPerPageOptions={[10, 20, 50, 100]}
                showGridlines
                stripedRows
                emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
              >
                {colunasPedidos.map(coluna => (
                  <Column
                    key={coluna.field}
                    field={coluna.field}
                    header={coluna.header}
                    selectionMode={coluna.selectionMode}
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

      </Modal>
    </Fragment>
  )
}
