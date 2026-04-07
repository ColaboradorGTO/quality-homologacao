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
  
  const getIPUsuario = async () => {
    let usuarioIP = null;

    try {
        const { data: ipWhoisData } = await axios.get("https://ifconfig.me/ip");
        usuarioIP = ipWhoisData?.ip;
    } catch (error) {
        console.error("Erro ao buscar IP via ifconfig.me:", error);
    }

    if (!usuarioIP) {
    try {
        const { data: ipifyData } = await axios.get("https://api.ipify.org?format=json");
        usuarioIP = ipifyData?.ip;
    } catch (error) {
        console.error("Erro ao buscar IP via ipify.org:", error);
    }
    }
    setIpUsuario(usuarioIP);
    return usuarioIP;
  };


  const optionsStatus = [
    { value: 'True', label: 'CANCELADA' },
    { value: 'False', label: 'EM ESPERA' },
    { value: 'FINALIZADA', label: 'FINALIZADA' }
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