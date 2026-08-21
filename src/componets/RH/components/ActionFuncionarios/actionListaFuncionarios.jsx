import React, { Fragment, useState } from "react"
import { dataFormatada } from "../../../../utils/dataFormatada";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import HeaderTable from "../../../Tables/headerTable";
import { toFloat } from "../../../../utils/toFloat";
import { formatarPorcentagem } from "../../../../utils/formatarPorcentagem";
import { ActionEditarFuncionario } from "./ActionEditar/actionEditarFuncionario";
import { useDesligarFuncionario } from "./hooks/useDesligarFuncionario";
import { useAtivarFuncionario } from "./hooks/useAtivarFuncionario";
import { useFuncionarioModal } from "./hooks/useFuncionarioModal";
import { ActionEditarDescontoFuncionarioModal } from "./ActionDesconto/actionEditarDescontoFuncionarioModal";
import { useExportarTabela } from "../../../../hooks/useExportarTabela";
import { executarComPermissao } from "../../../../utils/permissao";
import { AcoesFuncionarioColuna } from "./AcoesFuncionarioColuna";

export const ActionListaFuncionarios = ({ dadosFuncionarios, optionsModulos, usuarioLogado, handleClick, refetch }) => {
  const [rowSelection, setRowSelection] = useState(null);
  const { handleDesligarFuncionario } = useDesligarFuncionario({ optionsModulos, usuarioLogado, handleClick })
  const { handleAtivarFuncionario } = useAtivarFuncionario({ optionsModulos, usuarioLogado, handleClick })
  const modalEditar = useFuncionarioModal();
  const modalDesconto = useFuncionarioModal();

  function formatarDataBR(dataISO) {
    if (!dataISO || dataISO === "null" || dataISO === "undefined") return "";
    const d = new Date(dataISO);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("pt-BR");
  }

  const dados = dadosFuncionarios.map((item, index) => {
    let contador = index + 1;

    return {
      contador,
      NUCPF: item.NUCPF,
      NOFUNCIONARIO: item.NOFUNCIONARIO,
      NOLOGIN: item.NOLOGIN,
      DSFUNCAO: item.DSFUNCAO,
      STLOJA: item.STLOJA,
      STCONVENIO: item.STCONVENIO,
      DSTIPO: item.DSTIPO,
      PERC: toFloat(item.PERC),
      STATIVO: item.STATIVO,
      DATA_DEMISSAO: item.DATA_DEMISSAO,
      ID: item.ID,
      IDFUNCIONARIO: item.IDFUNCIONARIO,
      TELEFONE: item.TELEFONE,
      DEPARTAMENTO: item.DEPARTAMENTO

    };
  });

  const colunasExportacao = [
    { header: 'Nº', value: item => item.contador, width: 70 },
    { header: 'CPF', value: item => item.NUCPF, width: 100 },
    { header: 'Funcionário', value: item => item.NOFUNCIONARIO, width: 200 },
    { header: 'Login', value: item => item.NOLOGIN, width: 100 },
    { header: 'Função', value: item => item.DSFUNCAO, width: 100 },
    { header: 'Localização', value: item => item.STLOJA == 'True' ? 'Loja' : 'Escritório', width: 100 },
    { header: 'TP. Contratação', value: item => item.STCONVENIO == 'True' ? 'CLT' : 'PJ', width: 100 },
    { header: 'Tipo', value: item => item.DSTIPO == 'PN' ? 'PARCEIRO DE NEGÓCIOS' : 'FUNCIÓNARIO', width: 100 },
    { header: 'Telefone', value: item => item.TELEFONE, width: 100 },
    { header: 'Departamento', value: item => item.DEPARTAMENTO, width: 100 },
    { header: 'Desconto %', value: item => item.PERC, width: 100 },
    { header: 'Situação', value: item => item.STATIVO == 'True' ? 'Ativo' : 'Inativo', width: 100 },
    { header: 'DT Desl.', value: item => dataFormatada(item.DATA_DEMISSAO), width: 100 },
  ];

  const {
    globalFilterValue,
    onGlobalFilterChange,
    dataTableRef,
    handlePrint,
    exportToPDF,
    exportToExcel,
  } = useExportarTabela({
    dados,
    colunas: colunasExportacao,
    nomeArquivo: 'lista_funcionarios',
    tituloDocumento: 'Lista de Funcionarios',
    nomePlanilha: 'Lista de Funcionarios',
  });

  const handleClickEdit = (row) => {
    executarComPermissao(optionsModulos[0]?.ALTERAR == 'True', () => {
      if (row?.ID) {
        modalEditar.abrir(row.ID);
      }
    });
  };

  const handleClickDesconto = (row) => {
    executarComPermissao(optionsModulos[0]?.ALTERAR == 'True', () => {
      if (row?.ID) {
        modalDesconto.abrir(row.ID);
      }
    });
  };

  const colunasFuncionarios = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true,

    },
    {
      field: 'NUCPF',
      header: 'CPF',
      body: row => <th>{row.NUCPF}</th>,
      sortable: true,

    },
    {
      field: 'NOFUNCIONARIO',
      header: 'Funcionário',
      body: row => (
        <div style={{ width: '200px' }}>

          <th>{row.NOFUNCIONARIO}</th>
        </div>
      ),
      sortable: true,

    },
    {
      field: 'NOLOGIN',
      header: 'Login',
      body: row => <th>{row.NOLOGIN}</th>,
      sortable: true,

    },
    {
      field: 'DSFUNCAO',
      header: 'Função',
      body: row => <th>{row.DSFUNCAO}</th>,
      sortable: true,

    },
    {
      field: 'STLOJA',
      header: 'Localização',
      body: (row) => (
        <th>
          {row.STLOJA == 'True' ? 'Loja' : 'Escritório'}
        </th>
      ),
      sortable: true,

    },
    {
      field: 'STCONVENIO',
      header: 'TP. Contratação',
      body: (
        (row) => (
          <th>
            {row.STCONVENIO == 'True' ? 'CLT' : 'PJ'}

          </th>
        )
      ),
      sortable: true,
    },
    {
      field: 'DSTIPO',
      header: 'Tipo',
      body: (row) => {

        let tipo = row.DSTIPO;

        if (tipo === 'PN') {
          tipo = 'PARCEIRO DE NEGÓCIOS';
        } else if (tipo === 'PNC') {
          tipo = 'PARCEIRO DE NEGÓCIOS CONVÊNIO';
        }

        return (
          <div style={{ width: '220px' }}>
            <th>{tipo}</th>
          </div>
        );
      },
      sortable: true,
    },
    {
      field: 'TELEFONE',
      header: 'Telefone',
      body: (row) => (
        <div style={{}}>
          <th>
            {row.TELEFONE}
          </th>
        </div>
      ),
      sortable: true,
    },
    {
      field: 'DEPARTAMENTO',
      header: 'Departamento',
      body: (row) => (
        <div style={{}}>
          <th>
            {row.DEPARTAMENTO}
          </th>
        </div>
      ),
      sortable: true,
    },
    {
      field: 'PERC',
      header: 'Desc %',
      body: (
        (row) => (
          <th style={{ color: row.PERC == 'False' ? 'red' : 'blue' }}>
            {formatarPorcentagem(row.PERC)}

          </th>
        )
      ),
      sortable: true,
    },
    {
      field: 'STATIVO',
      header: 'Situação',
      body: (
        (row) => (
          <th style={{ color: row.STATIVO == 'True' ? 'blue' : 'red' }}>
            {row.STATIVO == 'True' ? 'Ativo' : 'Inativo'}

          </th>
        )
      ),
      sortable: true,
    },
    {
      field: 'DATA_DEMISSAO',
      header: 'DT Desl.',
      body: row => <th>{formatarDataBR(row.DATA_DEMISSAO)}</th>,
      sortable: true,
    },
    {
      field: 'ID',
      header: 'Opções',
      body: (row) => (
        <AcoesFuncionarioColuna
          row={row}
          optionsModulos={optionsModulos}
          onEditar={handleClickEdit}
          onDesconto={handleClickDesconto}
          onAtivar={handleAtivarFuncionario}
          onDesligar={handleDesligarFuncionario}
        />
      ),
      sortable: true,
    },

  ]

  
  return (

    <Fragment>

      <div className="panel">
        <div className="panel-hdr">
          <h2>Lista de Funcionários</h2>
        </div>
        <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
          <HeaderTable
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={onGlobalFilterChange}
            handlePrint={handlePrint}
            exportToExcel={exportToExcel}
            exportToPDF={exportToPDF}
          />

        </div>
        <div className="card" ref={dataTableRef}>

          <DataTable
            title="Lista de Funcionários"
            value={dados}
            size="small"
            globalFilter={globalFilterValue}
            sortOrder={-1}
            paginator={true}
            rows={10}
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasFuncionarios.map(coluna => (

              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}

                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '1rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '1rem', border: '1px solid #e9e9e9' }}
              />
            ))}
          </DataTable>

        </div>
      </div>

      <ActionEditarFuncionario
        show={modalEditar.visivel}
        handleClose={modalEditar.fechar}
        dadosAtualizarFuncionarios={modalEditar.dados}
        optionsModulos={optionsModulos}
        usuarioLogado={usuarioLogado}
        handleClick={handleClick}
        refetch={refetch}
      />

      <ActionEditarDescontoFuncionarioModal
        show={modalDesconto.visivel}
        handleClose={modalDesconto.fechar}
        dadosDescontoFuncionarios={modalDesconto.dados}
        optionsModulos={optionsModulos}
        usuarioLogado={usuarioLogado}
        handleClick={handleClick}
        refetch={refetch}
      />

    </Fragment>
  )
}
