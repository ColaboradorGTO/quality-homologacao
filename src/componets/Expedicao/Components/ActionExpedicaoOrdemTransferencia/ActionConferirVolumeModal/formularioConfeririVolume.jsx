import { Fragment } from "react"
import { Controller, useForm } from "react-hook-form";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import FormField from "../../../../Formularios/FormField";
import { ActionListaConferirVolume } from "./ActionListaConferirVolume";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { useConferirVolumeOT } from "../../../hooks/useConferirVolumeOT";

export const FormularioConferirVolume = ({
    handleClose,
    optionsModulos,
    usuarioLogado,
    refetchListaConferencia,
    dadosDetalheTransferencia,
    setDadosDetalheTransferencia

}) => {

    const { handleSubmit, formState: { errors }, clearErrors, control, setError } = useForm({
        mode: "onChange"
    })
    const {
        produto,
        setProduto,
        dadosProdutosTabela,
        setDadosProdutosTabela,
        handleExcluirProduto,
        handleChangeQtdAjuste,
        registrarLeituraVolume,
        handleConferirVolume

    } = useConferirVolumeOT({

        handleClose,
        optionsModulos,
        usuarioLogado,
        refetchListaConferencia,
        dadosDetalheTransferencia,
        setDadosDetalheTransferencia,

    });

    return (
        <Fragment>
            <form onSubmit={handleSubmit(handleConferirVolume)}>
                <div className="row" data-select2-id="736">
                    <div className="col-sm-6 col-xl-6">

                        <Controller
                            name="produtoIncluir"
                            control={control}
                            render={({ field }) => (
                                <FormField
                                    name="produtoIncluir"
                                    label={"Produto"}
                                    type="text"
                                    value={produto}
                                    placeholder={"Digite o codigo de barra do produto"}
                                    onChange={(e) => setProduto(e.target.value)}
                                    errors={errors}
                                    clearErrors={clearErrors}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();

                                            const codigo = produto;

                                            const novosDados = registrarLeituraVolume(codigo);
                                            setDadosDetalheTransferencia(novosDados);

                                            setProduto('');
                                        }
                                    }}
                                />
                            )}
                        />
                    </div>
                </div>

            </form>

            <ActionListaConferirVolume
                dadosProdutosTabela={dadosProdutosTabela}
                setDadosProdutosTabela={setDadosProdutosTabela}
                dadosDetalheTransferencia={dadosDetalheTransferencia}
                setDadosDetalheTransferencia={setDadosDetalheTransferencia}
                handleExcluirProduto={handleExcluirProduto}
                handleChangeQtdAjuste={handleChangeQtdAjuste}
                registrarLeituraVolume={registrarLeituraVolume}
            />

            <FooterModal
                ButtonTypeFechar={ButtonTypeModal}
                textButtonFechar={"Fechar"}
                onClickButtonFechar={handleClose}
                corFechar={"secondary"}

                ButtonTypeConfirmar={ButtonTypeModal}
                textButtonConfirmar={"Finalizar Confêrencia"}
                corConfirmar={"success"}
                onClickButtonConfirmar={() => handleSubmit(handleConferirVolume)}
            />

        </Fragment>
    )
}