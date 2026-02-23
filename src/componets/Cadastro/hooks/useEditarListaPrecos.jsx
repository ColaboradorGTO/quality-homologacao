import Swal from "sweetalert2"
import { get, put } from "../../../api/funcRequest"
import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export const useEditarListaPrecos = () => {
    const [descricao, setDescricao] = useState('')
    const [statusSelecionado, setStatusSelecionado] = useState([])
    const [subGrupoSelecionado, setSubGrupoSelecionado] = useState("")
    const [listaGrupoEstrutura, setListaGrupoEstrutura] = useState([])
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [ipUsuario, setIpUsuario] = useState('');
    const [dadosEmpresas, setDadosEmpresas] = useState([])
    const [rowClick, setRowClick] = useState(true);
    const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
  
    const navigate = useNavigate();
  
    useEffect(() => {
      getListaGrupoEstrutura()
      getListaEmpresas()
    }, [])
  
    const getListaEmpresas = async () => {
      try {
        const response = await get(`/empresas`)
        if (response.data) {
          setDadosEmpresas(response.data)
        }
      } catch (error) {
        console.log(error, "não foi possivel pegar os dados da tabela ")
      }
    }
  
    const getListaGrupoEstrutura = async () => {
      try {
        const response = await get(`/grupoEstrutura`)
        if (response.data) {
          setListaGrupoEstrutura(response.data)
        }
      } catch (error) {
        console.log(error, "não foi possivel pegar os dados da tabela ")
      }
    }
  
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
  
    const onSubmit = async () => {
      const postData = {
  
        STATIVO: statusSelecionado,
      }
  
      const response = await put('/sub-grupo-estrutura/:id', postData)
        .then(response => {
  
          // Limpar os campos do formulário
  
  
          console.log(response, 'despesa cadastrada com sucesso front end!')
        })
  
  
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Cadastrado com sucesso!',
        showConfirmButton: false,
        timer: 1500
      })
  
        .catch(error => {
  
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.',
            showConfirmButton: false,
            timer: 1500
          });
          console.log(error)
        })
    }
  
    const handleChangeStatus = (e) => {
      setStatusSelecionado(e.value)
    }

    return {
        descricao,
        setDescricao,
        statusSelecionado,
        setStatusSelecionado,
        subGrupoSelecionado,
        setSubGrupoSelecionado,
        listaGrupoEstrutura,
        setListaGrupoEstrutura,
        usuarioLogado,
        setUsuarioLogado,
        ipUsuario,
        setIpUsuario,
        dadosEmpresas,
        setDadosEmpresas,
        rowClick,
        setRowClick,
        empresaSelecionada,
        setEmpresaSelecionada,
        onSubmit,
        handleChangeStatus
    }
}