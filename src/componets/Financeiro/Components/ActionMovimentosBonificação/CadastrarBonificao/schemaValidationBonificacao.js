import * as yup from "yup";

export const schema = yup.object({

  valorBonificacaoFuncionario: yup
    .string()
    .required('Valor da bonificação é obrigatório'),
    // .number()
    // .transform((value) => {
    //   if (typeof value === 'string') {
    //     return value.replace(/\./g, '').replace(',', '.');
    //   }
    //   return value;
    // })
    // .typeError('Valor da bonificação deve ser um número')
  historicoBonificacaoFuncionario: yup.string()
    .required("Histórico da bonificação é obrigatório"),
});