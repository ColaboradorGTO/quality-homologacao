import { Fragment } from "react"
import { HeaderModal } from "../../../../../../Modais/HeaderModal/HeaderModal";
import { ButtonTypeModal } from "../../../../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../../../../Modais/FooterModal/footerModal";
import { Controller, useForm } from "react-hook-form";
import FormField from "../../../../../../Formularios/FormField";
//import { schema } from "./schemaCadastrarQuebraCaixa";
//import { useCadastrarAlvara } from "../../../hooks/actionCriarAlvara";
import { BsBuilding, BsPerson } from "react-icons/bs";
import Select from "react-select"
import { AiOutlineFileText } from "react-icons/ai";
import { ActionListaArquivosAnexados } from "./actionListaArquivoAnexado";
import { useCriarAlvara } from "../../../hooks/actionCriarAlvara";

//import { ActionListaAlvaraPrefeitura } from "./ActionAvaraPrefeituraLista/actionListaAlvaraPrefeitura.jsx";

export const FormularioVisualizarDetalhesAlvara = ({ show, dadosAlvaraSelecionado, handleClose, dadosDetelheCaixa, usuarioLogado, optionsModulos, refetchAlvaraEmpresa }) => {
    const { handleSubmit, formState: { errors }, clearErrors, control, setError, register } = useForm({
        mode: "onChange"
    });
    const {
        onSubmit,
        empresa,
        setEmpresa,
        motivoAjuste,
        setMotivoAjuste,
        dataLancamento,
        dataAtualFormatada,
        setDataAtualFormatada,
        dinheiroInformado,
        setDinheiroInformado,
        dinheiroAjuste,
        setDinheiroAjuste,
        dadosQuebraCaixasModal,
        setDadosQuebraCaixasModal,
        modalVisivelImprimir,
        setModalVisivelImprimir,
        modalQuebraVisivel,
        setModalQuebraVisivel,
        dados,
        operador,
        setOperador,
        setDataLancamento,
        dataTableRef
    } = useCriarAlvara({ show, handleClose, dadosDetelheCaixa, usuarioLogado, optionsModulos });

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

    const options = [
        { value: 'Todos', label: 'Todos' },
        { value: 'Ativo', label: 'Ativo' },
        { value: 'Inativo', label: 'Inativo' },
    ];
    return (
        <Fragment>
            <form onSubmit={handleSubmit(handleValidatedSubmit)} >
                <span class="d-flex align-items-center">
                    <AiOutlineFileText size={25} />
                    <h4 class="font-weight-bold" style={{ margin: 0, marginLeft: "10px" }}>
                        PREFEITURA (LICENÇA DE FUNCIONAMENTO)
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
                    optionsModulos={optionsModulos}
                    usuarioLogado={usuarioLogado}
                    refetchAlvaraEmpresa={refetchAlvaraEmpresa}
                    handleClose={handleClose}
                />
            </div>
            <FooterModal
                /*   ButtonTypeCadastrar={ButtonTypeModal}
                  onClickButtonCadastrar={handleValidatedSubmit}
                  tipoBtnCadastrar={"submit"}
                  textButtonCadastrar={"Adicionar"}
                  corCadastrar="success"
   */
                ButtonTypeFechar={ButtonTypeModal}
                textButtonFechar={"Fechar"}
                onClickButtonFechar={handleClose}
                corFechar="secondary"
            />
        </Fragment>
    )
}