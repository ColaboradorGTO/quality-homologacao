import * as yup from 'yup';

export const schema = yup.object({

  descricaoCores: yup
    .string()
    .required('Descrição Obrigatória'),

  grupoCores: yup.object()
    .nullable()
    .required('Grupo Cores Obrigatório')
    .typeError('Grupo Cores Obrigatório'),

  situacaoCores: yup.object()
    .nullable()
    .required('Situação Cores Obrigatória')
    .typeError('Situação Cores Obrigatória'),
  
});
