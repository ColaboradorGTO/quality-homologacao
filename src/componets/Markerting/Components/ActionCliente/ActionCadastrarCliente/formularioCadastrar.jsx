import { Fragment } from "react"
import { useForm } from "react-hook-form";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { InputFieldModal } from "../../../../Buttons/InputFieldModal";
import Select from "react-select";
import { useCadastrarliente } from "../hooks/useCadastrarCliente";

export const FormularioCadastrarCliente = ({ handleClose, optionsModulos, usuarioLogado }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const {
    cpf,
    setCPF,
    telefone,
    setTelefone,
    nome,
    setNome,
    endereco,
    setEndereco,
    complemento,
    setComplemento,
    bairro,
    setBairro,
    cidade,
    setCidade,
    cep,
    setCEP,
    uf,
    setUF,
    dadosCampanha,
    errorCampanha,
    isLoadingCampanha,
    refetchCampanha,
    campanhaSelecionada,
    setCampanhaSelecionada,
    onSubmit
  } = useCadastrarliente({ handleClose, optionsModulos, usuarioLogado });

  return (
    <Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <div className="row">
            <div className="col-sm-6 col-md-6 col-xl-6">
              <InputFieldModal
                label={"Nome Cliente"}
                type="text"
                id={"nomecliente"}
                value={nome}
                onChangeModal={(e) => setNome(e.value)}
                {...register("nomeCliente", { required: "Campo obrigatório Informe o Nome", })}
              />

              {errors.nomeCliente && <span className="text-danger">{errors.nomeCliente.message}</span>}
            </div>

            <div className="col-sm-6 col-md-3 col-xl-3">
              <InputFieldModal
                label={"CPF"}
                type="text"
                id={"nrcpf"}
                value={cpf}
                onChangeModal={(e) => setCPF(e.value)}
                {...register("nrcpf", { required: "Campo obrigatório Informe o CPF", })}
              />
              {errors.nrcpf && <span className="text-danger">{errors.nrcpf.message}</span>}
            </div>
            <div className="col-sm-6 col-md-3 col-xl-3">
              <InputFieldModal
                label={"Telefone"}
                type="text"
                id={"nrtelefone"}
                value={telefone}
                onChangeModal={(e) => setTelefone(e.value)}
                {...register("nrtelefone", { required: "Campo obrigatório Informe o Telefone", })}
              />
              {errors.nrtelefone && <span className="text-danger">{errors.nrtelefone.message}</span>}
            </div>


          </div>
          <div className="row">
            <div className="col-sm-6 col-md-6 col-xl-6">
              <InputFieldModal
                label={"Endereço"}
                type="text"
                id={"enderecoCliente"}
                value={endereco}
                onChangeModal={(e) => setEndereco(e.value)}
                {...register("enderecoCliente", { required: "Campo obrigatório Informe o Endereço", })}
              />

            </div>
            <div className="col-sm-6 col-md-6 col-xl-6">
              <InputFieldModal
                label={"Complemento"}
                type="text"
                id={"complementoCliente"}
                value={complemento}
                onChangeModal={(e) => setComplemento(e.value)}
                {...register("complementoCliente", { required: "Campo obrigatório Informe o Complemento", })}
              />

            </div>
          </div>
          <div className="row">
            <div className="col-sm-6 col-md-3 col-xl-3">
              <InputFieldModal
                label={"Bairro"}
                type="text"
                id={"bairroCliente"}
                value={bairro}
                onChangeModal={(e) => setBairro(e.value)}
                {...register("bairroCliente", { required: "Campo obrigatório Informe o Bairro", })}
              />

            </div>

            <div className="col-sm-6 col-md-3 col-xl-3">
              <InputFieldModal
                label={"Cidade"}
                type="text"
                id={"cidadeCliente"}
                value={cidade}
                onChangeModal={(e) => setCidade(e.value)}
                {...register("cidadeCliente", { required: "Campo obrigatório Informe a Cidade", })}
              />

            </div>
            <div className="col-sm-6 col-md-3 col-xl-3">
              <InputFieldModal
                label={"CEP"}
                type="text"
                id={"cepCliente"}
                value={cep}
                onChangeModal={(e) => setCEP(e.target.value)}
                {...register("cepCliente", { required: "Campo obrigatório Informe o CEP", })}
              />

            </div>
            <div className="col-sm-6 col-md-3 col-xl-3">
              <InputFieldModal
                label={"UF"}
                type="text"
                id={"ufCliente"}
                value={uf}
                onChangeModal={(e) => setUF(e.value)}
                {...register("ufCliente", { required: "Campo obrigatório Informe o UF", })}
              />

            </div>

          </div>
        </div>
        <div className="row mt-4">
          <div className="col-sm-6 col-xl-3">
            <label className="form-label" htmlFor={""}>Campanha</label>
            <Select
              closeMenuOnSelect={false}
              options={dadosCampanha.map((item, index) => ({
                contador: index + 1,
                value: item.IDCAMPANHA,
                label: `${index + 1} - ${item.DSCAMPANHA} -> ${item.NOFANTASIA}`
              }
              ))}
              value={dadosCampanha.find(option => option.value === campanhaSelecionada)}
              onChange={(e) => setCampanhaSelecionada(e.value)}
            />
          </div>

        </div>

      </form>


      <FooterModal
        ButtonTypeConfirmar={ButtonTypeModal}
        textButtonConfirmar={"Atualizar"}
        onClickButtonConfirmar={onSubmit}
        corConfirmar={"success"}

        ButtonTypeFechar={ButtonTypeModal}
        textButtonFechar={"Fechar"}
        onClickButtonFechar={handleClose}
        corFechar="secondary"
      />
    </Fragment>
  )
}