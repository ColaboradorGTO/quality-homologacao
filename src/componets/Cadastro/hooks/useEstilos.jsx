import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { post, put } from "../../../api/funcRequest";
import { useNavigate } from "react-router-dom";
import { useFetchData } from "../../../hooks/useFetchData";
import axios from 'axios';

export const useEstilos = ( dadosDetalheEstilos ) => {
    const [descricao, setDescricao] = useState('')
    const [statusSelecionado, setStatusSelecionado] = useState([])
    const [subGrupoSelecionado, setSubGrupoSelecionado] = useState("")
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [ipUsuario, setIpUsuario] = useState('');
    const navigate = useNavigate();
 
    const { data: dadosGrupoEstrutura = [] } = useFetchData('grupoEstrutura', '/grupoEstrutura');
    const optionsStatus = [
        { value: 'True', label: 'ATIVO' },
        { value: 'False', label: 'INATIVO' }
    ]
    console.log(dadosGrupoEstrutura, 'dadosGrupoEstrutura')
    useEffect(() => {
        if(dadosDetalheEstilos) {
            setDescricao(dadosDetalheEstilos[0]?.DS_ESTILOS || '')
            setStatusSelecionado({ value: dadosDetalheEstilos[0]?.STATIVO, label: dadosDetalheEstilos[0]?.STATIVO == 'True' ? 'ATIVO' : 'INATIVO' })
            setSubGrupoSelecionado({value: dadosDetalheEstilos[0]?.ID_GRUPOESTILOS, label: `${dadosDetalheEstilos[0]?.COD_GRUPOESTILOS} - ${dadosDetalheEstilos[0]?.DS_GRUPOESTILOS}`})
        }
    }, [dadosDetalheEstilos])

    useEffect(() => {
        const usuarioArmazenado = localStorage.getItem('usuario');

        if (usuarioArmazenado) {
            try {
                const parsedUsuario = JSON.parse(usuarioArmazenado);
                setUsuarioLogado(parsedUsuario);;
            } catch (error) {
                console.error('Erro ao parsear o usuário do localStorage:', error);
            }
        } else {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        getIPUsuario();
    }, [usuarioLogado]);

    const getIPUsuario = async () => {
        const response = await axios.get('http://ipwho.is/')
        if (response.data) {
            setIpUsuario(response.data.ip);
        }
        return response.data;
    }

    const atualzarEstilo = async () => {
        if(descricao == '') {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'O campo descrição é obrigatório.',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        const postData = [{
            IDVINCESTILOSESTRUTURA: dadosDetalheEstilos[0]?.IDVINCESTILOSESTRUTURA,
            IDGRUPOESTRUTURAANTIGA: dadosDetalheEstilos[0]?.IDGRUPOESTRUTURA,
            IDESTILO: dadosDetalheEstilos[0]?.IDESTILO,
            DSESTILO: descricao,
            IDGRUPOESTRUTURA: subGrupoSelecionado.value,
            STATIVO: statusSelecionado.value,
        }]
        try {
    
            const response = await put('/listaEstilos/:id', postData)
            const textDados = JSON.stringify(postData)
            let textFuncao = 'CADASTRO/CADASTRO DE ESTILOS';
        
            const createtLog = {
              IDFUNCIONARIO: usuarioLogado.id,
              PATHFUNCAO: textFuncao,
              DADOS: textDados,
              IP: ipUsuario
            }
        
            const responseLog = await post('/log-web', createtLog)

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Atualizado com sucesso!',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal', 
                }
            })

            // handleClose();
            return response.data;

        } catch (error) {
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
            console.error('Erro ao alterar a venda:', error);
        }        
    }

    const cadastrarEstilo = async () => {
        if(descricao == '') {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'O campo descrição é obrigatório.',
                showConfirmButton: false,
                timer: 1500
            });
            return;
        }

        const putData = [{
            // IDVINCESTILOSESTRUTURA:  null,
            // IDGRUPOESTRUTURAANTIGA: null,
            // IDESTILO: null,
            DSESTILO: descricao,
            IDGRUPOESTRUTURA: subGrupoSelecionado,
            STATIVO: statusSelecionado,
        }]
        try {
    
            const response = await post('/criarlistaEstilos', putData)
            const textDados = JSON.stringify(putData)
            let textFuncao = 'CADASTRO/CADASTRO DE ESTILOS';
        
            const createtLog = {
              IDFUNCIONARIO: usuarioLogado.id,
              PATHFUNCAO: textFuncao,
              DADOS: textDados,
              IP: ipUsuario
            }
        
            const responseLog = await post('/log-web', createtLog)

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Atualizado com sucesso!',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal', 
                }
            })

            // handleClose();
            return response.data;

        } catch (error) {
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
            console.error('Erro ao alterar a venda:', error);
        }        
    }




    return {
        descricao,
        setDescricao,
        statusSelecionado,
        setStatusSelecionado,
        subGrupoSelecionado,
        setSubGrupoSelecionado,
        usuarioLogado,
        ipUsuario,
        dadosGrupoEstrutura,
        getIPUsuario,
        optionsStatus,
        atualzarEstilo,
        cadastrarEstilo,
    };
};