import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import { get, post, put } from '../../../../../api/funcRequest';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from 'react-query';
export const useEditarRelatorioBi = ({
    handleClose,
    dadosLinkRelatorioBI,
    empresaSelecionada,
    handleTabelaVisivel,
    optionsModulos,
    usuarioLogado
}) => {

    const [statusSelecionado, setStatusSelecionado] = useState('');
    const [linkRelatorioBI, setLinkRelatorioBI] = useState('');
    const [empresa, setEmpresa] = useState('');
    const [relatorioSelecionado, setRelatorioSelecionado] = useState(null);
    const [ipUsuario, setIpUsuario] = useState('');

    const getIPUsuario = async () => {
        try {
            const response = await axios.get('https://api.ipify.org?format=json9');
            if (response.data && response.data.ip) {
                return response.data.ip;
            }
            throw new Error("Resposta inválida do ipfy.org");
        } catch (error) {
            const responseIP2 = await axios.get('https://api.ipwho.org/me');
            return responseIP2.data?.data?.ip;

        }
    };

    const { data: dadosListaBI = [], error: errorListaBI, isLoading: isLoadingBI, refetch } = useQuery(
        'relatorioInformaticaBI?status=True',
        async () => {
            const response = await get(`/relatorioInformaticaBI?status=True`);
            return response.data;
        },
        { staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
    );

    useEffect(() => {
        if (dadosLinkRelatorioBI && empresaSelecionada) {
            setLinkRelatorioBI(dadosLinkRelatorioBI[0]?.LINK);
            setStatusSelecionado(dadosLinkRelatorioBI[0]?.STATIVO);
            setEmpresa(empresaSelecionada?.NOFANTASIA);
            setRelatorioSelecionado(dadosLinkRelatorioBI[0]?.IDRELATORIOBI);
        }
    }, [dadosLinkRelatorioBI, empresaSelecionada]);

    const onSubmit = async (data) => {

        if (optionsModulos[0]?.ALTERAR === 'False') {
            Swal.fire({
                title: 'Atenção',
                text: 'Você não tem permissão para cadastrar Relatório BI.',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
        }

        if (!empresaSelecionada || !relatorioSelecionado || !statusSelecionado || !linkRelatorioBI) {
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: 'Preencha todos os campos!',
                customClass: {
                    container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        const putData = {
            IDRELATORIOBI: relatorioSelecionado,
            IDEMPRESA: dadosLinkRelatorioBI[0]?.IDEMPRESA,
            LINK: linkRelatorioBI,
            STATIVO: statusSelecionado,
            IDRELATORIOBIANTIGO: dadosLinkRelatorioBI[0]?.IDRELATORIOBI,
        };
        try {

            const response = await put('/linkRelatorioBI/:id', putData);

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Relatório atualizado com sucesso!',
                customClass: {
                    container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 1500,
            });

            const textDados = JSON.stringify(putData);
            let textoFuncao = 'INFORMATICA/ATUALIZAR LINK RELATORIO BI';

            const ipUsuario = await getIPUsuario();

            const postData = {
                IDFUNCIONARIO: String(usuarioLogado.id),
                PATHFUNCAO: textoFuncao,
                DADOS: textDados,
                IP: ipUsuario,
            };

            const responsePost = await post('/log-web', postData);
            handleTabelaVisivel()
            handleClose()
            return responsePost.data;

        } catch (error) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Erro ao atualizar Relatório!',
                customClass: {
                    container: 'custom-swal',
                },
                showConfirmButton: false,
                timer: 1500,
            });
            console.log(error);
        }

        const textDados = JSON.stringify(putData);
        let textoFuncao = 'INFORMATICA/ATUALIZAR LINK RELATORIO BI';

        const ipUsuario = await getIPUsuario();

        const postData = {
            IDFUNCIONARIO: String(usuarioLogado.id),
            PATHFUNCAO: textoFuncao,
            DADOS: textDados,
            IP: ipUsuario,
        };

        const responsePost = await post('/log-web', postData);
    };

    const optionsStatus = [
        { value: "True", label: "Ativo" },
        { value: "False", label: "Inativo" },
    ];

    return {
        onSubmit,
        statusSelecionado,
        setStatusSelecionado,
        linkRelatorioBI,
        setLinkRelatorioBI,
        empresa,
        setEmpresa,
        relatorioSelecionado,
        setRelatorioSelecionado,
        dadosListaBI,
        optionsStatus
    }

}