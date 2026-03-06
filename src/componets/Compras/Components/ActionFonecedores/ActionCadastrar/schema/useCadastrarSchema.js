import * as yup from "yup";
export const schema = yup.object({
    cnpjFornecedor: yup.string().required("O campo CNPJ é obrigatório."),
    inscricaoEstadualFornecedor: yup.string(),
    inscricaoMunicipalFornecedor: yup.string(),
    razaoSocialFornecedor: yup.string().required("O campo Razão Social é obrigatório."),
    nomeFantasiaFornecedor: yup.string().required("O campo Nome Fantasia é obrigatório."),
    cepFornecedor: yup.string().required("O campo CEP é obrigatório."),
    enderecoFornecedor: yup.string().required("O campo Endereço é obrigatório."),
    numeroFornecedor: yup.string().required("O campo Número é obrigatório."),
    complementoFornecedor: yup.string(),
    bairroFornecedor: yup.string().required("O campo Bairro é obrigatório."),
    cidadeFornecedor: yup.string().required("O campo Cidade é obrigatório."),
    ufFornecedor: yup.string().required("O campo Estado é obrigatório."),
    numeroIBGEFornecedor: yup.string(),
    nomeRepresentanteFornecedor: yup.string(),
    emailFornecedor: yup.string(),
    telefone1Fornecedor: yup.string().required("O campo Telefone 1 é obrigatório."),
    telefone2Fornecedor: yup.string(),
    telefone3Fornecedor: yup.string(),
    vendedorFornecedor: yup.string(),
    emailVendedorFornecedor: yup.string(),

    situacaoFornecedor: yup.object()
    .nullable()
    .required('Situação é obrigatória')
    .typeError('Situação é obrigatória'),

    fiscalFornecedor: yup.object()
    .nullable()
    .required('Fiscal é obrigatório')
    .typeError('Fiscal é obrigatório'),

});  