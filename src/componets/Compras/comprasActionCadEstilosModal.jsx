import { Fragment } from "react"
import { FooterModal } from "../Modais/FooterModal/footerModal"
import { HeaderModal } from "../Modais/HeaderModal/HeaderModal"
import { Modal } from "react-bootstrap"
import { InputFieldModal } from "../Buttons/InputFieldModal"
import { InputSelect } from "../Buttons/InputSelect"

export const ComprasActionCadesEstilosModal = ({ show, handleClose }) => {
  const options = [
    { value: '1', label: '1' },
    { value: '2', label: '2' }
  ]

  return (

    <Fragment>

      <Fragment>

        <Modal
          show={show}
          onHide={handleClose}
          class="modal-content"
          size="xl"
          centered
        >

          <HeaderModal
            title={"Cores"}
            subTitle={"Inclusão e Alteração"}
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
                    label={"Grupo Estrutura Mercadológica *"}
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
    </Fragment>
  )
}