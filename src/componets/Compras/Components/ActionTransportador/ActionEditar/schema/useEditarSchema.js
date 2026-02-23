import * as yup from "yup";
import { validarCNPJ } from "../../../../../../utils/mascaraCNPJ";
export const schema = yup.object({
    cnpjTransportador: yup.string()
    .required("CNPJ é obrigatório")
    .min(14, "CNPJ muito curto")
    .max(14, "CNPJ muito longo")
    .test("cnpj-valido", "CNPJ inválido", (value) => {
        if (!value) return false;
        return validarCNPJ(value);
    }),
    inscricaoEstadualTransportador: yup.string(),
    inscricaoMunicipalTransportador: yup.string(),
    razaoSocialTransportador: yup.string()
    .required("Razão Social é obrigatória")
    .test("razao-social-valida", "Razão Social deve conter apenas letras, números e espaços", (value) => {  
        if (!value) return false;
        return /^[A-Za-zÀ-ÿ0-9\s]+$/.test(value);
    }),
    nomeFantasiaTransportador: yup.string()
    .required("Nome Fantasia é obrigatório")
    .test("nome-fantasia-valido", "Nome Fantasia deve conter apenas letras, números e espaços", (value) => {
        if (!value) return false;
        return /^[A-Za-zÀ-ÿ0-9\s]+$/.test(value);
    }),
    cepTransportador: yup.string()
    .required("CEP é obrigatório")
    .min(8, "CEP muito curto")
    .max(8, "CEP muito longo"),
    enderecoTransportador: yup.string()
    .required("Endereço é obrigatório"),
    numeroTransportador: yup.string()
    .required("Número do Endereço é obrigatório"),
    complementoTransportador: yup.string(),
    bairroTransportador: yup.string()
    .required("Bairro é obrigatório"),
    cidadeTransportador: yup.string()
    .required("Cidade é obrigatória"),
    ufTransportador: yup.string()
    .required("UF é obrigatório"),
    numIbgeTransportador: yup.string()
    .required("Número IBGE é obrigatório"),
    // nomeRepresentanteTransportador: yup.string(),
    emailTransportador: yup.string(),
    telefoneTransportador1: yup.string(),
    telefoneTransportador2: yup.string(),
    // telefoneTransportador3: yup.string(),
})
