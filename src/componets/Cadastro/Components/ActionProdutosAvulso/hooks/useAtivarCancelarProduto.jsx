import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { getDataAtual } from "../../../../../utils/dataAtual";

export const useAtivarCancelarProduto = ({ usuarioLogado, optionsModulos, handleClick }) => {
    const [ipUsuario, setIpUsuario] = useState('');
    const [data, setData] = useState('');

    useEffect(() => {
        const dataAtual = getDataAtual()
        setData(dataAtual);
    }, [])

    const getIPUsuario = async () => {
        let usuarioIP = null;

        try {
            const { data: ipWhoisData } = await axios.get("https://ifconfig.me/ip");
            usuarioIP = ipWhoisData?.ip;
        } catch (error) {
            console.error("Erro ao buscar IP via ipwho.is:", error);
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

    const handleCancelar = async (row, status) => {
        if (optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                icon: "error",
                title: "Permissão Negada!",
                html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão.`,
            });
            return;
        }

        let motivoCancelamento = '';
        let msgtitulo = status == 'True' ? 'Cancelar' : 'Ativar';

        try {
 
            const confirmacao = await Swal.fire({
                title: `Certeza que Deseja ${msgtitulo} o Produto?`,
                text: "Você não poderá reverter esta ação!",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                customClass: {
                    confirmButton: 'btn btn-primary btn-lg',
                    cancelButton: 'btn btn-danger btn-lg',
                }
            });

            if (!confirmacao.isConfirmed) return;

            
            const motivoModal = await Swal.fire({
                icon: 'question',
                title: `Motivo para ${msgtitulo} o Produto?`,
                html: `
                <div class="input-group pt-0">
                    <input type="text" id="motivoCancelItem" 
                        class="swal2-input m-0"
                        placeholder="Motivo para ${msgtitulo} o produto!"
                        style="text-transform: uppercase">
                </div>
            `,
                width: '25rem',
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: 'Confirmar',
                cancelButtonText: 'Voltar',
                showLoaderOnConfirm: true,

                didOpen: () => {
                    const input = document.getElementById('motivoCancelItem');

                    input.focus();

                    input.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') Swal.clickConfirm();
                    });
                },

                preConfirm: () => {
                    const input = document.getElementById('motivoCancelItem');
                    motivoCancelamento = input.value?.trim();

                    if (!motivoCancelamento) {
                        input.focus();
                        Swal.showValidationMessage(
                            `Coloque o Motivo para ${msgtitulo} o Produto!`
                        );
                        return false;

                    } else if (motivoCancelamento.length < 10) {
                        input.value = ''; 
                        input.focus();

                        Swal.showValidationMessage(
                            `Motivo Muito Curto, mínimo 10 caracteres!`
                        );
                        return false;
                    }

                    return motivoCancelamento;
                }
            });

            if (!motivoModal.isConfirmed) return;

            const dados = {
                IDDETALHEPRODUTOPEDIDO: parseInt(row?.IDDETALHEPRODUTOPEDIDO),
                IDRESPCANCELAMENTO: parseInt(usuarioLogado.id),
                DSMOTIVOCANCELAMENTO: motivoCancelamento,
                DTCANCELAMENTO: data,
                STCANCELADO: status
            };

            Swal.fire({
                title: `${status == 'True' ? 'Cancelando' : 'Reativando'} produto...`,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const response = await put("/status-produto-avulso/:id", dados);

            Swal.close();

            if (response?.data?.type === 'success') {
                await Swal.fire({
                    icon: "success",
                    title: "Sucesso!",
                    text: `${msgtitulo} realizado com sucesso!`,
                });

                handleClick();
            } else {
                Swal.fire({
                    icon: "warning",
                    text: response?.data?.msg || "Erro ao processar",
                });
            }

        } catch (error) {
            Swal.close();

            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Erro!",
                text: `Erro ao ${msgtitulo.toLowerCase()} o produto`,
            });
        }
    };


    return { handleCancelar };
}