import { Fragment, useEffect, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { CiEdit } from "react-icons/ci";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";
import { toFloat } from "../../../../utils/toFloat";
import { getDataAtual } from "../../../../utils/dataAtual";
import { GrView } from "react-icons/gr";
import { ActionEditarAlteracaoPrecosModal } from "./ActionEditarAlteracaoPreco/actionEditarAlteracaoPrecosModal";
import { ActionDetalhesAlteracaoPrecos } from "./ActionDetalheVisualizar/actionDetalhesAlteracaoPrecos";
import { get } from "../../../../api/funcRequest";


export const ActionListaAlteracaoPreco = ({dadosAlteracaoPreco}) => {
  const [modalEditar, setModalEditar] = useState(false);
  const [modalVisualizar, setModalVisualizar] = useState(false);
  const [dadosDetalheAlteracao, setDadosDetalheAlteracao] = useState([]);
  const [dadosVisualizarDetalhe, setDadosVisualizarDetalhe] = useState([]);
  const [dataHoje, setDataHoje] = useState(new Date());
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();

  useEffect(() => {
    const dataAtual = getDataAtual();
    setDataHoje(dataAtual);
  }, []);

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista de Alteração Preço',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'ID Alteração', 'Lista de Preço', 'Responsável', 'QTD Produtos', 'Data Criação', 'Data Agendamento']],
      body: dados.map(item => [
        item.contador,
        item.IDRESUMOALTERACAOPRECOPRODUTO,
        item.NOMELISTA || item.NOFANTASIA,
        item.NOFUNCIONARIO,
        toFloat(item.QTDITENS),
        item.DATACRIACAOFORMATADA,
        item.AGENDAMENTOALTERACAOFORMATADO,
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('lista_alteracao_preco.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'ID Alteração', 'Lista de Preço',  'Responsável', 'QTD Produtos', 'Data Criação', 'Data Agendamento'];
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº' },
      { wpx: 100, caption: 'ID Alteração' },
      { wpx: 250, caption: 'Lista de Preço' },
      { wpx: 200, caption: 'Responsável' },
      { wpx: 100, caption: 'Qtd. Produtos' },
      { wpx: 200, caption: 'Data Criação' },
      { wpx: 200, caption: 'Data Agendamento' },
  
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista de Alteração Preço');
    XLSX.writeFile(workbook, 'lista_alteracao_preco.xlsx');
  };

  const dados = dadosAlteracaoPreco.map((item, index) => {
    let contador = index + 1;

    return {
      contador,
      IDRESUMOALTERACAOPRECOPRODUTO: item.IDRESUMOALTERACAOPRECOPRODUTO,
      NOMELISTA: item.NOMELISTA || item.NOFANTASIA,
      NOFUNCIONARIO: item.NOFUNCIONARIO,
      QTDITENS: toFloat(item.QTDITENS),
      DATACRIACAOFORMATADA: item.DATACRIACAOFORMATADA,
      AGENDAMENTOALTERACAOFORMATADO: item.AGENDAMENTOALTERACAOFORMATADO,    
      AGENDAMENTOALTERACAO: item.AGENDAMENTOALTERACAO, 
      authEdit: new Date(item.AGENDAMENTOALTERACAO) > dataHoje,
    }
  })

  const colunasAlteracoesPreco = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'IDRESUMOALTERACAOPRECOPRODUTO',
      header: 'ID Alteração',
      body: row => <th>{row.IDRESUMOALTERACAOPRECOPRODUTO}</th>,
      sortable: true,
    },
    {
      field: 'NOMELISTA',
      header: 'Lista de Preço',
      body: row => {
        return (
          <th> {row.NOMELISTA}</th>
        )
      
      },
      sortable: true,
    },
    {
      field: 'NOFUNCIONARIO',
      header: 'Responsável',
      body: row => {
        return (
          <th >{row.NOFUNCIONARIO}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'QTDITENS',
      header: 'Qtd. Produtos',
      body: row => {
        return (
          <th >{row.QTDITENS}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'DATACRIACAOFORMATADA',
      header: 'Data Criação',
      body: row => {
        return (
          <th >{row.DATACRIACAOFORMATADA || ''}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'AGENDAMENTOALTERACAOFORMATADO',
      header: 'Data Agendamento',
      body: row => {
        return (
          <th>{row.AGENDAMENTOALTERACAOFORMATADO || row.DATACRIACAOFORMATADA}</th>
        )
      },
      sortable: true,
    },
  
    {
      field: 'IDRESUMOALTERACAOPRECOPRODUTO',
      header: 'Detalhes',
      body: row => {
        if(row.authEdit){
          return (
            <div>
              <ButtonTable
                titleButton={"Editar "}
                cor={"primary"}
                Icon={CiEdit}
                iconSize={22}
                iconColor={"#fff"}
                onClickButton={() => clickEditar(row)}
              />
            </div>
          )
        } else
        return (
          <div>
            <ButtonTable
              titleButton={"Visualizar"}
              onClickButton={() => clickVisualizar(row)}
              cor={"success"}
              Icon={GrView}
              iconSize={22}
              iconColor={"#fff"}
            />
          </div>
        )
      },
      sortable: true,
    }
  ]

  const clickEditar = (row) => {
    if (row && row.IDRESUMOALTERACAOPRECOPRODUTO) {
      handleEditar(row.IDRESUMOALTERACAOPRECOPRODUTO);
    }
  };

  const handleEditar = async (IDRESUMOALTERACAOPRECOPRODUTO) => {
    try {
      const response = await get(`/alteracoes-de-precos-detalhes?idAlteracaoPreco=${IDRESUMOALTERACAOPRECOPRODUTO}`);
      setDadosDetalheAlteracao(response.data);
      setModalEditar(true)
    } catch (error) {
      console.error(error);
    }
  }
  const clickVisualizar = (row) => {
    if (row && row.IDRESUMOALTERACAOPRECOPRODUTO) {
      handleVisualizar(row.IDRESUMOALTERACAOPRECOPRODUTO);
    }
  };

  const handleVisualizar = async (IDRESUMOALTERACAOPRECOPRODUTO) => {
    try {
      const response = await get(`/alteracoes-de-precos-detalhes?idAlteracaoPreco=${IDRESUMOALTERACAOPRECOPRODUTO}`);
      setDadosVisualizarDetalhe(response.data);
      setModalVisualizar(true)
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2>Lista Alteração Preço</h2>
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
        <div className="card mb-4" ref={dataTableRef}>

        <DataTable
          title="Vendas por Loja"
          value={dados}
          globalFilter={globalFilterValue}
          size="small"
          sortOrder={-1}
          paginator={true}
          rows={10}
          rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
          showGridlines
          stripedRows
          emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
        >
          {colunasAlteracoesPreco.map(coluna => (
            <Column
              key={coluna.field}
              field={coluna.field}
              header={coluna.header}

              body={coluna.body}
              footer={coluna.footer}
              sortable={coluna.sortable}
              headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
              footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
              bodyStyle={{ fontSize: '0.8rem' }}

            />
          ))}
        </DataTable>
        </div>
      </div>

      <ActionEditarAlteracaoPrecosModal
        show={modalEditar}
        handleClose={() => setModalEditar(false)}
        dadosDetalheAlteracao={dadosDetalheAlteracao}
      />

      <ActionDetalhesAlteracaoPrecos 
        show={modalVisualizar}
        handleClose={() => setModalVisualizar(false)}
        dadosVisualizarDetalhe={dadosVisualizarDetalhe}
      />
    </Fragment>
  )
}