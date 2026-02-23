import * as yup from "yup";

const parseMoney = (value, originalValue) => {
  if (typeof originalValue === "number") return originalValue;

  const s = String(originalValue ?? "")
    .replace("R$", "")
    .trim()
    .replace(/\./g, "")
    .replace(",", ".");

  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
};

export const schema = yup.object().shape({
  empresaSelecionada: yup
    .string()
    .transform((v) => (v ?? "").trim())
    .required("Empresa é obrigatória"),

  numeroMovimentoCaixa: yup
    .string()
    .typeError("Nº Movimento do Caixa deve ser uma string")
    .required("Nº Movimento do Caixa é obrigatório"),

  codigoAutorizacaoDigitado: yup
    .string()
    .transform((v) => (v ?? "").trim())
    .required("Código de Autorização é obrigatório")
    .min(3, "Código de Autorização muito curto"),

  valorFaturaDigitado: yup
    .number()
    .transform(parseMoney)
    .typeError("Valor Fatura deve ser um número")
    .required("Valor Fatura é obrigatório")
    .moreThan(0, "Valor Fatura deve ser maior que zero"),
});
