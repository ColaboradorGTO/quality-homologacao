import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { ActionListaAlterarPreco } from "./actionListaAlterarPreco";
import { Formulario } from "./formulario";


export const ActionEditarAlteracaoPrecosModal = ({ 
  show, 
  handleClose, 
  dadosDetalheAlteracao,
  optionsModulos,
  usuarioLogado
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
            title={"Edição de Alteração de Preços"}
            subTitle={`Alteração de Preço Nº: ${dadosDetalheAlteracao[0]?.alteracaoPreco.IDRESUMOALTERACAOPRECOPRODUTO}`}
          handleClose={handleClose}
        />


        <Modal.Body>
          <Formulario 
            dadosDetalheAlteracao={dadosDetalheAlteracao} 
            optionsModulos={optionsModulos}
            usuarioLogado={usuarioLogado}  
          />
          <ActionListaAlterarPreco dadosDetalheAlteracao={dadosDetalheAlteracao}/> 
        </Modal.Body>

      </Modal>
    </Fragment>
  )
}