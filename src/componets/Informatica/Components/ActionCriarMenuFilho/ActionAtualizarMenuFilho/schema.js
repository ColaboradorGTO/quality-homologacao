import * as yup from "yup"

export const schema = yup.object().shape({


    nomeMenuDigitado: yup
        .string()
        .required('Nome do Menu Obrigatorio'),

    moduloPaiSelecionado: yup
        .object({
            value: yup.string().required(),
            label: yup.string().required()
        })
        .test(
            'modulo-pai-valido',
            'Modulo Pai Obrigatorio',
            (value) => {
                return value && value.value && value.label !== 'Selecione...';
            }
        )
        .required('Modulo Obrigatorio'),

    urlDigitada: yup
        .string()
        .required('Url do Menu Obrigatorio'),

})