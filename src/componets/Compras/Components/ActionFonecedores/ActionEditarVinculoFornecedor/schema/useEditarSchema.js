import * as yup from "yup";
export const schema = yup.object({
    nomeFornecedor: yup.string().required("O campo CNPJ é obrigatório."),
    fornecedor: yup.object().required("O campo Fornecedor é obrigatório.").nullable(),
    situacaoFornecedor: yup.object().required("O campo Situação é obrigatório.").nullable(),
});  