import { Fragment } from 'react';
import { InputFieldModal } from '../../../../Buttons/InputFieldModal';
import { FooterModal } from '../../../../Modais/FooterModal/footerModal';
import { ButtonTypeModal } from '../../../../Buttons/ButtonTypeModal';
import { useForm } from "react-hook-form";
import Select from 'react-select';
import { useCadastrarRelatorioBi } from '../hooks/useCadastrarRelatorioBi';
import { schema } from './schemaValidarRelatorio';
import { AlertError } from '../../../../Inputs/alertError';

export const FormularioCadastroLinkBi = ({ handleClose, optionsModulos, usuarioLogado, refetchListaRelatorio, dadosEmpresas }) => {
    const { handleSubmit, formState: { errors }, clearErrors, control, setError, register, } = useForm({
        mode: "onChange"
    });
    const {
        linkRelatorioBI,
        setLinkRelatorioBI,
        empresaSelecionada,
        setEmpresaSelecionada,
        relatorioSelecionado,
        setRelatorioSelecionado,
        statusSelecionado,
        setStatusSelecionado,
        dadosBI,
        onSubmit,
        optionsStatus
    } = useCadastrarRelatorioBi({ handleClose, optionsModulos, usuarioLogado, refetchListaRelatorio, dadosEmpresas });

    const handleValidatedSubmit = async () => {
        try {
            const dadosParaValidar = {
                empresaFilial: empresaSelecionada,
                relatorio: relatorioSelecionado,
                status: statusSelecionado,
                link: linkRelatorioBI
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
            console.log(`Erro de validação:\n${errorMessages.join('\n')}`);
        }
    }

    return (
        <Fragment>
            <form onSubmit={handleSubmit(handleValidatedSubmit)}>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-xl-">
                            <label className="form-label" htmlFor={""}>Filíal</label>

                            <Select
                                closeMenuOnSelect={false}
                                options={dadosEmpresas.map((item) => ({
                                    value: item.IDEMPRESA,
                                    label: item.NOFANTASIA
                                }))}
                                value={dadosEmpresas.find(option => option.value === empresaSelecionada)}
                                onChange={(value) => {
                                    setEmpresaSelecionada(value ? [value] : []);
                                }}
                            />
                            {errors.empresaFilial && (
                                <AlertError
                                    error={errors.empresaFilial?.value || errors.empresaFilial}
                                    onClose={clearErrors}
                                    fieldName="empresaFilial"
                                />
                            )}
                        </div>
                        <div className="col-sm-6 col-xl-6">
                            <label className="form-label" htmlFor={""}>Relatório</label>

                            <Select
                                closeMenuOnSelect={false}
                                options={dadosBI.map((item) => ({
                                    value: item.IDRELATORIOBI,
                                    label: item.DSRELATORIOBI
                                }))}
                                value={dadosBI.find(option => option.value === relatorioSelecionado)}
                                onChange={(value) => {
                                    setRelatorioSelecionado(value ? [value] : []);
                                }}
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
                                value={optionsStatus.find((obj) => obj.value === statusSelecionado)}
                                onChange={(selectedOption) => setStatusSelecionado(selectedOption.value)}
                            />
                            {errors.status && (
                                <AlertError
                                    error={errors.status?.value || errors.status}
                                    onClose={clearErrors}
                                    fieldName="status"
                                />
                            )}
                        </div>
                        <div className="col-sm-6 col-xl-12 mt-3">

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
                                    fieldName="link"
                                />
                            )}
                        </div>
                    </div>
                </div>
            </form>
            <FooterModal
                ButtonTypeCadastrar={ButtonTypeModal}
                onClickButtonCadastrar={handleValidatedSubmit}
                textButtonCadastrar={"Cadastrar"}
                corCadastrar={"success"}

                ButtonTypeFechar={ButtonTypeModal}
                textButtonFechar={"Fechar"}
                onClickButtonFechar={handleClose}
                corFechar="secondary"
            />
        </Fragment>
    );
}