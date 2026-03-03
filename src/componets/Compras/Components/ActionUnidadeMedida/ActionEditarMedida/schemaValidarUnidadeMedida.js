import * as yup from 'yup';

export const schema = yup.object({

  descricaoUnidadeMedida: yup
    .string()
    .required('Descrição Obrigatória'),

  siglaUnidadeMedida: yup
    .string()
    .required('Sigla Obrigatória'),

  situacaoUnidadeMedida: yup.object()
    .nullable()
    .required('Situação Unidade de Medida Obrigatória')
    .typeError('Situação Unidade de Medida Obrigatória'),

});
