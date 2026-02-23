import * as yup from 'yup';

export const schema = yup.object({

  empresaFuncionario: yup
  .object()
  .nullable()
  .required('Empresa é obrigatória')
  .typeError('Empresa é obrigatória'),

});
