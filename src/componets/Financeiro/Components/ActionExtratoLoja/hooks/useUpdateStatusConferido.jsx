import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import { useEffect, useState } from "react";
import axios from "axios";
import { getHoraAtual } from "../../../../../utils/dataAtual";

export const useUpdateStatusConferido = ({handleClick, optionsModulos, usuarioLogado }) => {
    const [ipUsuario, setIpUsuario] = useState('');
    const [hora, setHora] = useState('');

    useEffect(() => {
        const horaAtual = getHoraAtual();
        setHora(horaAtual);
      
    }, [usuarioLogado]);

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

    const handleSubmit = async (IDDEPOSITOLOJA, STCONFERIDO) => {

        if(optionsModulos[0]?.ALTERAR == 'True') {

            try {
    
                Swal.fire({
                    title: 'Confirma a Conferência do Depósito?',
                    text: 'Informe a Data de Compensação',
                    html: '<input type="date" id="dtcompensacao" name="DTCompensacao" class="form-control" value="" >',
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Confirmar',
                    cancelButtonText: 'Cancelar'
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        const dtCompensacao = document.getElementById('dtcompensacao').value;
                        
                        if (!dtCompensacao) {
                            Swal.fire({
                                title: 'Atenção!',
                                text: 'Informe a Data de Compensação.',
                                icon: 'warning'
                            });
                            return;
                        }
                        const dados = {
                            IDDEPOSITOLOJA: IDDEPOSITOLOJA,
                            STCONFERIDO: 'True',
                            DTCOMPENSACAO: `${dtCompensacao} ${hora}`
                        }
    
    
                        await put("/atualizacao-status-conferido/:id", dados);
    
                        const textdados = JSON.stringify(dados);
                        const textoFuncao = 'FINANCEIRO/CONFIRMADA CONFERENCIA DO DEPOSITO';
                        const ipUsuario = await getIPUsuario();
                        const dadosLog = {
                            IDFUNCIONARIO: String(usuarioLogado.id),
                            PATHFUNCAO: textoFuncao,
                            DADOS: textdados,
                            IP: ipUsuario || 'IP não disponível'
                        };
    
                        await post("/log-web", dadosLog);
                        handleClick();
                        Swal.fire({
                            title: 'Sucesso!',
                            text: 'Conferência do Depósito confirmada com sucesso.',
                            icon: 'success',

                        });
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        const dtCompensacao = document.getElementById('dtcompensacao').value;
                        const dados = {
                            IDDEPOSITOLOJA: IDDEPOSITOLOJA,
                            STCONFERIDO: 'True',
                            DTCOMPENSACAO: `${dtCompensacao} ${hora}`
                        }
                        const textdados = JSON.stringify(dados);
                        let textoFuncao = 'FINANCEIRO/ERRO AO CONFIRMAR CONFERENCIA DO DEPOSITO';
                        const ipUsuario = await getIPUsuario();
    
                        await post("/log-web", {
                            "IDFUNCIONARIO": String(usuarioLogado.id),
                            "PATHFUNCAO": textoFuncao,
                            "DADOS": textdados,
                            "IP": ipUsuario || 'IP não disponível'
                        });
    
                        Swal.fire('Erro!', 'Erro ao Confirmar Status.', 'error');
    
                    }
                });
            } catch (error) {
                console.error('Erro: ', error);
            }
        } else {
            Swal.fire({
                title: 'Atenção!',
                text: 'Você não tem permissão para alterar este registro.',
                icon: 'warning'
                
            })
        }
    };

    return {
        handleSubmit
    }

}

