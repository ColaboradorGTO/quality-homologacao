import { Fragment } from "react"
import { Controller, useForm } from "react-hook-form";
import { schema } from "./schamaValidarFuncionario";
import { useCriarFuncionario } from "../hooks/useCriarFuncionario";
import Select from 'react-select';
import { InputFieldModal } from "../../../../Buttons/InputFieldModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { mascaraCPF, removerMascaraCPF, validarCPF } from "../../../../../utils/formatCPF";
import { AlertError } from "../../../../Inputs/alertError"
import { format, subDays } from "date-fns";
import FormField from "../../../../Formularios/FormField";
import { formatarMoeda, removerFormatacaoMoeda } from "../../../../../utils/formatMoeda";
import { mascaraTelefone } from "../../../../../utils/mascaraTelefone";

export const FormularioCadastrar = ({
    handleClose,
    usuarioLogado,
    optionsModulos,
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
        optionsCPF,
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
    } = useCriarFuncionario({ handleClose, usuarioLogado, optionsModulos, refetch });

    const handleValidatedSubmit = async () => {
        try {
            const dadosParaValidar = {
                empresaFuncionario: empresaSelecionada,
                funcaoFuncionario: funcaoSelecionada,
                tipoFuncionario: tipoSelecionado,
                dataAdmissaoFuncionario: dataAdmissao,
                cpf: cpfFuncionario,
                nome: nomeFuncionario,
                telefoneFuncionario: telefone,
                departamentoFuncionario: departamentoSelecionado,
                localizacaoFuncionario: localizacaoSelcionada,
                salarioFuncionario: removerFormatacaoMoeda(valorSalario),
                valorDesconroFuncionario: valorDesconto,
                execaoDescFuncionario: excecao,
                situacaoFuncionario: situacaoSelecionada,
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
                <form onSubmit={handleSubmit(handleValidatedSubmit)}>
                    <div className="row">
                        <div className="col-sm-6 col-md-6 col-xl-6">
                            <label className="form-label" htmlFor="empresaFuncionario">Empresa *</label>

                            <Select
                                className="basic-single"
                                classNamePrefix={"select"}
                                name="empresaFuncionario"
                                options={optionsEmpresas.map((item) => ({
                                    value: item.IDEMPRESA,
                                    label: item.NOFANTASIA
                                }))}
                                value={empresaSelecionada}
                                onChange={(selected) => {
                                    setEmpresaSelecionada(selected);
                                    clearErrors("empresaFuncionario");
                                }}
                                isClearable={true}
                                isSearchable={true}
                                placeholder="Selecione a Empresa"
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
                            <label className="form-label" htmlFor="funcaoFuncionario">Função *</label>
                            <Select
                                className="basic-single"
                                classNamePrefix={"select"}
                                name="funcaoFuncionario"
                                options={Funcoes.map((item) => ({
                                    value: item.value,
                                    label: item.label
                                }))}
                                value={funcaoSelecionada}
                                onChange={(selected) => { 
                                    setFuncaoSelecionada(selected)
                                    clearErrors("funcaoFuncionario");
                                }}
                                isClearable={true}
                                isSearchable={true}
                            />

                            {errors.funcaoFuncionario && (
                                <AlertError
                                    error={errors.funcaoFuncionario}
                                    onClose={clearErrors}
                                    fieldName="funcaoFuncionario"
                                />
                            )}
                            
                        </div>

                    </div>
                    <div className="row mt-4">
                        <div className="col-sm-6 col-md-6 col-xl-6">
                            <label className="form-label">Tipo *</label>
                            <Select
                                className="basic-single"
                                classNamePrefix={"select"}
                                name="tipoFuncionario"
                                options={Parceiro.map((item) => ({
                                    value: item.value,
                                    label: item.label
                                }))}
                                value={tipoSelecionado}
                                onChange={(selected) => { 
                                    setTipoSelecionado(selected)
                                    clearErrors("tipoFuncionario");
                                }}
                                isClearable={true}
                                isSearchable={true}
                            />

                            {errors.tipoFuncionario && (
                                <AlertError
                                    error={errors.tipoFuncionario}
                                    onClose={clearErrors}
                                    fieldName="tipoFuncionario"
                                />
                            )}
                        </div>
                        <div className="col-sm-6 col-xl-6">
                            <Controller
                                name="dataAdmissaoFuncionario"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="dataAdmissaoFuncionario"
                                        label={"Data do Criação*"}
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


                    <div className="row mt-4">
                        <div className="col-sm-4 col-xl-4">
                            <Controller
                                name="cpf"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="cpf"
                                        label={"CPF"}
                                        type="text"
                                        errors={errors}
                                        clearErrors={clearErrors}
                                        value={mascaraCPF(cpfFuncionario)}
                                        onChangeModal={(e) => {
                                            const valorDigitado = e.target.value;
                                            const cpfSemMascara = removerMascaraCPF(valorDigitado);
                                            setCPFFuncionario(cpfSemMascara);
                                            if (cpfSemMascara.length === 11) {
                                                validarCPF(cpfSemMascara);
                                            }
                                        }}
                                    />
                                )}
                            />
                        </div>
                       
                        <div className="col-sm-8 col-xl-8">
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
                    <div className="row mt-4">
                        <div className="col-sm-6 col-xl-16">
                            <label htmlFor="">Localização *</label>
                            <Select
                                className="basic-single"
                                classNamePrefix={"select"}
                                name="localizacaoFuncionario"
                                options={localizacao.map((item) => ({
                                    value: item.value,
                                    label: item.label

                                }))}
                                value={localizacaoSelcionada}
                                onChange={(selected) => {
                                    setLocalizacaoSelecionada(selected)
                                    clearErrors("localizacaoFuncionario");
                                }}
                            />
                          
                            {errors.localizacaoFuncionario && (
                                <AlertError
                                    error={errors.localizacaoFuncionario}
                                    onClose={clearErrors}
                                    fieldName="localizacaoFuncionario"
                                />
                            )}
                            
                        </div>
                        <div className="col-sm-16 col-xl-16">
                            <label className="form-label">Categoria de Contratação *</label>
                            <div className="form-check">
                                <label className="form-check-label" htmlFor="radioCLT">
                                    <input
                                        id="radioCLT"
                                        type="radio"
                                        className="form-check-input"
                                        name="radioCategoria"
                                        isChecked={isChecked}
                                        checked={categoriaContratacao === 'CLT'}
                                        onChange={handleRadioChange}
                                    /> CLT

                                </label>
                             
                                <label className="form-check-label" htmlFor="radioPJ">
                                    <input
                                        id="radioPJ"
                                        type="radio"
                                        className="form-check-input"
                                        name="radioCategoria"
                                        isChecked={isChecked}
                                        checked={categoriaContratacao === 'PJ'}
                                        onChange={handleRadioChange}
                                    /> PJ
                                </label>

                            </div>

                        </div>
                    </div>

                    <div className="row mt-4">
                        <div className="col-sm-6 col-xl-6">
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
                        <div className="col-sm-6 col-xl-6">
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

                    <div className="row mt-4">
                        <div className="col-sm-6 col-xl-6">
                            <Controller
                                name="descontoConvFuncionario"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="descontoConvFuncionario"
                                        label={"% Desc. Conv."}
                                        placeholder={"0,00"}
                                        type="text"
                                        errors={errors}
                                        clearErrors={clearErrors}
                                        value={valorDesconto}
                                        onChangeModal={e => setValorDesconto(formatarMoeda(e.target.value))}

                                    />
                                )}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-6"
                            style={{

                                alignItems: 'center',
                                display: 'flex',
                                width: '100%',
                            }}
                        >
                            <div className="form-check">

                                <input
                                    type="radio"
                                    className="form-check-input"
                                    name="radioExcecao"
                                    onChange={() => { setFormularioVisivelLogin(true), setFormularioVisivel(false) }}

                                />
                                <label className="form-check-label" htmlFor="">Exceção Desconto</label>
                            </div>

                        </div>

                    </div>
                    <div className="row mt-4">

                        <div className="col-sm-6 col-xl-6">
                            <label className="form-label" htmlFor="situacaoFuncionario">Situação</label>

                            <Select
                                className="basic-single"
                                classNamePrefix={"select"}
                                name="situacaoFuncionario"
                                options={situacao.map((item) => ({
                                    value: item.value,
                                    label: item.label
                                }))}
                                value={situacaoSelecionada}
                                onChange={(selected) => {
                                    setSituacaoSelecionada(selected)
                                    clearErrors("situacaoFuncionario");
                                }}
                            />
                            {errors.situacaoFuncionario && (
                                <AlertError
                                    error={errors.situacaoFuncionario}
                                    onClose={clearErrors}
                                    fieldName="situacaoFuncionario"
                                />
                            )}
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

            )}
            {formularioVisivelLogin && (
                <Fragment>

                    <header style={{ display: 'flex', width: '100%' }}>

                        <h1 style={{ textAlign: 'center', width: '100%' }}>Autorização</h1>
                    </header>
                    <div className="form-group" style={{ marginTop: '2rem' }}>
                        <div className="row">
                            <div className="col-sm-4 col-md-4 col-xl-4">

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
                                    value={senhaLogin}
                                    onChangeModal={(e) => setSenhaLogin(e.target.value)}
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