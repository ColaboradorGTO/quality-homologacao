import { Fragment, useRef, useState } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ActionListaProduto } from "./actionListaProduto"


export const ActionModalProduto = ({
  refetch,
  show,
  handleClose,
  dadosColetorBalanco,
  usuarioLogado,
  optionsModulos,
  quantidade,
  empresaSelecionada
}) => {

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
          title={"Resumo do Balanço"}
          subTitle={"Relação dos Coletores"}
          handleClose={() => { handleClose(), setTabelaDetalhe(false); setTabelaColetor(true) }}
        />

        <Modal.Body className="modal-body">
          <ActionListaProduto
            dadosColetorBalanco={dadosColetorBalanco}
            empresaSelecionada={empresaSelecionada}
            quantidade={quantidade}
            usuarioLogado={usuarioLogado}
            optionsModulos={optionsModulos}
            refetch={refetch}
            handleClose={handleClose}

          />
        </Modal.Body>


        <FooterModal
          ButtonTypeFechar={ButtonTypeModal}
          textButtonFechar={"Fechar"}
          onClickButtonFechar={handleClose}
          corFechar={"secondary"}
        />
      </Modal>

    </Fragment>
  )

}