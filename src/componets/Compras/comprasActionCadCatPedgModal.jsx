import { Fragment } from "react"
import { FooterModal } from "../Modais/FooterModal/footerModal"
import { HeaderModal } from "../Modais/HeaderModal/HeaderModal"
import { Modal } from "react-bootstrap"
import { InputSelect } from "../Buttons/InputSelect"
import { InputFieldModal } from "../Buttons/InputFieldModal"

export const ComprasActionCadcatPedgModal = ({show, handleClose}) => {
  const options = [
    {value: 0, label: "Opção 1"},
    {value: 1, label: "Opção 2"},
    {value: 2, label: "Opção 3"}
  ]
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
          title={"Transportadores"}
          subTitle={"Inclusão de Transportadores e Alteração"}
          handleClose={handleClose}
        />


        <Modal.Body>

          <div className="form-group">
            <div className="row">
              <div className="col-sm-6 col-xl-6">
                <InputFieldModal
                  label={"Descrição *"}
                  type={"text"}
                  id={"IDCatPedido"}
                  readOnly={false}
                />
              </div>
              <div className="col-sm-6 col-xl-3">

                <InputSelect 
                  label={"Tipo Categoria *"}
                  type={"text"}
                  id={"tipocatpedido"}
                  readOnly={false}
                  options={options}
                />
              </div>
              <div className="col-sm-6 col-xl-3">

                <InputSelect 
                  label={"Situação *"}
                  type={"text"}
                  id={"stativocatpedido"}
                  readOnly={false}
                  options={options}

                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <h3 className="form-label" htmlFor="vrfat">* Campos Obrigatórios *</h3>
          </div>
        </Modal.Body>
        <FooterModal handleClose={handleClose} />
      </Modal>
    </Fragment>
  )
}