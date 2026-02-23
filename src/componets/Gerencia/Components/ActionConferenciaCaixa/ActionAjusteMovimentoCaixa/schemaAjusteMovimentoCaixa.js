import * as yup from "yup";

const moneyToNumber = (value, originalValue) => {
  if (originalValue === null || originalValue === undefined) return undefined;
  if (typeof originalValue === "number") return originalValue;

  const s = String(originalValue).trim();
  if (!s) return undefined;

  const normalized = s
    .replace(/[R$\s]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const n = Number(normalized);
  return Number.isNaN(n) ? undefined : n;
};

export const schema = yup.object().shape({
  empresa: yup
    .string()
    .nullable()
    .optional(),

  operadorCaixa: yup
    .string()
    .nullable()
    .optional(),

  motivoAjusteSelecionado: yup
    .string()
    .trim()
    .required("Motivo do ajuste é obrigatório")
    .min(3, "Informe pelo menos 3 caracteres"),

  dataLancamento: yup
    .string()
    .required("Data lançamento é obrigatória")
    .test("is-valid-date", "Data lançamento inválida", (value) => {
      if (!value) return false;
      const d = new Date(value);
      return !Number.isNaN(d.getTime());
    }),

  dinheiroInformado: yup
    .number()
    .transform(moneyToNumber)
    .typeError("Dinheiro informado deve ser um número válido")
    .min(0, "Dinheiro informado não pode ser negativo"),

  dinheiroAjuste: yup
    .number()
    .transform(moneyToNumber)
    .typeError("Dinheiro ajuste deve ser um número válido")
    .required("Dinheiro ajuste é obrigatório"),

  faturaInformada: yup
    .number()
    .transform(moneyToNumber)
    .typeError("Fatura informada deve ser um número válido")
    .min(0, "Fatura informada não pode ser negativa"),

  faturaAjuste: yup
    .number()
    .transform(moneyToNumber)
    .typeError("Fatura ajuste deve ser um número válido")
});
