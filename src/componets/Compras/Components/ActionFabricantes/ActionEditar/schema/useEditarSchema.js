import * as yup from "yup";
export const schema = yup.object({
    fabricanteFornecedor: yup.string().required("O campo NOME DO FABRICANTE é obrigatório."),

    situacao: yup.object()
    .nullable()
    .required('Situação é obrigatória')
    .typeError('Situação é obrigatória'),
})