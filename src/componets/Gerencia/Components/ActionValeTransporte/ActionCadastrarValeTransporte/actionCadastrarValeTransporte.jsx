import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { FormularioCadastrar } from "./formularioCadastrar";
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";

export const ActionCadastrarValeTransporte = ({ show, handleClose, usuarioLogado, optionsModulos, refetchDadosLoja }) => {

  return (
    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        tabIndex={-1}

      >

        <HeaderModal
          title={"Dados do Vale Transporte da Loja"}
          subTitle={"Cadastrar Vale Transporte da Loja"}
          handleClose={handleClose}
        />

        <Modal.Body>
          <FormularioCadastrar
            handleClose={handleClose}
            usuarioLogado={usuarioLogado}
            optionsModulos={optionsModulos}
            refetchDadosLoja={refetchDadosLoja}
          />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}