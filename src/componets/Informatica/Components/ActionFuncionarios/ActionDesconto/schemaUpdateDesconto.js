import * as yup from "yup";

export const schema = yup.object().shape({
    descontoAutorizado: yup
        .number()
        .transform((value) => {
            if (typeof value === 'string') {
                // Remove pontos (milhares) e troca vírgula por ponto
                return Number(value.replace(/\./g, '').replace(',', '.'));
            }
            return Number(value);
        })
        .typeError('Desconto é obrigatorio')
        .min(0, 'Desconto não pode ser negativo')
        //.max(50, 'Desconto não pode ser maior que 50%')
        .required('Desconto é obrigatório'),

    motivoDescontoFuncionario: yup
        .string()
        .required('Desconto Obrigatório'),

    dataInicioDesconto: yup
        .string()
        .required('Data inicio obrigatória'),

    dataFimDesconto: yup
        .string()
        .required('Data fim obrigatória'),
})
