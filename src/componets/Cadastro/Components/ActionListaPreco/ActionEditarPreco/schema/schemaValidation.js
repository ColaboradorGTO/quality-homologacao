import * as yup from 'yup';

export const schema = yup.object({

  nomeListaPreco: yup
    .string()
    .required('Nome Lista Preço Obrigatório'),

  grupoCores: yup.object()
    .nullable()
    .required('Grupo Cores Obrigatório')
    .typeError('Grupo Cores Obrigatório'),

  situacao: yup.object()
    .nullable()
    .required('Situação Obrigatória')
    .typeError('Situação Obrigatória'),
  
});
