import * as yup from "yup";
export const schema = yup.object({
    fabricanteFornecedor: yup.string().required("O campo NOME DO FABRICANTE é obrigatório."),

    fabricanteVinculo: yup.object()
    .nullable()
    .required('Fabricante é obrigatória')
    .typeError('Fabricante é obrigatória'),
 
    situacaoVinculo: yup.object()
    .nullable()
    .required('Situação é obrigatória')
    .typeError('Situação é obrigatória'),
})