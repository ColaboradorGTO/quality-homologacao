import { Fragment, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal";
import { InputFieldModal } from "../../../Buttons/InputFieldModal";
import { FooterModal } from "../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { dataFormatada } from "../../../../utils/dataFormatada";
import { toFloat } from "../../../../utils/toFloat";

export const ActionDetalheVendaModal = ({show, handleClose,dadosVendas}) => {


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

          <HeaderModal
            title={"Detalhe da Venda"}
            subTitle={"Relação de Produtos da Venda"}
            handleClose={handleClose}
          />

          <Modal.Body>
          {/* <header>
            <h3><b> Venda Nº {dadosVendas[0]?.IDVENDA} </b></h3>
            <p>Operador: {dadosVendas[0]?.NOFUNCIONARIO}</p>
            <p>Cliente: Consumidor Final</p>
            <p>CPF: Não Informado</p>
          </header> */}
            

            <div class="form-group">
              <div class="row">

                <div class="col-sm-6 col-md-6 col-xl-6">
                  <InputFieldModal
                    className="form-control input"
                    readOnly={true}
                    label="Empresa"
                    value={dadosVendas[0]?.NOFANTASIA}
                  />
                </div>
                <div class="col-sm-6 col-md-4 col-xl-4">

                  <InputFieldModal
                    className="form-control input"
                    readOnly={true}
                    label="Nº Mov. Caixa"
                    value={dadosVendas[0]?.IDMOVIMENTOCAIXAWEB}
                  />
                </div>
                <div class="col-sm-6 col-md-2 col-xl-2">

                  <InputFieldModal
                    className="form-control input"
                    readOnly={true}
                    label="Nota Nº"
                    value={dadosVendas[0]?.NFE_INFNFE_IDE_NNF}
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
                    value={dadosVendas[0]?.DTHORAABERTURA}
                  />
                </div>
                <div class="col-sm-6 col-md-3 col-xl-3">
                  <InputFieldModal
                    type="datetime"
                    className="form-control input"
                    readOnly={true}
                    label="Data Fechamento"
                    value={dadosVendas[0]?.DTHORAFECHAMENTO}
                  />
                </div>
                <div class="col-sm-6 col-md-6 col-xl-6">
                  <InputFieldModal
                    type="text"
                    className="form-control input"
                    readOnly={true}
                    label="Chave da Nota"
                    onChangeModal
                    value={dadosVendas[0]?.PROTNFE_INFPROT_CHNFE}
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
                    value={formatMoeda(toFloat(dadosVendas[0]?.VRTOTALVENDA))}
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
                    value={formatMoeda(toFloat(dadosVendas[0]?.NFE_INFNFE_TOTAL_ICMSTOT_VPROD))}
                    onChangeModal
                  />

                </div>
                <div class="col-sm-6 col-md-3 col-xl-3">
                  <InputFieldModal
                    type="text"
                    className="form-control input"
                    readOnly={true}
                    label="Valor Desc Nota"
                    value={formatMoeda(toFloat(dadosVendas[0]?.NFE_INFNFE_TOTAL_ICMSTOT_VDESC))}
                    onChangeModal
                  />

                </div>
                <div class="col-sm-6 col-md-3 col-xl-3">
                  <InputFieldModal
                    type="text"
                    className="form-control input"
                    readOnly={true}
                    label="Valor Nota"
                    value={formatMoeda(toFloat(dadosVendas[0]?.VRTOTALPAGO))}
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