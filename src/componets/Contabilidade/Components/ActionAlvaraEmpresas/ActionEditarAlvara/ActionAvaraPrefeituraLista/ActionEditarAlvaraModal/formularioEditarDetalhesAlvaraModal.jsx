import { Fragment } from "react"
import { HeaderModal } from "../../../../../../Modais/HeaderModal/HeaderModal";
import { ButtonTypeModal } from "../../../../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../../../../Modais/FooterModal/footerModal";
import { Controller, useForm } from "react-hook-form";
import FormField from "../../../../../../Formularios/FormField";
//import { schema } from "./schemaCadastrarQuebraCaixa";
import { BsBuilding, BsPerson } from "react-icons/bs";
import Select from "react-select"
import { AiOutlineFileText } from "react-icons/ai";
import { ActionEditarListaArquivosAnexados } from "./actionEditarListaArquivoAnexado";
import { AlertError } from "../../../../../../Inputs/alertError";
import { useEditarAlvara } from "../../../hooks/actionEditarAlvara";
import { useCriarArquivoAlvara } from "../../../hooks/actionCriarArquivoAlvara";
import { converterArquivosParaBase64 } from "../../../../../../../utils/converterFileBase64";

//import { ActionListaAlvaraPrefeitura } from "./ActionAvaraPrefeituraLista/actionListaAlvaraPrefeitura.jsx";

export const FormularioEditarDetalhesAlvara = ({ dadosAlvaraSelecionado, handleClose, usuarioLogado, optionsModulos, refetchAlvaraEmpresa }) => {
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
    } = useEditarAlvara({ handleClose, usuarioLogado, optionsModulos, dadosAlvaraSelecionado, refetchAlvaraEmpresa });


    const {
        onCriarArquivo
    } = useCriarArquivoAlvara({ usuarioLogado, optionsModulos, dadosAlvaraSelecionado, refetchAlvaraEmpresa });

    const handleUploadArquivo = async (e) => {
        const filesList = e.target.files;
        if (!filesList?.length) return;

        try {
            
            const arquivosConvertidos = await converterArquivosParaBase64(filesList);

            if (!arquivosConvertidos?.length) return;

            const idVinculo = dadosAlvaraSelecionado?.[0]?.IDVINCULO;

            await onCriarArquivo(idVinculo, arquivosConvertidos);

            e.target.value = null; // limpa input
        } catch (error) {
            console.error("Erro ao enviar arquivo:", error);
        }
    };

    const arquivosAlvara =
        dadosAlvaraSelecionado?.[0]?.ARQUIVOSALVARAS || [];

    const temArquivos = arquivosAlvara.length > 0;
    const handleValidatedSubmit = async () => {
        try {

            const dadosParaValidar = {
                Empresa: usuarioLogado?.NOFANTASIA,
                operador: usuarioLogado?.NOFUNCIONARIO,
                historicoDigitado: motivoAjuste,
                dataLancamento: dados?.[0]?.DTHORAFECHAMENTOCAIXA,
                dinheiroInformado: dadosDetelheCaixa?.[0]?.TOTALFECHAMENTOVRQUEBRACAIXA,
                dinheiroAjuste: dinheiroAjuste
            };

            // await schema.validate(dadosParaValidar, { abortEarly: false });
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

    //console.log(dataFimCompetencia, "dataIncioCompetencia")
    return (
        <Fragment>
            <form onSubmit={handleSubmit(onSubmit)} >
                <span class="d-flex align-items-center">
                    <AiOutlineFileText size={25} />
                    <h4 class="font-weight-bold" style={{ margin: 0, marginLeft: "10px" }}>
                        PREFEITURA (LICENÇA DE FUNCIONAMENTO)
                    </h4>
                </span>
                <div class="form-group">

                    <div class="row mt-3">

                        <div class="col-sm-6 col-xl-6">
                            <label className="form-label" htmlFor={""}>Status:</label>
                            <Select
                                className="basic-single"
                                classNamePrefix={"select"}
                                name="departamentoFuncionario"
                                options={optionsStatus?.map((item) => ({
                                    value: item.value,
                                    label: item.label
                                }))}
                                value={statusAlvara}
                                onChange={(opt) => {
                                    setStatusAlvara(opt ?? null);
                                    clearErrors("contaSelecionada");
                                }}
                            //onChange={(e) => setStatusAlvara(e.value)}
                            />
                            {errors.moduloEscolhido && (
                                <AlertError
                                    error={errors.moduloEscolhido?.value || errors.moduloEscolhido}
                                    onClose={clearErrors}
                                    fieldName="moduloEscolhido"
                                />
                            )}
                            {/* <Controller
                                name="Status:"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Status:"}
                                        name="Status:"
                                        type="text"
                                        value={dadosAlvaraSelecionado?.[0]?.STATIVO === "True" ? "Ativo" : "Inativo"}
                                        errors={errors}
                                        readOnly={true}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            /> */}
                        </div>
                    </div>

                    <div class="row mt-3">
                        <div class="col-sm-6 col-xl-6">
                            <Controller
                                name="Dt. Inicio:"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Dt. Inicio:"}
                                        name="Dt. Inicio:"
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
                                name="Dt. Inicio:"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Dt. Fim:"}
                                        name="Dt. Fim:"
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
                                name="departamentoFuncionario"
                                options={optionsStatusAlvara?.map((item) => ({
                                    value: item.IDSTATUS,
                                    label: item.DESCRICAO

                                }))}

                                value={statusAndamento}
                                onChange={(opt) => {
                                    setStatusAndamento(opt ?? null);
                                    clearErrors("contaSelecionada");
                                }}
                            //onChange={(e) => setStatusAndamento(e.value)}
                            />
                            {errors.moduloEscolhido && (
                                <AlertError
                                    error={errors.moduloEscolhido?.value || errors.moduloEscolhido}
                                    onClose={clearErrors}
                                    fieldName="moduloEscolhido"
                                />
                            )}

                            {/*  <Controller
                                name="Status Andamento:"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Status Andamento:"}
                                        name="Status Andamento:"
                                        type="text"
                                        readOnly={true}
                                        value={dadosAlvaraSelecionado?.[0]?.DESCRICAOSTATUS}
                                        onChange={(e) => setMetragem(e.value)}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            /> */}
                        </div>
                        <div class="col-sm-6 col-xl-6">
                            <Controller
                                name="Metragem:"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Metragem:"}
                                        name="Metragem:"
                                        type="text"
                                        value={metragemLoja}
                                        onChange={(e) => setMetragemLoja(e.target.value).replace(/\D/g, "")}
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
                                name="DETALHEANDAMENTO"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        {...field}
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
                        optionsModulos={optionsModulos}
                        usuarioLogado={usuarioLogado}
                        refetchAlvaraEmpresa={refetchAlvaraEmpresa}
                        handleClose={handleClose}
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
                onClickButtonCadastrar={onSubmit}
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