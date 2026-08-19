import { Fragment, useEffect } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import Select from 'react-select';
import { Controller, useForm } from "react-hook-form";
import FormField from "../../../../Formularios/FormField";
import { AlertError } from "../../../../Inputs/alertError";
import { schema } from "./Schema/schemaValidation";
import { useEditarProdutoAvulso } from "../hooks/useEditarProdutoAvulso"
import { SelectList } from "../../../../Buttons/menuList";
import { formatMoeda } from "../../../../../utils/formatMoeda";

export const Formulario = ({ handleClose, usuarioLogado, optionsModulos, dadosDetalheProduto, handleClick }) => {
    const { handleSubmit, formState: { errors }, clearErrors, control, setError, setValue } = useForm({
        mode: "onChange"
    });

    const {
        marcaSelecionada,
        setMarcaSelecionada,
        idProduto, 
        setIdProduto,
        codBarras,
        setCodBarras,
        descricao,
        setDescricao,
        referencia,
        setReferencia,
        fornecedor,
        setFornecedor,
        fabricante,
        setFabricante,
        unidadeSelecionada,
        setUnidadeSelecionada,
        corSelecionada,
        setCorSelecionada,
        tipoTecidoSelecionado,
        setTipoTecidoSelecionado,
        categoriaGradeSelecionada,
        setCategoriaGradeSelecionada,
        tamanhoSelecionado,
        setTamanhoSelecionado,
        estrutura,
        setEstrutura,
        estilo,
        setEstilo,
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
        vrCusto,
        setVrCusto,
        vrVenda,
        setVrVenda,
        dadosUnidadeMedida,
        dadosTamanhos,
        dadosCores,
        dadosTipoTecidos,
        dadosCategoriasProdutos,
        dadosLocalExposicao,
        dadosTipoProdutos,
        dadosTipoFiscalProdutos,
        dadosFornecedores,
        dadosFabricantes,
        dadosSubGrupoProduto,
        dadosCategoriaPedido, 
        dadosNCM,
        dadosVinculoEstiloGrupo,
        dadosMarcas,
        dadosProdutosPedido,
        optionsEcommerce,
        onSubmit
    } = useEditarProdutoAvulso({usuarioLogado, optionsModulos, handleClose, dadosDetalheProduto, handleClick})


    const handleValidatedSubmit = async () => {
        try {
            const dadosParaValidar = {
                marcaGrupoProduto: marcaSelecionada,
                descProduto: descricao,
                refProduto: referencia,
                fornecedorProduto: fornecedor,
                fabricanteProduto: fabricante,
                unidadeProduto: unidadeSelecionada,
                corProduto: corSelecionada,
                tipoTecidoProduto: tipoTecidoSelecionado,
                categoriaGradeProduto: categoriaGradeSelecionada,
                tamanhoProduto: tamanhoSelecionado,
                estruturaProduto: estrutura,
                estiloProduto: estilo,
                categoriaProduto: categoriaSelecionada,
                localExposicaoProduto: localExposicaoSelecionado,
                ecommerceProduto: ecommerceSelecionado,
                redeSocialProduto: redeSocialSelecionado,
                ncmProduto: ncmSelecionado,
                tipoProduto: tipoProdutoSelecionado,
                tipoFiscalProduto: tipoFiscalSelecionado,
                vrCustoProduto: vrCusto,
                vrVendaProduto: vrVenda
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

     const menuHeaderStyle = {
        padding: "8px 12px",
        background: "#7a59ad",
        color: "#ffffff",
        fontSize: "14px",
    };

    const formatSelectGroup = (data) => {
        const grupos = {};

        (data || []).forEach((item) => {
            if (!grupos[item.DS_GRUPO]) {
            grupos[item.DS_GRUPO] = {
                label: item.DS_GRUPO,
                options: []
            };
            }

            grupos[item.DS_GRUPO].options.push({
            value:  `${item.ID_GRUPO}:${item.ID_ESTRUTURA}`,
            label: item.ESTRUTURA,
            original: item
            });
        });

        return Object.values(grupos);
    };

    const formatSelectCor = (data = []) => {
        const grupos = new Map();

        data.forEach((item) => {
            const {
            ID_COR,
            DS_COR,
            ID_GRUPOCOR,
            DS_GRUPOCOR,
            DSSIGLA,
            STBLOQUEADOPARACADASTROPRODUTONOVO
            } = item;

            const nomeCor = (DS_COR || "").trim();
            const nomeCorUpper = nomeCor.toUpperCase();

            const bloqueadaPorNome = nomeCorUpper === "NENHUM" || nomeCorUpper === "NENHUMA";
            const bloqueadaPorFlag = String(STBLOQUEADOPARACADASTROPRODUTONOVO) === "True";
            const isDisabled = bloqueadaPorNome || bloqueadaPorFlag;

            const sigla = (DSSIGLA || "").trim();
            const labelCor = sigla ? `${nomeCor} - ${sigla}` : nomeCor;

            const groupKey = String(ID_GRUPOCOR ?? "SEM_GRUPO");
            if (!grupos.has(groupKey)) {
            grupos.set(groupKey, {
                label: String(DS_GRUPOCOR || "SEM GRUPO").toUpperCase(),
                options: []
            });
            }

            grupos.get(groupKey).options.push({
            value: ID_COR,
            label: labelCor,
            isDisabled,
            original: item
            });
        });

        return Array.from(grupos.values());
    };

    const formatSelectMaterial = (data = []) => {
        const opcoesBloqueadas = ["NENHUM", "NENHUMA"];
        const optionsAtivas = [];
        const optionsBloqueadas = [];

        data.forEach((item) => {
            const {
            IDTPTECIDO,
            DSTIPOTECIDO,
            DSSIGLA,
            STBLOQUEADOPARACADASTROPRODUTONOVO
            } = item;

            const nomeMaterial = (DSTIPOTECIDO || "").trim();
            const nomeMaterialUpper = nomeMaterial.toUpperCase();

            const bloqueadaPorNome = opcoesBloqueadas.includes(nomeMaterialUpper);
            const bloqueadaPorFlag = String(STBLOQUEADOPARACADASTROPRODUTONOVO) === "True";
            const isDisabled = bloqueadaPorNome || bloqueadaPorFlag;

            const sigla = (DSSIGLA || "").trim();
            const labelMaterial = sigla ? `${nomeMaterial} - ${sigla}` : nomeMaterial;

            const option = {
            value: IDTPTECIDO,
            label: labelMaterial,
            isDisabled,
            color: isDisabled ? "#f63c97" : undefined,
            original: item
            };

            if (isDisabled) {
            optionsBloqueadas.push(option);
            } else {
            optionsAtivas.push(option);
            }
        });

        return [...optionsAtivas, ...optionsBloqueadas];
    }; 

  
    return (
        <Fragment>
            <form onSubmit={handleSubmit(handleValidatedSubmit)}>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-xl-3">
                            <label className="form-label" htmlFor="tppedido">Marca do Grupo</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="marcaGrupoProduto"
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...(dadosMarcas || []).map((item) => {
                                        return {
                                            value: item.IDGRUPOEMPRESARIAL,
                                            label: item.DSGRUPOEMPRESARIAL
                                        }
                                    })]}
                                value={marcaSelecionada}
                                onChange={(e) => {
                                    setMarcaSelecionada(e)
                                    clearErrors('marcaGrupoProduto')
                                }}
                            />
                            {errors.marcaGrupoProduto && (
                                <AlertError
                                    error={errors.marcaGrupoProduto}
                                    onClose={clearErrors}
                                    fieldName="marcaGrupoProduto"
                                />
                            )}
                        </div>


                    </div>
                </div>

                <div className="form-group">

                    <div className="row">
                        <div className="col-sm-6 col-xl-2">
                            <Controller
                                name="nItemProduto"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="nItemProduto"
                                        label={"id.Produto"}
                                        type="text"
                                        errors={errors}
                                        clearErrors={clearErrors}
                                        value={idProduto}
                                        onChangeModal={(e) => setIdProduto(e.target.value)}
                                        readOnly={true}
                                    />
                                )}
                            />
                        </div>

                        <div className="col-sm-6 col-xl-3">
                            <Controller
                                name="codBarraProduto"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="codBarraProduto"
                                        label={"cod.Barras"}
                                        type="text"
                                        errors={errors}
                                        clearErrors={clearErrors}
                                        value={codBarras}
                                        onChangeModal={(e) => setCodBarras(e.target.value)}
                                        readOnly={true}
                                    />
                                )}
                            />
                        </div>
                       
                        

                        <div className="col-sm-6 col-xl-5">
                            <Controller
                                name="descProduto"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="descProduto"
                                        label={"Descrição Produto"}
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
                            <Controller
                                name="refProduto"
                                control={control}
                                render={({ field }) => (
                                    <FormField
                                        name="refProduto"
                                        label={"Referência "}
                                        type="text"
                                        errors={errors}
                                        clearErrors={clearErrors}
                                        value={referencia}
                                        onChangeModal={(e) => setReferencia(e.target.value)}
                                    />
                                )}
                            />
                        </div>

            

                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                    
                        <div className="col-sm-6 col-xl-9">
                            <label className="form-label" htmlFor="notam">Fornecedor</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="fornecedorProduto"
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...(dadosFornecedores || []).map((item) => {
                                        return {
                                            value: item.IDFORNECEDOR,
                                            label: `${item.NOFANTASIA} // ${item.NUCNPJ} // ${item.NORAZAOSOCIAL}`
                                        }
                                    })]}
                                value={fornecedor}
                                onChange={(e) => {
                                    setFornecedor(e)
                                    clearErrors('fornecedorProduto')
                                }}
                            />
                            {errors.fornecedorProduto && (
                                <AlertError
                                    error={errors.fornecedorProduto}
                                    onClose={clearErrors}
                                    fieldName="fornecedorProduto"
                                />
                            )}
                        </div>
                        <div className="col-sm-6 col-xl-3">
                            <label className="form-label" htmlFor="notam">Fabricante</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="fabricanteProduto"
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...(dadosFabricantes || []).map((item) => {
                                        return {
                                            value: item.IDFABRICANTE,
                                            label: `${item.IDFABRICANTE} - ${item.DSFABRICANTE}`
                                        }
                                    })]}
                                value={fabricante}
                                onChange={(e) => {
                                    setFabricante(e)
                                    clearErrors('fabricanteProduto')
                                }}
                            />
                            {errors.fabricanteProduto && (
                                <AlertError
                                    error={errors.fabricanteProduto}
                                    onClose={clearErrors}
                                    fieldName="fabricanteProduto"
                                />
                            )}
                        </div>


                    </div>
                </div>
                <div className="form-group">
                    <div className="row">

                        <div className="col-sm-6 col-xl-2">
                            <label className="form-label" htmlFor="tpunid">Unidade</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="unidadeProduto"
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...(dadosUnidadeMedida || []).map((item) => {
                                        return {
                                            value: item.IDUNIDADEMEDIDA,
                                            label: item.DSSIGLA
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

                        <div className="col-sm-6 col-xl-3">
                            <label className="form-label" htmlFor="tpcor">Cor</label>
                            <SelectList
                                name={"corProduto"}
                                value={corSelecionada}
                                options={formatSelectCor(dadosCores)}
                                menuHeaderTitle={"Selecione"}
                                menuHeaderStyle={menuHeaderStyle}
                                onChange={(e) => setCorSelecionada(e)}
                                getOptionDisabled={(option) => !!option.isDisabled}
                                styles={{
                                    option: (base, state) => ({
                                    ...base,
                                    color: state.data?.isDisabled ? "#f63c97" : base.color,
                                    cursor: state.data?.isDisabled ? "not-allowed" : "pointer"
                                    }),
                                    singleValue: (base, state) => ({
                                    ...base,
                                    color: state.data?.isDisabled ? "#f63c97" : base.color
                                    })
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
                        <div className="col-sm-6 col-xl-3">
                            <label className="form-label" htmlFor="tptecidoav">Tipo de Material</label>
                          
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="tipoTecidoProduto"
                                value={tipoTecidoSelecionado}
                                options={formatSelectMaterial(dadosTipoTecidos)}
                                onChange={(e) => {
                                    setTipoTecidoSelecionado(e)
                                    clearErrors('tipoTecidoProduto')
                                }}
                                getOptionDisabled={(option) => !!option.isDisabled}
                                styles={{
                                    option: (base, state) => ({
                                    ...base,
                                    color: state.data?.isDisabled ? "#f63c97" : base.color,
                                    cursor: state.data?.isDisabled ? "not-allowed" : "pointer",
                                    fontSize: "13px"
                                    }),
                                    singleValue: (base, state) => ({
                                    ...base,
                                    color: state.data?.isDisabled ? "#f63c97" : base.color
                                    })
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
                        <div className="col-sm-6 col-xl-4">
                             <label className="form-label" htmlFor="categoriaGradeProduto">Categoria Grade</label>
                            <SelectList
                                id={"categoriaGradeProduto"}
                                value={categoriaGradeSelecionada}
                                options={formatSelectGroup(dadosCategoriaPedido)}
                                menuHeaderTitle={"Selecione"}
                                menuHeaderStyle={menuHeaderStyle}
                                onChange={(e) => setCategoriaGradeSelecionada(e)}
                                
                            />
                            {errors.categoriaGradeProduto && (
                                <AlertError
                                    error={errors.categoriaGradeProduto}
                                    onClose={clearErrors}
                                    fieldName="categoriaGradeProduto"
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
                                    ...(dadosTamanhos || []).map((item) => {
                                        return {
                                            value: item.IDTAMANHO,
                                            label: item.DSTAMANHO
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

                        <div className="col-sm-6 col-xl-4">
                             <label className="form-label" htmlFor="tptecidoav">Estrutura</label>
                            <SelectList
                                id={"estruturaProduto"}
                                value={estrutura}
                                options={formatSelectGroup(dadosSubGrupoProduto)}
                                menuHeaderTitle={"Selecione"}
                                menuHeaderStyle={menuHeaderStyle}
                                onChange={(e) => setEstrutura(e)}
                                
                            />
                            {errors.estruturaProduto && (
                                <AlertError
                                    error={errors.estruturaProduto}
                                    onClose={clearErrors}
                                    fieldName="estruturaProduto"
                                />
                            )} 
                        </div> 

                        <div className="col-sm-6 col-xl-3">
                            <label className="form-label" htmlFor="tpcats">Estilos</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="estiloProduto"
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...(dadosVinculoEstiloGrupo || []).map((item) => {
                                        return {
                                            value: item.IDESTILO,
                                            label: `${item.IDESTILO} - ${item.DSESTILO}`
                                        }
                                    })]}
                                value={estilo}
                                onChange={(e) => {
                                    setEstilo(e)
                                    clearErrors('estiloProduto')
                                }}
                            />
                            {errors.estiloProduto && (
                                <AlertError
                                    error={errors.estiloProduto}
                                    onClose={clearErrors}
                                    fieldName="estiloProduto"
                                />
                            )}
                        </div>
                        <div className="col-sm-6 col-xl-3">
                            <label className="form-label" htmlFor="categoriaProduto">Categorias</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="categoriaProduto"
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...(dadosCategoriasProdutos || []).map((item) => {
                                        return {
                                            value: item.IDCATEGORIAS,
                                            label: `${item.IDCATEGORIAS} - ${item.DSCATEGORIAS} - ${item.TPCATEGORIAS}`
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
                        <div className="col-sm-6 col-xl-3">
                            <label className="form-label" htmlFor="locexp">Local Exposição</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="localExposicaoProduto"
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...(dadosLocalExposicao || []).map((item) => {
                                        return {
                                            value: item.IDLOCALEXPOSICAO,
                                            label: item.DSLOCALEXPOSICAO
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
                                    ...(optionsEcommerce || []).map((item) => {
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
                                    ...(optionsEcommerce || []).map((item) => {
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
                            <label className="form-label" htmlFor="tpncm">NCM</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="ncmProduto"
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...(dadosNCM || []).map((item) => {
                                        return {
                                            value: item.NUNCM,
                                            label: item.NUNCM
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
                                    ...(dadosTipoProdutos || []).map((item) => {
                                        return {
                                            value: item.IDTIPOPRODUTO,
                                            label: `${item.CODTIPOPRODUTO} - ${item.DSTIPOPRODUTO}`
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


                      

                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        

                        <div className="col-sm-6 col-xl-8">
                            <label className="form-label" htmlFor="tpfiscal">Tipo Fiscal</label>
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                name="tipoFiscalProduto"
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...(dadosTipoFiscalProdutos || []).map((item) => {
                                        return {
                                            value: item.IDTIPOFISCALPRODUTO,
                                            label: `${item.CODTIPOFISCALPRODUTO} - ${item.DSTIPOFISCALPRODUTO}`
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
                        <p>
                            PRÉVIA DO PRODUTO
                        </p>
                        <button
                            type="button"
                            className="btn btn-danger"
                        >
                            Prévia do Produto Avulso    
                        </button> 
                    </div>
                </div>
                <FooterModal
                    ButtonTypeFechar={ButtonTypeModal}
                    onClickButtonFechar={handleClose}
                    textButtonFechar={"Fechar"}
                    corFechar={"secondary"}

                    ButtonTypeCadastrar={ButtonTypeModal}
                    onClickButtonCadastrar={handleValidatedSubmit}
                    textButtonCadastrar={"Atualizar"}
                    corCadastrar={"success"}
                    loadingTextCadastrar={"Cadastrando..."}
                    autoLoadingCadastrar={true}
                />
            </form>
        </Fragment>
    )
}