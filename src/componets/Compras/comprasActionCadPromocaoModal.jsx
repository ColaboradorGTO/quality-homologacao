import { Fragment, useState } from "react"
import { FooterModal } from "../Modais/FooterModal/footerModal"
import { InputFieldModal } from "../Buttons/InputFieldModal"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../Modais/HeaderModal/HeaderModal"
import { ButtonTypeModal } from "../Buttons/ButtonTypeModal"

export const ComprasActionCadPromocaoModal = ({ show, handleClose }) => {
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [descricaoPromocao, setDescricaoPromocao] = useState('')
  const [aplicacaoEntrada, setAplicacaoEntrada] = useState('')
  const [qtdAplicacao, setQtdAplicacao] = useState('')
  const [valorProduto, setValorProduto] = useState('')
  const [fator, setFator] = useState('')
  const [valorDesconto, setValorDesconto] = useState('')
  const [percentual, setPercentual] = useState('')


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
          title={"Promoção"}
          subTitle={"Cadastrar Promoção"}
          handleClose={handleClose}
        />


        <Modal.Body>


        <div className="form-group">
          <div className="row">

            <div className="col-sm-6 col-xl-6">
              <InputFieldModal
                label={"Descrição *"}
                type={"text"}
                id={"descpromocao"}
                readOnly={false}
              />
            </div>
            <div className="col-sm-6 col-xl-3">

              <InputFieldModal
                label={"Data Início *"}
                type={"date"}
                id={"dtinipromo"}
                readOnly={false}
              />
            </div>
            <div className="col-sm-6 col-xl-3">
              <InputFieldModal
                label={"Data Fim *"}
                type={"date"}
                id={"dtfimpromo"}
                readOnly={false}
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="row">
            <div className="col-sm-3 col-xl-3">
              <label className="form-label" htmlFor="promoaplicst">Aplicação Entrada*</label>
              <div className="input-group">
                {/* <select className="select2 form-control" name="staplicacaopromo" id="staplicacaopromo" onChange="selecionaraplic();"> */}
                <select className="select2 form-control" name="staplicacaopromo" id="staplicacaopromo" >
                  <option value="">Selecione...</option>
                  <option value="1">Por QTD</option>
                  <option value="2">Por Valor</option>
                </select>
              </div>
            </div>
            <div className="col-sm-3 col-xl-3">

              <InputFieldModal
                label={"QTD Apartir De"}
                type={"text"}
                id={"qtdaplicpromo"}
                readOnly={false}
              />
            </div>
            <div className="col-sm-3 col-xl-3">
              <InputFieldModal
                label={"Valor Apartir De"}
                type={"text"}
                id={"vraplicpromo"}
                readOnly={false}
              />
            </div>
            <div className="col-sm-3 col-xl-3">
              <label className="form-label" htmlFor="promoaplicst">Aplicação Saída*</label>
              <div className="input-group">
                <select className="select2 form-control" name="staplicacaosaidapromo" id="staplicacaosaidapromo">
                <option value="">Selecione...</option>
                  <option value="1">Por QTD</option>
                  <option value="2">Por Valor</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="row">
            <div className="col-sm-3 col-xl-3">
              <label className="form-label" htmlFor="promofatorst">Fator *</label>
              <div className="input-group">
                {/* <select className="select2 form-control" name="stfatorpromo" id="stfatorpromo" onChange="selecionarafator();"> */}
                <select className="select2 form-control" name="stfatorpromo" id="stfatorpromo">
                  <option value="">Selecione...</option>
                  <option value="0">Por Valor do Produto</option>
                  <option value="1">Por Valor de Desconto</option>
                  <option value="2">Por Percentual</option>
                </select>
              </div>
            </div>
            <div className="col-sm-3 col-xl-3">

              <InputFieldModal
                label={"Valor Produto"}
                type={"text"}
                id={"vrprodfatorpromo"}
                readOnly={false}
              />
            </div>
            <div className="col-sm-3 col-xl-3">
              <InputFieldModal
                label={"Valor Desconto"}
                type={"text"}
                id={"vrdescfatorpromo"}
                readOnly={false}
              />
            </div>
            <div className="col-sm-3 col-xl-3">
              <InputFieldModal
                label={"Percentual"}
                type={"text"}
                id={"percaplicpromo"}
                readOnly={false}
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <div className="row">
            <h3 style={{color: "red"}}>* Campos Obrigatórios *</h3>
      
          </div>
        </div>

        </Modal.Body>
        <FooterModal  
          ButtonTypeFechar={ButtonTypeModal}
          textButtonFechar={"Fechar"}
          onClickButtonFechar
          cor="secondary" 
          
          ButtonTypeCadastrar={ButtonTypeModal}
          textButtonCadastrar={"Cadastrar"}
          onClickButtonCadastrar
          corCadastrar="primary"
        />

      </Modal>
    </Fragment>
  )
}