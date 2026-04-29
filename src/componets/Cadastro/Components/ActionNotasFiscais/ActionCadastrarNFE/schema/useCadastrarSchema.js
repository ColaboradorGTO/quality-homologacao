import * as yup from "yup";
export const schema = yup.object({
    cnpjFilialPedido: yup.string()
        .required("O campo CNPJ é obrigatório."),
        
    condicaoPagamentoPedido: yup.object()
    .nullable()
    .required('Condição de Pagamento é obrigatória')
    .typeError('Condição de Pagamento é obrigatória'),
  

});  