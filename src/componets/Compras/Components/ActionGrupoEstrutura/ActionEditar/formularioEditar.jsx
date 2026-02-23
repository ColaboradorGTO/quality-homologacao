import { Fragment } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import { useForm } from "react-hook-form"
import Select from 'react-select';
import { useEditarGrupoEstruturaMercadologica } from "../hooks/useEditarGrupoEstruturaMercadologico"

export const FormularioEditar = ({
  handleClose, 
  dadosDetalheGrupo,
  usuarioLogado,
  optionsModulos,
  handleClick 
 }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const {
    optionsStatus,
    statusSelecionado,
    setStatusSelecionado,
    descricao,
    setDescricao,
    atualzarGrupoEstrutura,

  } = useEditarGrupoEstruturaMercadologica({ dadosDetalheGrupo, handleClose, usuarioLogado, optionsModulos, handleClick });
  return (
    <Fragment>
      <form onSubmit={handleSubmit(atualzarGrupoEstrutura)}>

        <div className="form-group">
          <div className="row">
            <div className="col-sm-6 col-xl-6 ">
              <InputFieldModal
                label={"Descrição *"}
                type={"text"}
                id={"IDCatPedido"}
                value={descricao}
                onChangeModal={(e) => setDescricao(e.target.value)}

                {...register("IDCatPedido", { required: "Campo obrigatório Informe a Descrição do Grupo Estrutura Mercadológica", })}
                required={true}
              />
            </div>

            <div className="col-sm-6 col-xl-3">

              <label htmlFor="">Situação *</label>
              <Select

                options={optionsStatus.map((item) => {
                  return {
                    value: item.value,
                    label: item.label
                  }
                })}
                value={statusSelecionado}
                onChange={(e) => setStatusSelecionado(e)}
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <h3 className="form-label" htmlFor="vrfat">* Campos Obrigatórios *</h3>
        </div>
        <FooterModal
          ButtonTypeFechar={ButtonTypeModal}
          onClickButtonFechar={handleClose}
          textButtonFechar={"Fechar"}
          corFechar={"secondary"}

          ButtonTypeCadastrar={ButtonTypeModal}
          onClickButtonCadastrar={atualzarGrupoEstrutura}
          tipoBtnCadastrar={"submit"}
          textButtonCadastrar={"Salvar"}
          corCadastrar={"success"}
        />

      </form>
    </Fragment>
  )
}