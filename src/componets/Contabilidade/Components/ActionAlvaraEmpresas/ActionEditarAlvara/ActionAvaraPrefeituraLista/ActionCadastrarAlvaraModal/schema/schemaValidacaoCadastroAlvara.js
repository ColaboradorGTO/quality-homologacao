import * as yup from "yup";

export const schema = yup.object({
    dataInicioCompetenciaSelecionada: yup
        .date()
        .required("Data de início é obrigatória")
        .typeError('Data de início é obrigatória'),

    dataFimCompetenciaSelecionada: yup
        .date()
        .required("Data de fim é obrigatória")
        .typeError('Data de fim é obrigatória'),

    statusAndamento: yup.object()
        .nullable()
        .required("Status de andamento é obrigatório")
        .typeError('Status de andamento é obrigatório'),

    metragemLojaDigitado: yup
        .number()
        .required("Metragem é obrigatória")
        .typeError('Metragem é obrigatória'),

    descricaoDetalheAndamentoDigitado: yup
        .string()
        .required("Detalhe de andamento é obrigatório")
});