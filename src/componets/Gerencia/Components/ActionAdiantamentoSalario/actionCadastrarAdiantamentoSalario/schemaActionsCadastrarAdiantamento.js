import * as yup from "yup";

const parseBRLToNumber = (value) => {
    if (value == null) return NaN;
    if (typeof value === "number") return value;

    const str = String(value).trim();
    if (!str) return NaN;

    const cleaned = str
        .replace(/R\$\s?/gi, "")
        .replace(/\./g, "")
        .replace(/,/g, ".")
        .replace(/\s/g, "");

    const n = Number(cleaned);
    return Number.isFinite(n) ? n : NaN;
};

export const schema = yup.object().shape({

    empresa: yup.string().nullable(),


    funcionarios: yup
        .string()
        .required("Funcionário é obrigatório")
        .test("not-empty", "Funcionário é obrigatório", (v) => !!v && String(v).trim() !== ""),

    dateLancamento: yup
        .string()
        .required("Data lançamento é obrigatória")

        .matches(/^\d{4}-\d{2}-\d{2}$/, "Data lançamento inválida (use YYYY-MM-DD)"),

    textMotivo: yup
        .string()
        .required("Descrição / motivo é obrigatório")
        .min(3, "Descrição / motivo muito curto")
        .max(500, "Descrição / motivo muito longo"),

    Desconto: yup
        .string()
        .required("Valor é obrigatório")
        .test("valor-valido", "Informe um valor válido", (v) => Number.isFinite(parseBRLToNumber(v)))
        .test("valor-maior-que-zero", "O valor deve ser maior que zero", (v) => {
            const n = parseBRLToNumber(v);
            return Number.isFinite(n) && n > 0;
        }),
});
