import * as yup from 'yup';

export const schema = yup.object().shape({

  empresaFilial: yup
    .array()
    .of(
      yup.object({
        value: yup.mixed().required(),
        label: yup.string(),
      })
    )
    .min(1, 'Empresa obrigatória')
    .required('Empresa obrigatória')
    .typeError('Empresa obrigatória'),



  relatorio: yup
    .array()
    .of(
      yup.object({
        value: yup.mixed().required(),
        label: yup.string(),
      })
    )
    .min(1, 'Relatório obrigatório')
    .required('Relatório obrigatório')
    .typeError('Relatório obrigatório'),


  status: yup
    .string()
    .required('Status Obrigatório'),

  link: yup
    .string()
    .required('Link Obrigatório'),

});
