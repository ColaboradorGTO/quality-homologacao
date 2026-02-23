import Swal from "sweetalert2";
import { post } from "../../../../../api/funcRequest";
import { useState } from "react";
import axios from "axios";


export const useVincularTamanhoPedido = ({
    usuarioLogado, 
    optionsModulos,
    categoriaSelecionada, 
    tamanhoSelecionado,
    dadosVinculados,
    refetchVinculo
}) => {
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


    const vincularCategoriaTamanho = async () => {
        if(optionsModulos[0]?.CRIAR == 'False') {
            Swal.fire({
                title: 'Erro!',
                text: `${usuarioLogado?.NOFUNCIONARIO},\nVocê não tem permissão para criar o Vínculo!`,
                icon: 'error',
                customClass: {
                    container: 'custom-swal',
                },
            });
            return;
        }
        
        if (categoriaSelecionada == '') {
            Swal.fire({
                type: 'warning',
                icon: 'warning',
                title: 'A Categoria deve ser Informada!',
                showConfirmButton: false,
                timer: 1500
            })
            return;
        }

        if (tamanhoSelecionado == '') {
            Swal.fire({
                type: 'warning',
                icon: 'warning',
                title: 'O Tamanho deve ser Informado!',
                showConfirmButton: false,
                timer: 1500
            })
            return;
        }

        try {

            await refetchVinculo();

            if (dadosVinculados && dadosVinculados.length > 0) {
                let jaExiste = false;

                for (let i = 0; i < dadosVinculados.length; i++) {
                    const registro = dadosVinculados[i];

                    if (registro.IDCATEGORIAPEDIDO == categoriaSelecionada &&
                        registro.IDTAMANHO == tamanhoSelecionado) {
                        jaExiste = true;
                        break;
                    }
                }

                if (jaExiste) {
                    Swal.fire({
                        title: 'Categoria e Tamanho já Vinculados!',
                        icon: 'warning',
                        confirmButtonText: 'Ok',
                        customClass: {
                            container: 'custom-swal',
                        }
                    });
                    return;
                }
            }


            const postData = {
                IDCATEGORIAPEDIDO: parseInt(categoriaSelecionada),
                IDTAMANHO: parseInt(tamanhoSelecionado),
                STATIVO: 'True',
            }

            const response = await post('/cadastro-vinculo-tamanho-categoria', postData);

            const textDados = JSON.stringify(postData);
            let textFuncao = 'COMPRAS/CADASTRO DE CATEGORIA DE PEDIDO';
            const ip = await getIPUsuario();
            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ip
            }

            await post('/log-web', createtLog);

            Swal.fire({
                type: 'success',
                icon: 'success',
                title: 'Vínculo realizado com Sucesso!',
                showConfirmButton: false,
                timer: 1500
            });

            refetchVinculo();
            return response.data;

        } catch (error) {
            const textDados = JSON.stringify(postData);
            let textFuncao = 'COMPRAS/ERRO AO CADASTRAR CATEGORIA DE PEDIDO';
            const ip = await getIPUsuario();
            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ip
            }

            await post('/log-web', createtLog);

            Swal.fire({
                title: 'Erro!',
                text: 'Ocorreu um erro ao vincular os dados.',
                icon: 'error',
                confirmButtonText: 'Ok',
                customClass: {
                    container: 'custom-swal',
                }
            });

        }
    }

    return {
        vincularCategoriaTamanho,
    }
}