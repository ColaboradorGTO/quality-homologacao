import { Fragment } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import Select from 'react-select';
import { useCadastroProdutoAvulso } from "../../../hooks/useCadastroProdutoAvulso"
import { Controller, useForm } from "react-hook-form";
import FormField from "../../../../Formularios/FormField";
import { AlertError } from "../../../../Inputs/alertError";

export const FormularioCadastroProduto = ({ handleClose }) => {
    const { handleSubmit, formState: { errors }, clearErrors, control, setError, setValue } = useForm({
        mode: "onChange"
    });
    const {
        quantidade,
        setQuantidade,
        referencia,
        setReferencia,
        codBarras,
        setCodBarras,
        descricao,
        setDescricao,
        fornecedor,
        setFornecedor,
        fabricante,
        setFabricante,
        estrutura,
        setEstrutura,
        estilo,
        setEstilo,
        vrCusto,
        setVrCusto,
        vrVenda,
        setVrVenda,
        categoriaProdutoSelecionado,
        setCategoriaProdutoSelecionado,
        tamanhoSelecionado,
        setTamanhoSelecionado,
        unidadeSelecionada,
        setUnidadeSelecionada,
        corSelecionada,
        setCorSelecionada,
        tipoTecidoSelecionado,
        setTipoTecidoSelecionado,
        categoriaSelecionada,
        setCategoriaSelecionada,
        localExposicaoSelecionado,
        setLocalExposicaoSelecionado,
        ecommerceSelecionado,
        setEcommerceSelecionado,
        redeSocialSelecionado,
        setRedeSocialSelecionado,
        ncmSelecionado,
        setNcmSelecionado,
        tipoProdutoSelecionado,
        setTipoProdutoSelecionado,
        tipoFiscalSelecionado,
        setTipoFiscalSelecionado,
        dadosUnidadeMedida,
        dadosTamanhos,
        dadosCores,
        dadosTipoTecidos,
        dadosCategoriaPedidos,
        dadosCategoriasProdutos,
        dadosExposicao,
        dadosTipoProdutos,
        dadosTipoFiscalProdutos,
        handleCategoriaProduto,
        handleTamanho,
        handleUnidade,
        handleCor,
        handleTipoTecido,
        handleCategoria,
        handleLocalExposicao,
        handleEcommerce,
        handleRedeSocial,
        handleNcm,
        handleTipoProduto,
        handleTipoFiscal,
        enviarPagamento
    } = useCadastroProdutoAvulso()



    const optionsCategoriaProduto = [
        { value: 'VESTUARIO', label: 'VESTUARIO' },
        { value: 'CALCADOS', label: 'CALÇADOS' },
        { value: 'ARTIGOS', label: 'ARTIGOS' },
        { value: 'ACESSORIOS', label: 'ACESSÓRIOS' }
    ]

    const optionsEcommerce = [
        { value: 'True', label: 'SIM' },
        { value: 'False', label: 'NÃO' }
    ]

    const handleValidatedSubmit = async () => {
        try {
            const dadosParaValidar = {
                descricaoPedido: descricao,
            };

            await schema.validate(dadosParaValidar, { abortEarly: false });
            await onSubmit();
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
            <form>


                <div className="form-group">

                    <div className="row">
                        <div className="col-sm-6 col-xl-2">
                            <Controller
                                name="qtdProduto"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="qtdProduto"
                                        label={"Informe a Quantidade *"}
                                        type="text"
                                        errors={errors}
                                        clearErrors={clearErrors}
                                        value={quantidade}
                                        onChangeModal={(e) => setQuantidade(e.target.value)}
                                    />
                                )}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <Controller
                                name="refProduto"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="refProduto"
                                        label={"Informe a Referência *"}
                                        type="text"
                                        errors={errors}
                                        clearErrors={clearErrors}
                                        value={referencia}
                                        onChangeModal={(e) => setReferencia(e.target.value)}
                                    />
                                )}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <Controller
                                name="codProduto"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="codProduto"
                                        label={"Cod. Barras*"}
                                        type="text"
                                        errors={errors}
                                        clearErrors={clearErrors}
                                        value={codBarras}
                                        onChangeModal={(e) => setCodBarras(e.target.value)}
                                    />
                                )}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-4">
                            <Controller
                                name="descProduto"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="descProduto"
                                        label={"Descrição Produto*"}
                                        type="text"
                                        errors={errors}
                                        clearErrors={clearErrors}
                                        value={descricao}
                                        onChangeModal={(e) => setDescricao(e.target.value)}
                                    />
                                )}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <label className="form-label" htmlFor="tppedido">Categoria Produto</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="categoriaProduto"
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...optionsCategoriaProduto.map((item) => {
                                        return {
                                            value: item.value,
                                            label: item.label
                                        }
                                    })]}
                                value={categoriaProdutoSelecionado}
                                onChange={(e) => {
                                    setCategoriaProdutoSelecionado(e)
                                    clearErrors('categoriaProduto')
                                }}
                            />
                            {errors.categoriaProduto && (
                                <AlertError
                                    error={errors.categoriaProduto}
                                    onClose={clearErrors}
                                    fieldName="categoriaProduto"
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-xl-2">
                            <label className="form-label" htmlFor="notam">Tamanho</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="tamanhoProduto"
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...optionsCategoriaProduto.map((item) => {
                                        return {
                                            value: item.value,
                                            label: item.label
                                        }
                                    })]}
                                value={tamanhoSelecionado}
                                onChange={(e) => {
                                    setTamanhoSelecionado(e)
                                    clearErrors('tamanhoProduto')
                                }}
                            />
                            {errors.tamanhoProduto && (
                                <AlertError
                                    error={errors.tamanhoProduto}
                                    onClose={clearErrors}
                                    fieldName="tamanhoProduto"
                                />
                            )}
                        </div>
                        <div className="col-sm-6 col-xl-5">
                            <Controller
                                name="fornecedorProduto"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="fornecedorProduto"
                                        label={"Fornecedor*"}
                                        type="text"
                                        errors={errors}
                                        clearErrors={clearErrors}
                                        value={fornecedor}
                                        onChangeModal={(e) => setFornecedor(e.target.value)}
                                    />
                                )}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-3">
                            <Controller
                                name="fabricanteProduto"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="fabricanteProduto"
                                        label={"Fabricante*"}
                                        type="text"
                                        errors={errors}
                                        clearErrors={clearErrors}
                                        value={fabricante}
                                        onChangeModal={(e) => setFabricante(e.target.value)}
                                    />
                                )}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <label className="form-label" htmlFor="tpunid">Unidade</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="unidadeProduto"
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...optionsCategoriaProduto.map((item) => {
                                        return {
                                            value: item.value,
                                            label: item.label
                                        }
                                    })]}
                                value={unidadeSelecionada}
                                onChange={(e) => {
                                    setUnidadeSelecionada(e)
                                    clearErrors('unidadeProduto')
                                }}
                            />
                            {errors.unidadeProduto && (
                                <AlertError
                                    error={errors.unidadeProduto}
                                    onClose={clearErrors}
                                    fieldName="unidadeProduto"
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-xl-2">
                            <label className="form-label" htmlFor="tpcor">Cor</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="corProduto"
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...optionsCategoriaProduto.map((item) => {
                                        return {
                                            value: item.value,
                                            label: item.label
                                        }
                                    })]}
                                value={corSelecionada}
                                onChange={(e) => {
                                    setCorSelecionada(e)
                                    clearErrors('corProduto')
                                }}
                            />
                            {errors.corProduto && (
                                <AlertError
                                    error={errors.corProduto}
                                    onClose={clearErrors}
                                    fieldName="corProduto"
                                />
                            )}
                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <label className="form-label" htmlFor="tptecidoav">Tipo de Tecido</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="tipoTecidoProduto"
                                value={tipoTecidoSelecionado}
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...optionsCategoriaProduto.map((item) => {
                                        return {
                                            value: item.value,
                                            label: item.label
                                        }
                                    })]}
                                onChange={(e) => {
                                    setTipoTecidoSelecionado(e)
                                    clearErrors('tipoTecidoProduto')
                                }}
                            />
                            {errors.tipoTecidoProduto && (
                                <AlertError
                                    error={errors.tipoTecidoProduto}
                                    onClose={clearErrors}
                                    fieldName="tipoTecidoProduto"
                                />
                            )}
                        </div>
                        <div className="col-sm-6 col-xl-3">
                            <Controller
                                name="EstruturaProduto"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="EstruturaProduto"
                                        label={"Estrutura*"}
                                        type="text"
                                        errors={errors}
                                        clearErrors={clearErrors}
                                        value={estrutura}
                                        onChangeModal={(e) => setEstrutura(e.target.value)}
                                    />
                                )}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <Controller
                                name="estiloProduto"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="estiloProduto"
                                        label={"Estilos*"}
                                        type="text"
                                        errors={errors}
                                        clearErrors={clearErrors}
                                        value={estilo}
                                        onChangeModal={(e) => setEstilo(e.target.value)}
                                    />
                                )}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-3">
                            <label className="form-label" htmlFor="tpcats">Categorias</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="categoriaProduto"
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...optionsCategoriaProduto.map((item) => {
                                        return {
                                            value: item.value,
                                            label: item.label
                                        }
                                    })]}
                                value={categoriaSelecionada}
                                onChange={(e) => {
                                    setCategoriaSelecionada(e)
                                    clearErrors('categoriaProduto')
                                }}
                            />
                            {errors.categoriaProduto && (
                                <AlertError
                                    error={errors.categoriaProduto}
                                    onClose={clearErrors}
                                    fieldName="categoriaProduto"
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-xl-4">
                            <label className="form-label" htmlFor="locexp">Local Exposição</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="localExposicaoProduto"
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...optionsCategoriaProduto.map((item) => {
                                        return {
                                            value: item.value,
                                            label: item.label
                                        }
                                    })]}
                                value={localExposicaoSelecionado}
                                onChange={(e) => {
                                    setLocalExposicaoSelecionado(e)
                                    clearErrors('localExposicaoProduto')
                                }}
                            />
                            {errors.localExposicaoProduto && (
                                <AlertError
                                    error={errors.localExposicaoProduto}
                                    onClose={clearErrors}
                                    fieldName="localExposicaoProduto"
                                />
                            )}
                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <label className="form-label" htmlFor="ecommercest">E-commerce</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="ecommerceProduto"
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...optionsEcommerce.map((item) => {
                                        return {
                                            value: item.value,
                                            label: item.label
                                        }
                                    })]}
                                value={ecommerceSelecionado}
                                onChange={(e) => {
                                    setEcommerceSelecionado(e)
                                    clearErrors('ecommerceProduto')
                                }}
                            />
                            {errors.ecommerceProduto && (
                                <AlertError
                                    error={errors.ecommerceProduto}
                                    onClose={clearErrors}
                                    fieldName="ecommerceProduto"
                                />
                            )}
                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <label className="form-label" htmlFor="redesocialst">Rede Social</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="redeSocialProduto"
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...optionsEcommerce.map((item) => {
                                        return {
                                            value: item.value,
                                            label: item.label
                                        }
                                    })]}
                                value={redeSocialSelecionado}
                                onChange={(e) => {
                                    setRedeSocialSelecionado(e)
                                    clearErrors('redeSocialProduto')
                                }}
                            />
                            {errors.redeSocialProduto && (
                                <AlertError
                                    error={errors.redeSocialProduto}
                                    onClose={clearErrors}
                                    fieldName="redeSocialProduto"
                                />
                            )}
                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <Controller
                                name="vrCustoProduto"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="vrCustoProduto"
                                        label={"Vr Custo"}
                                        type="text"
                                        errors={errors}
                                        clearErrors={clearErrors}
                                        value={vrCusto}
                                        onChangeModal={(e) => setVrCusto(e.target.value)}
                                    />
                                )}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <Controller
                                name="vrVendaProduto"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="vrVendaProduto"
                                        label={"Vr Venda"}
                                        type="text"
                                        errors={errors}
                                        clearErrors={clearErrors}
                                        value={vrVenda}
                                        onChangeModal={(e) => setVrVenda(e.target.value)}
                                    />
                                )}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-xl-3">
                            <label className="form-label" htmlFor="tpncm">NCM</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="ncmProduto"
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...optionsEcommerce.map((item) => {
                                        return {
                                            value: item.value,
                                            label: item.label
                                        }
                                    })]}
                                value={ncmSelecionado}
                                onChange={(e) => {
                                    setNcmSelecionado(e)
                                    clearErrors('ncmProduto')
                                }}
                            />
                            {errors.ncmProduto && (
                                <AlertError
                                    error={errors.ncmProduto}
                                    onClose={clearErrors}
                                    fieldName="ncmProduto"
                                />
                            )}
                        </div>
                        <div className="col-sm-6 col-xl-3">
                            <label className="form-label" htmlFor="tpprod">Tipo Produto</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="tipoProduto"
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...optionsEcommerce.map((item) => {
                                        return {
                                            value: item.value,
                                            label: item.label
                                        }
                                    })]}
                                value={tipoProdutoSelecionado}
                                onChange={(e) => {
                                    setTipoProdutoSelecionado(e)
                                    clearErrors('tipoProduto')
                                }}
                            />
                            {errors.tipoProduto && (
                                <AlertError
                                    error={errors.tipoProduto}
                                    onClose={clearErrors}
                                    fieldName="tipoProduto"
                                />
                            )}
                        </div>
                        <div className="col-sm-6 col-xl-6">
                            <label className="form-label" htmlFor="tpfiscal">Tipo Fiscal</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="tipoFiscalProduto"
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...optionsEcommerce.map((item) => {
                                        return {
                                            value: item.value,
                                            label: item.label
                                        }
                                    })]}
                                value={tipoFiscalSelecionado}
                                onChange={(e) => {
                                    setTipoFiscalSelecionado(e)
                                    clearErrors('tipoFiscalProduto')
                                }}
                            />
                            {errors.tipoFiscalProduto && (
                                <AlertError
                                    error={errors.tipoFiscalProduto}
                                    onClose={clearErrors}
                                    fieldName="tipoFiscalProduto"
                                />
                            )}
                        </div>
                    </div>
                </div>
                <FooterModal
                    ButtonTypeFechar={ButtonTypeModal}
                    onClickButtonFechar={handleClose}
                    textButtonFechar={"Fechar"}
                    corFechar={"secondary"}

                    ButtonTypeCadastrar={ButtonTypeModal}
                    onClickButtonCadastrar
                    textButtonCadastrar={"Salvar"}
                    corCadastrar={"success"}
                    loadingTextCadastrar={"Cadastrando..."}
                    autoLoadingCadastrar={true}
                />
            </form>
        </Fragment>
    )
}