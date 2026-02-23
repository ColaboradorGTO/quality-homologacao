import * as yup from 'yup';

export const schema = yup.object().shape({

  relatorio: yup
    .string()
    .required('relatorio Obrigatório'),

  status: yup
    .string()
    .required('Status Obrigatório'),

  link: yup
    .string()
    .required('Link Obrigatório'),

});
