
import Swal from "sweetalert2";
import { registrarLogAuditoria } from "../../../../services/auditLog";
import { put } from "../../../../api/funcRequest";

export const useDesativarProdutoPrecoClube = ({
    usuarioLogado,
    optionsModulos
}) => {

    const handleAtivarDesativar = async (rowData) => {

        // Verifica permissão
        if (optionsModulos[0]?.ALTERAR === 'False') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                html: `${usuarioLogado?.NOFUNCIONARIO}<br/>Você não tem permissão para alterar o produto.`,
                showConfirmButton: true,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                },
            });
            return;
        }

        // Identifica o status atual e o novo status
        const produtoAtivo = rowData.STATIVO === 'True';

        const novoStatus = produtoAtivo ? 'False' : 'True';

        const descricaoAcao = produtoAtivo ? 'Desativar' : 'Ativar';

        // Define a data inicial do input
        const dataAtual = rowData.DTHORAFIMVIGENCIA
            ? new Date(rowData.DTHORAFIMVIGENCIA).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0];

        // Exibe confirmação com campo de data
        const result = await Swal.fire({
            title: `${descricaoAcao} Produto Preço Clube`,
            html: `
                <p>
                    Deseja realmente ${descricaoAcao.toLowerCase()} este produto?
                </p>
                <label for="dataFimVigencia">
                    Data final de vigência:
                </label>
                <input
                    type="date"
                    id="dataFimVigencia"
                    class="swal2-input"
                    value="${dataAtual}"
                    style="width: 80%;"
                />
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, confirmar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#7a59ad',
            cancelButtonColor: '#fd3995',
            customClass: {
                container: 'custom-swal',
            },
            preConfirm: () => {
                const dataSelecionada = document.getElementById('dataFimVigencia').value;

                if (!dataSelecionada) {
                    Swal.showValidationMessage('Informe a data final de vigência.');
                    return false;
                }

                return dataSelecionada;
            }
        });

        if (!result.isConfirmed) {
            return;
        }

        const dataFimVigencia = result.value;

        const putData = {
            DTHORAFIMVIGENCIA: `${dataFimVigencia} 23:59:59`,
            STATIVO: novoStatus,
            IDPROMOCAO: rowData.IDPROMOCAO,
            IDPRODUTO: rowData.IDPRODUTO
        };

        try {

            Swal.fire({
                position: 'center',
                icon: 'info',
                title: `${descricaoAcao} Produto Preço Clube`,
                html: 'Aguarde...',
                showConfirmButton: false,
                allowOutsideClick: false,
                allowEscapeKey: false,
                customClass: {
                    container: 'custom-swal',
                }
            });

            const response = await put('/produto-preco-clube/:id', putData);

            await registrarLogAuditoria({
                idFuncionario: usuarioLogado?.id,
                pathFuncao: `PROMOÇÃO/${descricaoAcao.toUpperCase()} PRODUTO PREÇO CLUBE`,
                dados: putData
            });

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Atualizado com sucesso!',
                text: `Produto ${produtoAtivo ? 'desativado' : 'ativado'} com sucesso.`,
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                },
            });

            return response.data;

        } catch (error) {

            await registrarLogAuditoria({
                idFuncionario: usuarioLogado?.id,
                pathFuncao: `PROMOÇÃO/ERRO AO ${descricaoAcao.toUpperCase()} PRODUTO PREÇO CLUBE`,
                dados: putData
            });

            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Ocorreu um erro ao atualizar o produto.',
                text: 'Por favor, tente novamente.',
                showConfirmButton: true,
                customClass: {
                    container: 'custom-swal',
                },
            });

            console.error('Erro ao atualizar produto preço clube:', error);
            return;
        }
    };

    return {
        handleAtivarDesativar
    };
};
