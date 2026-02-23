import { Fragment } from "react"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { ActionListaProdutos } from "./actionListaProdutos";


export const FormularioEditar = ({ handleClose, dadosDetalheTransferencia }) => {
  return (
    <Fragment>

      <div>
        <form onSubmit={''}>
          <div className="row" data-select2-id="736">
            <div className="col-sm-6 col-xl-6">
              <InputFieldModal
                label={"Loja Origem"}
                type="text"
                // id="IDContaBanco"
                readOnly={true}
                // value={dadosDetalheTransferencia[0]?.EMPRESAORIGEM}
              />
            </div>
            <div className="col-sm-6 col-xl-6" data-select2-id="735">
              <InputFieldModal
                label={"Loja Destino"}
                type="select"
                // value={dadosDetalheTransferencia[0]?.EMPRESADESTINO}
                readOnly={true}
              />
            </div>
          </div>

          <div className="row mt-4">

            <div className="col-sm-6 col-xl-6">
              <InputFieldModal
                label={"Observação"}
                type="text"
                // id="IDContaBanco"
                readOnly={true}
                // value={dadosDetalheTransferencia[0]?.DSOBSERVACAO}
              />
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