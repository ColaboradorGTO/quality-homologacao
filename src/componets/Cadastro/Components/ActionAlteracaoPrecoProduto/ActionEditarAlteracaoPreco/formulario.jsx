import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"

export const Formulario = async ({
    handleClose,
    dadosDetalheAlteracao,
    optionsModulos,
    usuarioLogado
}) => {

    return (
        <form action="">
            <div className="form-group">
              <div className="row">
                <div className="col-sm-6 col-xl-6">
                  <InputFieldModal
                    label={"Data Criação *"}
                    type={"date"}

                    id={"dtCreateListaPreco"}
                    value={""}
                    onChangeModal={""}
                    readOnly={true}
                    {...register("dtCreateListaPreco", { required: "Campo obrigatório Informe a Descrição do Grupo Estrutura Mercadológica", })}
                    required={true}
                  />
                </div>
                <div className="col-sm-6 col-xl-6">
                  <InputFieldModal
                    label={"Data Alteração *"}
                    type={"date"}

                    id={"dtAlterListaPreco"}
                    value={""}
                    onChangeModal={""}

                    {...register("dtAlterListaPreco", { required: "Campo obrigatório Informe a Descrição do Grupo Estrutura Mercadológica", })}
                    required={true}
                  />
                </div>

              </div>

              <div className="row mt-4">
                <div className="col-sm-6 col-xl-3">

                  <label htmlFor="">Status Alteração *</label>
                  <Select

                    defaultValue={statusSelecionado}
                    options={optionsStatus.map((item) => {
                      return {
                        value: item.value,
                        label: item.label
                      }
                    })}
                    onChange={handleChangeStatus}
                  />
                </div>
              </div>

              <div className="row mt-4">
                <div className="col-sm-6 col-xl-6">
                  <InputFieldModal
                    label={"Alteração "}
                    type={"text"}

                    id={"idListaPreco"}
                    value={dadosDetalheAlteracao[0]?.alteracaoPreco.IDRESUMOALTERACAOPRECOPRODUTO}
                    onChangeModal={""}

                    {...register("idListaPreco", { required: "Campo obrigatório Informe a Descrição do Grupo Estrutura Mercadológica", })}
                    required={true}
                  />
                </div>
                <div className="col-sm-6 col-xl-6">
                  <InputFieldModal
                    label={"Lista Alvo de Alteração *"}
                    type={"text"}

                    id={"nomeListaPreco"}
                    value={dadosDetalheAlteracao[0]?.listaPreco.NOMELISTA}
                    onChangeModal={""}

                    {...register("nomeListaPreco", { required: "Campo obrigatório Informe a Descrição do Grupo Estrutura Mercadológica", })}
                    required={true}
                  />
                </div>

              </div>

              <div className="row mt-4">
                <div className="col-sm-6 col-xl-6">
                  <InputFieldModal
                    label={"Qtd. Produtos"}
                    type={"text"}

                    id={"idListaPreco"}
                    value={toFloat(dadosDetalheAlteracao[0]?.alteracaoPreco.QTDITENS)}
                    onChangeModal={''}

                    {...register("idListaPreco", { required: "Campo obrigatório Informe a Descrição do Grupo Estrutura Mercadológica", })}
                    required={true}
                  />
                </div>
                <div className="col-sm-6 col-xl-6">
                  <InputFieldModal
                    label={"Responsável "}
                    type={"text"}

                    id={"nomeListaPreco"}
                    value={""}
                    onChangeModal={""}

                    {...register("nomeListaPreco", { required: "Campo obrigatório Informe a Descrição do Grupo Estrutura Mercadológica", })}
                    required={true}
                  />
                </div>

              </div>

            </div>

            <FooterModal
              ButtonTypeFechar={ButtonTypeModal}
              onClickButtonFechar={handleClose}
              textButtonFechar={"Fechar"}
              corFechar={"secondary"}

              ButtonTypeCadastrar={ButtonTypeModal}
              onClickButtonCadastrar
              textButtonCadastrar={"Salvar"}
              corCadastrar={"success"}
              loadingTextCadastrar={"Cadastrando..."}
              autoLoadingCadastrar={true}
            />

          </form>
    )
}