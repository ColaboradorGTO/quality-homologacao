import * as yup from 'yup';

export const schema = yup.object({

  descricaoUnidadeMedida: yup
    .string()
    .required('Descrição Obrigatória'),

  siglaUnidadeMedida: yup
    .string()
    .required('Sigla Obrigatória')
    .test(
      'max-length-without-spaces',
      'Sigla deve ter no máximo 5 caracteres (sem contar espaços)',
      function (value) {
        if (!value) return true; 
        const valueSemEspacos = value.replace(/\s/g, '');
        return valueSemEspacos.length <= 5;
      }
    ),

  situacaoUnidadeMedida: yup.object()
    .nullable()
    .required('Situação Unidade de Medida Obrigatória')
    .typeError('Situação Unidade de Medida Obrigatória'),

});
