import * as yup from 'yup';

export const schema = yup.object({

  descricaoSubGrupo: yup
    .string()
    .required('Descrição Obrigatória'),

  subGrupo: yup
    .object()
    .nullable()
    .required('SubGrupo Obrigatório')
    .typeError('SubGrupo Obrigatório'),


  situacaoSubGrupo: yup.object()
    .nullable()
    .required('Situação SubGrupo Obrigatória')
    .typeError('Situação SubGrupo Obrigatória'),

});
