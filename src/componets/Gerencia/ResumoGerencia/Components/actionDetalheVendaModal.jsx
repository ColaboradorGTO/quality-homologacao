import { Fragment} from "react";
import Modal from 'react-bootstrap/Modal';
import { InputFieldModal } from "../../../Buttons/InputFieldModal";
import { FooterModal } from "../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { dataFormatada } from "../../../../utils/dataFormatada";
import { useState } from "react";
import { useEffect } from "react";

export const ActionDetalheVendaModal = ({show, handleClose,dadosVendas}) => {
  const [nofantasia, setNofantasia] = useState('');
  const [idMovimentoCaixaWeb, setIdMovimentoCaixaWeb] = useState('');
  const [nfeInfNfeIdeNnf, setNfeInfNfeIdeNnf] = useState('');
  const [dthoraAbertura, setDthoraAbertura] = useState('');
  const [dthoraFechamento, setDthoraFechamento] = useState('');
  const [protNfeInfProtChnfe, setProtNfeInfProtChnfe] = useState('');
  const [vrTotalVenda, setVrTotalVenda] = useState(''); 
  const [vrBrutoNota, setVrBrutoNota] = useState('');
  const [vrDescNota, setVrDescNota] = useState('');
  const [vrNota, setVrNota] = useState('');

  useEffect(() => {
    if (dadosVendas && dadosVendas.length > 0) {
      setNofantasia(dadosVendas[0]?.NOFANTASIA || '');
      setIdMovimentoCaixaWeb(dadosVendas[0]?.IDMOVIMENTOCAIXAWEB || '');
      setNfeInfNfeIdeNnf(dadosVendas[0]?.NFE_INFNFE_IDE_NNF || '');
      setDthoraAbertura(dadosVendas[0]?.DTHORAABERTURA || '');
      setDthoraFechamento(dadosVendas[0]?.DTHORAFECHAMENTO || '');
      setProtNfeInfProtChnfe(dadosVendas[0]?.PROTNFE_INFPROT_CHNFE || '');
      setVrTotalVenda(formatMoeda(dadosVendas[0]?.VRTOTALVENDA) || '0,00');
      setVrBrutoNota(formatMoeda(dadosVendas[0]?.NFE_INFNFE_TOTAL_ICMSTOT_VPROD) || '0,00');
      setVrDescNota(formatMoeda(dadosVendas[0]?.NFE_INFNFE_TOTAL_ICMSTOT_VDESC) || '0,00');
      setVrNota(formatMoeda(dadosVendas[0]?.VRTOTALPAGO) || '0,00');
    }
  }, [dadosVendas]);
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
            <div >

              <header>
                <p style={{ fontSize: '18px'}} ><b>Venda Nº {dadosVendas[0]?.IDVENDA} </b> </p>
                <p style={{margin: 0, fontSize: '16px'}} >Operador: {dadosVendas[0]?.NOFUNCIONARIO}</p>
                <p style={{margin: 0, fontSize: '16px'}} >Cliente: Consumidor Final</p>
                <p style={{margin: 0, fontSize: '18px'}} >CPF: Não Informado</p>
              </header>
            </div>
            

            <div class="form-group mt-4">
              <div class="row">

                <div class="col-sm-6 col-md-6 col-xl-6">
                  <InputFieldModal
                    className="form-control input"
                    readOnly={true}
                    label="Empresa"
                    value={nofantasia}
                  />
                </div>
                <div class="col-sm-6 col-md-4 col-xl-4">

                  <InputFieldModal
                    className="form-control input"
                    readOnly={true}
                    label="Nº Mov. Caixa"
                    value={idMovimentoCaixaWeb}
                  />
                </div>
                <div class="col-sm-6 col-md-2 col-xl-2">

                  <InputFieldModal
                    className="form-control input"
                    readOnly={true}
                    label="Nota Nº"
                    value={nfeInfNfeIdeNnf}
                  />
                </div>
              </div>
            </div>
            <div class="form-group">
              <div class="row">

                <div class="col-sm-6 col-md-3 col-xl-3">
                  <InputFieldModal
                    type="datetime"
                    className="form-control input"
                    readOnly={true}
                    label="Data Abertura"
                    value={dthoraAbertura}
                  />
                </div>
                <div class="col-sm-6 col-md-3 col-xl-3">
                  <InputFieldModal
                    type="datetime"
                    className="form-control input"
                    readOnly={true}
                    label="Data Fechamento"
                    value={dthoraFechamento}
                  />
                </div>
                <div class="col-sm-6 col-md-6 col-xl-6">
                  <InputFieldModal
                    type="text"
                    className="form-control input"
                    readOnly={true}
                    label="Chave da Nota"
                    onChangeModal
                    value={protNfeInfProtChnfe}
                  />
                </div>
              </div>
            </div>

            <div class="form-group">
              <div class="row">
                <div class="col-sm-6 col-md-3 col-xl-3">
                  <InputFieldModal
                    type="text"
                    className="form-control input"
                    readOnly={true}
                    value={vrTotalVenda}
                    onChangeModal
                    label="Valor Venda"
                  />

                </div>

                <div class="col-sm-6 col-md-3 col-xl-3">
                  <InputFieldModal
                    type="text"
                    className="form-control input"
                    readOnly={true}
                    label="Valor Bruto Nota"
                    value={vrBrutoNota}
                    onChangeModal
                  />

                </div>
                <div class="col-sm-6 col-md-3 col-xl-3">
                  <InputFieldModal
                    type="text"
                    className="form-control input"
                    readOnly={true}
                    label="Valor Desc Nota"
                    value={vrDescNota}
                    onChangeModal
                  />

                </div>
                <div class="col-sm-6 col-md-3 col-xl-3">
                  <InputFieldModal
                    type="text"
                    className="form-control input"
                    readOnly={true}
                    label="Valor Nota"
                    value={vrNota}
                    onChangeModal
                  />

                </div>

              </div>
            </div>
            <div class="form-group">
              <div class="row">
                <div class="col-sm-6 col-md-3 col-xl-3">
                  <InputFieldModal
                    type="text"
                    className="form-control input"
                    readOnly={true}
                    label="Nº Cupom"
                    value={""}
                    onChangeModal
                    placeholder="0"
                  />
                </div>
                <div class="col-sm-6 col-md-3 col-xl-3">
                  <InputFieldModal
                    type="text"
                    className="form-control input"
                    readOnly={true}
                    label="Venda Origem"
                    value={""}
                    onChangeModal
                    placeholder="0"
                  />
                </div>
                <div class="col-sm-6 col-md-3 col-xl-3">
                  <InputFieldModal
                    type="text"
                    className="form-control input"
                    readOnly={true}
                    label="Venda Destino"
                    value={""}
                    onChangeModal
                    placeholder="0"
                  />
                </div>
                <div class="col-sm-6 col-md-3 col-xl-3">
                  <InputFieldModal
                    type="text"
                    className="form-control input"
                    readOnly={true}
                    label="Venda Desconto"
                    value={"0"}
                    onChangeModal
                    placeholder="0"
                  />
                </div>

              </div>
            </div>


            <FooterModal
              ButtonTypeFechar={ButtonTypeModal}
              textButtonFechar={"Fechar"}
              onClickButtonFechar={handleClose}
              corFechar="secondary"
            />
            
          </Modal.Body>

        </Modal>
    </Fragment>
  )
}