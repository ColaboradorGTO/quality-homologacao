import { Fragment } from "react"
import Modal from 'react-bootstrap/Modal';
import { dataFormatada } from "../../../../utils/dataFormatada";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { InputFieldModal } from "../../../Buttons/InputFieldModal";
import { FooterModal } from "../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal";
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal";
import { toFloat } from "../../../../utils/toFloat";


export const ActionDetalheVendaModal = ({show, handleClose, dadosVendas}) => {

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

          <div className="" role="document">

            <HeaderModal
              title={"VENDA Nº " + dadosVendas[0]?.IDVENDA}
              handleClose={handleClose}
            />
            <header className="modal-header">
              <div>

                <p style={{ fontWeight: 500 }}>Operador: <b> {dadosVendas[0]?.NOFUNCIONARIO} </b></p>
                <p style={{ fontWeight: 500 }}>Cliente: <b>{dadosVendas[0]?.NOFUNDESCONTO != null && dadosVendas[0]?.NOFUNDESCONTO != '' ? dadosVendas[0]?.NOFUNDESCONTO : 'Consumidor Final'} </b></p>
                <p style={{ fontWeight: 500 }}>CPF: <b>{dadosVendas[0]?.DEST_CPF === '' ? 'Não Informado' : dadosVendas[0]?.DEST_CPF}</b></p>
              </div>
            </header>
            <Modal.Body>
              <div class="form-group">
                <div class="row mt-2">

                  <div class="col-sm-6 col-xl-6">
                    <InputFieldModal 
                      label="Empresa" 
                      type="text" 
                      class="form-control input" 
                      value={dadosVendas[0]?.NOFANTASIA} 
                      readOnly 
                    />
                  </div>

                  <div class="col-sm-6 col-xl-4">
              
                    <InputFieldModal 
                      label="Nº Mov. Caixa" 
                      type="text" 
                      class="form-control input" 
                      value={dadosVendas[0]?.IDMOVIMENTOCAIXAWEB} 
                      readOnly 
                    />
                  </div>

                  <div class="col-sm-6 col-xl-2">

                    <InputFieldModal 
                      label="Nota Nº" 
                      type="text" 
                      id="idnumnota" 
                      name="idnumnota" 
                      class="form-control input" 
                      value="" 
                      readOnly 
                    />
                  </div>
                </div>


                <div className="form-group">

                  <div class="row mt-2">
                    <div class="col-sm-6 col-xl-3">
                    
                      <InputFieldModal 
                        label="Data Abertura" 
                        type="text" 
                        class="form-control" 
                        value={dadosVendas[0]?.DTHORAABERTURA} 
                        readOnly 
                      />
                      
                    </div>

                    <div class="col-sm-6 col-xl-3">
                     
                      <InputFieldModal 
                        label="Data Fechamento" 
                        type="text" 
                        class="form-control" 
                        value={dadosVendas[0]?.DTHORAFECHAMENTO} 
                        readOnly 
                      />
                    </div>

                    <div class="col-sm-6 col-xl-6">
                    
                      <InputFieldModal 
                        label="Chave da Nota" 
                        type="text" 
                        id="ChNota" 
                        name="ChNota" 
                        class="form-control" 
                        value="" 
                        readOnly 
                      />
                    </div>

                  </div>
                </div>

                <div class="row mt-2">
                  <div class="col-sm-6 col-xl-3">
                    
                    <InputFieldModal 
                      label="Valor Venda" 
                      type="text" 
                      class="form-control input" 
                      value={formatMoeda(toFloat(dadosVendas[0]?.VRTOTALVENDA))} 
                      readOnly 
                    />
                  </div>
                  <div class="col-sm-6 col-xl-3">
                    <InputFieldModal 
                      label="Valor Bruto Nota" 
                      type="text" 
                      class="form-control input" 
                      value={formatMoeda(toFloat(dadosVendas[0]?.NFE_INFNFE_TOTAL_ICMSTOT_VPROD))} 
                      readOnly 
                    />
                  </div>

                  <div class="col-sm-6 col-xl-3">
                
                    <InputFieldModal 
                      label="Valor Desc Nota" 
                      type="text" 
                      class="form-control input" 
                      value={formatMoeda(toFloat(dadosVendas[0]?.NFE_INFNFE_TOTAL_ICMSTOT_VDESC))} 
                      readOnly 
                    />

                  </div>
                  <div class="col-sm-6 col-xl-3">
                    <InputFieldModal 
                      label="Valor Nota" 
                      type="text" 
                      class="form-control input" 
                      value={formatMoeda(toFloat(dadosVendas[0]?.VRTOTALPAGO))} 
                      readOnly 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="row mt-2">

                    <div class="col-sm-6 col-xl-3">
                      <InputFieldModal 
                        label="Nº Cupom" 
                        type="text" 
                        id="idcupompromocao" 
                        name="idcupompromocao" 
                        class="form-control input" 
                        value="0" 
                        readOnly
                      />
                    </div>
                    <div class="col-sm-6 col-xl-3">
                      <InputFieldModal 
                        label="Venda Origem" 
                        type="text"  
                        id="idvendaorigem" 
                        name="idvendaorigem" 
                        class="form-control input" 
                        value="0" 
                        readOnly 
                      />
                    </div>

                    <div class="col-sm-6 col-xl-3">
                      <InputFieldModal 
                        label="Venda Destino" 
                        type="text" 
                        id="idvendadestino" 
                        name="idvendadestino" 
                        class="form-control input" 
                        value="0" 
                        readOnly 
                      />
                    </div>
                    <div class="col-sm-6 col-xl-3">
             
                      <InputFieldModal 
                        label="Valor Desconto" 
                        type="text" 
                        id="vrdesccupom" 
                        name="vrdesccupom" 
                        class="form-control input" 
                        value="0" 
                        readOnly 
                      />
                    </div>
                  </div>

                </div>

              </div>


            </Modal.Body>

            <FooterModal
              ButtonTypeFechar={ButtonTypeModal}
              textButtonFechar={"Fechar"}
              onClickButtonFechar={handleClose}
              corFechar={"secondary"}
            />
          </div>
        </Modal>

    </Fragment>
  )
}