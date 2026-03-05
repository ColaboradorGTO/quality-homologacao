import * as yup from 'yup';

export const schema = yup.object({

  descricaoPagamento: yup
    .string()
    .required('Descrição Obrigatória'),
 
  parcelaPagamento: yup.object()
    .nullable()
    .required('Parcelado Obrigatório')
    .typeError('Parcelado Obrigatório'),

  numeroParcelasPagamento: yup
    .number()
    .transform((value, originalValue) => {
      // Se for string vazia ou apenas espaços, retorna undefined para o required pegar
      if (typeof originalValue === 'string' && originalValue.trim() === '') {
        return undefined;
      }
      return value;
    })
    .typeError('Atenção! Informe apenas números válidos')
    .required('Número de Parcelas Obrigatório')
    .min(0, 'Número de Parcelas deve ser no mínimo 0')
    .max(99, 'Número de Parcelas deve ser no máximo 99'),

  dia1Pagamento: yup
    .number()
    .transform((value, originalValue) => {
      // Se for string vazia ou apenas espaços, retorna undefined para o required pegar
      if (typeof originalValue === 'string' && originalValue.trim() === '') {
        return undefined;
      }
      return value;
    })
    .typeError('Atenção! Informe apenas números válidos')
    .required('Dia 1 Pagamento Obrigatório')
    .min(0, 'Dia 1 Pagamento deve ser no mínimo 0')
    .max(999, 'Dia 1 Pagamento deve ser no máximo 999'),

  qtdDiaPagamento: yup
    .number()
    .transform((value, originalValue) => {
      // Se for string vazia ou apenas espaços, retorna undefined para o required pegar
      if (typeof originalValue === 'string' && originalValue.trim() === '') {
        return undefined;
      }
      return value;
    })
    .typeError('Atenção! Informe apenas números válidos')
    .required('QTD Dias Pagamento Obrigatório')
    .min(0, 'QTD Dias Pagamento deve ser no mínimo 0')
    .max(999, 'QTD Dias Pagamento deve ser no máximo 999'),

  tipoDocumento: yup.object()
    .nullable()
    .required('Tipo Documento Obrigatório')
    .typeError('Tipo Documento Obrigatório'),
  
  situacaoPagamento: yup.object()
    .nullable()
    .required('Situação Pagamento Obrigatória')
    .typeError('Situação Pagamento Obrigatória'),

});
