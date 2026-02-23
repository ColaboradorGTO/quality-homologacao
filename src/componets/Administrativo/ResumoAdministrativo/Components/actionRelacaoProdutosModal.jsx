import { Fragment } from "react"
import { FooterModal } from "../../../Modais/FooterModal/footerModal"
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal"
import Modal from 'react-bootstrap/Modal';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";

export const ActionRelacaoProdutosModal = ({ dadosProdutoModal, show, handleClose }) => {
  const dadosModalProduto = dadosProdutoModal.map((item) => {
    let situacao = item.STCANCELADO ? "Ativo" : "Cancelado";

    return {
      NUCODBARRAS: item.NUCODBARRAS,
      DSNOME: item.DSNOME,
      VUNCOM: item.VUNCOM,
      QTD: item.QTD,
      VRTOTALLIQUIDO: item.VRTOTALLIQUIDO,
      VENDEDOR_NOME: item.VENDEDOR_NOME,
      STCANCELADO: item.STCANCELADO

    }
  });

  const colunasProdutoModal = [
    {
      field: 'NUCODBARRAS',
      header: 'Código Barras',
      body: row => row.NUCODBARRAS,
      sortable: true,

    },
    {
      field: 'DSNOME',
      header: 'Descrição',
      body: row => row.DSNOME,
      sortable: true,

    },
    {
      field: 'VUNCOM',
      header: 'Vr. Unit',
      body: row => formatMoeda(row.VUNCOM),
      sortable: true,

    },
    {
      field: 'QTD',
      header: 'QTD',
      body: row => row.QTD,
      sortable: true,
    },
    {
      field: 'VRTOTALLIQUIDO',
      header: 'Vr Recebido',
      body: row => formatMoeda(row.VRTOTALLIQUIDO),
      sortable: true,
    },
    {
      field: 'VENDEDOR_NOME',
      header: 'Vendedor',
      body: row => row.VENDEDOR_NOME,
      sortable: true,
    },

    {
      field: 'STCANCELADO',
      header: 'Situação',
      body: row => row.STCANCELADO,
      sortable: true,

    },
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


            <DataTable
              title="Vendas por Loja"
              value={dadosModalProduto}
              sortField="VRTOTALPAGO"
              sortOrder={-1}
              paginator={true}
              rows={10}
              rowsPerPageOptions={[5, 10, 20, 50]}
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
          </Modal.Body>

          <FooterModal
            handleClose={handleClose}
          />
        </div>
      </Modal>
    </Fragment>
  )
}