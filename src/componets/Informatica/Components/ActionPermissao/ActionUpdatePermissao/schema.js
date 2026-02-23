import * as yup from 'yup';

export const schema = yup.object().shape({

    permicaoAdministrador: yup
        .string()
        .required(' A resposta de permição é obrigatório')
        .matches(/^(sim|não)$/i, 'A resposta deve ser "Sim" ou "Não"'),

    permicaoCriar: yup
        .string()
        .required(' A resposta de permição é obrigatório')
        .matches(/^(sim|não)$/i, 'A resposta deve ser "Sim" ou "Não"'),

    permicaoAlterar: yup
        .string()
        .required(' A resposta de permição é obrigatório')
        .matches(/^(Sim|não)$/i, 'A resposta deve ser "Sim" ou "Não"'),

    permicaoN1: yup
        .string()
        .required(' A resposta de permição é obrigatório')
        .matches(/^(Sim|não)$/i, 'A resposta deve ser "Sim" ou "Não"'),

    permicaoN2: yup
        .string()
        .required(' A resposta de permição é obrigatório')
        .matches(/^(Sim|não)$/i, 'A resposta deve ser "Sim" ou "Não"'),

    permicaoN3: yup
        .string()
        .required(' A resposta de permição é obrigatório')
        .matches(/^(Sim|não)$/i, 'A resposta deve ser "Sim" ou "Não"'),

    permicaoN4: yup
        .string()
        .required(' A resposta de permição é obrigatório')
        .matches(/^(Sim|não)$/i, 'A resposta deve ser "Sim" ou "Não"'),

});