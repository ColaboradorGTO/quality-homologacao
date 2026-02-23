import { Fragment } from "react"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import { useForm, Controller } from "react-hook-form";
import Select from 'react-select';
import { useCadastrarValeTransporte } from "../hooks/useCadastrarValeTransporte";
import FormField from "../../../../Formularios/FormField";
import { AlertError } from "../../../../Inputs/alertError";
import { schema } from "./schema/useCadastrarSchema"
import { set } from "date-fns";
import { formatarMoeda } from "../../../../../utils/formatMoeda";

export const FormularioCadastrar = ({ handleClose, usuarioLogado, optionsModulos, refetchDadosLoja }) => {
    const { register, handleSubmit, formState: { errors }, clearErrors, setError, control } = useForm({
        mode: "onChange"
    });
    const {
        onSubmit,
        dsHistorio,
        setDSHistorio,
        dsPagoA,
        setDsPagoA,
        vrDespesa,
        setVrDespesa,
        horarioAtual,
        setHorarioAtual,
        dtDespesa,
        setDtDespesa,
        usuarioSelecionado,
        setUsuarioSelecionado,
        empresa,
        setEmpresa,
        dadosFuncionarios
    } = useCadastrarValeTransporte({ handleClose, usuarioLogado, optionsModulos, refetchDadosLoja });

    const handleValidatedSubmit = async () => {
        try {
            const dadosParaValidar = {
                historico: dsHistorio,
                valorDespesa: vrDespesa,
                funcionarioSelecionado: usuarioSelecionado,
            }

            await schema.validate(dadosParaValidar, { abortEarly: false });

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
            <form onSubmit={handleSubmit(onSubmit)} >

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
                                label="Data do Vale"
                                value={dtDespesa}
                                onChange={(e) => setDtDespesa(e.target.value)}
                            />
                        </div>
                        <div class="col-sm-6 col-xl-4">
                            <InputFieldModal
                                type="time"
                                className="form-control input"
                                readOnly={true}
                                label="Hora do Vale"
                                value={horarioAtual}
                                onChangeModal={(e) => setHorarioAtual(e.target.value)}
                            />
                        </div>
                        <div class="col-sm-6 col-xl-4">
                            <InputFieldModal
                                type="text"
                                className="form-control input"
                                readOnly={true}
                                label="Despesa"
                                onChangeModal={(e) => setDsPagoA(e.target.value)}
                                value={"248 - Pgto Vale Transporte"}
                            />
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <div class="row">
                        <div class="col-sm-6 col-xl-6">

                            <Controller
                                name="historico"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Histórico"}
                                        name="historico"
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
                            <label className="form-label" htmlFor={""}>Funcionário</label>

                            <Select
                                isClearable
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...dadosFuncionarios.map((item) => {
                                        return {
                                            value: item.ID,
                                            label: `${item.ID} - ${item.NOFUNCIONARIO}`
                                        }
                                    })]}
                                value={usuarioSelecionado}
                                onChange={(opt) => {

                                    setUsuarioSelecionado(opt ?? null)
                                    clearErrors("funcionarioSelecionado");
                                }}

                            />
                            {errors.funcionarioSelecionado && (
                                <AlertError
                                    error={errors.funcionarioSelecionado}
                                    onClose={clearErrors}
                                    fieldName="funcionarioSelecionado"
                                />
                            )}

                        </div>

                    </div>
                </div>
                <div class="form-group">
                    <div class="row">
                        <div class="col-sm-6 col-xl-6">
                            <Controller
                                name="valorDespesa"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Valor do Vale Transporte "}
                                        placeholder={"0"}
                                        name="valorDespesa"
                                        type="number"
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