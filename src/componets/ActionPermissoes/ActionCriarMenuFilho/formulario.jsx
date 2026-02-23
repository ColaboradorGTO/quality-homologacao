import { Controller, useForm } from "react-hook-form";
import Select from 'react-select';
import { Fragment } from 'react';
import { ButtonType } from "../../Buttons/ButtonType";
import { FaAngleDown, FaRegSave } from "react-icons/fa";;
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { InputFieldModal } from "../../Buttons/InputFieldModal";
import { AlertError } from "../../Inputs/alertError";
import FormField from "../../Formularios/FormField";
import { schema } from "./schema";

export const FormularioCriarMenuFilho = ({
    moduloSelecionado,
    setModuloSelecionado,
    complementoUrl,
    setComplementoUrl,
    urlFinal,
    setUrlFinal,
    nomeMenu,
    setNomeMenu,
    dadosModulos,
    onSubmit
}) => {
    const { handleSubmit, formState: { errors }, clearErrors, control, setError } = useForm({
        mode: "onChange"
    });

    const limparTexto = (texto) => {
        return texto
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-zA-Z0-9]/g, "")
            .toLowerCase();
    };

    const nomeModuloLimpo = moduloSelecionado?.label
        ? limparTexto(moduloSelecionado.label)
        : "";

    const prefixo = `/${nomeModuloLimpo}/ActionPesquisa`;
    const valorFinal = `${prefixo}${complementoUrl}`;

    const handleChange = (e) => {
        const texto = e.target.value;

        if (!texto.startsWith(prefixo)) return;

        let complemento = texto.slice(prefixo.length);

        if (complemento.length > 0) {
            complemento = complemento.charAt(0).toUpperCase() + complemento.slice(1);
        }

        setComplementoUrl(complemento);
        setUrlFinal(`${prefixo}${complemento}`)
    };

    const handleValidatedSubmit = async () => {
        try {
            const dadosParaValidar = {
                moduloEscolhido: moduloSelecionado,
                nomeMenuEscolhido: nomeMenu,
                urlMenuFilho: urlFinal
            };

            await schema.validate(dadosParaValidar, { abortEarly: false });
            onSubmit(dadosParaValidar);
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
    return (
        <Fragment>
            <form onSubmit={handleSubmit(handleValidatedSubmit)} style={{ paddingBottom: '4rem' }}>
                <div className="" style={{ marginTop: "2rem", }} >
                    <div className=" " style={{ marginTop: "18px", width: '100%', }}>
                        <div className="row ">
                            <div className="col-4 mt-4">
                                <div style={{ width: '100%' }} className="mb-2 ">

                                    <label style={{ color: '#fff', fontSize: '1.5rem' }} htmlFor="">Selecione um Módulo</label>
                                </div>

                                <Select
                                    options={dadosModulos?.map((item) => ({
                                        value: item.IDMODULO,
                                        label: item.DSMENU
                                    }))}
                                    value={moduloSelecionado}
                                    onChange={(e) => setModuloSelecionado(e)}
                                />
                                {errors.moduloEscolhido && (
                                    <AlertError
                                        error={errors.moduloEscolhido?.value || errors.moduloEscolhido}
                                        onClose={clearErrors}
                                        fieldName="moduloEscolhido"
                                    />
                                )}
                            </div>
                            {moduloSelecionado && (
                                <Fragment>
                                    <div className="col-4 ">
                                        <div style={{ width: '100%' }} className="mb-2 ">

                                            <label style={{ color: '#fff', fontSize: '1.5rem' }} htmlFor="">Nome do menu</label>
                                        </div>
                                        <Controller
                                            name="nomeMenuEscolhido"
                                            control={control}
                                            render={({ field }) => (
                                                <FormField
                                                    name="nomeMenuEscolhido"
                                                    label={"Nome do Menu na Sidebar"}
                                                    type="text"
                                                    errors={errors}
                                                    clearErrors={clearErrors}
                                                    value={nomeMenu}
                                                    onChangeModal={(e) => {
                                                        const texto = e.target.value;
                                                        const capitalizado = texto.charAt(0).toUpperCase() + texto.slice(1);
                                                        setNomeMenu(capitalizado)
                                                    }
                                                    }
                                                />
                                            )}
                                        />
                                    </div>

                                    <div className="col-4 " >
                                        <div style={{ width: '100%' }} className="mb-2 ">

                                            <label style={{ color: '#fff', fontSize: '1.5rem' }} htmlFor="">URL do menu filho</label>
                                        </div>

                                        <Controller
                                            name="urlMenuFilho"
                                            control={control}
                                            render={({ field }) => (
                                                <FormField
                                                    name="urlMenuFilho"
                                                    label={"URL do menu filho"}
                                                    type="text"
                                                    errors={errors}
                                                    clearErrors={clearErrors}
                                                    value={valorFinal}
                                                    onChangeModal={handleChange}
                                                />
                                            )}
                                        />
                                    </div>
                                    <div className="row mt-3 ml-1">
                                        <ButtonType
                                            className="col-12 mt-2 "
                                            textButton=" Salvar"
                                            cor="success"
                                            Icon={FaRegSave}
                                            iconColo="#FFF"
                                            iconSize={18}
                                            tipo={"submit"}
                                        />
                                    </div>
                                </Fragment>
                            )}
                        </div>
                    </div>
                </div>

            </form>
        </Fragment>
    )
}