import { Fragment } from "react"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { ActionListaProdutos } from "./actionListaProdutos";
import { InputFieldModal } from "../../../../Buttons/InputFieldModal";


export const FormularioVisualizar = ({ handleClose, dadosDetalheTransferencia }) => {
  return (
    <Fragment>

      <div>
        <form onSubmit={''}>
          <div className="row" data-select2-id="736">
            <div className="col-sm-6 col-xl-6">
              <InputFieldModal
                label={"Loja Origem"}
                type="text"
                readOnly={true}
                value={dadosDetalheTransferencia[0]?.EMPRESAORIGEM}
              />
            </div>
            <div className="col-sm-6 col-xl-6" data-select2-id="735">
              <InputFieldModal
                label={"Loja Destino"}
                type="select"
                value={dadosDetalheTransferencia[0]?.EMPRESADESTINO}
                readOnly={true}
              />
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-sm-6 col-xl-6">
              <label className="form-label" htmlFor="textarea">Observação</label>
              <textarea
                className="form-control"
                id="textarea"
                rows="3"
                value={dadosDetalheTransferencia[0]?.DSOBSERVACAO}
                readOnly={true}
                placeholder="Digite aqui a Observação"
              >
              </textarea>
             
            </div>
          </div>


        </form>

        <ActionListaProdutos dadosDetalheTransferencia={dadosDetalheTransferencia} />
      </div>

      <FooterModal
        ButtonTypeFechar={ButtonTypeModal}
        textButtonFechar={"Fechar"}
        onClickButtonFechar={handleClose}
        corFechar={"secondary"}
      />

    </Fragment>
  )
}