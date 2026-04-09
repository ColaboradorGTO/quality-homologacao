import * as yup from 'yup';

export const schema = yup.object({

  descricaoCores: yup
    .string()
    .required('Descrição Obrigatória'),

  grupoCores: yup.object()
    .nullable()
    .required('Grupo Cores Obrigatório')
    .typeError('Grupo Cores Obrigatório'),

  situacao: yup.object()
    .nullable()
    .required('Situação Obrigatória')
    .typeError('Situação Obrigatória'),
  
});
