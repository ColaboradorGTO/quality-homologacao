import * as yup from 'yup';

export const schema = yup.object({
  marcaGrupoProduto: yup.object()
    .nullable()
    .required('Selecione uma Marca')
    .typeError('Marca Obrigatória'),

  descProduto: yup
    .string()
    .required('Descrição Obrigatória')
    .max(50, 'A descrição do Produto não pode mais do que 50 caracteres')
    .test('no-special-chars', 'A descrição do produto não pode conter caracteres especiais utilizados em operações aritméticas, sinais como: (- + * % ^ ~ ! / @ # $ & () _ = < > ?). Verifique a descrição dos itens e tente novamente!', 
      value => !value || !/[-+*%^~!@#$&()_=<>?]/.test(value)
    ),
  refProduto: yup
    .string()
    .required('Referência Obrigatória')
    .max(50, 'A referência do Produto não pode mais do que 50 caracteres')
    .test('no-special-chars', 'A referência do produto não pode conter caracteres especiais utilizados em operações aritméticas, sinais como: (- + * % ^ ~ ! / @ # $ & () _ = < > ?). Verifique a referência dos itens e tente novamente!', 
      value => !value || !/[-+*%^~!@#$&()_=<>?]/.test(value)
    ),

  fornecedorProduto: yup.object()
    .nullable()
    .required('Selecione um Fornecedor')
    .typeError('Fornecedor Obrigatório'),
  
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

  tipoTecidoProduto: yup.object()
    .nullable()
    .required('Selecione um Tipo de Tecido')
    .typeError('Tipo de Tecido Obrigatório'),
  categoriaGradeProduto: yup.object()
    .nullable()
    .required('Selecione uma Categoria Grade')
    .typeError('Categoria Grade Obrigatória'),

  tamanhoProduto: yup.object()
    .nullable()
    .required('Selecione um Tamanho')
    .typeError('Tamanho Obrigatório'),

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

  tamanhoProduto: yup.object()
    .nullable()
    .required('Selecione um Tamanho')
    .typeError('Tamanho Obrigatório'),
  
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

  localExposicaoProduto: yup.object()
    .nullable()
    .required('Selecione um Local de Exposição')
    .typeError('Local de Exposição Obrigatório'),

  ecommerceProduto: yup.object()
    .nullable()
    .required('Selecione um E-commerce')
    .typeError('E-commerce Obrigatório'),

  redeSocialProduto: yup.object()
    .nullable()
    .required('Selecione um Rede Social')
    .typeError('Rede Social Obrigatório'),
  
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

  vrCustoProduto: yup
    .string()
    .required('Informe o Valor de Custo'),
  
  vrVendaProduto: yup
    .string()
    .required('Informe o Valor de Venda'),

});
