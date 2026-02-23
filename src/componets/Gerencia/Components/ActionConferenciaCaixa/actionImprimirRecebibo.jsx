import { Fragment, useEffect, useRef, useState } from "react"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal";
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../Modais/FooterModal/footerModal";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";
import { toFloat } from "../../../../utils/toFloat";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { getDataAtual } from "../../../../utils/dataAtual";
import { dataFormatada } from "../../../../utils/dataFormatada";

export const ActionImprimirRecibos = ({ show, handleClose, dadosDetelheImprimir }) => {
  const [dataAtualFormatada, setDataAtualFormatada] = useState('');
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const dataTableRef = useRef();
  const navigate = useNavigate();

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Ajuste Fechamento de Caixa',
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


  const calcularTotal = (item) => {
    return (
      toFloat(dadosDetelheImprimir[0]?.TOTALAJUSTEDINHEIRO) +
      toFloat(dadosDetelheImprimir[0]?.TOTALAJUSTTEF) +
      toFloat(dadosDetelheImprimir[0]?.TOTALAJUSTPOS) +
      toFloat(dadosDetelheImprimir[0]?.TOTALAJUSTCONVENIO) +
      toFloat(dadosDetelheImprimir[0]?.TOTALAJUSTVOUCHER) +
      toFloat(dadosDetelheImprimir[0]?.TOTALAJUSTEFATURA) +
      toFloat(dadosDetelheImprimir[0]?.TOTALAJUSTPIX)
    )
  }
  return (
    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        className="modal fade"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <HeaderModal
          title={"Impressão de Recibos"}
          subTitle={"Imprimir Ajuste Fechamento de Caixa"}
          handleClose={handleClose}
        />
        <Modal.Body>

          <Fragment>
            <Modal.Body>

              <div ref={dataTableRef}>
                <div style={{ justifyContent: "center", }}>
                  <div className="col-sm-12">
                    <h3 style={{ textAlign: "center", marginBottom: "30px" }}>AJUSTE FECHAMENTO DE CAIXA</h3>
                  </div>

                  <table style={{width: '60%', textAlign: "left"}}>
                    <tr>
                      <th>DATA COMPETENCIA:</th>
                      <th>  {dadosDetelheImprimir[0]?.DTABERTURA}</th>
                    </tr>
                    <tr>
                      <th>DATA FECHAMENTO</th>
                      <th>  {dadosDetelheImprimir[0]?.DTHORAFECHAMENTOCAIXA}</th>
                    </tr>
                    <tr>
                      <th>CAIXA:</th>
                      <th>  {dadosDetelheImprimir[0]?.DSCAIXAFECHAMENTO}</th>
                    </tr>
                    <tr>
                      <th>Nº FECHAMENTO LOCAL:</th>
                      <th>  {dadosDetelheImprimir[0]?.ID}</th>
                    </tr>
                    <tr>
                      <th>Nº FECHAMENTO WEB:</th>
                      <th>  {dadosDetelheImprimir[0]?.ID}</th>
                    </tr>
                    <tr>
                      <th>COD. OPERADOR(A):</th>
                      <th>  {dadosDetelheImprimir[0]?.IDOPERADORFECHAMENTO}</th>
                    </tr>
                    <br/>
                    <tr>
                      <th>VALOR AJUSTE DINHEIRO:</th>
                      <th> {formatMoeda(dadosDetelheImprimir[0]?.TOTALAJUSTEDINHEIRO)}</th>
                    </tr>
                    <tr>
                      <th>VALOR AJUSTE TEF:</th>
                      <th> {formatMoeda(dadosDetelheImprimir[0]?.TOTALAJUSTTEF)}</th>
                    </tr>
                    <tr>
                      <th>VALOR AJUSTE POS:</th>
                      <th> {formatMoeda(dadosDetelheImprimir[0]?.TOTALAJUSTPOS)}</th>
                    </tr>
                    <tr>
                      <th>VALOR AJUSTE CONVENIO:</th>
                      <th> {formatMoeda(dadosDetelheImprimir[0]?.TOTALAJUSTCONVENIO)}</th>
                    </tr>
                    <tr>
                      <th>VALOR AJUSTE VOUCHER:</th>
                      <th> {formatMoeda(dadosDetelheImprimir[0]?.TOTALAJUSTVOUCHER)}</th>
                    </tr>
                    <tr>
                      <th>VALOR AJUSTE FATURA:</th>
                      <th> {formatMoeda(dadosDetelheImprimir[0]?.TOTALAJUSTEFATURA)}</th>
                    </tr>
                    <tr>
                      <th>VALOR AJUSTE PIX:</th>
                      <th> {formatMoeda(dadosDetelheImprimir[0]?.TOTALAJUSTPIX)}</th>
                    </tr>

                    <br/>
                    <tr>
                      <th>VALOR TOTAL AJUSTE:</th>
                      <th> {formatMoeda(calcularTotal())}</th>
                    </tr>
                  </table>
                </div>

                <div class="col-sm-12 " style={{textAlign: "center", paddingTop: '4rem'}}>
                  <p>

                    Eu, <b>{dadosDetelheImprimir[0 ]?.OPERADORFECHAMENTO} </b>  - CPF: <b>{dadosDetelheImprimir[0]?.NUCPF}</b>  confirmo o ajuste de fechamento de caixa do valor acima declarado.
                  </p>
                </div>
              
                <div class="col-sm-12"  style={{textAlign: "center", paddingTop: '3rem'}}>--------------------------------------------------------------------------------------------------------------------</div>
                <div class="col-sm-12"  style={{textAlign: "center"}}>
                  <p>

                    Operador(a): <b>{dadosDetelheImprimir[0 ]?.OPERADORFECHAMENTO} </b> - CPF: <b>{dadosDetelheImprimir[0]?.NUCPF}</b> 
                  </p>
                </div>
              </div>

            </Modal.Body>
          </Fragment>
        </Modal.Body>


        <FooterModal
          ButtonTypeConfirmar={ButtonTypeModal}
          textButtonConfirmar={"Fechar"}
          onClickButtonConfirmar={handleClose}
          corConfirmar={"secondary"}

          ButtonTypeCadastrar={ButtonTypeModal}
          onClickButtonCadastrar={handlePrint}
          textButtonCadastrar={"Imprimir"}
          corCadastrar={"success"}

        />

      </Modal>
    </Fragment>
  )
}