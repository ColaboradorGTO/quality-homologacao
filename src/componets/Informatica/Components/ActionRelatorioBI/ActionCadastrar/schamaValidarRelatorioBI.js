import * as yup from 'yup';

export const schema = yup.object().shape({

  descricaoRelatorio: yup
    .string()
    .required('Descrição obrigatoria'),

  statusRelatorio: yup
    .string()
    .required('Status Obrigatorio'),

});
