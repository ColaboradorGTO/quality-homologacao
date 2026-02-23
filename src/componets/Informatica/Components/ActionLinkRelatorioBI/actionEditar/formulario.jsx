import { InputFieldModal } from '../../../..//Buttons/InputFieldModal';
import { FooterModal } from '../../../../Modais/FooterModal/footerModal';
import { ButtonTypeModal } from '../../../../Buttons/ButtonTypeModal';
import { useForm } from "react-hook-form";
import Select from 'react-select';
import { Fragment } from 'react';
import { useEditarRelatorioBi } from '../hooks/useEditarRelatorioBi';
import { AlertError } from '../../../../Inputs/alertError';
import { schema } from './schemaValidarRelatorio';
export const FormularioEditarLinkBi = ({
    handleClose,
    dadosLinkRelatorioBI,
    empresaSelecionada,
    handleTabelaVisivel,
    optionsModulos,
    usuarioLogado
}) => {
    const { handleSubmit, formState: { errors }, clearErrors, control, setError } = useForm({
        mode: "onChange"
    });

    const {
        statusSelecionado,
        linkRelatorioBI,
        descricao,
        relatorioSelecionado,
        empresa,
        dadosListaBI,
        optionsStatus,

        setStatusSelecionado,
        setLinkRelatorioBI,
        setEmpresa,
        setRelatorioSelecionado,

        onSubmit
    } = useEditarRelatorioBi({
        handleClose,
        dadosLinkRelatorioBI,
        empresaSelecionada,
        handleTabelaVisivel,
        optionsModulos,
        usuarioLogado
    });

  
    const handleValidatedSubmit = async () => {
        try {
            const dadosParaValidar = {
                relatorio: relatorioSelecionado,
                status: statusSelecionado,
                link: linkRelatorioBI
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
            <form onSubmit={handleSubmit(handleValidatedSubmit)}>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-xl-6">
                            <InputFieldModal
                                label={"Filial "}
                                type="text"
                                id={"linkrelatoriobi"}
                                readOnly={true}
                                value={empresa}
                                onChangeModal={(e) => setEmpresa(e.target.value)}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-6">
                            <label className="form-label" htmlFor={""}>Relatório</label>
                            <Select
                                closeMenuOnSelect={false}
                                options={dadosListaBI.map((item) => {
                                    return {
                                        value: item.IDRELATORIOBI,
                                        label: item.DSRELATORIOBI
                                    };
                                })}
                                value={{
                                    value: relatorioSelecionado,
                                    label: dadosListaBI.find(item => item.IDRELATORIOBI === relatorioSelecionado)?.DSRELATORIOBI || ''
                                }}
                                onChange={(e) => setRelatorioSelecionado(e.value)}
                            />
                            {errors.relatorio && (
                                <AlertError
                                    error={errors.relatorio?.value || errors.relatorio}
                                    onClose={clearErrors}
                                    fieldName="Relatorio"
                                />
                            )}
                        </div>
                    </div>
                    <div className="row mt-4">
                        <div className="col-sm-6 col-xl-3">
                            <label className="form-label" htmlFor={""}>Status</label>
                            <Select
                                closeMenuOnSelect={false}
                                options={optionsStatus}
                                value={optionsStatus.find(option => option.value === statusSelecionado)}
                                onChange={(e) => setStatusSelecionado(e.value)}
                            />
                            {errors.status && (
                                <AlertError
                                    error={errors.status?.value || errors.status}
                                    onClose={clearErrors}
                                    fieldName="status"
                                />
                            )}
                        </div>
                        <div className="col-sm-6 col-xl-12">
                            <InputFieldModal
                                label={"Link "}
                                type="text"
                                id={"linkrelatoriobi"}
                                value={linkRelatorioBI}
                                onChangeModal={(e) => setLinkRelatorioBI(e.target.value)}
                            />
                            {errors.link && (
                                <AlertError
                                    error={errors.link?.value || errors.link}
                                    onClose={clearErrors}
                                    fieldName="Link"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </form>

            <FooterModal
                ButtonTypeConfirmar={ButtonTypeModal}
                textButtonConfirmar={"Atualizar"}
                onClickButtonConfirmar={handleValidatedSubmit}
                corConfirmar={"success"}
                ButtonTypeFechar={ButtonTypeModal}
                textButtonFechar={"Fechar"}
                onClickButtonFechar={handleClose}
                corFechar="secondary"
            />
        </Fragment>
    );
}