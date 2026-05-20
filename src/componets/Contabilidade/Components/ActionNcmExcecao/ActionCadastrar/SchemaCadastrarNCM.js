import * as yup from 'yup';

export const schema = yup.object().shape({

  numNcmExcecao: yup
    .number()
    .required('Numero de NCM Obrigatório')
    .typeError('Numero de NCM Obrigatório'),

   ex: yup
     .string()
     .max(2, "EX deve ter no máximo 2 caracteres"),

  tipo: yup
    .number()
    .required('Tipo Obrigatório')
    .typeError('Tipo Obrigatório'),

  dscNcmExcecao: yup.string(),

  impNacional: yup
    .number()
    .required('Imposto Nacional Obrigatório')
    .typeError('Imposto Nacional Obrigatório'),

  ImpImportacaoFederal: yup
    .number()
    .required('Imposto Importação Federal Obrigatório')
    .typeError('Imposto Importação Federal Obrigatório'),

  ImpEstadual: yup
    .number()
    .required('Imposto estadual Obrigatório')
    .typeError('Imposto estadual Obrigatório'),

  impMunicipal: yup
    .number()
    .required('Imposto Municipal Obrigatório')
    .typeError('Imposto Municipal Obrigatório'),

  InicioVigencia: yup
    .string()
    .required('Data de Início de Vigência Obrigatória'),

  FimVigencia: yup
    .string()
    .required('Data de Fim de Vigência Obrigatória'),

  chave: yup
    .string()
    .required('Chave Obrigatória')
    .typeError('Chave Obrigatória'),

  numVersao: yup
    .string()
    .required('Versão Obrigatória')
    .typeError('Versão Obrigatória'),

  fonte: yup
    .string()
    .required('Fonte Obrigatória')
    .typeError('Fonte Obrigatória'),

  uf: yup
    .object({
      value: yup.string().required('UF Obrigatória').typeError('UF Obrigatório'),
      label: yup.string(),
    })
    .required('UF é obrigatória')
    .typeError('UF é obrigatória'),

  PERCIBPT: yup
    .number()
    .required('PERCIBPT Obrigatória')
    .typeError('PERCIBPT Obrigatória'),

});
