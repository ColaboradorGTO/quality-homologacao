import * as yup from "yup";
export const schema = yup.object({
    codigoAutorizacao: yup.string().required("O campo Código Autorização é obrigatório.").min(1, "O campo Código Autorização não pode ser vazio."),
    valorAtual: yup.string().required("O campo Valor Atual é obrigatório.").min(1, "O campo Valor Atual não pode ser vazio."),
})