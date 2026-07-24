import { Fragment } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { Controller, useForm } from "react-hook-form";
import FormField from "../../../../Formularios/FormField";
import { useEditarDescontoFuncionario } from "../hooks/useDescontoFuncionario";
import { schema } from "./schemaUpdateDesconto";
import { formatarMoeda } from "../../../../../utils/formatMoeda";

export const FormularioEditar = ({
    handleClose,
    dadosDescontoFuncionarios,
    optionsModulos,
    usuarioLogado,
    handleClick,
    refetch
}) => {
    const { handleSubmit, formState: { errors }, clearErrors, control, setError, setValue } = useForm({
        mode: "onChange"
    });

    const {
        empresa,
        setEmpresa,
        cpf,
        setCpf,
        funcionario,
        setFuncionario,
        motivoDesconto,
        setMotivoDesconto,
        percentualDesconto,
        setPercentualDesconto,
        dataInicioDesconto,
        setDataInicioDesconto,
        dataFimDesconto,
        setDataFimDesconto,
        onSubmit,
    } = useEditarDescontoFuncionario({
        handleClose,
        dadosDescontoFuncionarios,
        optionsModulos,
        usuarioLogado,
        handleClick,
        refetch
    })

    const handleValidatedSubmit = async () => {
        try {
            const dadosParaValidar = {
                descontoAutorizado: percentualDesconto,
                motivoDescontoFuncionario: motivoDesconto,
                dataInicioDesconto: dataInicioDesconto,
                dataFimDesconto: dataFimDesconto
            };

            await schema.validate(dadosParaValidar, { abortEarly: false });
            await onSubmit();
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
            //console.log(`Erro de validação:\n${errorMessages.join('\n')}`);
        }
    }

    return (
        <Fragment>

            <Fragment>
                <form onSubmit={handleSubmit(handleValidatedSubmit)} >

                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-6 col-xl-12">
                                <Controller
                                    name="empresaFuncionario"
                                    control={control}
                                    render={({ field }) => (
                                        <FormField
                                            name="empresaFuncionario"
                                            label={"Empresa"}
                                            type="text"
                                            errors={errors}
                                            clearErrors={clearErrors}
                                            value={empresa}
                                            onChangeModal={e => setEmpresa(e.target.value)}
                                            readOnly={true}
                                        />

                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-4 col-xl-4">
                                <Controller
                                    name="cpfFuncionario"
                                    control={control}
                                    render={({ field }) => (
                                        <FormField
                                            name="cpfFuncionario"
                                            label={"CPF"}
                                            type="text"
                                            errors={errors}
                                            clearErrors={clearErrors}
                                            value={cpf}
                                            onChangeModal={e => setCpf(e.target.value)}
                                            readOnly={true}
                                        />

                                    )}
                                />
                            </div>
                            <div className="col-sm-8 col-xl-8">
                                <Controller
                                    name="nomeFuncionario"
                                    control={control}
                                    render={({ field }) => (
                                        <FormField
                                            name="nomeFuncionario"
                                            label={"Funcionário"}
                                            type="text"
                                            errors={errors}
                                            clearErrors={clearErrors}
                                            value={funcionario}
                                            onChangeModal={e => setFuncionario(e.target.value)}
                                            readOnly={true}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-12 col-xl-12">
                                <Controller
                                    name="motivoDescontoFuncionario"
                                    control={control}
                                    render={({ field }) => (
                                        <FormField
                                            name="motivoDescontoFuncionario"
                                            label={"Motivo do Desconto"}
                                            type="text"
                                            errors={errors}
                                            clearErrors={clearErrors}
                                            value={motivoDesconto}
                                            onChangeModal={e => setMotivoDesconto(e.target.value)}
                                            
                                        />
                                    )}
                                />

                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-3 col-md-4 col-xl-4">
                                <Controller
                                    name="descontoAutorizado"
                                    control={control}
                                    render={({ field }) => (
                                        <FormField
                                            name="descontoAutorizado"
                                            label={"% Desconto Autorizado"}
                                            type="text"
                                            errors={errors}
                                            clearErrors={clearErrors}
                                            value={percentualDesconto}
                                            onChangeModal={(e) => setPercentualDesconto(formatarMoeda(e.target.value))}
                                            
                                        />
                                    )}
                                />
                            </div>
                            <div className="col-sm-3 col-md-4 col-xl-4">
                                <Controller
                                    name="dataInicioDesconto"
                                    control={control}
                                    render={({ field }) => (
                                        <FormField
                                            name="dataInicioDesconto"
                                            label={"Início Desconto"}
                                            type="date"
                                            errors={errors}
                                            clearErrors={clearErrors}
                                            value={dataInicioDesconto}
                                            onChangeModal={(e) => setDataInicioDesconto(e.target.value)}
                                            
                                        />
                                    )}
                                />
                            </div>
                            <div className="col-sm-3 col-md-4 col-xl-4">
                                <Controller
                                    name="dataFimDesconto"
                                    control={control}
                                    render={({ field }) => (
                                        <FormField
                                            name="dataFimDesconto"
                                            label={"Fim Desconto"}
                                            type="date"
                                            errors={errors}
                                            clearErrors={clearErrors}
                                            value={dataFimDesconto}
                                            onChangeModal={(e) => setDataFimDesconto(e.target.value)}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                </form>

                <FooterModal
                    ButtonTypeFechar={ButtonTypeModal}
                    textButtonFechar={"Fechar"}
                    onClickButtonFechar={handleClose}
                    corFechar="secondary"

                    ButtonTypeConfirmar={ButtonTypeModal}
                    textButtonConfirmar={"Atualizar"}
                    onClickButtonConfirmar={handleValidatedSubmit}
                    corConfirmar="success"

                />
            </Fragment>
        </Fragment>
    )
}