import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioEditarFatura } from "./formularioEditar";

export const ActionEditarFaturaModal = ({ show, handleClose, dadosDetalheFaturaCaixa, optionsModulos, usuarioLogado }) => {
  
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
          <div className="">

            <HeaderModal
              title={"Dados da Despesa da Loja"}
              subTitle={"Cadastrar Despesas da Loja"}
              handleClose={handleClose}
            />

            <Modal.Body>
              <FormularioEditarFatura 
                dadosDetalheFaturaCaixa={dadosDetalheFaturaCaixa} 
                handleClose={handleClose}
                optionsModulos={optionsModulos}  
                usuarioLogado={usuarioLogado}
              />
            </Modal.Body>
          </div>
        </div>
      </Modal>
    </Fragment>
  )
}