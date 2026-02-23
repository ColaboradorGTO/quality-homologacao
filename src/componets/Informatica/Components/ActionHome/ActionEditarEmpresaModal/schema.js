import * as yup from "yup"

export const schema = yup.object().shape({
    atualizarLoja: yup
        .string()
        .required("Atualizar Status Loja Obrigatório"),

    atualizarPDVs: yup
        .string()
        .required("Atualizar PDVs Diario Obrigatório"),

        horarioAtualizacao: yup
        .string()
        .required("Horario Obrigatório"),

})