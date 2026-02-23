import { Fragment } from "react"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import Select from 'react-select';
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { useEditarItemPedido } from "../../../hooks/useEditarItemPedido";

export const FormularioEditarItemPedido = ({dadosItemPedido, handleClose}) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const {
        quantidade,
        setQuantidade,
        qtdCaixas,
        setQtdCaixas,
        referencia,
        setReferencia,
        descricaoProduto,
        setDescricaoProduto,
        categoriaProduto,
        setCategoriaProduto,
        fornecedor,
        setFornecedor,
        fabricante,
        setFabricante,
        unidade,
        setUnidade,
        cor,
        setCor,
        tipoTecido,
        setTipoTecido,
        estrutura,
        setEstrutura,
        estilo,
        setEstilo,
        categorias,
        setCategorias,
        localExposicao,
        setLocalExposicao,
        ecommerce,
        setEcommerce,
        redeSocial,
        setRedeSocial,
        vrCusto,
        setVrCusto,
        vrVenda,
        setVrVenda,
        dadosUnidadeMedida,
        groupedCores,
        dadosTipoTecido,
        dadosCategorias,
        dadosLocalExposicao,
        ooptionsTipoPedido,
        optionsEcommerce,
        onSubmit,
    } = useEditarItemPedido( dadosItemPedido );

    return (
        <Fragment>
            <form>

                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-xl-2">
                            <InputFieldModal
                                className="form-control input"
                                readOnly={true}
                                label="Quantidade"
                                value={quantidade}
                                onChangeModal={(e) => setQuantidade(e.value)}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <InputFieldModal
                                className="form-control input"
                                readOnly={true}
                                label="QTD Caixas"
                                value={qtdCaixas}
                                onChangeModal={(e) => setQtdCaixas(e.value)}
                            />

                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <InputFieldModal
                                className="form-control input"
                                readOnly={true}
                                label="Referência"
                                value={referencia}
                                onChangeModal={(e) => setReferencia(e.value)}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-4">
                            <InputFieldModal
                                className="form-control input"
                                readOnly={true}
                                label="Descrição Produto"
                                value={descricaoProduto}
                                onChangeModal={(e) => setDescricaoProduto(e.value)}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <label className="form-label" htmlFor="tppedido">Categoria Produto</label>
                            <div className="input-group">
                                <Select
                                    options={[
                                        { value: '', label: 'Selecione...' },
                                        ...ooptionsTipoPedido.map((item) => {
                                            return {
                                                value: item.value,
                                                label: item.label
                                            }
                                        })]}
                                    value={categoriaProduto}
                                    onChange={(e) => setCategoriaProduto(e)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-xl-6">
                            <InputFieldModal
                                className="form-control input"
                                readOnly={true}
                                label="Fornecedor"
                                value={fornecedor}
                                onChangeModal={(e) => setFornecedor(e.value)}
                            />

                        </div>
                        <div className="col-sm-6 col-xl-4">
                            <InputFieldModal
                                className="form-control input"
                                readOnly={true}
                                label="Fabricante"
                                value={fabricante}
                                onChangeModal={(e) => setFabricante(e.value)}
                            />

                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <label className="form-label" htmlFor="tpunid">Unidade</label>
                            <Select
                                value={unidade}
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...dadosUnidadeMedida.map((item) => {
                                        return {
                                            value: item.IDUNIDADEMEDIDA,
                                            label: item.DSUNIDADE
                                        }
                                    })]}
                                onChange={(e) => setUnidade(e)}
                            />

                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-xl-2">
                            <label className="form-label" htmlFor="tpcor">Cor</label>
                            <Select
                                value={cor}
                                options={groupedCores}
                                onChange={(e) => setCor(e)}
                            />

                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <label className="form-label" htmlFor="tptecidoav">Tipo de Tecido</label>
                            <Select
                                value={tipoTecido}
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...dadosTipoTecido.map((item) => {
                                        return {
                                            value: item.IDTPTECIDO,
                                            label: item.DSTIPOTECIDO
                                        }
                                    })]}
                                onChange={(e) => setTipoTecido(e)}
                            />

                        </div>
                        <div className="col-sm-6 col-xl-3">
                            <InputFieldModal
                                className="form-control input"
                                readOnly={true}
                                label="Estrutura"
                                value={estrutura}
                                onChangeModal={(e) => setEstrutura(e.value)}
                            />

                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <InputFieldModal
                                className="form-control input"
                                readOnly={true}
                                label="Estilos"
                                value={estilo}
                                onChangeModal={(e) => setEstilo(e.value)}
                            />

                        </div>
                        <div className="col-sm-6 col-xl-3">
                            <label className="form-label" htmlFor="tpcats">Categorias</label>
                            <Select
                                value={categorias}
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...dadosCategorias.map((item) => {
                                        return {
                                            value: item.IDCATEGORIAS,
                                            label: `${item.IDCATEGORIAS} - ${item.DSCATEGORIAS} - ${item.TPCATEGORIAS}`
                                        }
                                    })]}
                                onChange={(e) => setCategorias(e)}
                            />

                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-xl-4">
                            <label className="form-label" htmlFor="locexp">Local Exposição</label>
                            <Select
                                value={localExposicao}
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...dadosLocalExposicao.map((item) => {
                                        return {
                                            value: item.IDLOCALEXPOSICAO,
                                            label: item.DSLOCALEXPOSICAO
                                        }
                                    })]}
                                onChange={(e) => setLocalExposicao(e)}
                            />

                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <label className="form-label" htmlFor="ecommercest">E-commerce</label>
                            <Select
                                value={ecommerce}
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...optionsEcommerce.map((item) => {
                                        return {
                                            value: item.value,
                                            label: item.label
                                        }
                                    })]}
                                onChange={(e) => setEcommerce(e)}
                            />

                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <label className="form-label" htmlFor="redesocialst">Rede Social</label>
                            <Select
                                value={redeSocial}
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...optionsEcommerce.map((item) => {
                                        return {
                                            value: item.value,
                                            label: item.label
                                        }
                                    })]}
                                onChange={(e) => setRedeSocial(e)}
                            />

                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <InputFieldModal
                                className="form-control input"
                                readOnly={true}
                                label="Vr Custo"
                                value={vrCusto}
                                onChangeModal={(e) => setVrCusto(e.value)}
                            />

                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <InputFieldModal
                                className="form-control input"
                                readOnly={true}
                                label="Vr Venda"
                                value={vrVenda}
                                onChangeModal={(e) => setVrVenda(e.value)}
                            />

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
                />
            </form>
        </Fragment>
    )
}