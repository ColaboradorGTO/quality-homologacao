import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { useForm } from "react-hook-form";
import { Formulario } from "./formulario";

export const ActionCadastrarQuebraCaixaModal = ({ show, handleClose, dadosDetelheCaixa, usuarioLogado, optionsModulos, refetchCaixaMovimento }) => {
  const { register, handleSubmit, errors } = useForm();

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
          title={"Lançar Quebra de Caixa da Loja"}
          subTitle={"Cadastrar Quebra de Caixa da Loja"}
          handleClose={handleClose}
        />
        <Modal.Body>
          <Formulario
            show={show}
            handleClose={handleClose}
            dadosDetelheCaixa={dadosDetelheCaixa}
            usuarioLogado={usuarioLogado}
            optionsModulos={optionsModulos}
            refetchCaixaMovimento={refetchCaixaMovimento}
          />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}