import { Fragment, } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";

import { Formulario } from "./formulario";

export const ActionCancelarFaturaModal = ({ 
  show, 
  handleClose, 
  dadosCancelarFatura, 
  usuarioLogado, 
  optionsModulos,
  handleClick,
  refetchListaFaturas
}) => {

  return (
    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        className="modal fade"
        id="CadadiantamentoSalario"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >

        <HeaderModal
          title={"Faturas dos Caixas"}
          subTitle={"Cancelar Fatura de Caixa da Loja"}
          handleClose={handleClose}
        />
        <Modal.Body>
          <Formulario
            dadosCancelarFatura={dadosCancelarFatura}
            usuarioLogado={usuarioLogado}
            optionsModulos={optionsModulos}
            handleClick={handleClick}
            handleClose={handleClose}
            refetchListaFaturas={refetchListaFaturas}
          />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}