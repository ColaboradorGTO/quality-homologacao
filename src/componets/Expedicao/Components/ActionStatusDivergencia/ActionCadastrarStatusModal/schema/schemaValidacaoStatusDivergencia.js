import * as yup from "yup";

export const schema = yup.object({

    statusDivergenciaSelecionada: yup.object()
        .nullable()
        .required("Motivo da divergência é obrigatório")
        .typeError('Motivo da divergência é obrigatório'),

    descricaoDivergencia: yup
        .string()
        .required("descrição é obrigatório")
});
                
