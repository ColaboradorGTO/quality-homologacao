import * as yup from "yup";

export const schema = yup.object({
    codigoAutorizacao: yup.string().required('Código Autorização é obrigatório'),
    codigoPIX: yup.string(),
    vrFatura: yup.string()
    .transform((value) => {
        if(typeof value === 'string') {
            return value.replace(/\./g, '').replace(',', '.');
        }
        return value;
    })
    .typeError('Valor da Fatura inválido')
    .required('Valor da Fatura é obrigatório'),
});