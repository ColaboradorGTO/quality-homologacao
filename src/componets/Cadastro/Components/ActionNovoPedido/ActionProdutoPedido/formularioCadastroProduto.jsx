import { Fragment } from "react"
import { FooterModal } from "../../../../Modais/FooterModal/footerModal"
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal"
import { InputFieldModal } from "../../../../Buttons/InputFieldModal"
import { useForm } from "react-hook-form"
import Select from 'react-select';
import { useCadastroProduto } from "./hooks/useCadastroProduto"

export const FormularioCadastroProduto = ({ handleClose }) => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const {
        quantidade,
        setQuantidade,
        referencia,
        setReferencia,
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
        ncmSelecionado,
        setNcmSelecionado,
        tipoProdutoSelecionado,
        setTipoProdutoSelecionado,
        tipoFiscalSelecionado,
        setTipoFiscalSelecionado,
        handleTamanho,
        handleUnidade,
        handleCor,
        handleTipoTecido,
        handleCategoria,
        handleNcm,
        handleTipoProduto,
        handleTipoFiscal,
        observacao,
        setObservacao,
        estoque,
        setEstoque,
        cadastrarProduto,
    } = useCadastroProduto()



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
                            <label className="form-label" htmlFor="fornecedor">Fornecedor</label>
                            <Select
                                id={"fornecedor"}
                                defaultValue={fornecedor}
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...optionsEcommerce.map((item) => {
                                        return {
                                            value: item.value,
                                            label: item.label
                                        }
                                    })]}
                                onChange={(e) => setFornecedor(e.value)}
                            />
                        </div>
                        <div className="col-sm-6 col-xl-2">
                            <label className="form-label" htmlFor="fornecedor">Fabricante</label>
                            <Select
                                id={"fornecedor"}
                                defaultValue={fabricante}
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...optionsEcommerce.map((item) => {
                                        return {
                                            value: item.value,
                                            label: item.label
                                        }
                                    })]}
                                onChange={(e) => setFabricante(e.value)}
                            />
                        </div>
                      
                    </div>
                </div>
                <div className="form-group">
                    <div className="row">
                        
                        
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

                        <div className="col-sm-6 col-xl-4">
                            <InputFieldModal
                                label={"Obs Produto"}
                                type={"text"}
                                id={"obsProdPedidoEdit"}
                                value={observacao}
                                onChangeModal={(e) => setObservacao(e.target.value)}
                                {...register("obsProdPedidoEdit", { required: "Campo obrigatório Informe a Observação", })}
                                required={true}
                                placeholder={"Informe a Descrição do Produto."}
                                readOnly={false}
                            />
                        </div>
                        
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
                            <label className="form-label" htmlFor="categoriaGrade" >Categoria Grade</label>
                            <Select
                                id={"categoriaGrade"}
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

                        <div className="col-sm-6 col-xl-3">
                            <label className="form-label" htmlFor="estrutura">Estrutura</label>
                            <Select
                                id={"estruturaProd"}
                                defaultValue={estrutura}
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...optionsCategoriaProduto.map((item) => {
                                        return {
                                            value: item.value,
                                            label: item.label
                                        }
                                    })]}
                                onChange={(e) => setEstrutura(e.value)}
                            />
                        </div>

                        <div className="col-sm-6 col-xl-2">
                            <label className="form-label" htmlFor="estilos">Estilos</label>
                            <Select
                                id={"estilosProd"}
                                defaultValue={estilo}
                                options={[
                                    { value: '', label: 'Selecione...' },
                                    ...optionsCategoriaProduto.map((item) => {
                                        return {
                                            value: item.value,
                                            label: item.label
                                        }
                                    })]}
                                onChange={(e) => setEstilo(e.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <div className="row">

                        <div className="col-sm-6 col-xl-2">
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

                        <div className="col-sm-6 col-xl-2">
                            <InputFieldModal
                                label={"Estoque Real"}
                                type={"number"}
                                id={"qtdEstoqueRealEdit"}
                                value={estoque}
                                onChangeModal={(e) => setEstoque(e.target.value)}
                                {...register("qtdEstoqueRealEdit", { required: "Campo obrigatório Informe a quantidade estoque", })}
                                required={true}
                                placeholder={"Informe a quantidade estoque."}
                                readOnly={false}
                            />
                        </div>

                        <div className="col-sm-6 col-xl-2">
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
                        <div className="col-sm-6 col-xl-3">
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