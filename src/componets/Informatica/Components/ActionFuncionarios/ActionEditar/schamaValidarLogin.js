import * as yup from 'yup';

export const schemaLogin = yup.object({

  matriculaFuncionario: yup
    .string()
    .required('Matricula Obrigatório'),

  senhaFuncionario: yup
    .string()
    .required('Senha Obrigatório'),
});
