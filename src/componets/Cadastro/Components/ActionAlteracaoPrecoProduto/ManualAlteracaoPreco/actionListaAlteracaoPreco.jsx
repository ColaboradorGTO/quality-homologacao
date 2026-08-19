import { Fragment, useEffect, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../../ButtonsTabela/ButtonTable";
import { CiEdit } from "react-icons/ci";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../../Tables/headerTable";
import { toFloat } from "../../../../../utils/toFloat";
import { formatMoeda } from "../../../../../utils/formatMoeda";
import { GrView } from "react-icons/gr";
import { get } from "../../../../../api/funcRequest";
import Swal from "sweetalert2";


export const ActionListaAlteracaoPreco = ({
  dadosAlteracaoPreco,
  optionsModulos,
  usuarioLogado,
  nomeListaSelecionada,
  produtosSelecionados, 
  setProdutosSelecionados,
  precosNovos,
  setPrecosNovos,
  selectAllChecked,
  setSelectAllChecked,
  selectedItems,
  setSelectedItems,
  selectAll,
  setSelectAll,
  selectedIds,
  setSelectedIds,
}) => {
  const [modalVisualizar, setModalVisualizar] = useState(false);
  const [dadosVisualizarDetalhe, setDadosVisualizarDetalhe] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();


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
      head: [['Nº', 'Dt. Cadastro', 'ID Produto', 'Produto', 'TAMANHO', 'Pr.Venda', 'Pr.Novo', 'Lista', 'Estrutura']],
      body: dados.map(item => [
        item.contador,
        item.DTCADASTRO,
        item.IDPRODUTO,
        item.DSNOME,
        item.TAMANHO,
        formatMoeda(item.PRECOVENDA),
        formatMoeda(precosNovos[item.IDPRODUTO] ?? item.PRECOVENDA.toFixed(2)),
        item.IDEMPRESA ? item.NOFANTASIA : nomeListaSelecionada,
        item.DSSUBGRUPOESTRUTURA ? `${item.DSGRUPOESTRUTURA} - ${item.DSSUBGRUPOESTRUTURA}` : item.DSGRUPOESTRUTURA,
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('lista_alteracao_preco.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº', 'Dt. Cadastro', 'ID Produto', 'Produto', 'TAMANHO', 'Pr.Venda', 'Pr.Novo', 'Lista', 'Estrutura'];
    worksheet['!cols'] = [
      { wpx: 70, caption: 'Nº' },
      { wpx: 100, caption: 'Dt. Cadastro' },
      { wpx: 100, caption: 'ID Produto' },
      { wpx: 300, caption: 'Produto' },
      { wpx: 100, caption: 'TAMANHO' },
      { wpx: 100, caption: 'Pr.Venda' },
      { wpx: 100, caption: 'Pr.Novo' },
      { wpx: 150, caption: 'Lista' },
      { wpx: 150, caption: 'Estrutura' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista de Alteração Preço');
    XLSX.writeFile(workbook, 'lista_alteracao_preco.xlsx');
  };

  const dados = dadosAlteracaoPreco.filter(item => !item.STCANCELADO).map((item, index) => {
    let contador = index + 1;
    let tamanho = item.DSNOME.split(' ');
    return {
      contador,
      IDPRODUTO: item.IDPRODUTO,
      DTCADASTRO: item.DTCADASTRO,
      DSNOME: item.DSNOME,
      tamanho: tamanho[tamanho.length - 1],
      PRECOVENDA: toFloat(item.PRECOVENDA),
      SUBGRUPO: item.SUBGRUPO,
      DSESTILO: item.DSESTILO,
      NUCODBARRAS: item.NUCODBARRAS,
      IDGRUPOEMPRESARIAL: item.IDGRUPOEMPRESARIAL,
      IDEMPRESA: item.IDEMPRESA,
      NOFANTASIA: item.NOFANTASIA,
      DSGRUPOESTRUTURA: item.DSGRUPOESTRUTURA,
      DSSUBGRUPOESTRUTURA: item.DSSUBGRUPOESTRUTURA,
    }
  })

  useEffect(() => {
    const itensSelecionaveis = dados.filter(item => item.stDisabled !== 'disabled');

    const dadosPaginaAtual = dados.slice(first, first + rows);
    const itensSelecionaveisPaginaAtual = dadosPaginaAtual.filter(item => item.stDisabled !== 'disabled');

    if (selectedItems.length === 0) {
      setSelectAllChecked(false);
    } else if (
      selectedItems.length === itensSelecionaveis.length ||
      (selectedItems.length === itensSelecionaveisPaginaAtual.length &&
        itensSelecionaveisPaginaAtual.length > 0 &&
        itensSelecionaveisPaginaAtual.every(item =>
          selectedItems.some(selected => selected.IDPRODUTO === item.IDPRODUTO)
        ))
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
          // setBtnVisivel(true);
          setSelectedItems([...itensSelecionaveis]);
          setSelectedIds(itensSelecionaveis.map(item => item.IDPRODUTO));
          setProdutosSelecionados(itensSelecionaveis.map(item => ({ ...item, quantidade: 1 })));
          setSelectAll(true);

        } else if (result.dismiss === Swal.DismissReason.cancel) {
          const itensSelecionaveisPaginaAtual = dados.slice(first, first + rows).filter(item => item.stDisabled !== 'disabled');
          // setBtnVisivel(true);
          setSelectedItems([...itensSelecionaveisPaginaAtual]);
          setSelectedIds(itensSelecionaveisPaginaAtual.map(item => item.IDPRODUTO));
          setProdutosSelecionados(itensSelecionaveisPaginaAtual.map(item => ({ ...item, quantidade: 1 })));
          setSelectAll(true);

        } else {
          // setBtnVisivel(false);
          setSelectedItems([]);
          setSelectedIds([]);
          setProdutosSelecionados([]);
          setSelectAll(false);
        }
      });
    } else {
      // setBtnVisivel(false);
      setSelectedItems([]);
      setSelectedIds([]);
      setProdutosSelecionados([]);
      setSelectAll(false);
    }
  }

  const onChangePrecoNovo = (idProduto, value) => {
    setPrecosNovos(prev => ({ ...prev, [idProduto]: value }));
  };

  const colunasAlteracoesPreco = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'IDPRODUTO',
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
      body: (rowData) => {
        return (
          <div>
            <input
              type="checkbox"
              checked={selectedIds.includes(rowData.IDPRODUTO)}
              onChange={(e) => {
                const isChecked = e.target.checked;
                const updatedSelectedIds = isChecked
                  ? [...selectedIds, rowData.IDPRODUTO]
                  : selectedIds.filter(id => id !== rowData.IDPRODUTO);

                setSelectedIds(updatedSelectedIds);
                setSelectAll(updatedSelectedIds.length === dados.length);
                setSelectedItems((prevItems) =>
                  isChecked
                    ? [...prevItems, rowData]
                    : prevItems.filter(item => item.IDPRODUTO !== rowData.IDPRODUTO)
                );

                setProdutosSelecionados((prevProdutos) => {
                  if (!isChecked) {
                    return prevProdutos.filter(item => item.IDPRODUTO !== rowData.IDPRODUTO);
                  }

                  const produtoExistente = prevProdutos.find(item => item.IDPRODUTO === rowData.IDPRODUTO);
                  const quantidadeAtual = Number(produtoExistente?.quantidade) || 1;

                  if (produtoExistente) {
                    return prevProdutos.map((item) =>
                      item.IDPRODUTO === rowData.IDPRODUTO
                        ? { ...item, ...rowData, quantidade: quantidadeAtual }
                        : item
                    );
                  }

                  return [...prevProdutos, { ...rowData, quantidade: quantidadeAtual }];
                });
              }}
              disabled={rowData.stDisabled === 'disabled'}
            />
          </div>
        );
      }
    },
    {
      field: 'DTCADASTRO',
      header: 'Dt. Cadastro',
      body: row => {
        return (
          <th> {row.DTCADASTRO}</th>
        )

      },
      sortable: true,
    },
    {
      field: 'IDPRODUTO',
      header: 'Id. Produto',
      body: row => {
        return (
          <th >{row.IDPRODUTO}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'DSNOME',
      header: 'Produto',
      body: row => {
        return (
          <th >{row.DSNOME}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'tamanho',
      header: 'Tamanho',
      body: row => {
        return (
          <th >{row.tamanho}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'PRECOVENDA',
      header: 'Pr.Venda',
      body: row => {
        return (
          <th >{formatMoeda(row.PRECOVENDA)}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'PRECOVENDANOVO',
      header: 'Pr.Novo',
      body: row => (
        <input
          type="text"
          className="form-control text-center"
          style={{ width: '90px' }}
          value={precosNovos[row.IDPRODUTO] ?? row.PRECOVENDA.toFixed(2)}
          onChange={(e) => onChangePrecoNovo(row.IDPRODUTO, e.target.value)}
        />
      ),
    },
    {
      field: 'NOFANTASIA',
      header: 'Lista',
      body: row => {
        return (
          <th>{row.IDEMPRESA ? row.NOFANTASIA : nomeListaSelecionada}</th>
        )
      },
      sortable: true,
    },
    {
      field: 'DSGRUPOESTRUTURA',
      header: 'Estrutura',
      body: row => {
        const estrutura = row.DSSUBGRUPOESTRUTURA
          ? `${row.DSGRUPOESTRUTURA} - ${row.DSSUBGRUPOESTRUTURA}`
          : row.DSGRUPOESTRUTURA;

        return (
          <th>{estrutura}</th>
        )
      },
      sortable: true,
    },
  ]


  const clickVisualizar = (row) => {
    if (row && row.IDRESUMOALTERACAOPRECOPRODUTO) {
      handleVisualizar(row.IDRESUMOALTERACAOPRECOPRODUTO);
    }
  };

  const handleVisualizar = async (IDRESUMOALTERACAOPRECOPRODUTO) => {
    try {
      Swal.fire({
        title: 'Carregando...',
        html: 'Carregando dados da alteração de preço.',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });
      const response = await get(`/alteracoes-de-precos-detalhes?idAlteracaoPreco=${IDRESUMOALTERACAOPRECOPRODUTO}`);
      if (response.data && response.data.length > 0) {
        Swal.close();
        setDadosVisualizarDetalhe(response.data);
        setModalVisualizar(true)
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Nenhum detalhe encontrado',
          text: 'Não foram encontrados detalhes para esta alteração de preço.',
        })
        return;
      }
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
        <div className="card " ref={dataTableRef}>

          <DataTable
            title="Vendas por Loja"
            value={dados}
            globalFilter={globalFilterValue}
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            size="small"
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


    </Fragment>
  )
}