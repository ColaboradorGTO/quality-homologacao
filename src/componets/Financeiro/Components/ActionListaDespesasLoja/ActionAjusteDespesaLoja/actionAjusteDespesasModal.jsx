import { Fragment, useEffect, useState } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FormularioEditar } from "./formularioEditar";



export const ActionAjusteDespesasModal = ({ show, handleClose, dadosDespesasLojaDetalhe, usuarioLogado, optionsModulos }) => {
 
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

        <Modal.Body>

          <HeaderModal 
            title={`Dados da Despesa da Loja ${dadosDespesasLojaDetalhe[0]?.NOFANTASIA}`} 
            subTitle="Editar Despesas da Loja"
            handleClose={handleClose}
          />

          <FormularioEditar 
            dadosDespesasLojaDetalhe={dadosDespesasLojaDetalhe} 
            handleClose={handleClose}
            usuarioLogado={usuarioLogado}
            optionsModulos={optionsModulos}
          />
        </Modal.Body>
      </Modal>
    </Fragment>
  )
}

