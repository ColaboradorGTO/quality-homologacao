import Swal from "sweetalert2";
import { get, post } from "../../../../../api/funcRequest";
import axios from "axios";
import { useState } from "react";
import { useQuery } from "react-query";


export const useCadastrarImagemProduto = ({usuarioLogado, optionsModulos}) => {
    const [ipUsuario, setIpUsuario] = useState(null);
    const [referencia, setReferencia] = useState('');
    const [numeroPedido, setNumeroPedido] = useState('');
    const [novoProduto, setNovoProduto] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [codImgProd, setCodImgProd] = useState('');
    const [currentFile, setCurrentFile] = useState(null);

    const { data: dadosDetalheProdutos = [], error: errorImagens, isLoading: isLoadingImagens } = useQuery(
        ['produtos-imagens', referencia],
        async () => {
            const response = await get(`/produtos-imagens?numeroRefProduto=${referencia}`);
            return response.data;
        },
        { enabled: Boolean(referencia.length > 4), staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    );

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

    const onSubmit = async () => {
        if (optionsModulos[0]?.ALTERAR == 'False') {
            Swal.fire({
                title: 'Erro!',
                text: `${usuarioLogado?.NOFUNCIONARIO},\nVocê não tem permissão para editar um Fornecedor!`,
                icon: 'error',
                customClass: {
                    container: 'custom-swal',
                },
            });
            return;
        }

        if(numeroPedido == '' ) {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Informe o Nº Pedido e tente novamente!',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                },
            });
            return;
        }

        if(referencia == '' )  {
            Swal.fire({
                position: 'center',
                icon: 'warning',
                title: 'Informe a Referência e tente novamente!',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                },
            });
            return;
        }

        const postData = {
            IDRESUMOPEDIDO: numeroPedido,
            NUREF: referencia,
            IMAGEM: codImgProd,
            STATIVO: 'True',
            IDPRODIMAGEM: [{
                IDPRODUTO: novoProduto.map(item => item.IDPRODUTO).join(','),
                IDSUBGRUPOESTRUTURA: novoProduto.map(item => item.IDSUBGRUPOESTRUTURA).join(','),
                IDFABRICANTE: novoProduto.map(item => item.IDFABRICANTE).join(','),
                IDFORNECEDOR: novoProduto.map(item => item.IDFORNECEDOR).join(','),
            }],
        }
        try {

            const response = await post('/cadastrar-imagem-produto', postData)


            const textDados = JSON.stringify(postData)
            let textFuncao = 'COMPRAS/EDITAR FORNECEDOR';
            const ipUsuario = await getIPUsuario();
            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Atualizado com sucesso!',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })
            await post('/log-web', createtLog)


            return response.data;
        } catch (error) {
            const textDados = JSON.stringify(postData)
            let textFuncao = 'COMPRAS/ERRO AO EDITAR FORNECEDOR';
            const ipUsuario = await getIPUsuario();
            const createtLog = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }
            await post('/log-web', createtLog)
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                },
            });
            console.error('Erro ao editar fornecedor:', error);
        }
    }
    return {
        referencia,
        setReferencia,
        numeroPedido,
        setNumeroPedido,
        dadosDetalheProdutos,
        novoProduto,
        setNovoProduto,
        selectedImage,
        setSelectedImage,
        codImgProd,
        setCodImgProd,
        currentFile,
        setCurrentFile,
        onSubmit
    }
}