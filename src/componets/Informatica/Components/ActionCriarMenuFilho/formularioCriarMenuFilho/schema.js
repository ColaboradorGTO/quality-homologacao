import * as yup from "yup"

export const schema = yup.object().shape({

    moduloEscolhido: yup
        .object({
            value: yup.string().required(),
            label: yup.string().required()
        })
        .required('Modulo Obrigatorio'),

    nomeMenuEscolhido: yup
        .string()
        .required('Nome do Menu Obrigatorio'),

    urlMenuFilho: yup
        .string()
        .required('Url do Menu Obrigatorio'),

})