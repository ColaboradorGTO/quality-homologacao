import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal";
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../Modais/FooterModal/footerModal";

export const ActionImprimirAdiantamentoSalarial = ({show, handleClose,dadosAdiantamentoSalarialFuncionarios}) => {
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

        <div style={{ padding: "10px" }}>

          <HeaderModal
            title={"Impressão de Recibos"}
            subTitle={"Imprimir Adiantamento Salárial"}
            handleClose={handleClose}
          />

          <Modal.Body>
            {dadosAdiantamentoSalarialFuncionarios.map((item) => {


              return (
                <Fragment>
                  <div style={{ justifyContent: "center", }}>
                    <div className="col-sm-12">
                      <h3 style={{ textAlign: "center", marginBottom: "30px" }}>ADIANTAMENTO SALARIAL</h3>
                    </div>


                    <div className="col-sm-12" >
                      <p style={{ fontSize: "14px" }}>O(a)  <b> {item.NOFUNCIONARIO} </b>, CPF: {item.NUCPF}. Declara a empresa {item.NORAZAOSOCIAL}
                        CNPJ: {item.NUCNPJ} <b>  ({item.NOFANTASIA}) </b> - ter recebido a importância de R$ {item.VRVALORDESCONTO} (), referente ao ADIANTAMENTO SALARIAL, pago(s) em espécie.,
                      </p>
                    </div>

                    <div className="col-sm-12" ><p style={{ fontSize: "14px" }}> Histórico: <b> {item.TXTMOTIVO} </b> </p></div>

                    <div className="col-sm-12"><p style={{ fontSize: "14px" }}> Conforme Código Civil Lei nº 10.406, Art. 219, o recebimento dos créditos confirmam-se verdadeiras em relação ao Signatário. </p> </div>
                    <div className="col-sm-12"><p style={{ fontSize: "14px" }}> Brasília, <b> {item.DTLANCAMENTO} </b>. </p> </div>
                    <div style={{ textAlign: "center" }} >
                      <div className="col-sm-12" >--------------------------------------------------------------------------------------------------------------------</div>
                      <div className="col-sm-12" ><p style={{ fontSize: "14px" }}> {item.NOFUNCIONARIO}` - CPF: {item.NUCPF}  </p> </div>

                      <div className="col-sm-12">--------------------------------------------------------------------------------------------------------------------</div>
                      <div className="col-sm-12" > <p style={{ fontSize: "14px" }}>{item.NOFANTASIA} - {item.NOMEGERENTE} </p></div>

                    </div>
                  </div>


                </Fragment>
              )
            })}

          </Modal.Body>


          <FooterModal
            ButtonTypeCadastrar={ButtonTypeModal}
            onClickButtonCadastrar={""}
            textButtonCadastrar={"Confirmar Impressão"}
            corCadastrar="success"

            ButtonTypeFechar={ButtonTypeModal}
            textButtonFechar={"Fechar"}
            onClickButtonFechar={handleClose}
            corFechar="secondary"
          />
        </div>
      </Modal>
    </Fragment>
  )
}