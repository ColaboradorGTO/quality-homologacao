import { Fragment } from "react"
import { Modal } from "react-bootstrap"
import { HeaderModal } from "../Modais/HeaderModal/HeaderModal"
import { FooterModal } from "../Modais/FooterModal/footerModal"
import { InputFieldModal } from "../Buttons/InputFieldModal"
import { InputSelect } from "../Buttons/InputSelect"

export const ComprasActionCadFornecedorModal = ({ show, handleClose }) => {
  const options = [
    { value: 0, label: "Opção 1" },
    { value: 1, label: "Opção 2" },

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
          title={"Fornecedores"}
          subTitle={"Inclusão de Fornecedores e Alteração"}
          handleClose={handleClose}
        />


        <Modal.Body>

          <div className="form-group">
            <div className="row">
              <div className="col-sm-4 col-xl-4">

                <InputFieldModal
                  label={"CNPJ *"}
                  type={"text"}
                  id={"cnpjforn"}
                  readOnly={false}
                />
              </div>
              <div className="col-sm-4 col-xl-4">
                <InputFieldModal
                  label={"Insc. Estadual"}
                  type={"text"}
                  id={"inscestadualforn"}
                  readOnly={false}
                />
              </div>
              <div className="col-sm-4 col-xl-4">
                <InputFieldModal
                  label={"Insc. Municipal"}
                  type={"text"}
                  id={"inscmuniforn"}
                  readOnly={false}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="row">
              <div className="col-sm-6 col-xl-4">

                <InputFieldModal
                  label={"Razão Social *"}
                  type={"text"}
                  id={"razaoforn"}
                  readOnly={false}
                />
              </div>
              <div className="col-sm-6 col-xl-4">

                <InputFieldModal
                  label={"Nome Fantasia *"}
                  type={"text"}
                  id={"fantasiaforn"}
                  readOnly={false}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="row">
              <div className="col-sm-3 col-xl-2">

                <InputFieldModal
                  label={"CEP *"}
                  type={"text"}
                  id={"cepforn"}
                  readOnly={false}
                />
              </div>
              <div className="col-sm-3 col-xl-5">
                <InputFieldModal
                  label={"Endereço *"}
                  type={"text"}
                  id={"enderecoforn"}
                  readOnly={false}
                />
              </div>
              <div className="col-sm-3 col-xl-2">

                <InputFieldModal
                  label={"Nº *"}
                  type={"text"}
                  id={"numeroendforn"}
                  readOnly={false}
                />
              </div>
              <div className="col-sm-3 col-xl-3">
                <InputFieldModal
                  label={"Complemento"}
                  type={"text"}
                  id={"complementoendforn"}
                  readOnly={false}
                />

              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="row">
              <div className="col-sm-3 col-xl-4">
                <InputFieldModal
                  label={"Bairro *"}
                  type={"text"}
                  id={"bairroforn"}
                  readOnly={false}
                />
              </div>
              <div className="col-sm-3 col-xl-4">
                <InputFieldModal
                  label={"Cidade *"}
                  type={"text"}
                  id={"cidadeforn"}
                  readOnly={false}
                />
              </div>
              <div className="col-sm-3 col-xl-2">
                <InputFieldModal
                  label={"UF *"}
                  type={"text"}
                  id={"ufforn"}
                  readOnly={false}
                />
              </div>
              <div className="col-sm-3 col-xl-2">
                <InputFieldModal
                  label={"Nº IBGE *"}
                  type={"text"}
                  id={"nibgeforn"}
                  readOnly={false}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="row">
              <div className="col-sm-6 col-xl-6">
                <InputFieldModal
                  label={"Nome Representante *"}
                  type={"text"}
                  id={"nomerepreforn"}
                  readOnly={false}
                />
              </div>
              <div className="col-sm-6 col-xl-6">
                <InputFieldModal
                  label={"E-mail"}
                  type={"text"}
                  id={"emailforn"}
                  readOnly={false}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="row">
              <div className="col-sm-3 col-xl-3">
                <InputFieldModal
                  label={"Telefone 1 *"}
                  type={"text"}
                  id={"tel1forn"}
                  readOnly={false}
                />

              </div>
              <div className="col-sm-3 col-xl-3">
                <InputFieldModal
                  label={"Telefone 2"}
                  type={"text"}
                  id={"tel2forn"}
                  readOnly={false}
                />
              </div>
              <div className="col-sm-3 col-xl-3">
                <InputFieldModal
                  label={"Telefone 3"}
                  type={"text"}
                  id={"tel3forn"}
                  readOnly={false}
                />
              </div>
              <div className="col-sm-3 col-xl-3">
                <label className="form-label" htmlFor="fornst">Situação *</label>
                <div className="input-group">
                  <select className="select2 form-control" name="stativoforn" id="stativoforn">
                    <option value="True">ATIVO</option>
                    <option value="False">INATIVO</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <h3 className="form-label" htmlFor="vrfat">* Configuração Padrão *</h3>
          </div>

          <div className="form-group">
            <div className="row">
              <div className="col-sm-4 col-xl-4">
                <InputFieldModal
                  label={"Fiscal"}
                  type={"text"}
                  id={"idfiscal"}
                  readOnly={false}
                />
              </div>
              <div className="col-sm-4 col-xl-4">

                <InputFieldModal
                  label={"Enviar"}
                  type={"text"}
                  id={"idenviar"}
                  readOnly={false}
                />
              </div>
              <div className="col-sm-4 col-xl-4">

                <InputFieldModal
                  label={"Condições de Pagamento"}
                  type={"text"}
                  id={"idcondicaopagamento"}
                  readOnly={false}
                />
              </div>
            </div>
          </div>
          <div className="form-group">
            <div className="row">
              <div className="col-sm-4 col-xl-3">

                <InputFieldModal
                  label={"Tipo Pedido"}
                  type={"text"}
                  id={"idtipopedido"}
                  readOnly={false}
                />
              </div>
              <div className="col-sm-4 col-xl-3">

                <InputFieldModal
                  label={"Vendedor"}
                  type={"text"}
                  id={"novendedor"}
                  readOnly={false}
                />
              </div>
              <div className="col-sm-4 col-xl-6">

                <InputFieldModal
                  label={"E-mail Vendedor"}
                  type={"text"}
                  id={"emailvendedor"}
                  readOnly={false}
                />
              </div>

            </div>
          </div>
          <div className="form-group">
            <div className="row">
              <div className="col-sm-8 col-xl-8">

                <InputSelect
                  label={"Transportadora"}
                  options={options}
                  nome={"idtransportadora"}
                  id={"idtransportadora"}
                  readOnly={false}
                />

              </div>
              <div className="col-sm-4 col-xl-4">


                <InputSelect
                  label={"Tipo Frete"}
                  options={options}
                  nome={"idtransportadora"}
                  id={"tpfrete"}
                  readOnly={false}
                />
              </div>
            </div>
          </div>
          <FooterModal handleClose={handleClose} />

        </Modal.Body>


      </Modal>
    </Fragment>
  )
}
