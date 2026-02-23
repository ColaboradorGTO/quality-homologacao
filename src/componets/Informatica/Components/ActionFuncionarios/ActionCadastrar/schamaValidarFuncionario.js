import * as yup from 'yup';

export const schema = yup.object().shape({

  empresaFuncionario: yup
    .object({
      value: yup.string().required('Empresa Obrigatória'),
      label: yup.string(),
    }),

  funcaoFuncionario: yup
    .object({
      value: yup.string().required('Função Obrigatória'),
      label: yup.string(),
    }),

  tipoFuncionario: yup
    .object({
      value: yup.string().required('Tipo Obrigatório'),
      label: yup.string(),
    }),

  dataAdmissaoFuncionario: yup
    .date()
    .required('Data de Admissão Obrigatória'),

  nome: yup
    .string()
    .required('Nome Obrigatório')
    .test(
      'nome-valido',
      'Nome deve conter apenas letras e espaços, favor preencher e tentar novamente!',
      (value) => {
        if (!value) return false;
        return /^[A-Za-zÀ-ÿ\s]+$/.test(value);
      }
    ),

  localizacaoFuncionario: yup
    .object({
      value: yup.string().required('Localização Obrigatória'),
      label: yup.string(),
    }),

  salarioFuncionario: yup
    .number()
    .typeError('Salário deve ser um número')
    .required('Salário Obrigatório'),

  valorDescontoFuncionario: yup
    .number()
    .typeError('Valor de desconto deve ser um número')
    .nullable(),

  execaoDescFuncionario: yup
    .string()
    .nullable(),

  situacaoFuncionario: yup
    .object({
      value: yup.string().required('Situação Obrigatória'),
      label: yup.string(),
    }),

    cpf: yup
    .string()
    .required('CPF Obrigatório')
    .matches(/^\d{11}$/, 'CPF deve conter exatamente 11 números'),

});
