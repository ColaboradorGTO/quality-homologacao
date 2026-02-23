import { Fragment } from "react"
import { ButtonTypeModal } from "../../Buttons/ButtonTypeModal"

export const FooterModal = ({ 
  ButtonTypeConfirmar,
  textButtonConfirmar,
  onClickButtonConfirmar,
  corConfirmar,
  iconConfirmar,
  styleConfirmar,

  ButtonTypeFechar,
  onClickButtonFechar,
  textButtonFechar,
  corFechar,
  iconFechar,

  ButtonTypeCadastrar,
  onClickButtonCadastrar,
  textButtonCadastrar,
  corCadastrar,
  iconCadastrar,
  iconSizeCadastrar,
  styleCadastrar,
  tipoBtnCadastrar,

  ButtonTypeCancelar,
  onClickButtonCancelar,
  textButtonCancelar,
  corCancelar,
  iconCancelar,
  iconSizeCancelar,


  handleClose,
  handleClick, 
  disabled
}) => {
  return (
    <Fragment >
      <div
        style={{ display: "flex", justifyContent: "end", }}
        className="modal-footer"
        id="footerdeposito"
      >
        {ButtonTypeCadastrar && ( 
          <ButtonTypeCadastrar
            textButton={textButtonCadastrar}
            onClickButtonType={onClickButtonCadastrar}
            cor={corCadastrar}
            tipo={tipoBtnCadastrar}
            disabled={disabled}
            Icon={iconCadastrar}
            iconSize={iconSizeCadastrar}
            style={styleCadastrar}
          />

        )}
        {ButtonTypeFechar && ( 
          <ButtonTypeFechar
            textButton={textButtonFechar}
            onClickButtonType={onClickButtonFechar}
            cor={corFechar}
            tipo="button"
            iconFechar={iconFechar}
          />

        )}
        {ButtonTypeConfirmar && ( 
          <ButtonTypeConfirmar
            textButton={textButtonConfirmar}
            onClickButtonType={onClickButtonConfirmar}
            cor={corConfirmar}
            tipo="button"
            iconConfirmar={iconConfirmar}
            style={styleConfirmar}
          />

        )}

        {ButtonTypeCancelar && (
          <ButtonTypeCancelar
            textButton={textButtonCancelar}
            onClickButtonType={onClickButtonCancelar}
            cor={corCancelar}
            tipo="button"
            iconCancelar={iconCancelar}
            iconSize={iconSizeCancelar}
          />
        )}
        {/* <ButtonTypeModal
          textButton={"Cadastrar "}
          onClickButtonType={handleClick}
          cor="success"
          tipo="button"
        />
        <ButtonTypeModal textButton={"Fechar"} onClickButtonType={handleClose} cor="secondary" tipo="button" /> */}
      </div>
    </Fragment>
  )
}