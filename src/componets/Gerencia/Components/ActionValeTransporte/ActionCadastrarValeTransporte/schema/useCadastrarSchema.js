import * as yup from "yup";
export const schema = yup.object().shape({
    funcionarioSelecionado: yup
        .mixed()
        .nullable()
        .test("funcionarioSelecionado", "funcionario é obrigatório", (v) => {
            return !!v && typeof v === "object" && !!v.value;
        }),

    historico: yup
        .string()
        .required("O campo Histórico é obrigatório."),
    valorDespesa: yup
        .number()
        .typeError("O campo Valor Despesa deve ser um número.")
        .required("O campo Valor Despesa é obrigatório.")
        .moreThan(0, "O campo Valor Despesa deve ser maior que 0."),

    //funcionario: yup.object().required("O campo Funcionário é obrigatório."),
})