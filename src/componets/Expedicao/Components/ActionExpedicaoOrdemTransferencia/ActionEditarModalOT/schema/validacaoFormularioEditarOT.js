import * as yup from "yup";

export const schema = yup.object({

    empresaOrigemSelecionada: yup.object()
        .nullable()
        .required("Empresa Origem é obrigatório")
        .typeError('Empresa Origem é obrigatório'),

    empresaDestinoSelecionada: yup.object()
        //.nullable()
        .required("Empresa Destino é obrigatório")
        .typeError('Empresa Destino é obrigatório'),

  /*   dataEntregaSelecionada: yup
        .string()
        .required("Data de entrega é obrigatório"), */

    quantidadeDigitada: yup
        .string()
        .required("Quantidade é obrigatório"),


});

