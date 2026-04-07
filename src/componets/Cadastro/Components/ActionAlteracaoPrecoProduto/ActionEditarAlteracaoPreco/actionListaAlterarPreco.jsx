import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import HeaderTable from "../../../../Tables/headerTable";
import { toFloat } from "../../../../../utils/toFloat";
import { formatMoeda } from "../../../../../utils/formatMoeda";

export const ActionListaAlterarPreco = ({ dadosDetalheAlteracao }) => {
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [selectedProducts, setSelectedProducts] = useState({});
    const [selectAll, setSelectAll] = useState(false);
    const [editingPrices, setEditingPrices] = useState([]);
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
            head: [['Nº', 'ID Produto', 'Descrição', 'Código Barras', 'Preço Anterior', 'Preço Novo', 'Estoque']],
            body: dados.map(item => [
                item.contador,
                item.IDPRODUTO,
                item.DSNOME,
                item.NUCODBARRAS,
                formatMoeda(item.PRECOVENDAANTERIOR),
                formatMoeda(item.PRECOVENDANOVO),
                toFloat(item.quantidadeEstoque),
            ]),
            horizontalPageBreak: true,
            horizontalPageBreakBehaviour: 'immediately'
        });
        doc.save('lista_alteracao_preco_detalhes.pdf');
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(dados.map(item => ({
            'Nº': item.contador,
            'ID Produto': item.IDPRODUTO,
            'Descrição': item.DSNOME,
            'Código Barras': item.NUCODBARRAS,
            'Dt. Cadastro': item.DTCADASTRO,
            'Preço Anterior': item.PRECOVENDAANTERIOR,
            'Preço Novo': item.PRECOVENDANOVO,
            'Estoque': item.quantidadeEstoque,
            'Status': item.STATIVO ? 'ATIVA' : 'INATIVA'
        })));
        const workbook = XLSX.utils.book_new();
        const header = ['Nº', 'ID Produto', 'Descrição', 'Código Barras', 'Dt. Cadastro', 'Preço Anterior', 'Preço Novo', 'Estoque', 'Status'];
        worksheet['!cols'] = [
            { wpx: 70, caption: 'Nº' },
            { wpx: 100, caption: 'ID Produto' },
            { wpx: 300, caption: 'Descrição' },
            { wpx: 150, caption: 'Código Barras' },
            { wpx: 120, caption: 'Dt. Cadastro' },
            { wpx: 120, caption: 'Preço Anterior' },
            { wpx: 120, caption: 'Preço Novo' },
            { wpx: 100, caption: 'Estoque' },
            { wpx: 100, caption: 'Status' },
        ];
        XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Detalhes Alteração Preço');
        XLSX.writeFile(workbook, 'lista_alteracao_preco_detalhes.xlsx');
    };


    const dados = dadosDetalheAlteracao.flatMap((item, index) => {
        const dadosAlteracao = item?.alteracaoPreco;
        const stExecutado = dadosAlteracao?.STEXECUTADO !== 'False';
        const stCancelado = dadosAlteracao?.STCANCELADO !== 'False'; 
        const authEdit = !stExecutado && !stCancelado;
        // Verifica se existe alteracaoPreco e detalheAlteracao
        if (!item?.alteracaoPreco?.detalheAlteracao) {
            return [];
        }

        // Mapeia todos os produtos do detalheAlteracao
        return item.alteracaoPreco.detalheAlteracao.map((detalhe, produtoIndex) => {
            let contador = (index * 1000) + (produtoIndex + 1); // Contador único para cada produto
            let status = 'ATIVO'; 
            return {
                contador,
                IDRESUMOALTERACAOPRECOPRODUTO: detalhe.produto?.IDRESUMOALTERACAOPRECOPRODUTO,
                AGENDAMENTOALTERACAO: item?.alteracaoPreco?.AGENDAMENTOALTERACAO,
                IDPRODUTO: detalhe.produto?.IDPRODUTO,
                DTCADASTRO: detalhe.produto?.DTCADASTRO,
                DSNOME: detalhe.produto?.DSNOME,
                NUCODBARRAS: detalhe.produto?.NUCODBARRAS,
                STATIVO: detalhe.produto?.STATIVO === 'True',
                PRECOVENDAANTERIOR: toFloat(detalhe.produto?.PRECOVENDAANTERIOR),
                PRECOVENDANOVO: toFloat(detalhe.produto?.PRECOVENDANOVO),
                QTDESTOQUEAOCADASTRAR: detalhe.produto?.QTDESTOQUEAOCADASTRAR,
                QTDESTOQUEATUAL: detalhe.produto?.QTDESTOQUEATUAL,
                // Lógica para quantidade de estoque baseada no status de execução
                quantidadeEstoque: !stExecutado ? detalhe.produto?.QTDESTOQUEAOCADASTRAR : detalhe.produto?.QTDESTOQUEATUAL, 
                status,
                stExecutado,
                stCancelado, 
                authEdit,
                stProd: detalhe.produto?.STATIVO === 'True',
                idDetalheAlteracao: detalhe.produto?.IDDETALHEALTERACAOPRECOPRODUTO,
                idResumoAlteracao: detalhe.produto?.IDRESUMOALTERACAOPRECOPRODUTO,
            }
        });
    });

    const colunasDetalhes = [
        {
            field: 'contador',
            header: 'Nº',
            body: row => <th>{row.contador}</th>,
            sortable: true,
        },
        {
            field: 'selecao',
            header: 'Seleção',
            body: row => {
                // Só mostra se pode editar e produto está ativo
                if (!row.authEdit || !row.stProd) return null;
                
                return (
                    <div className="custom-control custom-checkbox">
                        <input 
                            type="checkbox"
                            checked={selectedProducts.has(row.idDetalheAlteracao)}
                            onChange={(e) => handleSelectProduct(row.idDetalheAlteracao, e.target.checked)}
                        />
                    </div>
                );
            },
            sortable: false,
            // Só aparece se não foi executado nem cancelado
            style: { display: dados.some(d => d.authEdit) ? 'table-cell' : 'none' }
        },
        {
            field: 'DTCADASTRO',
            header: 'Dt. Cadastro',
            body: row => <th>{row.DTCADASTRO}</th>,
            sortable: true,
        },
        {
            field: 'IDPRODUTO',
            header: 'ID Produto',
            body: row => {
                return (
                    <th>{row.IDPRODUTO}</th>
                )
            },
            sortable: true,
        },
        {
            field: 'DSNOME',
            header: 'Descriçao Produto',
            body: row => {
                return (
                    <th>{row.DSNOME}</th>
                )
            },
            sortable: true,
        },
        {
            field: 'NUCODBARRAS',
            header: 'Cod. Barras',
            body: row => {
                return (
                    <th>{row.NUCODBARRAS}</th>
                )
            },
            sortable: true,
        },
        {
            field: 'PRECOVENDAANTERIOR',
            header: 'Preço Antigo',
            body: row => {
                return (
                    <th>{formatMoeda(row.PRECOVENDAANTERIOR)}</th>
                )
            },
            sortable: true,
        },
        {
            field: 'PRECOVENDANOVO',
            header: 'Preço Novo',
            body: row => {
                // Se pode editar e produto ativo = input editável
                if (row.authEdit && row.stProd) {
                    return (
                        <input
                            type="text"
                            value={editingPrices[`${row.idResumoAlteracao}_${row.idDetalheAlteracao}`] || row.PRECOVENDANOVO}
                            onChange={(e) => handlePriceChange(row, e.target.value)}
                            onFocus={() => handleSelectProduct(row.idDetalheAlteracao, true)}
                            style={{ width: '80px', textAlign: 'center' }}
                            className="form-control"
                        />
                    );
                }
                
                // Senão = label simples
                return <th>{formatMoeda(row.PRECOVENDANOVO)}</th>;
            },
            sortable: true,
        },
        {
            field: 'quantidadeEstoque',
            header: 'Estoque',
            body: row => {
                return (
                    <th>{toFloat(row.quantidadeEstoque)}</th>
                )
            },
            sortable: true,
        },
        {
            field: 'STATIVO',
            header: 'Status',
            body: row => {
                let className = '';
                let texto = '';
                
                if (row.stCancelado) {
                    return <th style={{ color: '#fd3995', fontWeight: 900 }}>CANCELADO</th>;
                } else if (row.stExecutado) {
                    return <th style={{ color: '#1dc9b7', fontWeight: 900 }}>ALTERADO</th>;
                } else if (row.stProd) {
                    return <th style={{ color: '#2196f3', fontWeight: 900 }}>ATIVO</th>;
                } else {
                    return <th style={{ color: '#fd3995', fontWeight: 900 }}>CANCELADO</th>;
                }
            
            },
            sortable: true,
        },
        {
            field: 'opcoes',
            header: 'Opções',
            body: row => {
                if (row.stCancelado) return null;
                
                const hasChanges = editingPrices[`${row.idResumoAlteracao}_${row.idDetalheAlteracao}`] !== row.PRECOVENDANOVO;
                
                return (
                    <div style={{ width: '100px' }}>
                        {/* Botão confirmar - só se editou o preço */}
                        {row.authEdit && row.stProd && hasChanges && (
                            <button 
                                className="btn btn-warning btn-sm"
                                onClick={() => handleConfirmPriceChange(row)}
                                title="Confirmar Alteração"
                            >
                                <i className="fa fa-check"></i>
                            </button>
                        )}
                        
                        {/* Botão desativar - se produto ativo */}
                        {row.authEdit && row.stProd && (
                            <button 
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeactivateProduct(row)}
                                title="Desativar Produto"
                            >
                                <i className="fa fa-times"></i>
                            </button>
                        )}
                        
                        {/* Botão ativar - se produto inativo */}
                        {row.authEdit && !row.stProd && (
                            <button 
                                className="btn btn-success btn-sm"
                                onClick={() => handleActivateProduct(row)}
                                title="Ativar Produto"
                            >
                                <i className="fa fa-check"></i>
                            </button>
                        )}
                    </div>
                );
            },
            sortable: false,
            style: { display: dados.some(d => d.authEdit) ? 'table-cell' : 'none' }
        }
    ]

    return (
        <div className="panel">
            <div className="panel-hdr">
                <h2>Lista de Produtos</h2>
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
                    {colunasDetalhes.map(coluna => (
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
    )
}