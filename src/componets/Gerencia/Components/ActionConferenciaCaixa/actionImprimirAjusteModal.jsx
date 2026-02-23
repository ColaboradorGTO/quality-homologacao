import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal";
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../Modais/FooterModal/footerModal";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { dataFormatada } from "../../../../utils/dataFormatada";
import { formatMoeda } from "../../../../utils/formatMoeda";

export const ActionImprimirAjusteModal = ({ show, handleClose, dadosDetelheImprimir }) => {

  const dados = dadosDetelheImprimir.map((item) => {
    return {
      DTABERTURA: item.DTABERTURA,
      DTHORAFECHAMENTOCAIXA: item.DTHORAFECHAMENTOCAIXA,
      DSCAIXAFECHAMENTO: item.DSCAIXAFECHAMENTO,
      ID: item.ID,
      IDOPERADORFECHAMENTO: item.IDOPERADORFECHAMENTO,
      TOTALFECHAMENTODINHEIRO: item.TOTALFECHAMENTODINHEIRO,
      TOTALAJUSTTEF: item.TOTALAJUSTTEF,
      TOTALAJUSTPOS: item.TOTALAJUSTPOS,
      TOTALAJUSTCONVENIO: item.TOTALAJUSTCONVENIO,
      TOTALAJUSTVOUCHER: item.TOTALAJUSTVOUCHER,
      TOTALAJUSTEFATURA: item.TOTALAJUSTEFATURA,
      TOTALAJUSTPIX: item.TOTALAJUSTPIX,
      OPERADORFECHAMENTO: item.OPERADORFECHAMENTO,
      NUCPF: item.NUCPF,

    }
  })

  const colunasMovimentoCixa = [
    {
      field: 'contador',
      header: 'Nº Movimento',
      body: row => row.ID,
      sortable: true,
    },
    {
      field: 'IDCAIXAFECHAMENTO',
      header: 'Caixa',
      body: row => row.IDCAIXAFECHAMENTO + row.DSCAIXAFECHAMENTO,
      sortable: true,
    },
    {
      field: 'DTABERTURA',
      header: 'Fechamento',
      body: row => dataFormatada(row.DTABERTURA),
      sortable: true,
    },
    {
      field: 'OPERADORFECHAMENTO',
      header: 'Operador',
      body: row => row.OPERADORFECHAMENTO,
      footer: 'Total Lançamentos',
      sortable: true,
    },
    {
      field: 'TOTALFECHAMENTODINHEIROFISICO',
      header: 'Venda Dinheiro',
      body: row => formatMoeda(row.TOTALFECHAMENTODINHEIROFISICO),
      sortable: true,
    },
    {
      field: 'TOTALFECHAMENTODINHEIRO',
      header: 'Informado Dinheiro',
      body: row => formatMoeda(row.TOTALFECHAMENTODINHEIRO),
      sortable: true,
    },
    {
      field: 'TOTALAJUSTEFATURA',
      header: 'Recebido Fatura',
      body: row => formatMoeda(row.TOTALAJUSTEFATURA),
      sortable: true,
    },
    {
      field: 'vrFechamentoQuebraCaixa',
      header: 'Quebra Sistema',
      body: row => {
        return (
          <p style={{ color: row.vrFechamentoQuebraCaixa > 0 ? 'blue' : 'red' }}>
            {row.vrFechamentoQuebraCaixa > 0 ? formatMoeda(row.vrFechamentoQuebraCaixa) : formatMoeda(row.vrFechamentoQuebraCaixa)}
          </p>
        )
      },
      sortable: true,
    },
    {
      field: 'VRQUEBRAEFETIVADO',
      header: 'Quebra Lançado',
      body: row => {
        return (
          <p style={{ color: row.VRQUEBRAEFETIVADO > 0 ? 'blue' : 'red' }}>{formatMoeda(row.VRQUEBRAEFETIVADO)}</p>
        )
      },
      sortable: true,
    },
    {
      field: 'STFECHADOMOVIMENTO',
      header: 'Situação',
      body: row => {
        return (
          <p style={{ color: row.STFECHADOMOVIMENTO == 'False' ? 'blue' : 'red' }}>{row.STFECHADOMOVIMENTO == 'False' ? 'ABERTO' : 'FECHADO'}</p>

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
        size="lg"
        className="modal fade"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"

      >

        <div style={{ padding: "10px" }}>

          <HeaderModal
            title={"Impressão de Recibos"}
            subTitle={"Imprimir Ajuste Fechamento de Caixa"}
            handleClose={handleClose}
          />

          <Modal.Body>


            <div style={{ justifyContent: "center", }}>
              <div className="col-sm-12">
                <h3 style={{ textAlign: "center", marginBottom: "30px" }}>AJUSTE FECHAMENTO DE CAIXA</h3>
              </div>

            </div>

            <DataTable
              title="Vendas por Loja"
              value={dados}
              sortField="VRTOTALPAGO"
              sortOrder={-1}
              paginator={true}
              rows={10}
              rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
              showGridlines
              stripedRows
              response
              emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
            >
              {colunasMovimentoCixa.map(coluna => (
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

          </Modal.Body>


          <FooterModal
            ButtonTypeCadastrar={ButtonTypeModal}
            onClickButtonCadastrar={""}
            textButtonCadastrar={"Confirmar Impressão"}
            corCadastrar="success"

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