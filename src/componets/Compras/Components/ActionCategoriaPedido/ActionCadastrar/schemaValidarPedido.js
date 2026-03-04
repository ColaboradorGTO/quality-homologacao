import * as yup from 'yup';

export const schema = yup.object({

  descricao: yup
    .string()
    .required('Descrição Obrigatória'),

  tipoCategoria: yup.object()
    .nullable()
    .required('Tipo Categoria Obrigatória')
    .typeError('Tipo Categoria Obrigatória'),
  
  situacaoPedido: yup.object()
    .nullable()
    .required('Situação Pedido Obrigatória')
    .typeError('Situação Pedido Obrigatória'),

});
