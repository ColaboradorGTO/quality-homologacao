import * as yup from 'yup';

export const schema = yup.object({

  descricaoGrupo: yup
    .string()
    .required('Descrição Obrigatória'),

  situacaoGrupo: yup.object()
    .nullable()
    .required('Situação Grupo Obrigatória')
    .typeError('Situação Grupo Obrigatória'),

});
