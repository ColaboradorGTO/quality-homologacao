import { Fragment } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import Select from 'react-select';
import { Controller, useForm } from "react-hook-form";
import { useEditarFuncionario } from "../hooks/useEditarFuncionario";
import { mascaraCPF } from "../../../../../utils/formatCPF";
import { addDays, format, subDays } from "date-fns";
import { AlertError } from "../../../../Inputs/alertError";
import FormField from "../../../../Formularios/FormField";
import { schema } from "./schamaValidarFuncionario";
import { mascaraTelefone } from "../../../../../utils/mascaraTelefone";
import { formatarMoeda } from "../../../../../utils/formatMoeda";
export const FormularioEditar = ({
  handleClose,
  dadosAtualizarFuncionarios,
  optionsModulos,
  usuarioLogado,
  handleClick,
  refetch
}) => {

  const { handleSubmit, formState: { errors }, clearErrors, control, setError, setValue } = useForm({
    mode: "onChange"
  });

  const {
    empresaSelecionada,
    setEmpresaSelecionada,
    subGrupoEmpresarialSelecionado,
    setSubGrupoEmpresarialSelecionado,
    funcaoSelecionada,
    setFuncaoSelecionada,
    cpfFuncionario,
    setCPFFuncionario,
    nomeFuncionario,
    setNomeFuncionario,
    localizacaoSelcionada,
    setLocalizacaoSelecionada,
    categoriaContratacao,
    setCategoriaContratacao,
    dataAdmissao,
    setDataAdmissao,
    valorSalario,
    setValorSalario,
    valorDesconto,
    setValorDesconto,
    situacaoSelecionada,
    setSituacaoSelecionada,
    tipoSelecionado,
    setTipoSelecionado,
    isChecked,
    setIsChecked,
    senha,
    setSenha,
    repitaSenha,
    setRepitaSenha,
    cpf,
    setCPF,
    excecao,
    setExcecao,
    formularioVisivelLogin,
    setFormularioVisivelLogin,
    formularioVisivel,
    setFormularioVisivel,
    usuario,
    setUsuario,
    optionsEmpresas,
    handleRadioChange,
    handleChangeEmpresa,
    Funcoes,
    localizacao,
    situacao,
    Parceiro,
    Departamentos,
    onSubmit,
    loginConfirmacao,
    senhaLogin,
    setSenhaLogin,
    isLoggedIn,
    setIsLoggedIn,
    telefone,
    setTelefone,
    departamentoSelecionado,
    setDepartamentoSelecionado
  } = useEditarFuncionario({ handleClose, dadosAtualizarFuncionarios, optionsModulos, usuarioLogado, handleClick, refetch });

  const handleValidatedSubmit = async () => {
    try {
      const dadosParaValidar = {
        empresaFuncionario: empresaSelecionada,
        funcaoFuncionario: funcaoSelecionada,
        tipoFuncionario: tipoSelecionado,
        dataAdmissaoFuncionario: dataAdmissao,
        cpf: cpfFuncionario,
        nome: nomeFuncionario,
        localizacaoFuncionario: localizacaoSelcionada,
        categoriaContratacao: isChecked,
        salarioFuncionario: valorSalario,
        valorDesconroFuncionario: valorDesconto,
        execaoDescFuncionario: excecao,
        situacaoFuncionario: situacaoSelecionada,
        telefoneFuncionario: telefone,
        departamentoFuncionario: departamentoSelecionado
      };
      
      await schema.validate(dadosParaValidar, { abortEarly: false });
      onSubmit();
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

  const maxDataAdmissao = format(new Date(), "yyyy-MM-dd");
  const minDataAdmissao = format(subDays(new Date(), 45), "yyyy-MM-dd");
  
  return (
    <Fragment>
      {formularioVisivel && (
        <Fragment>
          <form onSubmit={handleSubmit(handleValidatedSubmit)} >

            <div className="row form-group">
              <div className="col-sm-6 col-md-6 col-xl-6">
                <label className="form-label" htmlFor="empresaFuncionario">Loja </label>
                <Select
                  closeMenuOnSelect={false}
                  options={optionsEmpresas.map((item) => {
                    return {
                      value: item.IDEMPRESA,
                      label: item.NOFANTASIA

                    }
                  })}
                  value={empresaSelecionada}
                  onChange={(selectedOption) => { setEmpresaSelecionada(selectedOption) }}
                />
                {errors.empresaFuncionario && (
                  <AlertError
                    error={errors.empresaFuncionario}
                    onClose={clearErrors}
                    fieldName="empresaFuncionario"
                  />
                )}

              </div>
              <div className="col-sm-6 col-md-6 col-xl-6">
                <label className="form-label" htmlFor="funcaoFuncionario">Função</label>


                <Select
                  closeMenuOnSelect={false}
                  options={Funcoes.map((item) => ({
                    value: item.value,
                    label: item.label

                  }))}
                  value={funcaoSelecionada}
                  onChange={(e) => setFuncaoSelecionada(e)}
                />{errors.funcaoFuncionario && (
                  <AlertError
                    error={errors.funcaoFuncionario?.value || errors.funcaoFuncionario}
                    onClose={clearErrors}
                    fieldName="funcaoFuncionario"
                  />
                )}
              </div>
            </div>

            <div className="row form-group">

              <div className="col-sm-6 col-md-6 col-xl-6 ">
                <label className="form-label" htmlFor="tpFuncionario">Tipo</label>

                <Select
                  className="basic-single"
                  classNamePrefix={"select"}
                  options={Parceiro.map((item) => ({
                    value: item.value,
                    label: item.label

                  }))}
                  value={tipoSelecionado}
                  onChange={(e) => setTipoSelecionado(e)}
                />

                {errors.tipoFuncionario && (
                  <AlertError
                    error={errors.tipoFuncionario?.value || errors.tipoFuncionario}
                    onClose={clearErrors}
                    fieldName="tipoFuncionario"
                  />
                )}


              </div>

              <div className="col-sm-6 col-md-6 col-xl-6 " >

                <Controller
                  name="dataAdmissaoFuncionario"
                  control={control}
                  render={({ field }) => (
                    <FormField
                      name="dataAdmissaoFuncionario"
                      label={"Data Admissão"}
                      type="date"
                      errors={errors}
                      clearErrors={clearErrors}
                      value={dataAdmissao}
                      onChangeModal={e => setDataAdmissao(e.target.value)}
                      min={minDataAdmissao}
                    // max={maxDataAdmissao}
                    />

                  )}
                />
              </div>
            </div>

            <div className="row form-group">
              <div className="col-sm-4 col-md-4 col-xl-4">
                <InputFieldModal
                  type="text"
                  className="form-control input"
                  readOnly={true}
                  label="CPF"
                  value={mascaraCPF(cpf)}
                  onChangeModal={(e) => setCPF(e.target.value)}

                />
              </div>
              <div className="col-sm-8 col-md-8 col-xl-8">
                <Controller
                  name="nome"
                  control={control}
                  render={({ field }) => (
                    <FormField
                      name="nome"
                      label={"Funcionário"}
                      type="text"
                      errors={errors}
                      clearErrors={clearErrors}
                      value={nomeFuncionario}
                      onChangeModal={e => setNomeFuncionario(e.target.value)}
                    />
                  )}
                />
              </div>
            </div>

            <div className="row mt-4">
              <div className="col-sm-4 col-xl-4">
                <Controller
                  name="telefoneFuncionario"
                  control={control}
                  render={({ field }) => (
                    <FormField
                      name="telefoneFuncionario"
                      label={"Telefone"}
                      type="text"
                      errors={errors}
                      clearErrors={clearErrors}
                      value={mascaraTelefone(telefone)}
                      onChangeModal={(e) => setTelefone(e.target.value)}
                    />
                  )}
                />
              </div>

              <div className="col-sm-6 col-xl-8">
                <label htmlFor="">Departamento *</label>
                <Select
                  className="basic-single"
                  classNamePrefix={"select"}
                  name="departamentoFuncionario"
                  options={Departamentos.map((item) => ({
                    value: item.value,
                    label: item.label
                  }))}
                  value={departamentoSelecionado}
                  onChange={(selected) => {
                    setDepartamentoSelecionado(selected)
                    clearErrors("departamentoFuncionario");
                  }}
                />
                {errors.departamentoFuncionario && (
                  <AlertError
                    error={errors.departamentoFuncionario}
                    onClose={clearErrors}
                    fieldName="departamentoFuncionario"
                  />
                )}

              </div>
            </div>

            <div className="row form-group mt-4">
              <div className="col-sm-6 col-md-6 col-xl-6">
                <label htmlFor="">Localização</label>
                <Select
                  className="basic-single"
                  classNamePrefix={"select"}
                  options={localizacao.map((item) => ({
                    value: item.value,
                    label: item.label

                  }))}
                  value={localizacaoSelcionada}
                  onChange={(e) => setLocalizacaoSelecionada(e)}
                />
                
                {errors.localizacaoFuncionario && (
                  <AlertError
                    error={errors.localizacaoFuncionario?.value || errors.localizacaoFuncionario}
                    onClose={clearErrors}
                    fieldName="localizacaoFuncionario"
                  />
                )}
              </div>

              <div className="col-sm-6 col-md-6 col-xl-6">
                <label className="form-label">Categoria de Contratação</label>
                <div className="form-check">
                  <label className="form-check-label" htmlFor="radioCLT">
                    <input
                      id="radioCLT"
                      type="radio"
                      checked={categoriaContratacao === "CLT"}
                      className="form-check-input"
                      name="radioCategoria"
                      onChange={handleRadioChange}
                    /> CLT
                  </label>
                  <label className="form-check-label" htmlFor="radioPJ">
                    <input
                      id="radioPJ"
                      type="radio"
                      checked={categoriaContratacao === "PJ"}
                      className="form-check-input"
                      name="radioCategoria"
                      onChange={handleRadioChange}
                    /> PJ
                  </label>
                </div>

              </div>
            </div>


            <div className="row form-group" >
              <div className="col-sm-3 col-md-4 col-xl-4 " >
                <InputFieldModal
                  type="text"
                  className="form-control input"
                  placeholder={"0,00"}
                  label="% Desc. Conv."
                  value={valorDesconto}

                  onChangeModal={(e) => setValorDesconto(e.target.value)}

                />
              </div>
              <div className="col-sm-3 col-md-4 col-lg-4 mb-2"  >
                <label className="form-label" >Execeção de Desconto</label>
                <div className="form-check" style={{}}>

                  <input
                    id="excecaoDesconto"
                    type="checkbox"
                    className="form-check-input"
                    name="radioDesconto"
                    checked={isChecked}
                    onChange={() => { setFormularioVisivelLogin(true), setFormularioVisivel(false) }}
                  />


                </div>

              </div>
            </div>

            <div className="row form-group">


              <div className="col-sm-3 col-md-6 col-xl-6">
                <Controller
                  name="salarioFuncionario"
                  control={control}
                  render={({ field }) => (
                    <FormField
                      name="salarioFuncionario"
                      label={"Valor Salário"}
                      type="text"
                      errors={errors}
                      clearErrors={clearErrors}
                      value={valorSalario}
                      onChangeModal={e => setValorSalario(formatarMoeda(e.target.value))}
                    />
                  )}
                />
              </div>

              <div className="col-sm-3 col-md-6 col-xl-6">
                <Controller
                  name="valorDescontoFuncionario"
                  control={control}
                  render={({ field }) => (
                    <FormField
                      name="valorDescontoFuncionario"
                      label={"Valor Desc."}
                      type="text"
                      errors={errors}
                      clearErrors={clearErrors}
                      value={valorDesconto}
                      readOnly={true}
                      onChangeModal={e => setValorDesconto(e.target.value)}
                    />
                  )}
                />

              </div>
            </div>

            <div className="form-group">
              <div className="row">
                <div className="col-sm-3 col-md-3 col-xl-2">
                  <InputFieldModal
                    type={"password"}
                    className="form-control input"
                    label="Senha"
                    value={senha}
                    onChangeModal={(e) => setSenha(e.target.value)}
                  />
                </div>
                <div className="col-sm-4 col-md-4 col-xl-4">

                  <InputFieldModal
                    type={"password"}
                    className="form-control input"
                    label="Repita Senha"
                    value={repitaSenha}
                    onChangeModal={(e) => setRepitaSenha(e.target.value)}

                  />
                </div>

                <div className="col-sm-4 col-md-4 col-xl-4">
                  <label className="form-label" htmlFor="stativofuncionario">Situação</label>

                  <Select
                    className="basic-single"
                    classNamePrefix={"select"}
                    options={situacao.map((item) => ({
                      value: item.value,
                      label: item.label
                    }))}
                    value={situacaoSelecionada}
                    onChange={(e) => setSituacaoSelecionada(e)}
                  />{errors.situacaoFuncionario && (
                    <AlertError
                      error={errors.situacaoFuncionario?.value || errors.situacaoFuncionario}
                      onClose={clearErrors}
                      fieldName="situacaoFuncionario"
                    />
                  )}
                </div>
              </div>
            </div>
            <FooterModal
              ButtonTypeFechar={ButtonTypeModal}
              textButtonFechar={"Fechar"}
              onClickButtonFechar={handleClose}
              corFechar="secondary"

              ButtonTypeConfirmar={ButtonTypeModal}
              textButtonConfirmar={"Atualizar"}
              onClickButtonConfirmar={handleSubmit(handleValidatedSubmit)}
              corConfirmar="success"

            />
          </form>
        </Fragment>
      )}

      {formularioVisivelLogin && (
        <Fragment>

          <header style={{ display: 'flex', width: '100%' }}>

            <h1 style={{ textAlign: 'center', width: '100%' }}>Autorização</h1>
          </header>
          <div className="form-group" style={{ marginTop: '2rem' }}>
            <div className="row">
              <div className="col-sm-4 col-md-5 col-xl-4">

                <InputFieldModal
                  type="text"
                  className="form-control input"
                  label="Matrícula"
                  value={usuario}
                  onChangeModal={(e) => setUsuario(e.target.value)}
                  placeholder={"Digite sua matrícula"}
                />
              </div>

              <div className="col-sm-4 col-md-4 col-xl-4">

                <InputFieldModal
                  type="password"
                  className="form-control input"
                  label="Senha"
                  value={senha}
                  onChangeModal={(e) => setSenha(e.target.value)}
                  placeholder={"Digite sua senha"}
                />
              </div>
            </div>
            <div className="row mt-4">
              <FooterModal
                ButtonTypeFechar={ButtonTypeModal}
                textButtonFechar={"Voltar"}
                onClickButtonFechar={() => { setFormularioVisivel(true), setFormularioVisivelLogin(false) }}
                corFechar="secondary"

                ButtonTypeCadastrar={ButtonTypeModal}
                textButtonCadastrar={"Confirmar"}
                onClickButtonCadastrar={loginConfirmacao}
                corCadastrar="success"
                loadingTextCadastrar={"Cadastrando..."}
                autoLoadingCadastrar={true}

              />
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  )
}