import * as yup from 'yup';

export const schema = yup.object({

  descricaoEstilo: yup
    .string()
    .required('Descrição Obrigatória'),

  subGrupoEstilo: yup.object()
    .nullable()
    .required('Grupo Estrutura Obrigatório')
    .typeError('Grupo Estrutura Obrigatório'),

  situacaoEstilo: yup.object()
    .nullable()
    .required('Situação Obrigatória')
    .typeError('Situação Obrigatória'),
  
});
