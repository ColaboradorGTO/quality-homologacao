import * as yup from "yup";

export const schema = yup.object({
    historico: yup.string().required('Histórico é obrigatório'),
    pagoA: yup.string().required('Pago A é obrigatório'),
    valorDespesa: yup.string()
    .transform((value) => {
        if(typeof value === 'string') {
            return value.replace(/\./g, '').replace(',', '.');
        }
        return value;
    })
    .typeError('Valor em Dinheiro inválido')
    .required('Valor da Despesa é obrigatório'),
});