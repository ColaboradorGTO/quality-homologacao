import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import { useEffect, useState } from "react";
import axios from "axios";

export const useAtualizarPixPDV = ({dadosPixPDV, handleClose, optionsModulos, usuarioLogado}) => {
    const [pixSelecionado, setPixSelecionado] = useState('')
    const [faturaSelecionado, setFaturaSelecionado] = useState('')
    const [ipUsuario, setIpUsuario] = useState('');

    const getIPUsuario = async () => {
        let usuarioIP = null;

        try {
            const { data: ipWhoisData } = await axios.get("http://ipwho.is/");
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
    
    useEffect(() => {
        if (dadosPixPDV.length) {
            setPixSelecionado({value: dadosPixPDV[0]?.IDPSPPIX, label: dadosPixPDV[0]?.IDPSPPIX == '1' ? 'Itaú' : 'Santander'})
            setFaturaSelecionado({value: dadosPixPDV[0]?.IDPSPPIXFATURA, label: dadosPixPDV[0]?.IDPSPPIXFATURA == '1' ? 'Itaú' : 'Santander'})
        }
    }, [dadosPixPDV])

    const onSubmit = async (data) => {
        if(optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Erro!',
                html: `${usuarioLogado?.NOFUNIONARIO}, <br/> você não tem permissão para alterar!`,
                customClass: {
                container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 5000 
            });
            return
        }

        const putData = {
            IDEMPRESA: Number(dadosPixPDV[0]?.IDEMPRESA),
            NOFANTASIA: String(dadosPixPDV[0]?.NOFANTASIA),
            IDPSPPIX: pixSelecionado,
            IDPSPPIXFATURA: faturaSelecionado,
            USER: String(usuarioLogado.id)
        }

        try {

            const dados = JSON.stringify(putData)
            const response = await put('/atualizarConfiguracaoPixPDV', putData)
            const ipUsuario = await getIPUsuario();
            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: `FINANCEIRO/EMPRESAS/ALTERACAO CONFIGURACAO PIX IDEMPRESA: ${dadosPixPDV[0]?.IDEMPRESA}`,
                DADOS: dados,
                IP: ipUsuario
            }
            
            await post('/log-web', postData)
            Swal.fire({
                title: 'Sucesso',
                text: 'Configuração atualizada com sucesso!',
                icon: 'success',
                timer: 5000,
                customClass: {
                    container: 'custom-swal',
                }
            })
            handleClose()
            return response.data
            
        } catch (error) {
            const dados = JSON.stringify(putData)
            const ipUsuario = await getIPUsuario();
            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: `FINANCEIRO/EMPRESAS/ERRO AO ALTERAR CONFIGURACAO PIX IDEMPRESA: ${dadosPixPDV[0]?.IDEMPRESA}`,
                DADOS: dados,
                IP: ipUsuario
            }
            
            await post('/log-web', postData)

            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Erro!',
                text: 'Erro ao atualizar configuração!',
                customClass: {
                    container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 5000 
            });
            console.error('Erro ao atualizar configuração:', error);
        }
    }


    const optionsBancos = [
        { value: '1', label: 'Itaú' },
        { value: '2', label: 'Santander' },
    ]

    return {
        pixSelecionado,
        faturaSelecionado,
        setPixSelecionado,
        setFaturaSelecionado,
        usuarioLogado,
        optionsBancos,
        dadosPixPDV,
        onSubmit
    }
}