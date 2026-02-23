import { Fragment, useRef } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { ActionNotaPDFSemPreco } from "./actionNotaPDFSemPreco";
import { useReactToPrint } from "react-to-print";

export const ActionPDFPedidoSemPreco = ({ show, handleClose, dadosPedidoSemPreco, dadosDetalhePedido }) => {

  const dataTableRef = useRef(null);
  
   const handlePrint = useReactToPrint({
     content: () => dataTableRef.current,
     documentTitle: 'Nota Fiscal de Pedido',
   });

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
          title={"Impressão Pedido"}
          subTitle={""}
          handleClose={handleClose}
        />


        <Modal.Body>

          <div ref={dataTableRef} style={{ marginTop: "1rem" }}>

            <ActionNotaPDFSemPreco dadosPedidoSemPreco={dadosPedidoSemPreco} dadosDetalhePedido={dadosDetalhePedido} />
           
            <div className="row" style={{ 
                marginTop: "3.1rem", 
              
                textAlign: "center", 
                width: '100%',
                justifyContent: "center", 
                display: "flex",
            }} >

              <div style={{  width: '50%'}} >
                <hr size="1" style={{border: "1px dashed black", width: "300px"}} />
                <p style={{ fontSize: "14px" }}> Assinatura Vendedor  </p> 
              </div>
              <div style={{  width: '50%' }} >
                <hr size="1" style={{border: "1px dashed black", width: "300px"}} />
                <p style={{ fontSize: "14px" }}> Assinatura Comprador </p>
              </div>

            </div>
          </div>

        </Modal.Body>
        <FooterModal
          ButtonTypeFechar={ButtonTypeModal}
          onClickButtonFechar={handleClose}
          textButtonFechar={"Fechar"}
          corFechar={"secondary"}

          ButtonTypeCadastrar={ButtonTypeModal}
          onClickButtonCadastrar={() => handlePrint()}
          textButtonCadastrar={"Imprimir"}
          corCadastrar={"info"}
        />
      </Modal>
    </Fragment>
  )
}