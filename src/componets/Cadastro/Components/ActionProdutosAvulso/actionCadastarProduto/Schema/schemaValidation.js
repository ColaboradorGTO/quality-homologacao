import * as yup from 'yup';

export const schema = yup.object({

  descricaoProduto: yup
    .string()
    .required('Descrição Obrigatória')
    .max(50, 'A descrição do Produto não pode mais do que 50 caracteres')
    .test('no-special-chars', 'A descrição do produto não pode conter caracteres especiais utilizados em operações aritméticas, sinais como: (- + * % ^ ~ ! / @ # $ & () _ = < > ?). Verifique a descrição dos itens e tente novamente!', 
      value => !value || !/[-+*%^~!@#$&()_=<>?]/.test(value)
    ),
    

  fornecedorProduto: yup.object()
    .nullable()
    .required('Selecione um Fornecedor')
    .typeError('Fornecedor Obrigatório'),
  
  tamanhoProduto: yup.object()
    .nullable()
    .required('Selecione um Tamanho')
    .typeError('Tamanho Obrigatório'),

  fabricanteProduto: yup.object()
    .nullable()
    .required('Selecione um Fabricante')
    .typeError('Fabricante Obrigatório'),
  
  unidadeProduto: yup.object()
    .nullable()
    .required('Selecione uma Unidade')
    .typeError('Unidade Obrigatória'),

  corProduto: yup.object()
    .nullable()
    .required('Selecione uma Cor')
    .typeError('Cor Obrigatória'),
  
  tecidoProduto: yup.object()
    .nullable()
    .required('Selecione um Tipo de Tecido')
    .typeError('Tipo de Tecido Obrigatório'),
  
  estruturaProduto: yup.object()
    .nullable()
    .required('Selecione uma Estrutura')
    .typeError('Estrutura Obrigatória'),

  estiloProduto: yup.object()
    .nullable()
    .required('Selecione um Estilo')
    .typeError('Estilo Obrigatório'),

  categoriaProduto: yup.object()
    .nullable()
    .required('Selecione uma Categoria')
    .typeError('Categoria Obrigatória'),
  
  vrCustoProduto: yup
    .string()
    .required('Informe o Valor de Custo'),
  
  vrVendaProduto: yup
    .string()
    .required('Informe o Valor de Venda'),

  ncmProduto: yup.object()
    .nullable()
    .required('Selecione um NCM')
    .typeError('NCM Obrigatório'),

  tipoProduto: yup.object()
    .nullable()
    .required('Selecione um Tipo Produto')
    .typeError('Tipo Produto Obrigatório'),
    
  tipoFiscalProduto: yup.object()
    .nullable()
    .required('Selecione um Tipo Fiscal')
    .typeError('Tipo Fiscal Obrigatório'),

  barraProduto: yup
    .string()
    .required('Dê o Prévia para informar o Produto'),

});
