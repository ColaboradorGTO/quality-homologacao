import { Fragment, useEffect, useState } from "react"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal"
import { Modal } from "react-bootstrap"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { Formulario } from "./formulario"


export const ActionEditarProodutodPedidoAvulsoModal = ({ 
  show, 
  handleClose, 
  usuarioLogado, 
  optionsModulos,
  dadosDetalheProduto 
}) => {

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
          title={"Produtos Avulsos"}
          subTitle={"Alteração de Produtos Avulso"}
          handleClose={handleClose}
        />

        <Modal.Body>
          <Formulario 
            handleClose={handleClose}
            usuarioLogado={usuarioLogado} 
            optionsModulos={optionsModulos}
            dadosDetalheProduto={dadosDetalheProduto}
          />
        </Modal.Body>
      </Modal>

    </Fragment>
  )
}