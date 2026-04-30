import { Fragment, useRef, useState, useEffect } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../../Tables/headerTable";
import Swal from "sweetalert2";
import { formatMoeda } from "../../../../../utils/formatMoeda";


export const ActionListaPedidosSemVinculoNFE = ({
  dadosListaPedidosSemVinculoNFE,
  usuarioLogado,
  optionsModulos,
  handleClose,
  selectedItems,
  setSelectedItems
}) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [btnVisivel, setBtnVisivel] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [pedidosSelecionados, setPedidosSelecionados] = useState([]);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const dataTableRef = useRef();


  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Pedidos Sem Vínculo',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº', 'Nº Pedido', 'Marca', 'Comprador', 'Fornecedor', 'Valor Pedido', 'Data']],
      body: dados.map(item => [
        item.contador,
        item.IDPEDIDO,
        item.NOFORNECEDOR,
        item.NOMECOMPRADOR,
        item.NOFANTASIA,
        formatMoeda(item.VRTOTALLIQUIDO),
        item.DTPEDIDO
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('pedidos_sem_vinculo.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Nº Pedido', 'Marca', 'Comprador', 'Fornecedor', 'Valor Pedido', 'Data']
    worksheet['!cols'] = [
      { wpx: 50, caption: 'Nº' },
      { wpx: 100, caption: 'Nº Pedido' },
      { wpx: 200, caption: 'Marca' },
      { wpx: 250, caption: 'Comprador' },
      { wpx: 250, caption: 'Fornecedor' },
      { wpx: 100, caption: 'Valor Pedido' },
      { wpx: 200, caption: 'Data' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pedidos Sem Vínculo');
    XLSX.writeFile(workbook, 'pedidos_sem_vinculo.xlsx');
  };
 
  const dados = dadosListaPedidosSemVinculoNFE?.data
    .filter((item) => {
      const statusVinc = item.STATUSVINC;
      const idNota = item.NOTAVINC;
      return (!statusVinc || statusVinc === 'False') && 
        (!idNota || idNota !== dadosListaPedidosSemVinculoNFE.idNotaFiscal);
    }).map((item, index) => {
    let contador = index + 1;

    return {
      contador,
      IDPEDIDO: item.IDPEDIDO,
      NOFANTASIA: item.NOFANTASIA,
      NOMECOMPRADOR: item.NOMECOMPRADOR,
      NOFORNECEDOR: item.NOFORNECEDOR,
      VRTOTALLIQUIDO: formatMoeda(item.VRTOTALLIQUIDO),
      DTPEDIDO: item.DTPEDIDO,
      STATUSVINC: item.STATUSVINC,
      NOTAVINC: item.NOTAVINC,
      LOGSAP: item.LOGSAP,
    }
  })

  useEffect(() => {
    const itensSelecionaveis = dados.filter(item => {
    return (!item.STATUSVINC || item.STATUSVINC === 'False') && 
            (!item.NOTAVINC || item.NOTAVINC !== dadosListaPedidosSemVinculoNFE.idNotaFiscal) &&
            item.stDisabled !== 'disabled';
    });
    const dadosPaginaAtual = dados.slice(first, first + rows);
    const itensSelecionaveisPaginaAtual = dadosPaginaAtual.filter(item => {
      return (!item.STATUSVINC || item.STATUSVINC === 'False') && 
             (!item.NOTAVINC || item.NOTAVINC !== dadosListaPedidosSemVinculoNFE.idNotaFiscal) &&
             item.stDisabled !== 'disabled';
    });

    if (selectedItems.length === 0) {
      setSelectAllChecked(false);
    } else if (selectedItems.length === itensSelecionaveis.length) {
      
      setSelectAllChecked(true);
    } else if (
      itensSelecionaveisPaginaAtual.length > 0 &&
      itensSelecionaveisPaginaAtual.every(item =>
        selectedItems.some(selected => selected.IDPEDIDO === item.IDPEDIDO)
      )
    ) {
      
      setSelectAllChecked(true);
    } else {
      setSelectAllChecked(false);
    }
  }, [selectedItems, dados, first, rows]);
  
  const onSelectAllChange = (checked) => {
    if (checked) {
      Swal.fire({
        icon: 'question',
        title: 'Selecione o modo de seleção',
        text: 'Deseja selecionar todos da tabela ou somente o que está em tela?',
        showConfirmButton: true,
        showCancelButton: true,
        showCloseButton: true,
        customClass: { container: 'custom-swal' },
        confirmButtonText: 'Todos os registros',
        cancelButtonText: 'Apenas o que está tela',
        cancelButtonColor: '#2196F3',
        allowOutsideClick: false,
      }).then((result) => {

        if (result.isConfirmed) {
          const itensSelecionaveis = dados.filter(item => item.stDisabled !== 'disabled');
  
          setSelectedItems(itensSelecionaveis.map(item => ({ ...item, idNotaFiscal: dadosListaPedidosSemVinculoNFE.idNotaFiscal })));
          setSelectedIds(itensSelecionaveis.map(item => item.IDPEDIDO));
          setPedidosSelecionados(itensSelecionaveis.map(item => ({ ...item, quantidade: 1, idNotaFiscal: dadosListaPedidosSemVinculoNFE.idNotaFiscal })));
          setSelectAll(true);

        } else if (result.dismiss === Swal.DismissReason.cancel) {
          const itensSelecionaveisPaginaAtual = dados.slice(first, first + rows).filter(item => item.stDisabled !== 'disabled');

          setSelectedItems(itensSelecionaveisPaginaAtual.map(item => ({ ...item, idNotaFiscal: dadosListaPedidosSemVinculoNFE.idNotaFiscal })));
          setSelectedIds(itensSelecionaveisPaginaAtual.map(item => item.IDPEDIDO));
          setPedidosSelecionados(itensSelecionaveisPaginaAtual.map(item => ({ ...item, quantidade: 1, idNotaFiscal: dadosListaPedidosSemVinculoNFE.idNotaFiscal })));
          setSelectAll(true);

        } else {
          setSelectedItems([]);
          setSelectedIds([]);
          setPedidosSelecionados([]);
          setSelectAll(false);
        }
      });
    } else {

      setSelectedItems([]);
      setSelectedIds([]);
      setPedidosSelecionados([]);
      setSelectAll(false);
    }
  }
  console.log(selectedItems, 'Lista selectedItems');
  const colunasUnidadeMedida = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'IDPEDIDO',
      header: 'Nº Pedido',
      body: row => <th>{row.IDPEDIDO}</th>,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Marca',
      body: row => <th>{row.NOFANTASIA}</th>,
      sortable: true,
    },
    {
      field: 'NOMECOMPRADOR',
      header: 'Comprador',
      body: row => {
        return (
          <th>{row.NOMECOMPRADOR}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'NOFORNECEDOR',
      header: 'Fornecedor',
      body: row => {
        return (
          <th>{row.NOFORNECEDOR}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'VRTOTALLIQUIDO',
      header: 'Valor Pedido',
      body: row => {
        return (
          <th>{row.VRTOTALLIQUIDO}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'DTPEDIDO',
      header: 'Data',
      body: row => {
        return (
          <th>{row.DTPEDIDO}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'IDRESUMOENTRADA',
      header: (
        <div>
          <label>{selectAllChecked ? 'Desmarcar Todos' : 'Marcar Todos'}</label>
          <input
            type="checkbox"
            checked={selectAllChecked}
            onChange={(e) => onSelectAllChange(e.target.checked)}
          />
        </div>
      ),
      body: row => {
        return (
          <div style={{ justifyContent: "space-between", display: "flex" }}>

            <input
              type="checkbox"
              checked={selectedIds.includes(row.IDPEDIDO)}
              onChange={(e) => {
                const checked = e.target.checked;
                const updatedSelectedIds = checked
                  ? [...selectedIds, row.IDPEDIDO]
                  : selectedIds.filter(id => id !== row.IDPEDIDO);
                setSelectedIds(updatedSelectedIds);

                const updatedSelectedItems = checked
                  ? [...selectedItems, { ...row, idNotaFiscal: dadosListaPedidosSemVinculoNFE.idNotaFiscal }]
                  : selectedItems.filter(item => item.IDPEDIDO !== row.IDPEDIDO);
                setSelectedItems(updatedSelectedItems);

                const updatedPedidosSelecionados = checked
                  ? [...pedidosSelecionados, { ...row, quantidade: 1, idNotaFiscal: dadosListaPedidosSemVinculoNFE.idNotaFiscal }]
                  : pedidosSelecionados.filter(item => item.IDPEDIDO !== row.IDPEDIDO);
                setPedidosSelecionados(updatedPedidosSelecionados);
                setBtnVisivel(updatedSelectedIds.length > 0);
                
              }}
            />
            {/* {console.log(selectedItems, 'selectedItems')} */}
          </div>
        )
      },
      sortable: true,
    }
  ]

  return (
    <Fragment>
      <div className="panel">
        <div className="panel-hdr">
          <h2>Lista de Pedidos Sem Vínculo</h2>
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
            title="Pedidos Sem Vínculo"
            value={dados}
            globalFilter={globalFilterValue}
            size="small"
            first={first}
            onPage={onPageChange}
            sortOrder={-1}
            paginator={true}
            rows={rows}
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

      </div>
    </Fragment>
  )
}