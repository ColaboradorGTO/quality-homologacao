import React, { Fragment, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { get } from "../../../../api/funcRequest";
import { ActionMain } from "../../../Actions/actionMain";
import { ButtonType } from "../../../Buttons/ButtonType";
import { AiOutlineSearch } from "react-icons/ai";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";

import { ActionListaTesteExemplo } from "./actionListaTesteExemplo";


export const ActionTesteExemplo = () => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false)
  const [clickContador, setClickContador] = useState(0)
  const [dadosEmpresas, setDadosEmpresas] = useState([])
  const [empresas, setEmpresas] = useState([])
  const [empresaSelecionada, setEmpresaSelecionada] = useState('')
  const [usuarioLogado, setUsuarioLogado] = useState(null)

  const navigate = useNavigate();

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

  }, [usuarioLogado]);

  useEffect(() => {
    getEmpresas()
  }, [])

  const getEmpresas = async () => {
    try {
      const response = await get(`/empresas`)
      if (response.data) {
        setEmpresas(response.data)
      }
      return response.data
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ")
    }
  }

  const getListaEmpresas = async () => {

    try {
      const response = await get(`/listaEmpresas?idEmpresa=${empresaSelecionada}`)
      if (response.data) {
        setDadosEmpresas(response.data)
      }
      return response.data
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ")
    }
  }

  const handleSelectEmpresa = (e) => {   
    setEmpresaSelecionada(e.value)
  }

  const handleClick = () => {
    setClickContador(prevContador => prevContador + 1);
    getListaEmpresas()
    setTabelaVisivel(true)

  }

  return (

    <Fragment>
      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Empresas"]}
        title="Empresas"
        subTitle="Nome da Loja"

        InputSelectEmpresaComponent={InputSelectAction}
        labelSelectEmpresa={"Empresa"}
        optionsEmpresas={empresas.map((empresa) => ({
          value: empresa.IDEMPRESA,
          label: empresa.NOFANTASIA,
        }))}
        valueSelectEmpresa={empresaSelecionada}
        onChangeSelectEmpresa={handleSelectEmpresa}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}
      />

      {tabelaVisivel &&
        <ActionListaTesteExemplo dadosEmpresas={dadosEmpresas}/>
      }

    </Fragment>
  )
}
