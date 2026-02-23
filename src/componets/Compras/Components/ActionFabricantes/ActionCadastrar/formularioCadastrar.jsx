import { Fragment } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import Select from 'react-select';
import { useCadastrarFabricanteFornecedor } from "../hooks/useCadastrarFabricanteFornecedor";
import { schema } from "./schema/useCadastrarSchema";
import { useForm, Controller } from "react-hook-form";
import FormField from "../../../../Formularios/FormField";

export const FormularioCadastrar = ({ handleClose, usuarioLogado, optionsModulos, handleClick }) => {
    const { register, handleSubmit, formState: { errors }, clearErrors, setError, control } = useForm({
        mode: "onChange"
    });
    const {
        statusSelecionado,
        setStatusSelecionado,
        onSubmit,
        fabricante,
        setFabricante,
        optionsStatus,
        handleChange
    } = useCadastrarFabricanteFornecedor({ handleClose, usuarioLogado, optionsModulos, handleClick });

    const handleValidatedSubmit = async () => {
        try {
            const dadosParaValidar = {
                fabricanteFornecedor: fabricante,
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
            <form onSubmit={handleSubmit(handleValidatedSubmit)}>
                <div className="row">
                    <div className="col-sm-6 col-xl-3">
                        <Controller
                            name="fabricanteFornecedor"
                            control={control}
                            render={({ field }) => (
                                <FormField
                                    label={"Nome Fabricante *"}
                                    name="fabricanteFornecedor"
                                    type="text"
                                    value={fabricante}
                                    onChange={(e) => setFabricante(e.target.value)}
                                    errors={errors}
                                    clearErrors={clearErrors}
                                />

                            )}
                        />
                    </div>
                    <div className="col-sm-6 col-xl-3">
                        <label>Situação *</label>
                        <Select
                            id={"stativofab"}
                            readOnly={false}
                            options={optionsStatus.map((item) => {
                                return {
                                    value: item.value,
                                    label: item.label
                                }
                            })}
                            value={statusSelecionado}
                            onChange={(e) => setStatusSelecionado(e)}
                        />
                    </div>
                </div>

                <div className="form-group mt-5">

                    <h5 className="form-label" htmlFor="vrfat">* Campos Obrigatórios *</h5>
                </div>
                <FooterModal
                    ButtonTypeFechar={ButtonTypeModal}
                    onClickButtonFechar={handleClose}
                    textButtonFechar={"Fechar"}
                    corFechar={"secondary"}

                    ButtonTypeCadastrar={ButtonTypeModal}
                    onClickButtonCadastrar
                    tipoBtnCadastrar={"submit"}
                    textButtonCadastrar={"Salvar"}
                    corCadastrar={"success"}
                />
            </form>

        </Fragment>
    )
}