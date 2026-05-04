import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { Formulario } from "./formulario";


export const ActionCriarDevolucaoNFE = ({ 
    show, 
    handleClose, 
    usuarioLogado, 
    optionsModulos, 
    handleClick,
    dadosCriarDevolucao
}) => {
 
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
          title={"Produto para Devolução"}
        //   subTitle={`Nota Fiscal: ${dadosCriarDevolucao?.numSerieNota} \n Fornecedor: ${dadosCriarDevolucao?.fornecedor}`}
          handleClose={handleClose}
        />
        <header
            style={{
                paddingLeft: '1rem',
                color: '#868e96'
            }}
        >
            
            <p style={{fontSize: '1rem', fontWeight: '500'}}> Nota Fiscal: {dadosCriarDevolucao?.numSerieNota} </p>
            <p style={{fontSize: '1rem', fontWeight: '500'}}> Fornecedor: {dadosCriarDevolucao?.fornecedor}   </p>
           
        </header>
        <Modal.Body>
          <Formulario 
            handleClose={handleClose}
            usuarioLogado={usuarioLogado}
            optionsModulos={optionsModulos}
            handleClick={handleClick}
            dadosCriarDevolucao={dadosCriarDevolucao}
          />
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}