import * as yup from "yup";
export const schema = yup.object({
    valorPagamentoDigitado: yup.string()
        .required("Valor do Pagamento é obrigatório"),

    dataPagamentoSelecionada: yup.string()
        .required("Data do Pagamento é obrigatória"),

    formaPagamentoSelecionada: yup.object()
        .nullable()
        .required("Forma de Pagamento é obrigatória")
        .typeError("Forma de Pagamento é obrigatória"),

    anexoComprovanteAnexado: yup.string(),

    observacaoDigitada: yup.string(),
})
