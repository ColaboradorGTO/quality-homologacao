import { Fragment } from "react"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import Select from 'react-select';
import { useForm, Controller } from "react-hook-form";
import { useCadastrarDespesas } from "../hooks/useCadastrarDespesas";
import FormField from "../../../../Formularios/FormField";
import { schema } from "./schema/useCadastrarSchema";
import { AlertError } from "../../../../Inputs/alertError";
import { formatarMoeda, formatMoeda } from "../../../../../utils/formatMoeda";

export const FormularioCadastrar = ({ handleClose, optionsModulos, usuarioLogado, handleClick }) => {
    const { register, handleSubmit, formState: { errors }, clearErrors, setError, control } = useForm({
        mode: "onChange"
    });
    const {
        despesaSelecionada,
        setDespesaSelecionada,
        dsHistorio,
        setDSHistorio,
        dsPagoA,
        setDsPagoA,
        vrDespesa,
        setVrDespesa,
        hora,
        setHora,
        dtDespesa,
        setDtDespesa,
        dadosReceitaDespesa,
        Options,
        setTpNota,
        tpNota,
        setNuNotaFiscal,
        nuNotaFiscal,
        empresa,
        setEmpresa,
        onSubmit

    } = useCadastrarDespesas({ handleClose, optionsModulos, usuarioLogado, handleClick })

    const handleValidatedSubmit = async () => {
        try {
            const dadosParaValidar = {
                historicoDespesa: dsHistorio,
                dsPagoDespesa: dsPagoA,
                tipoDespesaSelecionada: despesaSelecionada,
                valorDespesa: vrDespesa,
                tipoNota: tpNota,

            }

            await schema.validate(dadosParaValidar, { abortEarly: false });
            //console.log(dadosParaValidar, 'dadosParaValidar no submit com validação');
            onSubmit();

        } catch (validationError) {
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
            <form onSubmit={handleSubmit(handleValidatedSubmit)}>

                <div class="form-group">
                    <div class="row">

                        <div class="col-sm-6 col-xl-10">
                            <Controller
                                name="empresaDespesa"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Empresa "}
                                        name="empresaDespesa"
                                        type="text"
                                        value={empresa}
                                        readOnly={true}
                                        onChange={(e) => setEmpresa(e.target.value)}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />

                                )}
                            />

                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="row">
                        <div class="col-sm-6 col-xl-4">
                            <InputFieldModal
                                type="date"
                                className="form-control input"
                                readOnly={true}
                                label="Data Despesa"
                                value={dtDespesa}
                                onChange={(e) => setDtDespesa(e.target.value)}
                            />
                        </div>
                        <div class="col-sm-6 col-xl-4">
                            <InputFieldModal
                                type="time"
                                className="form-control input"
                                readOnly={true}
                                label="Hora Despesa"
                                value={hora}
                                onChange={(e) => setHora(e.target.value)}
                            />
                        </div>

                        <div class="col-sm-6 col-xl-4 ">
                            <label className="form-label" htmlFor={""}>Despesa</label>
                            <Select
                                isClearable
                                label={"Despesa"}
                                options={[
                                    ...dadosReceitaDespesa.map((item) => ({
                                        value: String(item.IDCATEGORIARECDESP),
                                        label: `${item.IDCATEGORIARECDESP} - ${item.DSCATEGORIA}`,
                                    }))
                                ]}
                                value={despesaSelecionada}
                                onChange={(e) => {
                                    setDespesaSelecionada(e);
                                    clearErrors("tipoDespesaSelecionada");
                                }}
                            />
                            {errors.tipoDespesaSelecionada && (
                                <AlertError
                                    error={errors.tipoDespesaSelecionada}
                                    onClose={clearErrors}
                                    fieldName="despestipoDespesaSelecionadaaSelecionada"
                                />
                            )}

                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="row">

                        <div class="col-sm-6 col-xl-6">
                            <Controller
                                name="historicoDespesa"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Histórico"}
                                        name="historicoDespesa"
                                        type="text"
                                        value={dsHistorio}
                                        onChange={(e) => setDSHistorio(e.target.value)}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />

                                )}
                            />
                        </div>
                        <div class="col-sm-6 col-xl-6">
                            <Controller
                                name="dsPagoDespesa"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="dsPagoDespesa"
                                        label={"Pago A"}
                                        type="text"
                                        value={dsPagoA}
                                        onChange={(e) => setDsPagoA(e.target.value)}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />

                                )}
                            />
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <div class="row mt-3">
                        <div class="col-sm-6 col-xl-4">
                            <label htmlFor="">Tipo Nota</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                defaultValue={Options[0]}
                                value={tpNota}
                                onChange={(e) => {
                                    setTpNota(e);
                                    clearErrors("tipoNota");
                                }}
                                name="color"
                                options={Options}
                            />
                            {errors.tipoNota && (
                                <AlertError
                                    error={errors.tipoNota}
                                    onClose={clearErrors}
                                    fieldName="tipoNota"
                                />
                            )}
                        </div>
                        <div class="col-sm-6 col-xl-6">
                            <Controller
                                name="valorDespesa"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Valor Despesa"}
                                        name="valorDespesa"
                                        type="text"
                                        value={vrDespesa}
                                        onChange={(e) => setVrDespesa(formatarMoeda(e.target.value))}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />

                                )}
                            />
                        </div>
                    </div>
                </div>

            </form>
            <FooterModal
                ButtonTypeCadastrar={ButtonTypeModal}
                onClickButtonCadastrar={handleValidatedSubmit}
                tipoBtnCadastrar={"submit"}
                textButtonCadastrar={"Cadastrar"}
                corCadastrar="success"

                ButtonTypeFechar={ButtonTypeModal}
                textButtonFechar={"Fechar"}
                onClickButtonFechar={handleClose}
                corFechar="secondary"
            />
        </Fragment>
    )
}