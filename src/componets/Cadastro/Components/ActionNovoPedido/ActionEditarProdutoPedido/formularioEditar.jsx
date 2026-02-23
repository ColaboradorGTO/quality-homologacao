import { Fragment } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import { useForm } from "react-hook-form"
import Select from 'react-select';
import { useCadastroProdutoAvulso } from "../../../hooks/useCadastroProdutoAvulso"

export const FormularioEditar = ({ handleClose }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
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


    return (
        <Fragment>
            <form>


                <div className="form-group">
                    
                    <div className="row">
                        <div className="col-sm-6 col-xl-2">
                            <InputFieldModal
                                label={"Quantidade "}
                                type={"text"}
                                id={"qtdProdPedidoEdit"}
                                value={quantidade}
                                onChangeModal={(e) => setQuantidade(e.target.value)}
                                {...register("qtdProdPedidoEdit", { required: "Campo obrigatório Informe a Quantidade.", })}
                                required={true}
                                placeholder={"Informe a Quantidade."}
                                readOnly={false}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <InputFieldModal
                                label={"Referência"}
                                type={"text"}
                                id={"refProdutoEdit"}
                                value={referencia}
                                onChangeModal={(e) => setReferencia(e.target.value)}
                                {...register("refProdutoEdit", { required: "Campo obrigatório Informe a Referência.", })}
                                required={true}
                                placeholder={"Informe a Referência."}
                                readOnly={false}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <InputFieldModal
                                label={"Cod. Barras"}
                                type={"text"}
                                id={"codbProdutoEdit"}
                                value={codBarras}
                                onChangeModal={(e) => setCodBarras(e.target.value)}
                                {...register("codbProdutoEdit", { required: "Campo obrigatório Informe o Código de Barras", })}
                                required={true}
                                placeholder={"Informe o Código de Barras."}
                                readOnly={false}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-4">
                            <InputFieldModal
                                label={"Descrição Produto"}
                                type={"text"}
                                id={"dsProdPedidoEdit"}
                                value={descricao}
                                onChangeModal={(e) => setDescricao(e.target.value)}
                                {...register("dsProdPedidoEdit", { required: "Campo obrigatório Informe a Descrição de Produto", })}
                                required={true}
                                placeholder={"Informe a Descrição do Produto."}
                                readOnly={false}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <label className="form-label" htmlFor="tppedido">Categoria Produto</label>
                            <Select
                                id={"idtipopedido"}
                                defaultValue={categoriaProdutoSelecionado}
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...optionsCategoriaProduto.map((item) => {
                                        return {
                                            value: item.value,
                                            label: item.label
                                        }
                                    })]}
                                onChange={handleCategoriaProduto}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-xl-2">
                            <label className="form-label" htmlFor="notam">Tamanho</label>
                            <Select
                                id={"tamprod"}
                                defaultValue={tamanhoSelecionado}
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...optionsCategoriaProduto.map((item) => {
                                        return {
                                            value: item.value,
                                            label: item.label
                                        }
                                    })]}
                                onChange={handleTamanho}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-5">
                            <InputFieldModal
                                label={"Fornecedor"}
                                type={"text"}
                                id={"dsFornEdit"}
                                value={fornecedor}
                                onChangeModal={(e) => setFornecedor(e.target.value)}
                                {...register("dsFornEdit", { required: "Campo obrigatório Informe o Fornecedor", })}
                                required={true}
                                placeholder={"Informe o Fornecedor."}
                                readOnly={false}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-3">
                            <InputFieldModal
                                label={"Fabricante"}
                                type={"text"}
                                id={"dsFabEdit"}
                                value={fabricante}
                                onChangeModal={(e) => setFabricante(e.target.value)}
                                {...register("dsFabEdit", { required: "Campo obrigatório Informe o Fabricante", })}
                                required={true}
                                placeholder={"Informe o Fabricante."}
                                readOnly={false}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <label className="form-label" htmlFor="tpunid">Unidade</label>
                            <Select
                                id={"unidProd"}
                                defaultValue={unidadeSelecionada}
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...optionsCategoriaProduto.map((item) => {
                                        return {
                                            value: item.value,
                                            label: item.label
                                        }
                                    })]}
                                onChange={handleUnidade}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-xl-2">
                            <label className="form-label" htmlFor="tpcor">Cor</label>
                            <Select
                                id={"corProdCad"}
                                defaultValue={corSelecionada}
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...optionsCategoriaProduto.map((item) => {
                                        return {
                                            value: item.value,
                                            label: item.label
                                        }
                                    })]}
                                onChange={handleCor}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <label className="form-label" htmlFor="tptecidoav">Tipo de Tecido</label>
                            <Select
                                id={"tpTecidoProdCad"}
                                defaultValue={tipoTecidoSelecionado}
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...optionsCategoriaProduto.map((item) => {
                                        return {
                                            value: item.value,
                                            label: item.label
                                        }
                                    })]}
                                onChange={handleTipoTecido}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-3">
                            <InputFieldModal
                                label={"Estrutura"}
                                type={"text"}
                                id={"dsEstruturaEdit"}
                                value={estrutura}
                                onChangeModal={(e) => setEstrutura(e.target.value)}
                                {...register("dsEstruturaEdit", { required: "Campo obrigatório Informe a Estrutura", })}
                                required={true}
                                placeholder={"Informe a Estrutura."}
                                readOnly={false}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <InputFieldModal
                                label={"Estilos"}
                                type={"text"}
                                id={"dsEstiloEdit"}
                                value={estilo}
                                onChangeModal={(e) => setEstilo(e.target.value)}
                                {...register("dsEstiloEdit", { required: "Campo obrigatório Informe o Estilo", })}
                                required={true}
                                placeholder={"Informe o Estilo."}
                                readOnly={false}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-3">
                            <label className="form-label" htmlFor="tpcats">Categorias</label>
                            <Select
                                id={"categoriasProd"}
                                defaultValue={categoriaSelecionada}
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...optionsCategoriaProduto.map((item) => {
                                        return {
                                            value: item.value,
                                            label: item.label
                                        }
                                    })]}
                                onChange={handleCategoria}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-xl-4">
                            <label className="form-label" htmlFor="locexp">Local Exposição</label>
                            <Select
                                id={"localexp"}
                                defaultValue={localExposicaoSelecionado}
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...optionsCategoriaProduto.map((item) => {
                                        return {
                                            value: item.value,
                                            label: item.label
                                        }
                                    })]}
                                onChange={handleLocalExposicao}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <label className="form-label" htmlFor="ecommercest">E-commerce</label>
                            <Select
                                id={"stecommerce"}
                                defaultValue={ecommerceSelecionado}
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...optionsEcommerce.map((item) => {
                                        return {
                                            value: item.value,
                                            label: item.label
                                        }
                                    })]}
                                onChange={handleEcommerce}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <label className="form-label" htmlFor="redesocialst">Rede Social</label>
                            <Select
                                id={"stredesocial"}
                                defaultValue={redeSocialSelecionado}
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...optionsEcommerce.map((item) => {
                                        return {
                                            value: item.value,
                                            label: item.label
                                        }
                                    })]}
                                onChange={handleRedeSocial}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <InputFieldModal
                                label={"Vr Custo"}
                                type={"text"}
                                id={"vrUnitCustoEdit"}
                                value={vrCusto}
                                onChangeModal={(e) => setVrCusto(e.target.value)}
                                {...register("vrUnitCustoEdit", { required: "Campo obrigatório Informe o Valor Custo", })}
                                required={true}
                                placeholder={"Informe o Valor Custo."}
                                readOnly={false}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <InputFieldModal
                                label={"Vr Venda"}
                                type={"text"}
                                id={"vrUnitVendaEdit"}
                                value={vrVenda}
                                onChangeModal={(e) => setVrVenda(e.target.value)}
                                {...register("vrUnitCustoEdit", { required: "Campo obrigatório Informe o Valor Venda", })}
                                required={true}
                                placeholder={"Informe o Valor da Venda."}
                                readOnly={false}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        <div className="col-sm-6 col-xl-3">
                            <label className="form-label" htmlFor="tpncm">NCM</label>
                            <Select
                                id={"idNcm"}
                                defaultValue={ncmSelecionado}
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...optionsEcommerce.map((item) => {
                                        return {
                                            value: item.value,
                                            label: item.label
                                        }
                                    })]}
                                onChange={handleNcm}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-3">
                            <label className="form-label" htmlFor="tpprod">Tipo Produto</label>
                            <Select
                                id={"idTipoProd"}
                                defaultValue={tipoProdutoSelecionado}
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...optionsEcommerce.map((item) => {
                                        return {
                                            value: item.value,
                                            label: item.label
                                        }
                                    })]}
                                onChange={handleTipoProduto}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-6">
                            <label className="form-label" htmlFor="tpfiscal">Tipo Fiscal</label>
                            <Select
                                id={"idTipoFiscal"}
                                defaultValue={tipoFiscalSelecionado}
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...optionsEcommerce.map((item) => {
                                        return {
                                            value: item.value,
                                            label: item.label
                                        }
                                    })]}
                                onChange={handleTipoFiscal}
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