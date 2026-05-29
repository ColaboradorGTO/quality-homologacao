import * as yup from 'yup';

export const schema = yup.object({

  icmsSelecionado: yup
  .object()
  .nullable()
  .required('ICMS é obrigatório')
  .typeError('ICMS é obrigatório'),

});
