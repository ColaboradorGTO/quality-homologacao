import * as yup from "yup";


/**
 * Validação de schema para formulário de pagamento
 * 
 * Define as regras de validação para os campos de pagamento:
 * - vrDinheiro: Valor em dinheiro que aceita formato brasileiro (com virgula e ponto)
 *   e o transforma em número decimal padrão. Exibe erro se formato inválido.
 * 
 * - vrPix: Valor em Pix que aceita formato brasileiro (com virgula e ponto)
 *   e o transforma em número decimal padrão. Exibe erro se formato inválido.
 * 
 * - chavePix: Chave Pix que é validada condicionalmente:
 *   Se vrPix > 0, o campo é obrigatório com mensagem de erro específica.
 *   Caso contrário, o campo não é obrigatório.
 * 
 * @type {yup.ObjectSchema}
 * @example
 * const dados = await schema.validate({ vrDinheiro: '100,50', vrPix: '50,00', chavePix: 'chave@pix' })
 */
export const schema = yup.object({
  vrDinheiro: yup.string()
    .transform((value) => {
        if(typeof value === 'string') {
            return value.replace(/\./g, '').replace(',', '.');
        }
        return value;
    })
    .typeError('Valor em Dinheiro inválido'),
    // .required('Valor em Dinheiro é obrigatório'),
    
   vrPix: yup.string()
    .transform((value) => {
        if(typeof value === 'string') {
            return value.replace(/\./g, '').replace(',', '.');
        }
        return value;
    })
    .typeError('Valor em Pix inválido'),
    chavePix: yup.string()
    .when('vrPix', {
        is: (vrPix) => parseFloat(vrPix) > 0,
        then: (schema) => schema.required('Chave Pix é obrigatória quando há valor em Pix'),
        otherwise: (schema) => schema.notRequired(),
    }),
    numeroOperacao: yup.string(),
    nAutorizacao: yup.string(),
    valorCartao: yup.string()
        .transform((value) => {
            if(typeof value === 'string') {
                return value.replace(/\./g, '').replace(',', '.');
            }
        return value;
    })
    .typeError('Valor em Cartão inválido'),
    nParcelas: yup.string(),
    dataParcelaN1: yup.string(),
    numeroOperacao2: yup.string(),
    numeroAutorizacao2: yup.string(),
    valorCartao2: yup.string()
        .transform((value) => {
            if(typeof value === 'string') {
                return value.replace(/\./g, '').replace(',', '.');
            }
            return value;
        }
    )
    .typeError('Valor em Cartão 2 inválido'),
    nParcelas2: yup.string(),
    dataParcelaN2: yup.string(),
    numeroOperacao3: yup.string(),
    numeroAutorizacao3: yup.string(),
    valorCartao3: yup.string()
        .transform((value) => {
            if(typeof value === 'string') {
                return value.replace(/\./g, '').replace(',', '.');
            }
            return value;
        }
    )
    .typeError('Valor em Cartão 3 inválido'),
    nParcelas3: yup.string(),
    dataParcelaN3: yup.string(),
    numeroOperacaoPOS: yup.string(),
    numeroAutorizacaoPOS: yup.string(),
    valorPos: yup.string()
        .transform((value) => {
            if(typeof value === 'string') {
                return value.replace(/\./g, '').replace(',', '.');
            }
            return value;
        }
    )
    .typeError('Valor POS inválido'),
    nqtdParcelasPos1: yup.string(),
    dataParcelaPos1: yup.string(),
    numeroOperacaoPOS2: yup.string(),
    numeroAutorizacaoPOS2: yup.string(),
    valorPos2: yup.string()
        .transform((value) => {
            if(typeof value === 'string') {
                return value.replace(/\./g, '').replace(',', '.');
            }
            return value;
        }
    )
    .typeError('Valor POS 2 inválido'),
    nqtdParcelasPos2: yup.string(),
    datadaParcelaPos2: yup.string(),
    valorVoucher: yup.string()
        .transform((value) => {
            if(typeof value === 'string') {
                return value.replace(/\./g, '').replace(',', '.');
            }
            return value;
        }
    )
    .typeError('Valor do Voucher inválido'),
    numeroVoucher: yup.string(),
    motivo: yup.string(),
});