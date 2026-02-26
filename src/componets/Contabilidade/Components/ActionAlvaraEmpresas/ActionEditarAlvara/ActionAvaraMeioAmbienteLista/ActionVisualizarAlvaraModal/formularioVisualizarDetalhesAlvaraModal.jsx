import { Fragment } from "react"
import { ButtonTypeModal } from "../../../../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../../../../Modais/FooterModal/footerModal";
import { Controller, useForm } from "react-hook-form";
import FormField from "../../../../../../Formularios/FormField";
import { AiOutlineFileText } from "react-icons/ai";
import { ActionListaArquivosAnexados } from "./actionListaArquivoAnexado";

export const FormularioVisualizarDetalhesAlvara = ({
    dadosAlvaraSelecionado,
    handleClose,
}) => {

    const { formState: { errors }, clearErrors, control } = useForm({
        mode: "onChange"
    });

    return (
        <Fragment>
            <form>
                <span class="d-flex align-items-center">
                    <AiOutlineFileText size={25} />
                    <h4 class="font-weight-bold" style={{ margin: 0, marginLeft: "10px" }}>
                        ALVARÁS - MEIO AMBIENTE (LICENÇA AMBIENTAL)
                    </h4>
                </span>

                <div class="form-group">
                    <div class="row mt-3">
                        <div class="col-sm-6 col-xl-6">
                            <Controller
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
                            />
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
                                        value={dadosAlvaraSelecionado?.[0]?.DTINICIOCOMPETENCIAALVARA}
                                        errors={errors}
                                        readOnly={true}
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
                                        value={dadosAlvaraSelecionado?.[0]?.DTFIMCOMPETENCIAALVARA}
                                        errors={errors}
                                        readOnly={true}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />

                        </div>
                    </div>

                    <div class="row mt-3">
                        <div class="col-sm-6 col-xl-6">
                            <Controller
                                name="Status:"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        label={"Status:"}
                                        name="Status:"
                                        type="text"
                                        readOnly={true}
                                        value={dadosAlvaraSelecionado?.[0]?.DESCRICAOSTATUS}
                                        onChange={(e) => setMetragem(e.target.value).replace(/\D/g, "")}
                                        errors={errors}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />
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
                                        value={dadosAlvaraSelecionado?.[0]?.METRAGEMEMPRESA}
                                        readOnly={true}
                                        onChange={(e) => setMetragem(e.target.value).replace(/\D/g, "")}
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
                                        value={dadosAlvaraSelecionado?.[0]?.DESCRICAODETALHEANDAMENTO}
                                        errors={errors}
                                        width="100%"
                                        height="120px"
                                        readOnly={true}
                                        clearErrors={clearErrors}
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>
            </form>

            <div style={{ marginTop: "3rem" }}>
                <ActionListaArquivosAnexados
                    dadosAlvaraSelecionado={dadosAlvaraSelecionado}
                />
            </div>

            <FooterModal
                ButtonTypeFechar={ButtonTypeModal}
                textButtonFechar={"Fechar"}
                onClickButtonFechar={handleClose}
                corFechar="secondary"
            />
        </Fragment>
    )
}