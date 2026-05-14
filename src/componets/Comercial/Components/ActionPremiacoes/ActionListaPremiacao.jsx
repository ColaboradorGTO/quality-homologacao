import { Fragment } from "react"
import { GrFormView } from "react-icons/gr";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { dataFormatada } from "../../../../utils/dataFormatada";
import { useState } from "react";
import { get } from "../../../../api/funcRequest";



export const ActionListaPremiacoes = ({
  dadosListaPremiacoes,
  setDadosGerente,
  setDadosLiderLoja,
  setDadosLiderCaixa,
  setDadosOperadorCaixa,
  setDadosVendedor,
  setDadosAssistentes,
  setDadosMultiplicador,
  setDadosFiscal,
  setTabelaVisivel,
  setTabelasSecundariasVisiveis
}) => {
  const [rowSelection, setRowSelection] = useState(null);

  const dados = dadosListaPremiacoes.map((item, index) => {
    let contador = index + 1;

    return {

      IDSUBGRUPOEMPRESARIAL: item.IDSUBGRUPOEMPRESARIAL,
      DTPREMIOINICIOFORMAT: item.DTPREMIOINICIOFORMAT,
      DTPREMIOFIMFORMAT: item.DTPREMIOFIMFORMAT,
      DTPREMIOINICIO: item.DTPREMIOINICIO,
      NOFANTASIA: item.NOFANTASIA,
      DTPREMIOFIM: item.DTPREMIOFIM,
      DSSUBGRUPOEMPRESARIAL: item.DSSUBGRUPOEMPRESARIAL,
      STATIVO: item.STATIVO,

      contador
    };
  });

  const colunasVendas = [
    {
      field: 'contador',
      header: '#',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'DSSUBGRUPOEMPRESARIAL',
      header: 'Grupo Empresarial',
      body: row => <th>{row.DSSUBGRUPOEMPRESARIAL}</th>,
      sortable: true,

    },
    {
      field: 'DTPREMIOINICIOFORMAT',
      header: 'Data Início',
      body: row => <th>{dataFormatada(row.DTPREMIOINICIOFORMAT)}</th>,
      sortable: true,

    },
    {
      field: 'DTPREMIOFIMFORMAT',
      header: 'DataFim',
      body: row => <th>{dataFormatada(row.DTPREMIOFIMFORMAT)}</th>,
      sortable: true,

    },
    {
      field: 'STATIVO',
      header: 'Situação',
      body: (
        (row) => (
          <th style={{ color: row.STATIVO == 'True' ? 'blue' : 'red' }}>
            {row.STSALVO == 'True' ? 'ATIVO' : 'INATIVO'}

          </th>
        )
      ),
      sortable: true,
    },
    {
      field: '',
      header: 'Situação',
      body: (
        (row) => (
          <div style={{ display: "flex", justifyContent: "space-around" }}>

            <div className="p-1">
              <ButtonTable
                titleButton={"Detalhar Premiação"}
                onClickButton={() => handleClickPremioGerente(row)}
                Icon={GrFormView}
                iconSize={30}
                iconColor={"#fff"}
                cor={"success"}
                width="40px"
                height="30px"
              />

            </div>
          </div>
        )
      ),
      sortable: true,
    },
  ]

  const handlePremioGerente = async (IDSUBGRUPOEMPRESARIAL, DTPREMIOINICIO, DTPREMIOFIM, DSSUBGRUPOEMPRESARIAL) => {
    try {
      const response = await get(`/lista-premios-gerente?idSubGrupo=${IDSUBGRUPOEMPRESARIAL}&dataPesquisaInicio=${DTPREMIOINICIO}&dataPesquisaFim=${DTPREMIOFIM}&funcao=GERENTE`)
      if (response.data && response.data.length > 0) {

        setDadosGerente({
          data: response.data,
          idSubGrupo: IDSUBGRUPOEMPRESARIAL,
          dataPesquisaInicio: DTPREMIOINICIO,
          dataPesquisaFim: DTPREMIOFIM,
          dsSubGrupo: DSSUBGRUPOEMPRESARIAL
        });
        setTabelasSecundariasVisiveis(true);
        setTabelaVisivel(false);;
      }
    } catch (error) {
      console.error('Erro ao buscar metas detalhadas: ', error);
    }
  };
  
  const handleClickPremioGerente = (row) => {
    if (row && row.IDSUBGRUPOEMPRESARIAL) {
      handlePremioGerente(row.IDSUBGRUPOEMPRESARIAL, row.DTPREMIOINICIO, row.DTPREMIOFIM, row.DSSUBGRUPOEMPRESARIAL);
    }
  };

  const handlePremioLiderLoja = async (IDSUBGRUPOEMPRESARIAL, DTPREMIOINICIO, DTPREMIOFIM, DSSUBGRUPOEMPRESARIAL) => {
    try {
      const response = await get(`/lista-premios-gerente?idSubGrupo=${IDSUBGRUPOEMPRESARIAL}&dataPesquisaInicio=${DTPREMIOINICIO}&dataPesquisaFim=${DTPREMIOFIM}&funcao=LIDER DE LOJA`)
      if (response.data && response.data.length > 0) {

        setDadosLiderLoja({
          data: response.data,
          idSubGrupo: IDSUBGRUPOEMPRESARIAL,
          dataPesquisaInicio: DTPREMIOINICIO,
          dataPesquisaFim: DTPREMIOFIM,
          dsSubGrupo: DSSUBGRUPOEMPRESARIAL
        });
        setTabelasSecundariasVisiveis(true);
        setTabelaVisivel(false);;
      }
    } catch (error) {
      console.error('Erro ao buscar metas detalhadas: ', error);
    }
  };
  
  const handleClickPremioLiderLoja = (row) => {
    if (row && row.IDSUBGRUPOEMPRESARIAL) {
      handlePremioLiderLoja(row.IDSUBGRUPOEMPRESARIAL, row.DTPREMIOINICIO, row.DTPREMIOFIM, row.DSSUBGRUPOEMPRESARIAL);
    }
  };
  
  const handlePremioLiderCaixa = async (IDSUBGRUPOEMPRESARIAL, DTPREMIOINICIO, DTPREMIOFIM, DSSUBGRUPOEMPRESARIAL) => {
    try {
      const response = await get(`/lista-premios-gerente?idSubGrupo=${IDSUBGRUPOEMPRESARIAL}&dataPesquisaInicio=${DTPREMIOINICIO}&dataPesquisaFim=${DTPREMIOFIM}&funcao=LIDER DE CAIXA`)
      if (response.data && response.data.length > 0) {

        setDadosLiderCaixa({
          data: response.data,
          idSubGrupo: IDSUBGRUPOEMPRESARIAL,
          dataPesquisaInicio: DTPREMIOINICIO,
          dataPesquisaFim: DTPREMIOFIM,
          dsSubGrupo: DSSUBGRUPOEMPRESARIAL
        });
        setTabelasSecundariasVisiveis(true);
        setTabelaVisivel(false);;
      }
    } catch (error) {
      console.error('Erro ao buscar metas detalhadas: ', error);
    }
  };
  
  const handleClickPremioLiderCaixa = (row) => {
    if (row && row.IDSUBGRUPOEMPRESARIAL) {
      handlePremioLiderCaixa(row.IDSUBGRUPOEMPRESARIAL, row.DTPREMIOINICIO, row.DTPREMIOFIM, row.DSSUBGRUPOEMPRESARIAL);
    }
  };

  const handlePremioOperadorCaixa = async (IDSUBGRUPOEMPRESARIAL, DTPREMIOINICIO, DTPREMIOFIM, DSSUBGRUPOEMPRESARIAL) => {
    try {
      const response = await get(`/lista-premios-gerente?idSubGrupo=${IDSUBGRUPOEMPRESARIAL}&dataPesquisaInicio=${DTPREMIOINICIO}&dataPesquisaFim=${DTPREMIOFIM}&funcao=OPERADOR DE CAIXA`)
      if (response.data && response.data.length > 0) {

        setDadosOperadorCaixa({
          data: response.data,
          idSubGrupo: IDSUBGRUPOEMPRESARIAL,
          dataPesquisaInicio: DTPREMIOINICIO,
          dataPesquisaFim: DTPREMIOFIM,
          dsSubGrupo: DSSUBGRUPOEMPRESARIAL
        });
        setTabelasSecundariasVisiveis(true);
        setTabelaVisivel(false);;
      }
    } catch (error) {
      console.error('Erro ao buscar metas detalhadas: ', error);
    }
  };
  
  const handleClickPremioOperadorCaixa = (row) => {
    if (row && row.IDSUBGRUPOEMPRESARIAL) {
      handlePremioOperadorCaixa(row.IDSUBGRUPOEMPRESARIAL, row.DTPREMIOINICIO, row.DTPREMIOFIM, row.DSSUBGRUPOEMPRESARIAL);
    }
  };

  const handlePremioAssistentes = async (IDSUBGRUPOEMPRESARIAL, DTPREMIOINICIO, DTPREMIOFIM, DSSUBGRUPOEMPRESARIAL) => {
    try {
      const response = await get(`/lista-premios-gerente?idSubGrupo=${IDSUBGRUPOEMPRESARIAL}&dataPesquisaInicio=${DTPREMIOINICIO}&dataPesquisaFim=${DTPREMIOFIM}&funcao=ASSISTENTES`)
      if (response.data && response.data.length > 0) {

        setDadosAssistentes({
          data: response.data,
          idSubGrupo: IDSUBGRUPOEMPRESARIAL,
          dataPesquisaInicio: DTPREMIOINICIO,
          dataPesquisaFim: DTPREMIOFIM,
          dsSubGrupo: DSSUBGRUPOEMPRESARIAL
        });
        setTabelasSecundariasVisiveis(true);
        setTabelaVisivel(false);;
      }
    } catch (error) {
      console.error('Erro ao buscar metas detalhadas: ', error);
    }
  };
  
  const handleClickPremioAssistentes = (row) => {
    if (row && row.IDSUBGRUPOEMPRESARIAL) {
      handlePremioAssistentes(row.IDSUBGRUPOEMPRESARIAL, row.DTPREMIOINICIO, row.DTPREMIOFIM, row.DSSUBGRUPOEMPRESARIAL);
    }
  };

  const handlePremioMultiplicador = async (IDSUBGRUPOEMPRESARIAL, DTPREMIOINICIO, DTPREMIOFIM, DSSUBGRUPOEMPRESARIAL) => {
    try {
      const response = await get(`/lista-premios-gerente?idSubGrupo=${IDSUBGRUPOEMPRESARIAL}&dataPesquisaInicio=${DTPREMIOINICIO}&dataPesquisaFim=${DTPREMIOFIM}&funcao=MULTIPLICADOR`)
      if (response.data && response.data.length > 0) {

        setDadosMultiplicador({
          data: response.data,
          idSubGrupo: IDSUBGRUPOEMPRESARIAL,
          dataPesquisaInicio: DTPREMIOINICIO,
          dataPesquisaFim: DTPREMIOFIM,
          dsSubGrupo: DSSUBGRUPOEMPRESARIAL
        });
        setTabelasSecundariasVisiveis(true);
        setTabelaVisivel(false);;
      }
    } catch (error) {
      console.error('Erro ao buscar metas detalhadas: ', error);
    }
  };
  
  const handleClickPremioMultiplicador = (row) => {
    if (row && row.IDSUBGRUPOEMPRESARIAL) {
      handlePremioMultiplicador(row.IDSUBGRUPOEMPRESARIAL, row.DTPREMIOINICIO, row.DTPREMIOFIM, row.DSSUBGRUPOEMPRESARIAL);
    }
  };

  const handlePremioFiscal = async (IDSUBGRUPOEMPRESARIAL, DTPREMIOINICIO, DTPREMIOFIM, DSSUBGRUPOEMPRESARIAL) => {
    try {
      const response = await get(`/lista-premios-gerente?idSubGrupo=${IDSUBGRUPOEMPRESARIAL}&dataPesquisaInicio=${DTPREMIOINICIO}&dataPesquisaFim=${DTPREMIOFIM}&funcao=FISCAL`)
      if (response.data && response.data.length > 0) {

        setDadosFiscal({
          data: response.data,
          idSubGrupo: IDSUBGRUPOEMPRESARIAL,
          dataPesquisaInicio: DTPREMIOINICIO,
          dataPesquisaFim: DTPREMIOFIM,
          dsSubGrupo: DSSUBGRUPOEMPRESARIAL
        });
        setTabelasSecundariasVisiveis(true);
        setTabelaVisivel(false);;
      }
    } catch (error) {
      console.error('Erro ao buscar metas detalhadas: ', error);
    }
  };
  
  const handleClickPremioFiscal = (row) => {
    if (row && row.IDSUBGRUPOEMPRESARIAL) {
      handlePremioFiscal(row.IDSUBGRUPOEMPRESARIAL, row.DTPREMIOINICIO, row.DTPREMIOFIM, row.DSSUBGRUPOEMPRESARIAL);
    }
  };

  return (

    <Fragment>

      <div className="card">
        <DataTable
          title="Vendas por Loja"
          value={dados}
          sortField="VRTOTALPAGO"
          sortOrder={-1}
          paginator={true}
          rows={10}
              selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            rowsPerPageOptions={[10, 20, 50, dados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
          showGridlines
          stripedRows
          emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}

        >
          {colunasVendas.map(coluna => (
            <Column
              key={coluna.field}
              field={coluna.field}
              header={coluna.header}

              body={coluna.body}
              footer={coluna.footer}
              sortable={coluna.sortable}
              headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '1rem' }}
              footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
              bodyStyle={{ fontSize: '1rem' }}

            />
          ))}
        </DataTable>
      </div>

    </Fragment>
  )
}