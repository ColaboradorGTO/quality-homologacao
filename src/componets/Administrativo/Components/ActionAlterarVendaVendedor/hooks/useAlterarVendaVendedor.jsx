import Swal from "sweetalert2";
import { post, put } from "../../../../../api/funcRequest";
import { useState } from "react";
import axios from "axios";


export const useAlterarVendaVendedor = ({ optionsModulos, usuarioLogado, handleClose}) => {
    const [selectAll, setSelectAll] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [vendedorSelecionado, setVendedorSelecionado] = useState('')
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

    const alterarVendaVendedor = async () => {
        if(optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
            icon: 'warning',
            title: 'Acesso Negado!',
            html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para alterar a venda vendedor.`,
            confirmButtonText: 'OK',
            customClass: {
                container: 'custom-swal',
            },
            });
            return;
        }
        
        if (selectedIds.length === 0) {
            Swal.fire({
            icon: 'warning',
            title: 'Selecione uma Venda!',
            text: 'Favor selecionar ao menos uma venda!',
            confirmButtonText: 'OK',
            customClass: {
                container: 'custom-swal',
            },
            });
            return;
        }
        
        if (vendedorSelecionado === '') {
            Swal.fire({
            icon: 'warning',
            title: 'Selecione um Vendedor!',
            text: 'Selecione um vendedor para alterar a venda',
            confirmButtonText: 'OK',
            customClass: {
                container: 'custom-swal',
            },
            });
            return;
        }

        const putData = {
            IDVENDADETALHE: String(selectedIds),
            IDVENDEDOR: vendedorSelecionado,
        }

        try {

            const response = await put('/venda-vendedor/:id', putData)
            const textDados = JSON.stringify(putData)
            let textFuncao = 'ADMINISTRATIVO / VENDAS / ALTERAR VENDA VENDEDOR';
            const ipUsuario = await getIPUsuario();
            const postDataEditarCaixa = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'IP não disponível'
            }

            await post('/log-web', postDataEditarCaixa)

            Swal.fire({
                icon: 'success',
                title: 'Venda Alterada com Sucesso!',
                text: 'Venda alterada com sucesso!',
                timer: 3000,
                showConfirmButton: false,
                customClass: {
                    container: 'custom-swal',
                },
            });

            handleClose();
            return response.data;
        } catch (error) {
            const textDados = JSON.stringify(putData)
            const ipUsuario = await getIPUsuario();
            let textFuncao = 'ADMINISTRATIVO / VENDAS / ERRO ALTERAR VENDA VENDEDOR';
            const postDataEditarCaixa = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario || 'IP não disponível'
            }

            const response = await post('/log-web', postDataEditarCaixa)

            Swal.fire({
                icon: 'error',
                title: 'Erro ao alterar a venda!',
                text: 'Erro ao alterar a venda!',
                timer: 3000,
                showConfirmButton: false,
                customClass: {
                    container: 'custom-swal',
                },
            });

            return response.data;
        }
    }

    return {
        alterarVendaVendedor,
        selectAll,
        setSelectAll,
        selectedIds,
        setSelectedIds, 
        vendedorSelecionado,
        setVendedorSelecionado,
    }
}
