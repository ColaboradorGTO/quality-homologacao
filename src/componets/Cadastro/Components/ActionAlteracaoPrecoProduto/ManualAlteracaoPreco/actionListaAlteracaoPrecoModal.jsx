import { Fragment } from 'react';
import Modal from 'react-bootstrap/Modal';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { FaRegTrashAlt } from 'react-icons/fa';
import { HeaderModal } from '../../../../Modais/HeaderModal/HeaderModal';
import { FooterModal } from '../../../../Modais/FooterModal/footerModal';
import { ButtonTypeModal } from '../../../../Buttons/ButtonTypeModal';
import { ButtonTable } from '../../../../ButtonsTabela/ButtonTable';
import { formatMoeda } from '../../../../../utils/formatMoeda';

export const ActionListaAlteracaoPrecoModal = ({
  show,
  handleClose,
  dadosPreVisualizacao,
  excluirProdutoPreVisualizacao,
  confirmarAlteracaoPrecos
}) => {
  // const usaLoja = Boolean(dadosPreVisualizacao[0]?.IDEMPRESA);

  const colunas = [
    {
      field: 'indice',
      header: 'Nº',
      body: (row, { rowIndex }) => <th>{rowIndex + 1}</th>,
    },
    {
      // field: usaLoja ? 'IDEMPRESA' : 'IDLISTAPRECO',
      // header: usaLoja ? 'Loja' : 'Lista de Preço',
      body: row => <th>{ row.IDEMPRESA ? row.IDEMPRESA : row.IDLISTAPRECO}</th>,
    },
    {
      field: 'IDPRODUTO',
      header: 'ID Produto',
      body: row => <th>{row.IDPRODUTO}</th>,
    },
    {
      field: 'DSNOME',
      header: 'Descrição Produto',
      body: row => <th>{row.DSNOME || 'Não Informado'}</th>,
    },
    {
      field: 'CODBARRAS',
      header: 'Cod. Barras',
      body: row => <th>{row.CODBARRAS || 'Não Informado'}</th>,
    },
    {
      field: 'PRECO_VENDA_ANTIGO',
      header: 'Preço Antigo',
      body: row => <th>{row.PRECO_VENDA_ANTIGO ? formatMoeda(row.PRECO_VENDA_ANTIGO) : 'Não Informado'}</th>,
    },
    {
      field: 'PRECO_VENDA',
      header: 'Preço Novo',
      body: row => <th>{formatMoeda(row.PRECO_VENDA)}</th>,
    },
    {
      field: 'excluir',
      header: 'Excluir',
      body: row => (
        <ButtonTable
          titleButton="Excluir produto desta alteração de preço"
          cor="danger"
          Icon={FaRegTrashAlt}
          iconSize={16}
          iconColor={"#fff"}
          onClickButton={() => excluirProdutoPreVisualizacao(row.IDPRODUTO)}
          width="30px"
          height="30px"
        />
      ),
    },
  ];

  return (
    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        centered
      >
        <HeaderModal
          title={"Pré-Visualização de Alteração de Preços"}
          subTitle={`${dadosPreVisualizacao?.length} Produto(s) a Alterar`}
          handleClose={handleClose}
        />

        <Modal.Body>
          <DataTable
            value={dadosPreVisualizacao}
            size="small"
            paginator={dadosPreVisualizacao?.length > 50}
            rows={50}
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum produto para alterar</div>}
          >
            {colunas.map(coluna => (
              <Column
                key={coluna.header}
                field={coluna.field}
                header={coluna.header}
                body={coluna.body}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '0.8rem' }}
              />
            ))}
          </DataTable>
        </Modal.Body>

        <FooterModal
          ButtonTypeConfirmar={ButtonTypeModal}
          textButtonConfirmar={"Confirmar Alteração"}
          onClickButtonConfirmar={confirmarAlteracaoPrecos}
          corConfirmar="success"

          ButtonTypeFechar={ButtonTypeModal}
          textButtonFechar={"Fechar"}
          onClickButtonFechar={handleClose}
          corFechar="secondary"
        />
      </Modal>
    </Fragment>
  )
}
