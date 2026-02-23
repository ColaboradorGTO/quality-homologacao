import React, { Fragment, useEffect, useState } from "react"
import { ActionMain } from "../Actions/actionMain";
import { InputSelectAction } from "../Inputs/InputSelectAction";
import { InputField } from "../Buttons/Input";
import { ButtonType } from "../Buttons/ButtonType";
import { get } from "../../api/funcRequest";
import { dataFormatada } from "../../utils/dataFormatada";
import { formatMoeda } from "../../utils/formatMoeda";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';


export const ComercialActionPesqProdutoPreco = () => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);

  const [clickContador, setClickContador] = useState(0);
  const [dadosProdutos, setDadosProdutos] = useState([]);
  const [dadosProdutosPreco, setDadosProdutosPreco] = useState([]);
  const [dadosProdutosSap, setDadosProdutosSap] = useState([]);
  const [dadosProdutosQuality, setDadosProdutosQuality] = useState([]);
  const [descricaoProduto, setDescricaoProduto] = useState('');
  const [itensPorPagina, setItensPorPagina] = useState(10)
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [empresa, setEmpresa] = useState(null)
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null)
  const [marcaSelecionada, setMarcaSelecionada] = useState(null)
  const [empresaUsuario, setEmpresaUsuario] = useState([])
  const [optionsMarcas, setOptionsMarcas] = useState([])
  const [codBarra, setCodBarra] = useState('')

  useEffect(() => {
    if (getGrupoEmpresas) {

      getTodasEmpresas(marcaSelecionada);
    }
    getGrupoEmpresas();
  }, [marcaSelecionada]);

  const getTodasEmpresas = async (marcaSelecionada) => {
    try {

      const response = await get(`/subGrupoEmpresarial?idGrupoEmpresarial=${marcaSelecionada}`,)
      if (response.data) {
        setEmpresaUsuario(response.data)
        console.log(response.data, 'response.data')
      }

    } catch (error) {
      console.log('Erro ao buscar empresas: ', error)
    }
  }
  const getGrupoEmpresas = async () => {
    try {

      const response = await get(`/listaGrupoEmpresas`,)
      if (response.data) {
        setOptionsMarcas(response.data)
        // console.log(response.data, 'response.data')
      }

    } catch (error) {
      console.log('Erro ao buscar empresas: ', error)
    }
  }

  const getListaProdutos = async (empresaSelecionada ) => {

    try {
      const response = await get(`/listaProdutos?idEmpresa=${empresaSelecionada}`)

      if (response.data) {
        setDadosProdutos(response.data)
        console.log(response.data, 'response.data')
      }
      return response.data;

    } catch (error) {
      console.log('Erro ao buscar empresas: ', error)
    }

  }


  const dadosListaProdutos = dadosProdutos.map((item, index) => {
    let contador = index + 1;
    return {
      DTULTALTERACAO: item.DTULTALTERACAO,
      IDPRODUTO: item.IDPRODUTO,
      DSNOME: item.DSNOME,
      NUCODBARRAS: item.NUCODBARRAS,
      PRECO_VENDA: item.PRECO_VENDA,
      contador
    }
  });

  const colunasProdutos = [
    {
      field: 'contador',
      header: '#',	
      body: row => row.contador,
      sortable: true,
    },
    {
      field: 'NUCODBARRAS',
      header: 'Cód. Barras',
      body: row => parseFloat(row.NUCODBARRAS),
      sortable: true,
    },
    {
      field: 'DSNOME',
      header: 'Descrição',
      body: row => row.DSNOME,
      sortable: true,
    },
    {
      field: 'DTULTALTERACAO',
      header: 'Data Alteração',
      body: row => dataFormatada(row.DTULTALTERACAO),
      sortable: true,
    },
    {
      field: 'PRECO_VENDA',
      header: 'Venda PDV',
      body: row => formatMoeda(row.PRECO_VENDA),
      sortable: true,
    },
  ]


  const handleSelectEmpresa = (e) => {
    const selectedId = Number(e.target.value);
   
    if (!isNaN(selectedId)) {
      setEmpresaSelecionada(selectedId);
    }
  };

  const handleSelectMarcas = (e) => {
    const selectedId = Number(e.target.value);

    if (!isNaN(selectedId)) {
      setMarcaSelecionada(selectedId);
    }
  }

  const handleInputChange = (e) => {
    setCodBarra(e.target.value)
  }

  const handleClickSap = () => {
    getListaProdutoSap(empresaSelecionada)
    setTabelaSapVisivel(true);
    setTabelaQualityVisivel(false);
  }
  const handleClickQuality = () => {
    getListaProdutosQuality(empresaSelecionada)
    setTabelaQualityVisivel(true);
    setTabelaSapVisivel(false);
  }

  const handleClick = () => {
    getListaProdutos(empresaSelecionada)
  }
  return (

    <Fragment>
      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Produtos - Preços"]}
        title="Produtos - Preços"
        subTitle

        InputSelectEmpresaComponent={InputSelectAction}
        optionsEmpresas={[
          { value: null, label: 'Selecione uma loja' },
            ...empresaUsuario.map((empresa) => ({
            value: empresa.IDEMPRESA,
            label: empresa.NOFANTASIA,
          }))
        ]}
        labelSelectEmpresa={"Empresa"}
        valueSelectEmpresa={empresaSelecionada}
        onChangeSelectEmpresa={handleSelectEmpresa}

        InputSelectMarcasComponent={InputSelectAction}
        labelSelectMarcas={"Marcas"}
        optionsMarcas={[
          { value: null, label: 'Selecione uma Marca' },          
          ...optionsMarcas.map((empresa) => ({
          value: empresa.IDGRUPOEMPRESARIAL,
          label: empresa.GRUPOEMPRESARIAL,

          }))
        ]}
        valueSelectMarcas={marcaSelecionada}
        onChangeSelectMarcas={handleSelectMarcas}




        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Produtos / Preços Quality"}
        onButtonClickSearch={handleClickQuality}

        ButtonTypeVendasEstrutura={ButtonType}
        onButtonClickVendasEstrutura={handleClickSap}
        linkNomeVendasEstrutura={"Produtos / Preços SAP"}
        
      


      />


      {tabelaVisivel && (
        <div className="card">
          <DataTable
            value={dadosListaProdutos}
            sortField="VRTOTALPAGO"
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[5, 10, 20, 50, 100, 200, 300, 400, 500 ]}
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasProdutos.map(coluna => (

              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}
                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem'}}
                footerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9',fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '0.8rem' }}
              />
            ))}
          </DataTable>
        </div>

      )}

    
    </Fragment>
  )
}
