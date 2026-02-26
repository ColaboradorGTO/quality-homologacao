import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";

export const useEditarDeposito = ({ optionsModulos, usuarioLogado, handleClick }) => {
    const [ipUsuario, setIpUsuario] = useState('');

    const getIPUsuario = async () => {
        let usuarioIP = null;

        try {
        const { data: ipWhoisData } = await axios.get("https://ifconfig.me/ip");
        usuarioIP = ipWhoisData?.ip;
        } catch (error) {
        console.error("Erro ao buscar IP via ifconfig.me:", error);
        }

        if (!usuarioIP) {
        try {
            const { data: ipifyData } = await axios.get("https://api.ipify.org?format=json");
            usuarioIP = ipifyData?.ip;
        } catch (error) {
            console.error("Erro ao buscar IP via ipify.org:", error);
        }
        }
        setIpUsuario(usuarioIP);
        return usuarioIP;
    };

    const onEitarDataMovimentoConciliacao = async (IDDEPOSITOLOJA, DTMOVDEP) => {
        if (optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Erro!',
                text: 'Você não tem permissão para cancelar a conciliação do depósito!',
                customClass: {
                    container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 4000
            });
            return
        }

        Swal.fire({
            title: 'Insira a nova Data Movimento:',
            icon: 'info',
            showCancelButton: true,
            showConfirmButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Confirmar',
            html: `<input type="date" id="dtModal" name="dtModal" class="form-control" value="${DTMOVDEP || ''}" >`,
            customClass: {
                confirmButton: 'btn btn-success mx-2',
                cancelButton: 'btn btn-danger mx-2',
                loader: 'custom-loader'
            },
            buttonsStyling: false,
            allowOutsideClick: false,
            allowEscapeKey: false,
            showCloseButton: true,
            preConfirm: () => {
                let dtModal = document.getElementById('dtModal').value;
                let date = new Date(dtModal);
                let now = new Date();

                if (isNaN(date.getTime())) {
                    Swal.showValidationMessage(`<span class="text-danger fw-900">Nova Data Movimento vazia ou inválida!</span>`);
                    return false;
                }

                if (dtModal == DTMOVDEP) {
                    Swal.showValidationMessage(`<span class="text-danger fw-900">Nova Data Movimento não pode ser igual a Data Original!</span>`);
                    return false;
                }

                date.setHours(0, 0, 0, 0);
                now.setHours(0, 0, 0, 0);

                if (date.getTime() > now.getTime()) {
                    Swal.showValidationMessage(`<span class="text-danger fw-900">Nova Data Movimento não pode ser maior que a data atual!</span>`);
                    return false;
                }

                return dtModal;
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const dtNovaData = result.value;
                
                // Modal de confirmação adicional
                const confirmResult = await Swal.fire({
                    title: 'Confirmação',
                    text: 'Certeza que Deseja Alterar a Data de Movimento do Depósito?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Sim, Alterar',
                    cancelButtonText: 'Cancelar',
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33'
                });

                if (confirmResult.isConfirmed) {
                    try {
                        // Mostrar loading
                        Swal.fire({
                            title: 'Atualizando Data do Movimento...',
                            didOpen: () => Swal.showLoading(),
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            showConfirmButton: false
                        });

                        const putData = {
                            IDDEPOSITOLOJA: IDDEPOSITOLOJA,
                            DTMOVIMENTOCAIXA: dtNovaData
                        }

                        const response = await put('/deposito-alteracao-data-movimento/:id', putData)
                        const textDados = JSON.stringify(putData)
                        const ipUsuario = await getIPUsuario()
                        let textoFuncao = 'FINANCEIRO/ALTERAÇÃO DATA DE MOVIMENTO DO DEPOSITO';

                        const postData = {
                            IDFUNCIONARIO: String(usuarioLogado.id),
                            PATHFUNCAO: textoFuncao,
                            DADOS: textDados,
                            IP: ipUsuario || 'IP não disponível',
                        }

                        await post('/log-web', postData)

                        Swal.fire({
                            title: 'Sucesso!',
                            text: 'Data de Movimento Alterada Com Sucesso!',
                            icon: 'success'
                        })
                        handleClick()

                        return response.data;
                    } catch (error) {
                        const putData = {
                            IDDEPOSITOLOJA: IDDEPOSITOLOJA,
                            DTMOVIMENTOCAIXA: dtNovaData
                        }
                        const textDados = JSON.stringify(putData)
                        let textoFuncao = 'FINANCEIRO/ERRO AO ALTERAR DATA DE MOVIMENTO DO DEPOSITO';
                        const ipUsuario = await getIPUsuario()
                        const postData = {
                            IDFUNCIONARIO: String(usuarioLogado.id),
                            PATHFUNCAO: textoFuncao,
                            DADOS: textDados,
                            IP: ipUsuario || 'IP não disponível',
                        }

                        const responsePost = await post('/log-web', postData)

                        Swal.fire({
                            icon: 'error',
                            title: 'Erro!',
                            text: 'Erro ao alterar a data de movimento do depósito!',
                            customClass: {
                                container: 'custom-swal',
                            },
                            showConfirmButton: false,
                            timer: 4000
                        });
                        handleClick()
                        return responsePost.data;
                    }
                }
            }
        })

    }

    return {
        onEitarDataMovimentoConciliacao,
        ipUsuario,
        getIPUsuario,
        setIpUsuario,
    }
}