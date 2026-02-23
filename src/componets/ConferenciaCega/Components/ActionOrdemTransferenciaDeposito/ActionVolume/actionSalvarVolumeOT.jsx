import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { FormularioSalvarVolumeOT } from "./formularioSalvarVolumeOT";


export const ActionSalvarVolumeOTModal = ({
  show,
  handleClose,
  dadosSalvarVolume

}) => {

  return (

    <Fragment>

      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
      >
        <HeaderModal
          title="Controle Ordem de Transferência"
          subtitle="Nome da Loja"
          handleClose={handleClose}
        />
        <Modal.Body>
      
         <FormularioSalvarVolumeOT dadosSalvarVolume={dadosSalvarVolume} handleClose={handleClose}/>
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}
