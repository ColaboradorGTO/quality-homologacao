import { Fragment } from "react"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ActionCarregaImagem } from "../actionCarregaImagem"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"

export const FormularioCadastrar = ({handleClose }) => {
    return (
        <Fragment>
            <form>
                <div className="row">
                    <div className="col-sm-6 col-xl-3">
                        <InputFieldModal
                            label={"Referência *"}
                            type={"text"}
                            id={"refimagemprod"}
                            value={""}
                            onChangeModal
                        />
                    </div>
                    <div className="col-sm-6 col-xl-3">
                        <InputFieldModal
                            label={"Nº Pedido *"}
                            type={"text"}
                            id={"refimagemprod"}
                            value={""}
                            onChangeModal
                        />
                    </div>
                </div>

                <div style={{ marginTop: '5rem' }} >
                    <ActionCarregaImagem />

                </div>
                <FooterModal
                    ButtonTypeFechar={ButtonTypeModal}
                    onClickButtonFechar={handleClose}
                    textButtonFechar={"Fechar"}
                    corFechar={"secondary"}

                // ButtonTypeCadastrar={ButtonTypeModal}
                // onClickButtonCadastrar
                // textButtonCadastrar={"Salvar"}
                // corCadastrar={"success"}
                />
            </form>
        </Fragment>
    )
}