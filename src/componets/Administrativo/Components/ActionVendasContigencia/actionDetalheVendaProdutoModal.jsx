import { Fragment } from "react"
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal"
import { FooterModal } from "../../../Modais/FooterModal/footerModal"
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal"
import Modal from 'react-bootstrap/Modal';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatMoeda } from "../../../../utils/formatMoeda";

export const ActionDetalheVendaProdutoModal = ({ show, handleClose, dadosDetalheProduto }) => {
  const dadosModalProduto = dadosDetalheProduto.map((item) => {

    return {
      NUCODBARRAS: item.NUCODBARRAS,
      DSNOME: item.DSNOME,
      VUNCOM: item.VUNCOM,
      QTD: item.QTD,
      VRTOTALLIQUIDO: item.VRTOTALLIQUIDO,
      VENDEDOR_NOME: item.VENDEDOR_NOME,
      STCANCELADO: item.STCANCELADO,
      STTROCA: item.STTROCA,

    }
  });

  const colunasProdutoModal = [
    {
      field: 'NUCOBARRAS',
      header: 'Código Barras',
      body: row => <th style={{  }}> {row.NUCODBARRAS}</th>,
      sortable: true,

    },
    {
      field: 'DSNOME',
      header: 'Descrição',
      body: row => <th style={{  }}> {row.DSNOME}</th>,
      sortable: true,

    },
    {
      field: 'VUNCOM',
      header: 'Vr. Unit',
      body: row => <th style={{  }}> {formatMoeda(row.VUNCOM)}</th>,
      sortable: true,

    },
    {
      field: 'QTD',
      header: 'QTD',
      body: row => <th style={{  }}> {row.QTD}</th>,
      sortable: true,
    },
    {
      field: 'VRTOTALLIQUIDO',
      header: 'Vr Recebido',
      body: row => <th style={{  }}> {formatMoeda(row.VRTOTALLIQUIDO)}</th>,
      sortable: true,
    },
    {
      field: 'VENDEDOR_NOME',
      header: 'Vendedor',
      body: row => <th style={{  }}> {row.VENDEDOR_NOME}</th>,
      sortable: true,
    },

    {
      field: 'STCANCELADO',
      header: 'Situação',
      body: (row) => {
        return (
          <th style={{ color: row.STCANCELADO == 'False' ? 'blue' : 'red' }}> {row.STCANCELADO == 'False' ? 'Ativo' : 'Cancelado'}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'STTROCA',
      header: 'Troca',
      body: (row) => {
        return (
          <th style={{ color: row.STTROCA == 'False' ? 'blue' : 'red' }}> {row.STTROCA == 'False' ? 'NÃO' : 'SIM'}</th>
        )
      },
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
            <div id="panel-1" class="panel">
              <div class="panel-hdr textoCabecalhoDetalheProduto">
                <h2>{"VENDA Nº " + dadosDetalheProduto[0]?.IDVENDA}</h2>

              </div>
              <div class="panel-container show">
                <div class="panel-content">

                  <div className="card">

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
                          footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                          bodyStyle={{ fontSize: '0.8rem' }}

                        />
                      ))}
                    </DataTable>
                  </div>
                </div>
              </div>
            </div>



          </Modal.Body>

          <FooterModal

            ButtonTypeFechar={ButtonTypeModal}
            textButtonFechar={"Fechar"}
            onClickButtonFechar={handleClose}
            corFechar={"secondary"}
          />
        </div>
      </Modal>
    </Fragment>
  )
}

