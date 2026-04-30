import { Fragment, useRef, useState } from "react"
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { CiEdit } from "react-icons/ci";
import { get } from "../../../../api/funcRequest";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";
import { BsTrash3 } from "react-icons/bs";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { FaLink, FaUnlink } from "react-icons/fa";
import { GiPadlock, GiPadlockOpen } from "react-icons/gi";
import { GrFormView, GrView } from "react-icons/gr";
import { SiSap } from "react-icons/si";
import { ActionDesvincularNotasNFEModal } from "./actionDesvincularNotasNFEModal";
import { IoMdAdd } from "react-icons/io";
import Swal from "sweetalert2";
import { ActionVisualizarNFE } from "./ActionVisualizarNota/actionVisualizarNFE";

export const ActionListaNotasNFE = ({ 
  dadosNFE, 
  usuarioLogado, 
  optionsModulos,
  setDadosListaPedidosSemVinculoNFE,
  setTabelaPedido,
  setTabelaVisivel
 }) => {
  const [modalDesvincular, setModalDesvincular] = useState(false);
  const [modalVisualizar, setModalVisualizar] = useState(false);
  const [dadosPedidosVinculados, setDadosPedidosVinculados] = useState([]);
  const [dadosVisualizarNFE, setDadosVisualizarNFE] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();


  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Pedidos Periodo',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Descrição', 'Grupo Estrutura', 'Situação']],
      body: dados.map(item => [
        item.contador,
        item.DS_ESTILOS,
        `${item.COD_GRUPOESTILOS} - ${item.DS_GRUPOESTILOS}`,
        item.STATIVO == 'True' ? 'ATIVO' : 'INATIVO'
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('lista_estilos.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Descrição', 'Grupo Estrutura', 'Situação']
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº' },
      { wpx: 100, caption: 'Descrição' },
      { wpx: 100, caption: 'Grupo Estrutura' },
      { wpx: 100, caption: 'Situação' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pedidos Periodo');
    XLSX.writeFile(workbook, 'lista_estilos.xlsx');
  };


  const dados = dadosNFE.map((item, index) => {
    let contador = index + 1;
    let numSerieNota = `${item.SERIE} - ${item.NNF}`;

    return {
      contador,
      DTCADASTRO: item.DTCADASTRO,
      DEMI: item.DEMI,
      EMIT_XNOME: item.EMIT_XNOME,
      SERIE: item.SERIE,
      NNF: item.NNF,
      IDRESUMOENTRADA: item.IDRESUMOENTRADA,
      STCANCELADO: item.STCANCELADO,
      STMIGRADOSAP: item.STMIGRADOSAP,
      LOGSAP: item.LOGSAP,
      numSerieNota
    }
  })

  const colunasUnidadeMedida = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'DTCADASTRO',
      header: 'Data Cadastro',
      body: row => <th>{row.DTCADASTRO}</th>,
      sortable: true,
    },
    {
      field: 'DEMI',
      header: 'Data Emissão',
      body: row => {
        return (
          <th>{row.DEMI}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'EMIT_XNOME',
      header: 'Fornecedor',
      body: row => {
        return (
          <th>{row.EMIT_XNOME}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'SERIE',
      header: 'Série',
      body: row => {
        return (
          <th>{row.SERIE}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'NNF',
      header: 'NFE',
      body: row => {
        return (
          <th>{row.NNF}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'STCANCELADO',
      header: 'Status SAP',
      body: row => {
        if(row.STCANCELADO == 'True') {
          return (
            <th style={{ color: 'red', textTransform: 'uppercase'  }} >
              CANCELADA  
            </th>
          )
        } else if(row.LOGSAP) {
          return (
            <th style={{ color: row.STMIGRADOSAP == 'True' ? '#2196F3' : '#FD3995',textTransform: 'uppercase'  }} >
              {row.LOGSAP }
            </th>
          )
        } else {
          return (
            <th style={{ textTransform: 'uppercase'  }} >
              SEM RETORNO SAP 
            </th>
          )
        }
      },
      sortable: true,
    },

    {
      field: 'IDRESUMOENTRADA',
      header: 'Opções',
      body: row => {
        const stCancelado = row.STCANCELADO === 'True';
        const stSAP = row.STMIGRADOSAP === 'True';
        return (
          <div style={{ justifyContent: "space-between", display: "flex" }}>
            {!stSAP && !stCancelado && (
              <div className="p-1">
                <ButtonTable
                  titleButton={"Migrar Para o SAP"}
                  onClickButton={() => clickVincular(row)}
                  cor={"primary"}
                  Icon={SiSap}
                  iconSize={25}
                  iconColor={"#fff"}
                  width="30px"
                  height="30px"
                />
              </div>
            )}

            <div className="p-1">
              <ButtonTable
                titleButton={"Visualizar Nota"}
                onClickButton={() => clickVisualizar(row)}
                cor={"info"}
                Icon={GrView}
                iconSize={25}
                iconColor={"#fff"}
                width="30px"
                height="30px"
              />
            </div>

            {!stCancelado && (
              <div className="p-1">
                <ButtonTable
                  titleButton={"Vincular Nota Fiscal a Pedidos"}
                  onClickButton={() => clickVincular(row)}
                  cor={"success"}
                  Icon={FaLink}
                  iconSize={25}
                  iconColor={"#fff"}
                  width="30px"
                  height="30px"
                />
              </div> 
            )}

            {/* {!stCancelado && (
              <div className="p-1">
                <ButtonTable
                  titleButton={"Desvincular Pedidos Desta Nota Fiscal"}
                  onClickButton={() => clickDesvincular(row)}
                  cor={"warning"}
                  Icon={FaUnlink}
                  iconSize={25}
                  iconColor={"#fff"}
                  width="30px"
                  height="30px"
                />
              </div>
            )} */}

            {!stCancelado && (
              <div className="p-1">
                <ButtonTable
                  titleButton={"Criar Nota Fiscal de Devolução"}
                  onClickButton={() => clickCriarNota(row)}
                  cor={"secondary"}
                  Icon={IoMdAdd}
                  iconSize={25}
                  iconColor={"#fff"}
                  width="30px"
                  height="30px"
                />
              </div>
            )}

            {!stCancelado && (
              <div className="p-1">
                <ButtonTable
                  titleButton={"Cancelar Nota Fiscal"}
                  onClickButton={() => clickCriarNota(row)}
                  cor={"danger"}
                  Icon={BsTrash3}
                  iconSize={25}
                  iconColor={"#fff"}
                  width="30px"
                  height="30px"
                />
              </div>
            )}
          
          </div>
        )
      },
      sortable: true,
    }
  ]

  const clickDesvincular = (row) => {
    if (row && row.IDRESUMOENTRADA) {
      handleDesvincular(row.IDRESUMOENTRADA);
    }
  };

  const handleDesvincular = async (IDRESUMOENTRADA) => {
    try {
      const response = await get(`/vinculo-nfPedidos?idNota=${IDRESUMOENTRADA}`);
      setDadosPedidosVinculados(response.data);
      setModalDesvincular(true);
    } catch (error) {
      console.error(error);
    }
  }

  const clickVincular = (row) => {
    if (row && row.IDRESUMOENTRADA) {
      handleVincular(row.IDRESUMOENTRADA);
    }
  };

  const handleVincular = async (IDRESUMOENTRADA) => {
    try {
      const response = await get(`/pedidos-sem-vinculo-nfe?idNota=${IDRESUMOENTRADA}`);
      if(response.data && response.data.length > 0) {
        setDadosListaPedidosSemVinculoNFE(response.data);
        setTabelaPedido(true);
        setTabelaVisivel(false);
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Nenhum pedido encontrado',
          text: 'Não foi possível encontrar pedidos sem vínculo para esta nota fiscal.',
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  const clickVisualizar = (row) => {
    if (row && row.IDRESUMOENTRADA) {
      handleVisualizar(row.IDRESUMOENTRADA);
    }
  }

  const handleVisualizar = async (IDRESUMOENTRADA) => {
    try {
      const response = await get(`/cadastro-nfpedido?idPedido=${IDRESUMOENTRADA}`);
      if(response.data && response.data.length > 0) {
        setDadosVisualizarNFE(response.data);
        setModalVisualizar(true);
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Nenhum detalhe encontrado',
          text: 'Não foi possível encontrar os detalhes para esta nota fiscal.',
        });
      }
    }catch (error) {
      console.error(error);
    }
  }
  return (
    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2>Lista de Notas Fiscais</h2>
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
            title="Notas Fiscais"
            value={dados}
            globalFilter={globalFilterValue}
            size="small"
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
          >
            {colunasUnidadeMedida.map(coluna => (
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

        <ActionDesvincularNotasNFEModal 
          show={modalDesvincular}
          handleClose={() => setModalDesvincular(false)}
          dadosPedidosVinculados={dadosPedidosVinculados}
        />

        <ActionVisualizarNFE 
          show={modalVisualizar}
          handleClose={() => setModalVisualizar(false)}
          dadosVisualizarNFE={dadosVisualizarNFE}
        /> 
      </div>

    </Fragment>
  )
}