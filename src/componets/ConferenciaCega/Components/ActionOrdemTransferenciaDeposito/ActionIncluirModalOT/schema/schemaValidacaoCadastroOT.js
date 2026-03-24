import * as yup from "yup";

export const schema = yup.object({

    empresaOrigemSelecionada: yup.object()
        .nullable()
        .required("Empresa origem é obrigatório")
        .typeError('Empresa origem é obrigatório'),

    empresaDestinoSelecionada: yup.object()
        .nullable()
        .required("Empresa destino é obrigatório")
        .typeError('Empresa destino é obrigatório'),
});

