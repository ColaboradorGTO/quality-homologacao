import { useState } from "react";
import { post, postFile } from "../../../../../api/funcRequest";
import Swal from "sweetalert2";
import { registrarLogAuditoria } from "../../../../../services/auditLog";

export const optionsFormaPagamento = [
    {value: '', label: 'Seleicone'},
    { value: 'PIX', label: 'PIX' },
    { value: 'TED', label: 'TED' },
    { value: 'DINHEIRO', label: 'Dinheiro' },
    { value: 'CARTAO', label: 'Cartão' },
    { value: 'BOLETO', label: 'Boleto' },
]

export const optionsStatus = [
    {value: 'PAGO', label: 'PAGO'},
    {value: 'REPROVADO', label: 'REPROVADO'}
]
export const useAnexarPagamento = ({
    dadosDetalheAdiantamento,
    optionsModulos,
    usuarioLogado,
    handleClick,
    
}) => {
    const [anexoComprovante, setAnexoComprovante] = useState('')
    const [anexoNotaFiscal, setAnexoNotaFiscal] = useState('')

    const tiposArquivoPermitidos = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    async function uploadAnexoAdiantamento(arquivo) {
        if (!arquivo) return '';

        if (!tiposArquivoPermitidos.includes(arquivo.type)) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Arquivo inválido. Envie apenas PDF ou imagem (JPEG, PNG, WEBP).',
                showConfirmButton: false,
                timer: 3000,
                customClass: { container: 'custom-swal' },
            });
            return '';
        }

        try {
            const formData = new FormData();
            formData.append('arquivo', arquivo);

            const response = await postFile('/upload-anexo-adiantamento', formData);
            return response?.data?.path || '';
        } catch (error) {
            console.error('Erro ao enviar anexo:', error);
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Não foi possível enviar o arquivo. Por favor, tente novamente.',
                showConfirmButton: false,
                timer: 3000,
                customClass: { container: 'custom-swal' },
            });
            return '';
        }
    }

    const handleUploadComprovante = async (e) => {
        const arquivo = e.target.files?.[0];
        const caminhoArquivo = await uploadAnexoAdiantamento(arquivo);
        setAnexoComprovante(caminhoArquivo);
    }

    const handleUploadNotaFiscal = async (e) => {
        const arquivo = e.target.files?.[0];
        const caminhoArquivo = await uploadAnexoAdiantamento(arquivo);
        setAnexoNotaFiscal(caminhoArquivo);
    }

    const handleAnexarComprovante = async () => {
        if (optionsModulos[0]?.CRIAR == 'False') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                html: `${usuarioLogado?.NOFUNCIONARIO} <br> Você não tem permissão para registrar um pagamento.`,
                showConfirmButton: true,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                },
            });
            return;
        }

        const postData = {
            IDADIANTAMENTO: dadosDetalheAdiantamento[0]?.IDADIANTAMENTO,
            STATUS: dadosDetalheAdiantamento[0]?.STATUS,
            DEPARTAMENTO: departamento,
            IDEMPRESA: empresaSelecionada?.value,
            NUCNPJEMPRESA: cnpj,
            CNPJFATURAMENTO: ehPJ ? removeMascaraCNPJ(cnpjFaturado) : '',
            RAZAOSOCIALFATURAMENTO: ehPJ ? razaoSocialFaturamento : '',
            VRSOLICITADO: removerFormatacaoMoeda(vrAdiantamento),
            DESCRICAO: descricao,
            POSSUINOTAFISCAL: possuiNota?.value,
            ANEXOORCAMENTO: anexoOrcamento,
            ANEXONOTAFISCAL: anexoNotaFiscal,
            DSJUSTIFICATIVA: proposta,
            IDUSUARIOALTERACAO: usuarioLogado?.id,
            RAZAOSOCIALEMPRESA: razaoSocial,
            TPBENEFICIARIO: dadosDetalheAdiantamento[0]?.TPBENEFICIARIO,
            NUCPFBENEFICIARIO: ehPF ? removerMascaraCPF(cpfBeneficiario) : '',
            NOBENEFICIARIO: ehPF ? nomeBeneficiario : '',
            NURGBENEFICIARIO: ehPF ? rgBeneficiario : '',
            EMAILBENEFICIARIO: ehPF ? emailBeneficiario : '',
            NUCEPBENEFICIARIO: ehPF ? cepBeneficiario.replace(/\D/g, '') : '',
            ENDERECOBENEFICIARIO: ehPF ? enderecoBeneficiario : '',
            TELEFONEBENEFICIARIO: ehPF ? removerMascaraTelefone(telefoneBeneficiario) : '',
            DTNASCIMENTOBENEFICIARIO: ehPF ? dtNascimentoBeneficiario : '',
            TPDESPESA: tipoDespesa?.value,
            NOFAVORECIDO: nomeFavorecido,
            FORMAPAGAMENTO: formaPagamento?.value,
            CHAVEPIX: ehPix ? chavePix : '',
            IDBANCO: exigeDadosBancarios ? banco?.value : null,
            NUAGENCIA: exigeDadosBancarios ? agencia : '',
            NUCONTA: exigeDadosBancarios ? conta : '',
            NUDIGITOCONTA: exigeDadosBancarios ? digitoConta : '',
            UNIDADENEGOCIO: unidadeNegocio,
            CENTROCUSTO: centroCusto,
            DTPAGAMENTO: dtPagamento,
            ANEXOCOMPROVANTE: anexoComprovante,
        }

        try {

            const response = await post(`/pagamento-departamento`, postData)
 
            await registrarLogAuditoria({
                idFuncionario: usuarioLogado.id,
                pathFuncao: 'FINANCEIRO/REGISTRAR PAGAMENTO ADIANTAMENTO',
                dados: postData
            });

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Pagamento registrado com sucesso!',
                showConfirmButton: false,
                timer: 5000,
                customClass: {
                    container: 'custom-swal',
                },
            })

            handleClick?.();
            
            return response.data;

        } catch (error) {
            const responsePost = await registrarLogAuditoria({
                idFuncionario: usuarioLogado.id,
                pathFuncao: 'FINANCEIRO/ERRO AO REGISTRAR PAGAMENTO ADIANTAMENTO',
                dados: postData
            });

            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Ocorreu um erro ao registrar o pagamento. Por favor, tente novamente.',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                },
            });
            console.error('Erro ao registrar pagamento:', error);
            return responsePost?.data;
        }
    }

    return {
        handleUploadComprovante,
        handleAnexarComprovante,
    }
}
