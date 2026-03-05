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
    .string()
    .required('Número de Parcelas Obrigatório'),

  dia1Pagamento: yup
    .string()
    .required('Dia 1 Pagamento Obrigatório'),

  qtdDiaPagamento: yup
    .string()
    .required('QTD Dias Pagamento Obrigatório'),

  tipoDocumento: yup.object()
    .nullable()
    .required('Tipo Documento Obrigatório')
    .typeError('Tipo Documento Obrigatório'),
  
  situacaoPagamento: yup.object()
    .nullable()
    .required('Situação Pagamento Obrigatória')
    .typeError('Situação Pagamento Obrigatória'),

});
