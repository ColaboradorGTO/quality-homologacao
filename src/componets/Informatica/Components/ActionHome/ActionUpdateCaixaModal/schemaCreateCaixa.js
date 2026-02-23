import * as yup from 'yup';

export const schema = yup.object().shape({

  nomeCaixa: yup
    .string()
    .required(' Nome Caixa Obrigatório'),

  tipoDeEmissao: yup
    .string()
    .required('Tipo de Emissao obrigatório'),

  modeloDeImpressora: yup
    .string()
    .required('Modelo de Impressora obrigatório'),

  portaDeComunicacao: yup
    .string()
    .required('Porta de Comunicacao Obrigatória'),

  numeroDeSerieProducao: yup
    .string()
    .matches(/^(?!0+$)\d+$/, "Digite apenas números maiores que 0")
    .required('numero de serie Obrigatório'),

  numeroDeUltimaNFCeProducao: yup
    .string()
    .matches(/^(?!0+$)\d+$/, "Digite apenas números maiores que 0")
    .required('numero de ultima NFCE Obrigatório'),

  tefSchema: yup
    .string()
    .required('Tef obrigatório'),

  statusAtualizarSchema: yup
    .string()
    .required('status atualizar obrigatório'),

  statusLimparSchema: yup
    .string()
    .required('status limpar obrigatório')


});
