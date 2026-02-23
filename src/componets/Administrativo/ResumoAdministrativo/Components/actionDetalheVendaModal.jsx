import { Fragment } from "react"
import { FooterModal } from "../../../Modais/FooterModal/footerModal"
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal"
import Modal from 'react-bootstrap/Modal';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { formatMoeda } from "../../../../utils/formatMoeda";

export const ActionDetalheVendaModal = ({ dadosVendas, show, handleClose }) => {

  const dados = dadosVendas.map((item) => {
    return {
      NOFANTASIA: item.NOFANTASIA,
      IDCAIXAWEB: item.IDCAIXAWEB,
      DSCAIXA: item.DSCAIXA,
      IDVENDA: item.IDVENDA,
      NFE_INFNFE_IDE_NNF: item.NFE_INFNFE_IDE_NNF,
      DTHORAFECHAMENTO: item.DTHORAFECHAMENTO,
      NOFUNCIONARIO: item.NOFUNCIONARIO,
      NOFUNCIOCANCEL: item.NOFUNCIOCANCEL,
      NOFUNCAOCANCEL: item.NOFUNCAOCANCEL,
      TXTMOTIVOCANCELAMENTO: item.TXTMOTIVOCANCELAMENTO,
      VRTOTALPAGO: formatMoeda(item.VRTOTALPAGO),
      STCONTINGENCIA: item.STCONTINGENCIA,
    }
  });

  const colunasVouchers = [
    {
      name: '*',
      selector: row => row.IDCAIXAWEB,
      sortable: true,
      width: '3%',
    },
    {
      name: 'Empresa',
      selector: row => row.NOFANTASIA,
      sortable: true,

    },
    {
      name: 'Caixa',
      selector: row => row.DSCAIXA,
      sortable: true,

    },
    {
      name: 'Nº Venda',
      selector: row => row.IDVENDA,
      sortable: true,

    },
    {
      name: 'NFe/NFCe',
      selector: row => row.NFE_INFNFE_IDE_NNF,
      sortable: true,

    },
    {
      name: 'Abertura',
      selector: row => row.DTHORAFECHAMENTO,
      sortable: true,

    },
    {
      name: 'Operador',
      selector: row => row.NOFUNCIONARIO,
      sortable: true,

    },
    {
      name: 'Valor',
      selector: row => row.VRTOTALPAGO,
      sortable: true,

    },
    {
      name: 'Nota',
      selector: row => row.STCONTINGENCIA,
      sortable: true,

    },
    {
      name: 'Cancelado Por',
      selector: row => row.NOFUNCIOCANCEL,
      sortable: true,

    },
    {
      name: 'Função',
      selector: row => row.NOFUNCAOCANCEL,
      sortable: true,

    },
    {
      name: 'Motivo',
      selector: row => row.TXTMOTIVOCANCELAMENTO,
      sortable: true,

    },
    {
      name: 'Opções',
      button: true,
      width: '10%',
      cell: (row) => (
        <div className="p-1 "
          style={{ justifyContent: "space-between" }}
        >
          <div className="p-1">
            <ButtonTable
              nome={"Produtos"}
              onClickProduto={() => handleClickProduto(row)}
            />
          </div>
          <div className="p-1">
            <ButtonTable
              nome={"Vendas"}
              onClickVenda={() => handleClickVenda(row)}
            />
          </div>
          <div className="p-1">
            <ButtonTable
              nome={"Pagamentos"}
              onClickPagamento={() => handleClickPagamento(row)}
            />
          </div>
        </div>
      ),
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

        <div className="" role="document">

          <HeaderModal
            title={"Detalhe da Venda"}
            subTitle={"Relação de Recebimentos da Venda "}
            handleClose={handleClose}
          />

          <Modal.Body>

            <DataTable
              title="Vendas por Loja"
              value={dados}
              sortField="VRTOTALPAGO"
              sortOrder={-1}
              paginator={true}
              rows={10}
              rowsPerPageOptions={[5, 10, 20, 50]}
              showGridlines
              stripedRows
              emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
            >
              {colunasVouchers.map(coluna => (
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