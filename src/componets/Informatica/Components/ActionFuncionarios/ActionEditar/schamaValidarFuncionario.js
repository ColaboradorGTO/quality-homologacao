import * as yup from 'yup';

export const schema = yup.object({

  empresaFuncionario: yup
  .object()
  .nullable()
  .required('Empresa é obrigatória')
  .typeError('Empresa é obrigatória'),

  funcaoFuncionario: yup.object()
    .nullable()
    .required('Função Obrigatória')
    .typeError('Função Obrigatória'),

  tipoFuncionario: yup.object()
    .nullable()
    .required('Tipo Obrigatório')
    .typeError('Tipo Obrigatório'),
     

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

  localizacaoFuncionario: yup.object()
    .nullable()
    .required('Localização Obrigatória')
    .typeError('Localização Obrigatória'),

  salarioFuncionario: yup
    .number()
    .transform((value) => {
        if(typeof value === 'string') {
            return value.replace(/\./g, '').replace(',', '.');
        }
        return value;
    })
    .typeError('Salário deve ser um número')
    .required('Salário Obrigatório'),

  valorDescontoFuncionario: yup
    .number()
    .typeError('Valor de desconto deve ser um número')
    .nullable(),

  execaoDescFuncionario: yup
    .string()
    .nullable(),

  situacaoFuncionario: yup.object()
    .nullable()
    .required('Situação Obrigatória')
    .typeError('Situação Obrigatória'),


  telefoneFuncionario: yup.string()
    .transform((value) => {
        if (typeof value === 'string') {
            return value.replace(/\D/g, ''); // Remove espaços e caracteres especiais
        }
        return value;
    })
    .required('Telefone Obrigatório')
    .matches(/^\d{10,11}$/, 'Telefone deve conter 10 ou 11 números'),
  
  
  departamentoFuncionario: yup.object()
    .nullable()
    .required('Departamento Obrigatório')
    .typeError('Departamento Obrigatório'),
});
