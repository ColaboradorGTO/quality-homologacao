import * as yup from "yup";
export const schema = yup.object({
    // empresaDespesa: yup.string().required("O campo Empresa é obrigatório."),
    historicoDespesa: yup.string().required("O campo Histórico é obrigatório."),
    dsPagoDespesa: yup.string().required("O campo Histórico é obrigatório."),
    valorDespesa: yup.string().required("O campo Valor Despesa é obrigatório."),
})