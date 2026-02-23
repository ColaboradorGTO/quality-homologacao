import * as yup from "yup";

export const schema = yup.object().shape({
    contaSelecionada: yup
        .mixed()
        .nullable()
        .test("contaSelecionada", "Conta do banco é obrigatório", (v) => {
            return !!v && typeof v === "object" && !!v.value;
        }),

    historicoDigitado: yup
        .string()
        .required("Histórico obrigatório"),

    numeroDocumentoDeposito: yup
        .string()
        .required("N° Doc Depósito obrigatório"),

    valorDepositoDigitado: yup
        .number()
        .transform((value, originalValue) => {
            if (originalValue === "" || originalValue === null || originalValue === undefined) {
                return undefined;
            }
            const parsed = Number(originalValue);
            return isNaN(parsed) ? undefined : parsed;
        })
        .typeError("Valor Depósito deve ser número")
        .required("Valor Depósito obrigatório")
        .moreThan(0, "Valor Depósito deve ser maior que 0"),

    dataMovimentoSelecionado: yup
        .string()
        .required("Data movimento de caixa obrigatório"),

    horaMovimentoSelecionado: yup
        .string()
        .required("Hora movimento de caixa obrigatório"),
});
