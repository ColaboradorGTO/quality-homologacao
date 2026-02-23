import React, { Fragment, useEffect, useRef, useState } from "react"
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from "react-router-dom";
import { getDataAtual } from "../../../utils/dataAtual";
import { HeaderModal } from "../../Modais/HeaderModal/HeaderModal";
import { FooterModal } from "../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../Buttons/ButtonTypeModal";
import { useReactToPrint } from "react-to-print";
import { dataFormatada } from "../../../utils/dataFormatada";


export const ModalImprimirQuebra = ({ show, handleClose, dadosQuebraCaixasModal }) => {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [dataAtualFormatada, setDataAtualFormatada] = useState('');
  const navigate = useNavigate();
  const dataTableRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'DESCONTO AUTORIZADO EM FOLHA DE PAGAMENTO',
  });

  useEffect(() => {

    const dataAtual = getDataAtual();
    setDataAtualFormatada(dataFormatada(dataAtual));
  }, []);


  useEffect(() => {
    const usuarioArmazenado = localStorage.getItem('usuario');

    if (usuarioArmazenado) {
      try {
        const parsedUsuario = JSON.parse(usuarioArmazenado);
        setUsuarioLogado(parsedUsuario);;
      } catch (error) {
        console.error('Erro ao parsear o usuário do localStorage:', error);
      }
    } else {
      navigate('/');
    }
  }, [navigate]);


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
        {dadosQuebraCaixasModal.map((item) => {
      
          if (usuarioLogado.id == item.IDFUNCIONARIO) {
            return (
              <Fragment>

                <HeaderModal
                  title={"Impressão de Recibos"}
                  subTitle={"Imprimir Quebra de Caixa"}
                  handleClose={handleClose}
                />

                <Modal.Body>

                  <div ref={dataTableRef}>
                    <div style={{ justifyContent: "center", }}>
                      <div className="col-sm-12">
                        <h3 style={{ textAlign: "center", marginBottom: "30px" }}>AUTORIZAÇÃO DE DESCONTO EM FOLHA DE PAGAMENTO POR QUEBRA DE CAIXA</h3>
                      </div>
                      <div className="col-sm-12" >
                        <p style={{ fontSize: "13px" }}>
                          Valor da Quebra:<b> R$ {item.VRQUEBRASISTEMA} - </b>Referente:<b>   {item.DSCAIXA}   - </b>Movimento:<b>  {item.IDMOVIMENTOCAIXA} </b>
                        </p>
                      </div>

                      <div className="col-sm-12" >
                        <p style={{ fontSize: "13px" }}>Pelo presente instrumento, Eu  ,<b> {item.NOMEOPERADOR}</b>, brasileiro(a), função {item.DSFUNCAO}, inscrito(a) no CPF sob o nº <p> <b> {item.CPFOPERADOR} </b>,</p>
                          colaborador(a) da empresa GTO COM. ATAC. DE CONFEC. E CALÇ. LTDA., inscrita no CNPJ nº.<b>  {item.NUCNPJ} </b>, com sede na {item.EENDERECO} - {item.EBAIRRO} - {item.ECIDADE} - {item.SGUF},
                          <b>AUTORIZO</b> a empresa a efetuar o desconto até o limite total do meu adicional de quebra de caixa, em meu salário, através da folha de pagamento, dos valores faltantes no meu caixa, seguindo assim os ditames legais do Art. 462, §1º da CLT e CCT vigentes.</p>
                      </div>

                      <div className="col-sm-12" ><p style={{ fontSize: "13px" }}> Motivo: <b style={{ textTransform: 'uppercase' }}>{item.TXTHISTORICO}</b>  </p></div>

                      <div className="col-sm-12"><p style={{ fontSize: "13px" }}> Brasília, <b> {dataAtualFormatada} </b>. </p> </div>
                      <div style={{ textAlign: "center" }} >
                        <div className="col-sm-12" >--------------------------------------------------------------------------------------------------------------------</div>
                        <div className="col-sm-12" ><p style={{ fontSize: "13px" }}> {item.NOMEOPERADOR} - CPF: {item.CPFOPERADOR}  </p> </div>

                        <div className="col-sm-12">--------------------------------------------------------------------------------------------------------------------</div>
                        <div className="col-sm-12" > <p style={{ fontSize: "13px" }}>{item.NOFANTASIA} - {item.NOMEGERENTE} </p></div>

                      </div>
                    </div>
                  </div>

                  <FooterModal
                    ButtonTypeFechar={ButtonTypeModal}
                    onClickButtonFechar={handleClose}
                    textButtonFechar={"Fechar"}
                    corFechar={"secondary"}

                    ButtonTypeCadastrar={ButtonTypeModal}
                    onClickButtonCadastrar={() => handlePrint()}
                    textButtonCadastrar={"Confirmar Impressão"}
                    corCadastrar={"success"}

                  />
                </Modal.Body>
              </Fragment>
            )
          } else {
            return (
              <Fragment>

                <HeaderModal
                  title={"Impressão de Recibos"}
                  subTitle={"Imprimir Desconto em Folha"}
                  handleClose={handleClose}
                />

                <Modal.Body>

                  <div ref={dataTableRef}>
                    <div style={{ justifyContent: "center", }}>
                      <div className="col-sm-12">
                        <h3 style={{ textAlign: "center", marginBottom: "30px" }}>DESCONTO AUTORIZADO EM FOLHA DE PAGAMENTO</h3>
                      </div>
                      <div className="col-sm-12" >
                        <p style={{ fontSize: "13px" }}>
                          Valor da Quebra:<b> R$ {item.VRQUEBRASISTEMA} - </b>Referente:<b>   {item.DSCAIXA}   - </b>Movimento:<b>  {item.IDMOVIMENTOCAIXA} </b>
                        </p>
                      </div>

                      <div className="col-sm-12" >
                        <p style={{ fontSize: "13px" }}>Pelo presente instrumento, Eu  ,<b> {item.NOMEOPERADOR}</b>, brasileiro(a), função {item.DSFUNCAO}, inscrito(a) no CPF sob o nº <p> <b> {item.CPFOPERADOR} </b>,</p>
                          colaborador(a) da empresa GTO COM. ATAC. DE CONFEC. E CALÇ. LTDA., inscrita no CNPJ nº.<b>  {item.NUCNPJ} </b>, com sede na {item.EENDERECO} - {item.EBAIRRO} - {item.ECIDADE} - {item.SGUF},
                          <b> AUTORIZO </b> a empresa a efetuar o desconto acima especificado em meu salário, através da folha de pagamento.</p>
                      </div>

                      <div className="col-sm-12" ><p style={{ fontSize: "13px" }}> Motivo: <b style={{ textTransform: 'uppercase' }}>{item.TXTHISTORICO}</b>  </p></div>

                      <div className="col-sm-12"><p style={{ fontSize: "13px" }}> Brasília, <b> {dataAtualFormatada} </b>. </p> </div>
                      <div style={{ textAlign: "center" }} >
                        <div className="col-sm-12" >--------------------------------------------------------------------------------------------------------------------</div>
                        <div className="col-sm-12" ><p style={{ fontSize: "13px" }}> {item.NOMEOPERADOR} - CPF: {item.CPFOPERADOR}  </p> </div>

                        <div className="col-sm-12">--------------------------------------------------------------------------------------------------------------------</div>
                        <div className="col-sm-12" > <p style={{ fontSize: "13px" }}>{item.NOFANTASIA} - {item.NOMEGERENTE} </p></div>

                      </div>
                    </div>
                  </div>

                  <FooterModal
                    ButtonTypeFechar={ButtonTypeModal}
                    onClickButtonFechar={handleClose}
                    textButtonFechar={"Fechar"}
                    corFechar={"secondary"}

                    ButtonTypeCadastrar={ButtonTypeModal}
                    onClickButtonCadastrar={() => handlePrint()}
                    textButtonCadastrar={"Confirmar Impressão"}
                    corCadastrar={"success"}

                  />
                </Modal.Body>
              </Fragment>
            )
          }
        })}
      </Modal>
    </Fragment>
  )

}