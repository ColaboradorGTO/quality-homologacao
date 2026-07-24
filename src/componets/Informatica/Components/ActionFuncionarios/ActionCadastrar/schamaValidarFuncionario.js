import * as yup from 'yup';

export const schema = yup.object().shape({

  empresaFuncionario: yup
    .string()
    .required('Empresa Obrigatória'),

  funcaoFuncionario: yup
    .string()
    .required('Função Obrigatória'),

  tipoFuncionario: yup
    .string()
    .required('Tipo Obrigatório'),

  dataAdmissaoFuncionario: yup
    .string()
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
    .string()
    .required('Localização Obrigatória'),

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

  cpf: yup
    .string()
    .required('CPF Obrigatório')
    .matches(/^\d{11}$/, 'CPF deve conter exatamente 11 números'),

  situacaoFuncionario: yup
    .string()
    .required('Situação Obrigatória'),


  telefoneFuncionario: yup
    .string()
    .required('Telefone Obrigatório')
    .matches(/^\d{10,11}$/, 'Telefone deve conter 10 ou 11 números'),

  departamentoFuncionario: yup
    .string()
    .required('Departamento Obrigatório'),

});
