import { Fragment } from "react"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import { useEditarEmpresa } from "../hooks/useEditarEmpresa"
import { Controller, useForm } from "react-hook-form"
import { dataFormatada } from "../../../../../utils/dataFormatada"
import Select from 'react-select';
import { AlertError } from "../../../../Inputs/alertError"
import FormField from "../../../../Formularios/FormField";
import { schema } from "./schemaValidarEmpresa"

export const FormularioEditar = ({ handleClose, dadosEditarEmpresa, refetch, usuarioLogado }) => {
  const { handleSubmit, formState: { errors }, clearErrors, control, setError } = useForm({
    mode: "onChange"
  });
  const {
    grupoEmpresa,
    setGrupoEmpresa,
    situacao,
    setSituacao,
    dataCriacao,
    setDataCriacao,
    nomeFantasia,
    setNomeFantasia,
    cep,
    setCep,
    endereco,
    setEndereco,
    complemento,
    setComplemento,
    bairro,
    setBairro,
    cidade,
    setCidade,
    uf,
    setUF,
    email,
    setEmail,
    telefone,
    setTelefone,
    onSubmit,
    ipUsuario
    
  } = useEditarEmpresa({ dadosEditarEmpresa, handleClose, refetch, usuarioLogado })


  const options = [
    {
      value: "True",
      label: "ATIVO"
    },
    {
      value: "False",
      label: "INATIVO"
    }
  ]

  const handleValidatedSubmit = async () => {
    try {
      const dadosParaValidar = {
        situacaoSelecionada: situacao.value,
        cepSelecionado: cep,
        enderecoSelecionado: endereco,
        bairroSelecionado: bairro,
        cidadeSelecionada: cidade,
        estadoSelecionado: uf,
        emailSelecionado: email,
      };

      await schema.validate(dadosParaValidar, { abortEarly: false });
      onSubmit(dadosParaValidar);
    } catch (validationError) {
      console.error('❌ Erro de validação:', validationError);

      clearErrors();
      if (validationError.inner && validationError.inner.length > 0) {
        validationError.inner.forEach(error => {
          if (error.path) {
            setError(error.path, {
              type: 'manual',
              message: error.message
            });
          }
        });
      }
      const errorMessages = validationError.errors || [validationError.message];
      console.log(`Erro de validação:\n${errorMessages.join('\n')}`);
    }
  }

  return (
    <Fragment>
      <form onSubmit={handleSubmit(handleValidatedSubmit)} >

        <div className="form-group">
          
          <div className="row">
            <div className="col-sm-4 col-xl-4">
              <InputFieldModal
                label={"Grupo Empresarial"}
                type="text"
                readOnly={true}
                value={grupoEmpresa}
                onChangeModal={(e) => setGrupoEmpresa(e.target.value)}
              />
            </div>
            <div className="col-sm-4 col-xl-4">

              <label>
                Situação:
              </label>
              <Select
                className="basic-single"
                classNamePrefix={"select"}
                options={options.map((item) => ({
                  value: item.value,
                  label: item.label
                }))}
                value={situacao}
                onChange={(e) => setSituacao(e)}
              />
              {errors.situacaoSelecionada && (
                <AlertError
                  error={errors.situacaoSelecionada?.value || errors.situacaoSelecionada}
                  onClose={clearErrors}
                  fieldName="situacaoSelecionada"
                />
              )}

            </div>
            <div className="col-sm-4 col-xl-4">

              <InputFieldModal
                label={"Data Criação"}
                type="datetime"
                readOnly={true}
                value={dataFormatada(dataCriacao)}
                onChangeModal={(e) => setDataCriacao(e.target.value)}
              />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-sm-12 col-xl-12">

              <InputFieldModal
                label={"Nome Fantasia"}
                type="text"
                readOnly={true}
                value={nomeFantasia}
                onChangeModal={(e) => setNomeFantasia(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <div className="row">
              <div className="mt-3" style={{ display: 'flex' }}>
                <div className="col-sm-4 col-xl-4">
                  <Controller
                    name="cepSelecionado"
                    control={control}
                    render={({ field }) => (
                      <FormField
                        name="cepSelecionado"
                        label={"CEP"}
                        type="text"
                        errors={errors}
                        clearErrors={clearErrors}
                        value={cep}
                        onChangeModal={(e) => setCep(e.target.value)}
                      />
                    )}
                  />
                </div>
                <div className="col-sm-4 col-xl-4">

                  <Controller
                    name="enderecoSelecionado"
                    control={control}
                    render={({ field }) => (
                      <FormField
                        name="enderecoSelecionado"
                        label={"Endereço"}
                        type="text"
                        errors={errors}
                        clearErrors={clearErrors}
                        value={endereco}
                        onChangeModal={(e) => setEndereco(e.target.value)}
                      />
                    )}
                  />
                </div>
                <div className="col-sm-4 col-xl-4">

                  <InputFieldModal
                    label={"Complemento"}
                    type="text"
                    value={complemento}
                    onChangeModal={(e) => setComplemento(e.target.value)}
                  />
                </div>

              </div>
            </div>
            <div className="row">
              <div className="mt-3" style={{ display: 'flex' }}>
                <div className="col-sm-4 col-xl-4">

                  <Controller
                    name="bairroSelecionado"
                    control={control}
                    render={({ field }) => (
                      <FormField
                        name="bairroSelecionado"
                        label={"Bairro"}
                        type="text"
                        errors={errors}
                        clearErrors={clearErrors}
                        value={bairro}
                        onChangeModal={(e) => setBairro(e.target.value)}
                      />
                    )}
                  />
                </div>
                <div className="col-sm-4 col-xl-4">

                  <Controller
                    name="cidadeSelecionada"
                    control={control}
                    render={({ field }) => (
                      <FormField
                        name="cidadeSelecionada"
                        label={"Cidade"}
                        type="text"
                        errors={errors}
                        clearErrors={clearErrors}
                        value={cidade}
                        onChangeModal={(e) => setCidade(e.target.value)}
                      />
                    )}
                  />
                </div>
                <div className="col-sm-4 col-xl-4">

                  <Controller
                    name="estadoSelecionado"
                    control={control}
                    render={({ field }) => (
                      <FormField
                        name="estadoSelecionado"
                        label={"Estado"}
                        type="text"
                        errors={errors}
                        clearErrors={clearErrors}
                        value={uf}
                        onChangeModal={(e) => setUF(e.target.value)}
                      />
                    )}
                  />
                </div>
              </div>

            </div>
            <div className="row">
              <div className="mt-3" style={{ display: 'flex' }}>

                <div className="col-sm-6 col-xl-6">


                  <Controller
                    name="emailSelecionado"
                    control={control}
                    render={({ field }) => (
                      <FormField
                        name="emailSelecionado"
                        label={"E-mail"}
                        type="email"
                        errors={errors}
                        clearErrors={clearErrors}
                        value={email}
                        onChangeModal={(e) => setEmail(e.target.value)}
                        readOnly={true}
                      />
                    )}
                  />
                </div>
                <div className="col-sm-6 col-xl-6">
                  <InputFieldModal
                    label={"Telefone"}
                    type="text"
                    value={telefone}
                    onChangeModal={(e) => setTelefone(e.target.value)}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        <FooterModal
          ButtonTypeCadastrar={ButtonTypeModal}
          onClickButtonCadastrar={handleValidatedSubmit}
          textButtonCadastrar={"Atualizar"}
          corCadastrar="success"

          ButtonTypeFechar={ButtonTypeModal}
          textButtonFechar={"Fechar"}
          onClickButtonFechar={handleClose}
          corFechar="secondary"
        />

      </form>
    </Fragment>
  )
}