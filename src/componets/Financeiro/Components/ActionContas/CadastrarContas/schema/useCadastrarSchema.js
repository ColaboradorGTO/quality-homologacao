import * as yup from "yup";
export const schema = yup.object({

    nAgencia: yup.string().required("O campo número da agência é obrigatório."),
    // dAgencia: yup.string().required("O campo número do dígito da agência é obrigatório."),
    nConta: yup.string().required("O campo número da conta é obrigatório."),
    // dConta: yup.string().required("O campo número do dígito da conta é obrigatório."),
    nContaSap: yup.string().required("O campo número da conta SAP é obrigatório."),
    dsConta: yup.string().required("O campo descrição da conta é obrigatório."),
})