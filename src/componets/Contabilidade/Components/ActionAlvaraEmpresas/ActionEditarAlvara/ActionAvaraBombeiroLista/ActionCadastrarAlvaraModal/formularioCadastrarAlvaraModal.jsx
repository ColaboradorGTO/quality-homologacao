import { Fragment } from "react"
import { ButtonTypeModal } from "../../../../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../../../../Modais/FooterModal/footerModal";
import { Controller, useForm } from "react-hook-form";
import FormField from "../../../../../../Formularios/FormField";
import { useCriarAlvara } from "../../../hooks/actionCriarAlvara";
import Select from "react-select"
import { AiOutlineFileText } from "react-icons/ai";
import { AlertError } from "../../../../../../Inputs/alertError";
import { schema } from "./schema/schemaValidacaoCadastroAlvara";

export const FormularioCadastrarActionAlvara = ({
    dadosAlvaraSelecionado,
    handleClose,
    usuarioLogado,
    optionsModulos,
    refetchAlvaraEmpresa,
    idAlvaraSelecionado,
    refetchAlvaraSelecionado
}) => {
console.log(dadosAlvaraSelecionado,  "dadosAlvaraSelecionado")
    const { handleSubmit, formState: { errors }, clearErrors, control, setError, register } = useForm({
        mode: "onChange"
    });
    const {
        optionsStatusAlvara,
        optionsStatus,
        arquivoAlvara,
        setArquivoAlvara,
        descricaoDetalheAndamento,
        setDescricaoDetalheAndamento,
        dataFimCompetencia,
        setDataFimCompetencia,
        dataIncioCompetencia,
        setDataIncioCompetencia,
        statusAndamento,
        setStatusAndamento,
        statusAlvara,
        setStatusAlvara,
        metragemLoja,
        setMetragemLoja,
        onSubmit
        
    } = useCriarAlvara({
        handleClose,
        usuarioLogado,
        optionsModulos,
        dadosAlvaraSelecionado,
        idAlvaraSelecionado,
        refetchAlvaraEmpresa,
        refetchAlvaraSelecionado
    });


    const handleValidatedSubmit = async () => {
        try {

            const dadosParaValidar = {
                dataInicioCompetenciaSelecionada: dataIncioCompetencia,
                dataFimCompetenciaSelecionada: dataFimCompetencia,
                statusAndamento: statusAndamento,
                metragemLojaDigitado: metragemLoja,
                descricaoDetalheAndamentoDigitado: descricaoDetalheAndamento
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
            //console.log(`Erro de validação:\n${errorMessages.join('\n')}`);
        }
    };

    return (
        <Fragment>
            <form onSubmit={handleSubmit(handleValidatedSubmit)} >
                <span class="d-flex align-items-center">
                    <AiOutlineFileText size={25} />
                    <h4 class="font-weight-bold" style={{ margin: 0, marginLeft: "10px" }}>
                         BOMBEIRO (CERTIFICADO DE CONFORMIDADE - CERCON)
                    </h4>
                </span>

                <div class="form-group">
                    <div class="row mt-3">

                        <div class="col-sm-6 col-xl-6">
                            <label className="form-label" htmlFor={""}>Status:</label>
                            <Select
                                className="basic-single"
                                classNamePrefix={"select"}
                                name="statusAlvara"
                                isDisabled={true}
                                options={optionsStatus?.map((item) => ({
                                    value: item.value,
                                    label: item.label
                                }))}
                                value={optionsStatus.find(opt => opt.value === "True")}
                                onChange={(opt) => {
                                    setStatusAlvara(opt ?? null);
                                    clearErrors("contaSelecionada ");
                                }}
                            />
                            {errors.statusAlvara && (
                                <AlertError
                                    error={errors.statusAlvara?.value || errors.statusAlvara}
                                    onClose={clearErrors}
                                    fieldName="statusAlvara"
                                />
                            )}

                        </div>
                    </div>

                    <div class="row mt-3">
                        <div class="col-sm-6 col-xl-6">
                            <Controller
                                name="dataInicioCompetenciaSelecionada"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        {...field}
                                        name="dataInicioCompetenciaSelecionada"
                                        label={"Dt. Inicio:"}
                                        type="date"
                                        errors={errors}
                                        clearErrors={clearErrors}
                                        value={dataIncioCompetencia}
                                        onChange={(e) => setDataIncioCompetencia(e.target.value)}
                                    />
                                )}
                            />
                        </div>
                        <div class="col-sm-6 col-xl-6">
                            <Controller
                                name="dataFimCompetenciaSelecionada"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        {...field}
                                        name="dataFimCompetenciaSelecionada"
                                        label={"dataFimCompetencia"}
                                        type="date"
                                        value={dataFimCompetencia}
                                        onChange={(e) => setDataFimCompetencia(e.target.value)}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div class="row mt-3">
                        <div class="col-sm-6 col-xl-6">

                            <label className="form-label" htmlFor={""}>Status:</label>
                            <Select
                                className="basic-single"
                                classNamePrefix={"select"}
                                name="statusAndamento"
                                options={optionsStatusAlvara?.map((item) => ({
                                    value: item.IDSTATUS,
                                    label: item.DESCRICAO

                                }))}

                                value={statusAndamento}
                                onChange={(opt) => {
                                    setStatusAndamento(opt ?? null);
                                    clearErrors("statusAndamento");
                                }}
                            />
                            {errors.statusAndamento && (
                                <AlertError
                                    error={errors.statusAndamento?.value || errors.statusAndamento}
                                    onClose={clearErrors}
                                    fieldName="statusAndamento"
                                />
                            )}
                        </div>
                        <div class="col-sm-6 col-xl-6">
                            <Controller
                                name="metragemLojaDigitado"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        {...field}
                                        label={"Metragem:"}
                                        name="metragemLojaDigitado"
                                        type="number"
                                        inputMode="numeric"
                                        value={metragemLoja}
                                        onChange={(e) => setMetragemLoja(e.target.value)}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-sm-6 col-xl-6">
                            <Controller
                                name="descricaoDetalheAndamentoDigitado"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        {...field}
                                        label="Detalhe Andamento"
                                        name="descricaoDetalheAndamentoDigitado"
                                        type="textarea"
                                        value={descricaoDetalheAndamento}
                                        onChange={(e) => setDescricaoDetalheAndamento(e.target.value)}
                                        errors={errors}
                                        width="100%"
                                        height="120px"
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div class="row mt-3">
                        <div class="col-sm-6 col-xl-6">
                            <Controller
                                name="arquivoAlvara"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label="Detalhe Andamento"
                                        name="arquivoAlvara"
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => setArquivoAlvara(e.target.files)}
                                        errors={errors}
                                        width="100%"
                                        height="120px"
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
                onClickButtonCadastrar={handleSubmit(handleValidatedSubmit)}
                tipoBtnCadastrar={"submit"}
                textButtonCadastrar={"Adicionar"}
                corCadastrar="success"

                ButtonTypeFechar={ButtonTypeModal}
                textButtonFechar={"Fechar"}
                onClickButtonFechar={handleClose}
                corFechar="secondary"
            />
        </Fragment>
    )
}