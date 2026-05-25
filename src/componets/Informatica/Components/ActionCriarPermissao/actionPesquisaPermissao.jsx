import React, { Fragment, useState } from "react"
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { ActionMain } from "../../../Actions/actionMain";
import { ButtonType } from "../../../Buttons/ButtonType";
import { get } from "../../../../api/funcRequest";
import { AiOutlineClear, AiOutlineSearch } from "react-icons/ai";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import { useEffect } from "react";
import { FaRegSave } from "react-icons/fa";
import { useEditarPermissaoUsuario } from "../../../ActionPermissoes/hooks/useEditarPermissaoUsuario";
import { Departamentos } from '../../../../../parceiro.json';
import { useRef } from "react";
import { InputListaMenus } from "./inputListaMenus";


export const ActionPesquisaPermissao = ({ usuarioLogado }) => {

  const {
    moduloSelecionado,
    setModuloSelecionado,
    funcionarioSelecionado,
    setFuncionarioSelecionado,
    menuPaiSelecionado,
    setMenuPaiSelecionado,
    menuFilhoSelecionado,
    setMenuFilhoSelecionado,
    funcaoSelecionada,
    setFuncaoSelecionada,
    alterar,
    setAlterar,
    criar,
    setCriar,
    nivel1,
    setNivel1,
    nivel2,
    setNivel2,
    nivel3,
    setNivel3,
    nivel4,
    setNivel4,
    administrador,
    setAdministrador,
    departamentoSelecionado,
    setDepartamentoSelecionado,
    handleSubmit
  } = useEditarPermissaoUsuario();

  const [menuVisivel, setMenuVisivel] = useState(false)
  const [menusPermitidos, setMenusPermitidos] = useState([moduloSelecionado]);
  const [moduloSelecionadoObj, setModuloSelecionadoObj] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);
  const [selectedModule, setSelectedModule] = useState(null)
  const [moduloUsuario, setModuloUsuario] = useState(null);
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');

  const menuLeft = useRef(null);

  useEffect(() => {
    const moduloArmazenado = localStorage.getItem('moduloUsuario');
    if (moduloArmazenado) {
      const parsedModulo = JSON.parse(moduloArmazenado);
      setModuloUsuario(parsedModulo);
    }
  }, [moduloUsuario]);

  useEffect(() => {
    const storedModule = JSON.parse(localStorage.getItem('moduloselecionado'));
    if (storedModule) {
      setSelectedModule(storedModule);
    }
  }, [usuarioLogado]);


  const { data: optionsModulos = [], error: errorModulos, isLoading: isLoadingModulos, refetch: refetchModulos } = useQuery(
    'menus-usuario',
    async () => {
      const response = await get(`/menus-usuario?idUsuario=${usuarioLogado?.id}`);

      return response.data;
    },
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000, }
  );

  const { data: optionsEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas } = useQuery(
    'empresas',
    async () => {
      const response = await get(`/empresas`);
      return response.data;
    },
    { staleTime: 60 * 60 * 1000 }
  );


  useEffect(() => {
    if (moduloSelecionado) {
      const modulo = optionsModulos[0]?.modulos.find((item) => item.ID === moduloSelecionado);
      setModuloSelecionadoObj(modulo || null);
      setMenusPermitidos(modulo?.menuPai?.menuFilho || []); // Atualiza os menus permitidos
      setMenuPaiSelecionado(modulo?.menuPai?.IDMENU); // Atualiza os menus permitidos

      const menuFilhoIds = modulo?.menuPai?.menuFilho?.map((menu) => menu.ID) || [];
      setMenuFilhoSelecionado(menuFilhoIds);
      setMenuVisivel(true);
    } else {
      setMenuVisivel(false);
    }
  }, [moduloSelecionado, optionsModulos]);


  const fetchListaFuncionarios = async () => {
    try {
      const urlApi = `/funcionarios-loja?idEmpresa=${empresaSelecionada?.value}`;
      const response = await get(urlApi);

      if (response.data.length && response.data.length === pageSize) {

        let allData = [...response.data];
        animacaoCarregamento(`Carregando... Página ${currentPage} de ${response.data.length}`, true);

        async function fetchNextPage(currentPage) {
          try {
            currentPage++;
            const responseNextPage = await get(`${urlApi}&page=${currentPage}`);
            if (responseNextPage.data.length) {
              allData.push(...responseNextPage.data);
              return fetchNextPage(currentPage);
            } else {
              return allData;
            }
          } catch (error) {
            console.error('Erro ao buscar próxima página:', error);
            throw error;
          }
        }

        await fetchNextPage(currentPage);
        return allData;
      } else {

        return response.data;
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosFuncionarios = [], error: errorFuncionario, isLoading: isLoadingFuncionario } = useQuery(
    ['funcionarios-loja', empresaSelecionada?.value],
    () => fetchListaFuncionarios(),
    {
      enabled: Boolean(empresaSelecionada?.value), staleTime: Infinity, cacheTime: Infinity,
    }
  );

  const selecioneModulos = (moduloURL) => {
    const modulos = optionsModulos[0]?.modulos || [];
    const moduloEncontrado = modulos.find(modulo => modulo.DSMODULO == moduloURL);

    if (moduloEncontrado) {
      setSelectedModule(moduloEncontrado);
      localStorage.setItem('moduloselecionado', JSON.stringify(moduloEncontrado));
    }
  };
  const modulosDisponiveis = optionsModulos[0]?.modulos || [];
  const menuItems = modulosDisponiveis?.map((modulo) => ({
    label: modulo.NOME,
    icon: modulo.src,
    command: () => selecioneModulos(modulo.DSMODULO),
  }));


  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={[" Permissões de Acesso Usuário"]}
        title="   Permissões de Acesso Usuário"

        InputSelectMarcasComponent={InputSelectAction}
        optionsMarcas={[
          { value: '', label: 'Selecione...' },
          ...(Array.isArray(optionsModulos[0]?.modulos)
            ? optionsModulos[0].modulos.map((item) => ({
              value: item.ID,
              label: `${item.NOME}`,
            }))
            : [])
        ]}
        labelSelectMarcas={"Selecione um Módulo"}
        valueSelectMarca={moduloSelecionado ? { value: moduloSelecionado, label: moduloSelecionadoObj?.NOME } : null}
        onChangeSelectMarcas={(e) => setModuloSelecionado(e.value)}

        InputSelectEmpresaComponent={InputSelectAction}
        optionsEmpresas={
          Departamentos?.map((item) => ({
            value: item.value,
            label: item.label
          }))
        }

        labelSelectEmpresa={"Selecione um Departamento"}
        valueSelectEmpresa={departamentoSelecionado}
        onChangeSelectEmpresa={(e) => setDepartamentoSelecionado(e)}

        InputSelectGrupoComponent={InputSelectAction}
        optionsGrupos={
          optionsEmpresas?.map((item) => ({
            value: item.IDEMPRESA,
            label: item.NOFANTASIA
          }))
        }
        labelSelectGrupo={"Selecione uma Empresa"}
        valueSelectGrupo={empresaSelecionada}
        onChangeSelectGrupo={(e) => setEmpresaSelecionada(e)}

        InputSelectSubGrupoComponent={InputSelectAction}
        optionsSubGrupos={
          dadosFuncionarios?.map((item) => ({
            value: item.ID,
            label: `${item.NOLOGIN} - ${item.NOFUNCIONARIO} `
          }))
        }
        labelSelectSubGrupo={"Selecione um Funcionário"}
        valueSelectSubGrupo={funcionarioSelecionado}
        onChangeSelectSubGrupo={(e) => setFuncionarioSelecionado(e)}

      />

      <form onSubmit={handleSubmit} style={{ paddingBottom: '4rem' }}>
        <div className="row" >
          <div className="col-sm-5 col-md-5 col-lg-5 col-xl-5">
            <div style={{ marginTop: '2rem', background: '' }} >
              <head style={{ display: 'block' }}>
                <h3 style={{ color: '#000' }}>Nível de Permissão do Módulo</h3>

              </head>

              <div className="form-group form-check" style={{ justifyContent: 'center', marginTop: '2rem' }}>
                <input
                  type="checkbox"
                  checked={administrador == 'True'}
                  onChange={(e) => setAdministrador(e.target.checked ? 'True' : 'False')}
                  className="form-check-input"
                />
                <label style={{ color: '#000', fontSize: '1rem' }} className="form-check-label d-inline-block " htmlFor="">Administrador</label>
              </div>

              <div className="form-group form-check">
                <input
                  type="checkbox"
                  checked={nivel1 == 'True'}
                  onChange={(e) => setNivel1(e.target.checked ? 'True' : 'False')}
                  className="form-check-input"
                />
                <label style={{ color: '#000', fontSize: '1rem' }} className="form-check-label d-inline-block " htmlFor="">Nível Permissão 1</label>
              </div>

              <div className="form-group form-check">
                <input
                  type="checkbox"
                  checked={nivel2 == 'True'}
                  onChange={(e) => setNivel2(e.target.checked ? 'True' : 'False')}
                  className="form-check-input"
                />
                <label style={{ color: '#000', fontSize: '1rem' }} className="form-check-label d-inline-block " htmlFor="">Nível Permissão 2</label>
              </div>

              <div className="form-group form-check">
                <input
                  type="checkbox"
                  checked={nivel3 == 'True'}
                  onChange={(e) => setNivel3(e.target.checked ? 'True' : 'False')}
                  className="form-check-input"
                />
                <label style={{ color: '#000', fontSize: '1rem' }} className="form-check-label d-inline-block " htmlFor="">Nível Permissão 3</label>
              </div>

              <div className="form-group form-check">
                <input
                  type="checkbox"
                  checked={nivel4 == 'True'}
                  onChange={(e) => setNivel4(e.target.checked ? 'True' : 'False')}
                  className="form-check-input"
                />
                <label style={{ color: '#000', fontSize: '1rem' }} className="form-check-label d-inline-block " htmlFor="">Nível Permissão 4</label>
              </div>
            </div>

            <div style={{ marginTop: '2rem' }} className="col-sm-6 col-md-6 col-lg-6 col-xl-6">
              <head style={{ display: 'block' }}>
                <h2 style={{ color: '#000' }}>Tipo de Permissão do Usuário</h2>
              </head>

              <div className="form-group form-check" style={{ justifyContent: 'center', marginTop: '2rem' }}>
                <input
                  type="checkbox"
                  checked={alterar == 'True'}
                  onChange={(e) => setAlterar(e.target.checked ? 'True' : 'False')}
                  className="form-check-input"
                />
                <label style={{ color: '#000', fontSize: '1rem' }} className="form-check-label d-inline-block " htmlFor="">Permissão Para Alterar</label>
              </div>

              <div className="form-group form-check">
                <input
                  type="checkbox"
                  checked={criar === 'True'}
                  onChange={(e) => setCriar(e.target.checked ? 'True' : 'False')}
                  className="form-check-input"
                />
                <label style={{ color: '#000', fontSize: '1rem' }} className="form-check-label d-inline-block" htmlFor="">
                  Permissão Para Criar
                </label>
              </div>

            </div>
          </div>

          {menuVisivel && (

            <div className="col-sm-6 col-md-6 col-lg-6 col-xl-6 "  >
              <head style={{ display: 'block', textAlign: 'center' }}>

                <span style={{ color: '#000', fontSize: '28px', fontWeight: 600 }} className="text-center">{`MENU:`}</span>
                <span style={{ color: '#000', fontSize: '32px', textTransform: 'uppercase' }} className="text-center h6 fw-600">{` ${moduloSelecionadoObj?.NOME || ''}`}</span>

              </head>
              <InputListaMenus
                menusPermitidos={menusPermitidos}
                moduloSelecionadoObj={moduloSelecionadoObj}
                menuFilhoSelecionado={menuFilhoSelecionado}
                setMenuFilhoSelecionado={setMenuFilhoSelecionado}
              />

              <div className="row " style={{ marginTop: "4rem" }}>

                <ButtonType
                  textButton="Salvar"
                  onClickButtonType={handleSubmit}
                  cor="success"
                  Icon={FaRegSave}
                  iconColo="#000"
                  iconSize={20}
                  tipo={"submit"}
                />

                <ButtonType
                  textButton="Limpar Menus"
                  onClickButtonType={() => setMenuFilhoSelecionado([])}
                  cor="danger"
                  Icon={AiOutlineClear}
                  iconColo="#000"
                  iconSize={20}
                  tipo={"button"}
                />

              </div>
            </div>
          )}
        </div>
      </form>

    </Fragment>
  )
}