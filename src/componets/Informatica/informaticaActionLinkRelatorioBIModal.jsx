import React, { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { InputFieldModal } from "../Buttons/InputFieldModal";
import { FooterModal } from "../Modais/FooterModal/footerModal";
import { HeaderModal } from "../Modais/HeaderModal/HeaderModal";
import { InputSelect } from "../Buttons/InputSelect";

export const InformaticaActionLinkRelatorioBiModal = ({ show, handleClose }) => {
  const options = [
    { value: 0, label: "Todos" },
    { value: 1, label: "Administrador" },
  ]

  return (

    <Fragment>
      <Modal show={show} handleClose={handleClose} size="lg">
        <HeaderModal
          title={"Link Relatório BI"}
          subTitle={"Cadastrar ou Alterar Relatório Link BI"}
          handleClose={handleClose}
        />

        <Modal.Body>
          
          <div className="form-group">
            <div className="row">
              <div className="col-sm-6 col-xl-12">
                <InputSelect
                  label={"Filial"}
                  type="select"
                  id="idfilialmodal"
                  options={options}

                />
              </div>
              <div className="col-sm-6 col-xl-9">
                <InputSelect
                  label={"Relatório"}
                  type="select"
                  id="idlinkrelatoriobimodal"
                  options={options}

                />
              </div>
              <div className="col-sm-6 col-xl-3">
                <InputSelect
                  label={"Status"}
                  type="select"
                  id="stativorelatoriobi"
                  options={options}

                />
              </div>
              <div className="col-sm-6 col-xl-12">
         
                <InputFieldModal
                  label={"Link "}
                  type="text"
                  id={"linkrelatoriobi"}
                  value={""}
                />
              </div>
            </div>
          </div>

          <FooterModal handleClose={handleClose} />
        </Modal.Body>
      </Modal>
    </Fragment>
  )
}
