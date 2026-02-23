import * as yup from "yup";
export const schema = yup.object().shape({
    //empresaDespesa: yup.string().required("O campo Empresa é obrigatório."),
    tipoDespesaSelecionada: yup
        .mixed()
        .nullable()
        .test("tipoDespesaSelecionada", "despesas é obrigatório", (v) => {
            return !!v && typeof v === "object" && !!v.value;
        }),

    historicoDespesa: yup
        .string()
        .required("O campo Histórico é obrigatório."),

    dsPagoDespesa: yup
        .string()
        .required("o campo é obrigatório."),

    valorDespesa: yup
        .string()
        .required("O campo Valor Despesa é obrigatório."),

    tipoNota: yup
        .mixed()
        .nullable()
        .test("tipoNota", "tipo de nota é obrigatório", (v) => {
            return !!v && typeof v === "object" && !!v.value;
        }),
})