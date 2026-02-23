import { Fragment, useEffect, useRef, useState } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal";
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../Modais/FooterModal/footerModal";
import { getDataAtual } from "../../../../utils/dataAtual";
import { useReactToPrint } from "react-to-print";

export const ActionImprimirQuebraModal = ({ show, handleClose, dadosDetelheImprimir }) => {
const [dataAtualFormatada, setDataAtualFormatada] = useState('')
const dataTableRef = useRef();

useEffect(() => {
  const data = getDataAtual()
  setDataAtualFormatada(data)
}, [])

const handlePrint = useReactToPrint({
  content: () => dataTableRef.current,
  documentTitle: 'Impressão de Recibos',
});

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
            subTitle={"Imprimir Desconto em Folha"}
            handleClose={handleClose}
          />

          <Modal.Body>

            <div style={{ padding: "10px" }}>

              {dadosDetelheImprimir.map((item) => {
                return (
                  <Fragment>
                    <div style={{ justifyContent: "center", }} ref={dataTableRef}>
                      <div className="col-sm-12">
                        <h3 style={{ textAlign: "center", marginBottom: "30px" }}>DESCONTO AUTORIZADO EM FOLHA DE PAGAMENTO</h3>
                      </div>
                      <div className="col-sm-12" >
                        <span style={{ fontSize: "14px" }}>
                          Valor da Quebra:<b> R$ {item.VRQUEBRASISTEMA} - </b>Referente:<b>   {item.DSCAIXA}   - </b>Movimento:<b>  {item.IDMOVIMENTOCAIXA} </b>
                        </span>
                      
                        <span style={{ fontSize: "14px" }}>Pelo presente instrumento, Eu  ,<b> {item.NOMEOPERADOR}</b>, brasileiro(a), função {item.DSFUNCAO}, inscrito(a) no CPF sob o nº  <b> {item.CPFOPERADOR} </b>,
                          colaborador(a) da empresa GTO COM. ATAC. DE CONFEC. E CALÇ. LTDA., inscrita no CNPJ nº.<b>  {item.NUCNPJ} `</b>, com sede na {item.EENDERECO} - {item.EBAIRRO} - {item.ECIDADE} - {item.SGUF},
                          <b> AUTORIZO </b> a empresa a efetuar o desconto acima especificado em meu salário, através da folha de pagamento.</span>
                      </div>

                      <div className="col-sm-12 mt-4" >
                        <p style={{ fontSize: "14px" }}> Motivo: <b> {item.TXTHISTORICO} </b> </p>

                      </div>
                      <div className="col-sm-12" >
                        <p style={{ fontSize: "14px" }}> Brasília, <b> {dataAtualFormatada} </b>. </p> 

                      </div>
                      
                      <div style={{ textAlign: "center", paddingTop: '2rem'}} >
                        <div className="col-sm-12" >--------------------------------------------------------------------------------------------------------------------</div>
                        <div className="col-sm-12" ><p style={{ fontSize: "14px" }}> {item.NOMEOPERADOR}` - CPF: {item.CPFOPERADOR}  </p> </div>

                        <div className="col-sm-12">--------------------------------------------------------------------------------------------------------------------</div>
                        <div className="col-sm-12" > <p style={{ fontSize: "14px" }}>{item.NOFANTASIA} - {item.NOMEGERENTE} </p></div>

                      </div>
                    </div>
                  </Fragment>
                )
              })}
            
            </div>

          </Modal.Body>


          <FooterModal
            ButtonTypeCadastrar={ButtonTypeModal}
            onClickButtonCadastrar={handlePrint}
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