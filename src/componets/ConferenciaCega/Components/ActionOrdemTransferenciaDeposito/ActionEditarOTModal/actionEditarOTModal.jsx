import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { FaRegSave } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { InputFieldModal } from "../../../../Buttons/InputFieldModal";
import { ActionListaEditarOT } from "./actionListaEditarOT";


export const ActionEditarOTModal = ({
  show,
  handleClose,
  dadosDetalheTransferencia,

}) => {
  const { register, handleSubmit, errors } = useForm();

  return (

    <Fragment>

      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
      >
        <HeaderModal
          title="Controle Ordem de Transferência"
          subtitle="Nome da Loja"
          handleClose={handleClose}
        />
        <Modal.Body>

          <form onSubmit={''}>
            <div className="row" >
              <div className="col-sm-6 col-xl-6">
                <InputFieldModal
                  label={"Loja Origem"}
                  type="text"
                  // id="IDContaBanco"
                  readOnly={true}
                  value={dadosDetalheTransferencia[0]?.EMPRESAORIGEM}
                />
              </div>
              <div className="col-sm-6 col-xl-6">
                <InputFieldModal
                  label={"Loja Destino"}
                  type="select"
                  value={dadosDetalheTransferencia[0]?.EMPRESADESTINO}
                  readOnly={true}
                />
              </div>
            </div>


            <div className="row mt-4">
              <div className="col-sm-6 col-xl-6">
                <InputFieldModal
                  label={"Produto"}
                  type="text"
                  // id="IDContaBanco"
                  readOnly={true}
                />
              </div>
           
            </div>
   

            <div className="row mt-4">
              <div className="col-sm-8 col-xl-8">

                <ButtonTypeModal
                  Icon={FaRegSave}
                  textButton={"Salvar"}
                  cor={"info"}
                  className={"mr-4"}
                  onClickButtonType={''}
                  buttonDisabled={true}
                  // buttonDisabled={dados[0].IDSTATUSOT === 6}
                />
                
              </div>
              <div className="col-sm-8 col-xl-8 mt-4">
                <label className="form-label" style={{ color: "red" }}>Para confirmar as Alterações e Inclusões dos Produtos, favor clicar no botão Salvar!</label>
              </div>
            </div>
          </form>

          <ActionListaEditarOT dadosDetalheTransferencia={dadosDetalheTransferencia} />
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
