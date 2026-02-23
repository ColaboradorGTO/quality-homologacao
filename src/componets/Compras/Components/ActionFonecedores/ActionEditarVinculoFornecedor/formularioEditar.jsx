import { Fragment } from "react"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { useForm } from "react-hook-form";
import Select from 'react-select';
import { useEditarVinculoFornecedorFabricante } from "../hooks/useEditarViculoFornecedorFabricante";

export const FormularioEditar = ({
  handleClose,
  dadosDetalheFornecedorFabricante,
  usuarioLogado,
  optionsModulos,
  handleClick
}) => {
  const { register, handleSubmit, errors } = useForm();
  const {
    statusSelecionado,
    fabricante,
    fornecedorSelecionado,
    setFornecedorSelecionado,
    data,
    optionsStatus,
    setStatusSelecionado,
    setFabricante,
    dadosFabricantes,
    onSubmit
  } = useEditarVinculoFornecedorFabricante({ handleClose, dadosDetalheFornecedorFabricante, usuarioLogado, optionsModulos, handleClick})
  return (

    <Fragment>
      <form>
        <div className="form-group">
          <div className="row">

            <div className="col-sm-6 col-xl-4">

              <InputFieldModal
                label={"Fornecedor *"}
                type={"text"}
                nome={"nomeFabricante"}
                readOnly={true}
                value={dadosDetalheFornecedorFabricante[0]?.DSFORNECEDOR}
                onChange={(e) => setFabricante(e.target.value)}
                required={true}
              />
      
            </div>
            <div className="col-sm-6 col-xl-6">
              <label htmlFor="fornecedor">Nome Fabricante *</label>
              <Select
                className="basic-single"
                classNamePrefix="select"
                value={fornecedorSelecionado}
                options={dadosFabricantes.map((item) => {
                  return {
                    value: item.IDFORNECEDOR,
                    label: `${item.IDFABRICANTE} - ${item.DSFABRICANTE}`
                  }
                })}
                onChange={(e) => setFornecedorSelecionado(e)}
              />
            </div>
            <div className="col-sm-6 col-xl-2">
              <label htmlFor="situacao">Situação *</label>
              <Select
                value={statusSelecionado}
                options={optionsStatus.map((item) => {
                  return {
                    value: item.value,
                    label: item.label
                  }
                })}
                onChange={(e) => setStatusSelecionado(e)}
              />
            </div>
          </div>
        </div>

      </form>

      <FooterModal
        ButtonTypeFechar={ButtonTypeModal}
        onClickButtonFechar={handleClose}
        textButtonFechar={"Fechar"}
        corFechar={"secondary"}

        ButtonTypeCadastrar={ButtonTypeModal}
        onClickButtonCadastrar={handleSubmit(onSubmit)}
        textButtonCadastrar={"Salvar"}
        corCadastrar={"success"}
      />
    </Fragment>
  )
}