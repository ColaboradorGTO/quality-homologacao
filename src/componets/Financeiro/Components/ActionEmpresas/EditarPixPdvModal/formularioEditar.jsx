import { Fragment } from "react"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import Select from 'react-select'
import { useAtualizarPixPDV } from "../hooks/useAtualizarPixPDV"
import { useForm } from "react-hook-form"
import { Message } from 'primereact/message';
        

export const FormularioEditar = ({ dadosPixPDV, handleClose, optionsModulos, usuarioLogado }) => {
  const { register, handleSubmit, errors } = useForm();
  const {
    pixSelecionado,
    faturaSelecionado,
    setPixSelecionado,
    setFaturaSelecionado,
    optionsBancos,
    onSubmit
  } = useAtualizarPixPDV({ dadosPixPDV, handleClose, optionsModulos, usuarioLogado })
 
  return (
    <Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>

        <div className="form-group">
          <div className="row">
            <div className="col-sm-6 col-xl-6">
              <InputFieldModal
                label={"Nº LOJA"}
                type="text"
                readOnly={true}
                value={dadosPixPDV[0]?.IDEMPRESA}

              />
            </div>
            <div className="col-sm-6 col-xl-6">
              <InputFieldModal
                label={"LOJA"}
                type="text"
                readOnly={true}
                value={dadosPixPDV[0]?.NOFANTASIA}
              />
            </div>

          </div>

          <div className="form-group mt-4">
            <div className="row">
              <div className="col-sm-6 col-xl-6">

                <label> Config. Pix Venda </label>
                <Select
                  options={optionsBancos.map((item) => {
                    return {
                      value: item.value,
                      label: item.label

                    }
                  })}
                  value={pixSelecionado}
                  onChange={(e) => setPixSelecionado(e.value)}
                />
                {!pixSelecionado && <Message severity="error" text="Selecione o Pix" />}
              </div>
              <div className="col-sm-6 col-xl-6">
                <label>Config. Pix Fatura</label>
                <Select
                  options={optionsBancos.map((item) => {
                    return {
                      value: item.value,
                      label: item.label
                    }
                  })}
                  value={faturaSelecionado}
                  onChange={(e) => setFaturaSelecionado(e.value)}

                />
                {!faturaSelecionado && <Message severity="error" text="Selecione o Pix Fatura" />}
              </div>

            </div>
          </div>
        </div>
      </form>
      <FooterModal

        ButtonTypeCadastrar={ButtonTypeModal}
        onClickButtonCadastrar={handleSubmit((data) => {
          onSubmit(data);
        })}
        textButtonCadastrar={"Atualizar"}
        corCadastrar={"success"}
        loadingTextCadastrar={"Atualizando..."}
        autoLoadingCadastrar={true} 

        ButtonTypeFechar={ButtonTypeModal}
        onClickButtonFechar={handleClose}
        textButtonFechar={"Cancelar e Fechar"}
        corFechar={"secondary"}
      />
    </Fragment>
  )
}