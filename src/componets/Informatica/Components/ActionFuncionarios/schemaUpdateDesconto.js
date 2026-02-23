import yup from 'yup';

export const schema = yup.object().shape({

    motivoDescontoFuncionario: yup
    .string()
    .required('Desconto Obrigatório'),

    descontoAutorizado: yup
        .number()
        .typeError('Desconto é obrigatorio')
        .nullable(),

    
    dataIncio: yup
        .date()
        .required('Data inicio obrigatória'),

    dataFim: yup
        .date()
        .required('Data fim obrigatória'),

})