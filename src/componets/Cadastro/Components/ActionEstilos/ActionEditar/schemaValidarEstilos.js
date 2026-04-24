import * as yup from 'yup';

export const schema = yup.object({

  descricaoEstilo: yup
    .string()
    .required('Descrição Obrigatória'),
  
});
