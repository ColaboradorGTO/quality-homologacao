import { Fragment, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import Modal from 'react-bootstrap/Modal';
import { FooterModal } from "../../../Modais/FooterModal/footerModal";
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal";
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal";
import { formatMoeda } from "../../../../utils/formatMoeda";

export const ActionVendaRecebimentoModal = ({ show, handleClose, dadosDetalheRecebimentosEletronico }) => {
  
  const dadosListaRecebimentosEletronico = dadosDetalheRecebimentosEletronico.map((item, index) => {
    let contador = index + 1;
    const percentualValorRecebido = (parseFloat(item.VALORRECEBIDO) * 100) + parseFloat(item.VALORRECEBIDO);
    return {
      DSTIPOPAGAMENTO: item.DSTIPOPAGAMENTO,
      NOCARTAO: item.NOCARTAO,
      NUOPERACAO: item.NUOPERACAO,
      NOTEF: item.NOTEF,
      NSUTEF: item.NSUTEF,
      NOAUTORIZADOR: item.NOAUTORIZADOR,
      NUAUTORIZACAO: item.NUAUTORIZACAO,
      NSUAUTORIZADORA: item.NSUAUTORIZADORA,
      DTHORAFECHAMENTO: item.DTHORAFECHAMENTO,
      NPARCELAS: item.NPARCELAS,
      VALORRECEBIDO: item.VALORRECEBIDO,
      VALORRECEBIDOTOTAL: item.VALORRECEBIDOTOTAL,
      IDVENDA: item.IDVENDA,

      contador
    }
  });

  const colunasTEF = [
    {
      field: 'IDVENDA',
      header: 'Nº Venda',
      body: row => <th style={{ color: 'blue' }}>{row.IDVENDA}</th>,
      sortable: true
    },
    {
      field: 'DSTIPOPAGAMENTO',
      header: 'Tipo Pagamento',
      body: row => <th style={{ color: 'blue' }}>{row.DSTIPOPAGAMENTO} {row.NPARCELAS}</th>,
      sortable: true
    },
    {
      field: 'NUOPERACAO',
      header: 'Nº Operação',
      body: row => <th style={{ color: 'blue' }}>{row.NUOPERACAO}</th>,
      sortable: true
    },
    {
      field: 'NOTEF',
      header: 'TEF',
      body: row => <th style={{ color: 'blue' }}>{row.NOTEF}</th>,
      sortable: true
    },
    {
      field: 'NSUTEF',
      header: 'NSU TEF',
      body: row => <th style={{ color: 'blue' }}>{row.NSUTEF}</th>,
      sortable: true
    },
    {
      field: 'NSUAUTORIZADORA',
      header: 'Autorizador',
      body: row => <th style={{ color: 'blue' }}>{row.NSUAUTORIZADORA}</th>,
      sortable: true
    },
    {
      field: 'NUAUTORIZACAO',
      header: 'NSU Autorizadora',
      body: row => <th style={{ color: 'blue' }}>{row.NUAUTORIZACAO}</th>,
      sortable: true
    },
    {
      field: 'VALORRECEBIDO',
      header: 'Valor Parcela',
      body: row => <th style={{ color: 'blue' }}>{formatMoeda(row.VALORRECEBIDO)}</th>,
      sortable: true
    },
    {
      field: 'VALORRECEBIDOTOTAL',
      header: 'Valor Total',
      body: row => <th style={{ color: 'blue' }}>{formatMoeda(row.VALORRECEBIDOTOTAL)}</th>,
      sortable: true
    },
    {
      field: 'NPARCELAS',
      header: 'Nº Parcelas',
      body: row => <th style={{ color: 'blue' }}>{row.NPARCELAS}</th>,
      sortable: true
    },
    {
      field: 'DTHORAFECHAMENTO',
      header: 'Data Venda',
      body: row => <th style={{ color: 'blue' }}>{row.DTHORAFECHAMENTO}</th>,
      sortable: true
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
        <HeaderModal
          title={"Detalhe de Vendas dos Recebimentos"}
          subTitle={"Relação das Vendas"}
          handleClose={handleClose}
        />
        <Modal.Body>
          <div class="row">
            <div class="col-xl-12">
              <div id="panel-1" class="panel">
                <div class="panel-hdr">
                  <h2 id="">
                    {`Relação das Vendas do Recebimento Tipo ${dadosListaRecebimentosEletronico[0]?.NOAUTORIZADOR}-${dadosListaRecebimentosEletronico[0]?.DSTIPOPAGAMENTO}-${dadosListaRecebimentosEletronico[0]?.NPARCELAS} x`}

                  </h2>
                 
                </div>
                <div class="panel-container show">
                  <div class="panel-content">

                    <DataTable
                      title="Relação de Vendas Recebimentos"
                      value={dadosListaRecebimentosEletronico}
                      sortField="VRTOTALPAGO"
                      sortOrder={-1}
                      size="small"
                      paginator={true}
                      rows={10}
                      rowsPerPageOptions={[10, 20, 50, 100, dadosListaRecebimentosEletronico.length]}

                      showGridlines
                      stripedRows
                      emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
                    >
                      {colunasTEF.map(coluna => (
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
          </div>


          <FooterModal
            ButtonTypeFechar={ButtonTypeModal}
            onClickButtonFechar={handleClose}
            textButtonFechar={"Fechar"}
            corFechar={"secondary"}

          />
        </Modal.Body>
      </Modal>
    </Fragment>
  )
}