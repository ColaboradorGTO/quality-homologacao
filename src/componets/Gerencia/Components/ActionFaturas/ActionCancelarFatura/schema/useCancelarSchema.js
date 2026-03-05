import * as yup from "yup";
export const schema = yup.object({
    motivoCancelamento: yup.string().required("O campo Motivo de Cancelamento é obrigatório."),

})