import * as yup from "yup";

export const schema = yup.object({
    quantidade: yup
        .number()
        .required("Quantidade é obrigatória")
        .typeError('Quantidade é obrigatória'),

    descricaoDigitada: yup
        .string()
        .required("Descrição é obrigatória")
});