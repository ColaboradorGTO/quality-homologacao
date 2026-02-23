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

export const ActionListaEditarPreco = ({ dadosEditarPreco }) => {
    const [globalFilterValue, setGlobalFilterValue] = useState('');
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
        const header = ['Nº', 'ID Alteração', 'Lista de Preço', 'Responsável', 'QTD Produtos', 'Data Criação', 'Data Agendamento'];
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

    const dados = dadosEditarPreco.map((item, index) => {
        let contador = index + 1;
        // console.log(item?.alteracaoPreco.detalheAlteracao[0]?.produto.DTCADASTRO)
        return {

            contador,
            IDRESUMOALTERACAOPRECOPRODUTO: item[0]?.produto.IDRESUMOALTERACAOPRECOPRODUTO,
            AGENDAMENTOALTERACAO: item?.alteracaoPreco.AGENDAMENTOALTERACAO,
            IDPRODUTO: item?.alteracaoPreco.detalheAlteracao[0]?.produto.IDPRODUTO,
            DTCADASTRO: item?.alteracaoPreco.detalheAlteracao[0]?.produto.DTCADASTRO,
            DSNOME: item?.alteracaoPreco.detalheAlteracao[0]?.produto.DSNOME,
            NUCODBARRAS: item?.alteracaoPreco.detalheAlteracao[0]?.produto.NUCODBARRAS,
            STATIVO: item?.alteracaoPreco.detalheAlteracao[0]?.produto.STATIVO == 'True' ? true : false,
            PRECOVENDAANTERIOR: toFloat(item?.alteracaoPreco.detalheAlteracao[0]?.produto.PRECOVENDAANTERIOR),
            PRECOVENDANOVO: toFloat(item?.alteracaoPreco.detalheAlteracao[0]?.produto.PRECOVENDANOVO),
            QTDESTOQUEAOCADASTRAR: item?.alteracaoPreco.detalheAlteracao[0]?.produto.QTDESTOQUEAOCADASTRAR,
            QTDESTOQUEATUAL: item?.alteracaoPreco.detalheAlteracao[0]?.produto.QTDESTOQUEATUAL,
            quantidadeEstoque: item[0]?.alteracaoPreco.STEXECUTADO != 'False' ? true : false ? item[0]?.produto.QTDESTOQUEAOCADASTRAR : item[0]?.produto.QTDESTOQUEATUAL,
        }
    })

    const colunasDetalhes = [
        {
            field: 'contador',
            header: 'Nº',
            body: row => <th>{row.contador}</th>,
            sortable: true,
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
                return (
                    <th>{formatMoeda(row.PRECOVENDANOVO)}</th>
                )
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
                return (
                    <th style={{ color: row.STATIVO == 'True' ? 'blue' : 'red' }} >{row.STATIVO == 'True' ? 'ATIVA' : 'INATIVA'}</th>
                )
            },
            sortable: true,
        },
    ]

    return (
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