import { post } from "../../../../../api/funcRequest";
import Swal from "sweetalert2";
import { registrarLogAuditoria } from "../../../../../services/auditLog";

export const useConsolidarTodasFaturas = ({
    optionsModulos,
    usuarioLogado,
    handleClickConciliar,
    handleClick,
    selectedItems,
}) => {
    const conferirTodas = async (rowData) => {
        if (optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para integrar as consolidações.`,
                showConfirmButton: true,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                },
            });
            return;
        }

        Swal.fire({
            title: 'Deseja Integrar Todas as Consolidações Selecionadas no SAP?',
            text: 'Você não poderá reverter esta ação!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger',
                actions: 'swal-button-spacing'
            },
            buttonsStyling: false,
            didOpen: () => {
                const style = document.createElement('style');
                style.innerHTML = '.swal-button-spacing button { margin: 0 5px; }';
                document.head.appendChild(style);
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    for (let i = 0; i < selectedItems.length; i++) {
                        const rowData = selectedItems[i];
                        const putData = {
                            IDEMPRESA: Number(rowData.IDEMPRESA),
                            DTPROCESSAMENTO: rowData.DTPROCESSAMENTO,
                            QTDTOTALFATURAS: Number(rowData.QTDFATURAS),
                            VRTOTALRECEBIDO: Number(rowData.VRTOTAL),
                            IDFUNCIONARIO: Number(usuarioLogado.id),

                        };

                        const response = await post('/criar-consolidacao-faturas', putData)

                        await registrarLogAuditoria({
                            idFuncionario: usuarioLogado?.id,
                            pathFuncao: 'FINANCEIRO/CONSOLIDACOES DE TODAS FATURAS',
                            dados: putData
                        })

                        return response.data;
                    }

                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Atualizado com sucesso!',
                        showConfirmButton: false,
                        timer: 3000,
                        customClass: {
                            container: 'custom-swal',
                        },
                    })

                    if (typeof handleClickConciliar === 'function') {
                        handleClickConciliar();
                    } else if (typeof handleClick === 'function') {
                        handleClick();
                    }

                } catch (error) {
                    for (let i = 0; i < selectedItems.length; i++) {
                        const rowData = selectedItems[i];
                        const putData = {
                            IDEMPRESA: Number(rowData.IDEMPRESA),
                            DTPROCESSAMENTO: rowData.DTPROCESSAMENTO,
                            QTDTOTALFATURAS: Number(rowData.QTDFATURAS),
                            VRTOTALRECEBIDO: Number(rowData.VRTOTAL),
                            IDFUNCIONARIO: Number(usuarioLogado.id),
                        };

                        await registrarLogAuditoria({
                            idFuncionario: usuarioLogado?.id,
                            pathFuncao: 'FINANCEIRO/ERRO AO INTEGRAR TODAS CONSOLIDACOES FATURAS SELECIONADAS',
                            dados: putData
                        })
                      
                    }

                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Ocorreu um erro ao tentar consolidar faturas.',
                        showConfirmButton: false,
                        timer: 3000,
                        customClass: {
                            container: 'custom-swal',
                        },
                    });
                    console.error('Erro Conferir Todas Faturas:', error);
                    return;
                }
            } else {
                return;
            }
        });
    }

    return {
        conferirTodas,
    }
}