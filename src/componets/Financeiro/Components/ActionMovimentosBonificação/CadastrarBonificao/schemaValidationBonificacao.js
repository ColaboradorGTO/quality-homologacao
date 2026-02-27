import * as yup from "yup";

export const schema = yup.object({

  nomeFuncionario: yup.string()
    .required("Nome é obrigatório")
    .transform((value) => value?.trim())
    .min(3, "Nome muito curto")
    .test("nome-valido", "Nome deve conter apenas letras e espaços", (value) => {
      if (!value) return false;
      return /^[A-Za-zÀ-ÿ\s]+$/.test(value.trim());
    }),
  valorBonificacaoFuncionario: yup
    .number()
    .transform((value) => {
      if (typeof value === 'string') {
        return value.replace(/\./g, '').replace(',', '.');
      }
      return value;
    })
    .typeError('Valor da bonificação deve ser um número')
    .required('Valor da bonificação é obrigatório'),
  historicoBonificacaoFuncionario: yup.string()
    .required("Histórico da bonificação é obrigatório"),
});