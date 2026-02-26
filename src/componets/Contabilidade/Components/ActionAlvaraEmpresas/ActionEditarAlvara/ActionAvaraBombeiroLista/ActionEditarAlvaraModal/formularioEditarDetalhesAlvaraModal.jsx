import { Fragment } from "react"
import { ButtonTypeModal } from "../../../../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../../../../Modais/FooterModal/footerModal";
import { Controller, useForm } from "react-hook-form";
import FormField from "../../../../../../Formularios/FormField";
import Select from "react-select"
import { AiOutlineFileText } from "react-icons/ai";
import { AlertError } from "../../../../../../Inputs/alertError";
import { useEditarAlvara } from "../../../hooks/actionEditarAlvara";
import { useCriarArquivoAlvara } from "../../../hooks/actionCriarArquivoAlvara";
import { converterArquivosParaBase64 } from "../../../../../../../utils/converterFileBase64";
import { ActionEditarListaArquivosAnexados } from "./actionEditarListaArquivoAnexado";
import { schema } from "./schema/schemaValidarEditarAlvara";

export const FormularioEditarDetalhesAlvara = ({
    dadosAlvaraSelecionado,
    handleClose,
    usuarioLogado,
    optionsModulos,
    refetchAlvaraEmpresa,
    refetchAlvaraSelecionado,
    refetchVinculoAlvara
}) => {

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

    } = useEditarAlvara({
        handleClose,
        usuarioLogado,
        optionsModulos,
        dadosAlvaraSelecionado,
        refetchAlvaraEmpresa,
        refetchAlvaraSelecionado,
        refetchVinculoAlvara
    });

    const {
        onCriarArquivo

    } = useCriarArquivoAlvara({
        usuarioLogado,
        optionsModulos,
        refetchVinculoAlvara
    });

    const handleUploadArquivo = async (e) => {
        const filesList = e.target.files;
        if (!filesList?.length) return;

        try {
            const arquivosConvertidos = await converterArquivosParaBase64(filesList);

            if (!arquivosConvertidos?.length) return;
            const idVinculo = dadosAlvaraSelecionado?.[0]?.IDVINCULO;
            await onCriarArquivo(idVinculo, arquivosConvertidos);

            e.target.value = null;
        } catch (error) {
            console.error("Erro ao enviar arquivo:", error);
        }
    };

    const arquivosAlvara = dadosAlvaraSelecionado?.[0]?.ARQUIVOSALVARAS || [];
    const temArquivos = arquivosAlvara.length > 0;

    const handleValidatedSubmit = async () => {
        try {
            const dadosParaValidar = {
                statusAlvaraSelecionado: statusAlvara,
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
                                name="statusAlvaraSelecionado"
                                options={optionsStatus?.map((item) => ({
                                    value: item.value,
                                    label: item.label
                                }))}
                                value={statusAlvara}
                                onChange={(opt) => {
                                    setStatusAlvara(opt ?? null);
                                    clearErrors("contaSelecionada");
                                }}
                            />
                            {errors.statusAlvaraSelecionado && (
                                <AlertError
                                    error={errors.statusAlvaraSelecionado?.value || errors.statusAlvaraSelecionado}
                                    onClose={clearErrors}
                                    fieldName="statusAlvaraSelecionado"
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
                                        label={"Dt. Inicio:"}
                                        name="dataInicioCompetenciaSelecionada"
                                        type="date"
                                        value={dataIncioCompetencia}
                                        onChange={(e) => setDataIncioCompetencia(e.target.value)}
                                        errors={errors}

                                        clearErrors={clearErrors}
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
                                        label={"Dt. Fim:"}
                                        name="dataFimCompetenciaSelecionada"
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
                                        name="descricaoDetalheAndamentoDigitado"
                                        label="Detalhe Andamento"
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
                </div>
            </form>

            <div style={{ marginTop: "3rem" }}>
                {temArquivos ? (
                    <ActionEditarListaArquivosAnexados
                        dadosAlvaraSelecionado={dadosAlvaraSelecionado}
                        refetchAlvaraEmpresa={refetchAlvaraEmpresa}
                        refetchVinculoAlvara={refetchVinculoAlvara}
                        handleClose={handleClose}
                        usuarioLogado={usuarioLogado}
                        optionsModulos={optionsModulos}
                    />
                ) : (
                    <div className="form-group ">
                        <label className="form-label mr-2" htmlFor={""}>Anexar Arquivo:</label>
                        <input
                            type="file"
                            accept="application/pdf"
                            onChange={handleUploadArquivo}
                        />
                    </div>
                )}
            </div>
            <FooterModal
                ButtonTypeCadastrar={ButtonTypeModal}
                onClickButtonCadastrar={handleSubmit(handleValidatedSubmit)}
                tipoBtnCadastrar={"submit"}
                textButtonCadastrar={"Salvar Alterações"}
                corCadastrar="success"

                ButtonTypeFechar={ButtonTypeModal}
                textButtonFechar={"Fechar"}
                onClickButtonFechar={handleClose}
                corFechar="secondary"
            />
        </Fragment>
    )
}