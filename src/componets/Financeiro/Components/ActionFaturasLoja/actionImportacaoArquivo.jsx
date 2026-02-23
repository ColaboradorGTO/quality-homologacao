import { Fragment, useState, useRef } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { ButtonType } from "../../../Buttons/ButtonType";
import { IoMdReturnLeft } from "react-icons/io";

export const ActionImportacaoArquivo = ({ 
    dadosVendaMarcaPeriodo,
    actionArquivo,
    setActionArquivo,
    actionMain,
    setActionMain
}) => {
    const [tableData, setTableData] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const fileUploadRef = useRef(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const dataTableRef = useRef();


    const onGlobalFilterChange = (e) => {
        setGlobalFilterValue(e.target.value);
    };

    const handlePrint = useReactToPrint({
        content: () => dataTableRef.current,
        documentTitle: 'Faturas',
    });


    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['Nº', 'Data', 'Cod. Estabelecimento', 'Empresa', 'Valor Recebido', 'Valor Arquivo', 'Valor Divergente', 'Obs']],
            body: tableData.map(item => [
                item.contador,
                item.data,
                item.codEstabelecimento,
                item.empresa,
                item.valorRecebido,
                item.valorArquivo,
                item.valorDivergente,
                item.observacao
            ]),
            horizontalPageBreak: true,
            horizontalPageBreakBehaviour: 'immediately'
        });
        doc.save('faturas.pdf');
    };

    const exportToExcel = () => {
        const dados = tableData.map(item => ({
            'Nº': item.contador,
            'Data': item.data,
            'Cod. Estabelecimento': item.codEstabelecimento,
            'Empresa': item.empresa,
            'Valor Recebido': item.valorRecebido,
            'Valor Arquivo': item.valorArquivo,
            'Valor Divergente': item.valorDivergente,
            'Obs': item.observacao
        }))
        const worksheet = XLSX.utils.json_to_sheet(dados);
        const workbook = XLSX.utils.book_new();
        const header = ['Nº', 'Data', 'Cod. Estabelecimento', 'Empresa', 'Valor Recebido', 'Valor Arquivo', 'Valor Divergente', 'Obs'];
        worksheet['!cols'] = [
            { wpx: 50, caption: 'Nº' },
            { wpx: 100, caption: 'Data' },
            { wpx: 150, caption: 'Cod. Estabelecimento' },
            { wpx: 200, caption: 'Empresa' },
            { wpx: 150, caption: 'Valor Recebido' },
            { wpx: 150, caption: 'Valor Arquivo' },
            { wpx: 150, caption: 'Valor Divergente' },
            { wpx: 150, caption: 'Obs' },
        ];
        XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Faturas ');
        XLSX.writeFile(workbook, 'faturas.xlsx');
    };

    // Função para mascarar valor (equivalente ao mascaraValor)
    const mascaraValor = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(parseFloat(valor));
    };

    // Função para processar o arquivo
    const processFile = (file) => {
        setLoading(true);

        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");

        reader.onload = function () {
            try {
                const text = this.result;
                const lines = text.split('\n');
                let contadorFatura = 0;
                const dataRetornoFat = [];

                let vrConcRecebidoFatura = 0;
                let vrConcRecebidoFaturaPIX = 0;
                let vrConcFaturaTotal = 0;
                let CodEmpFatura = '';
                let NoEmpFatura = '';

                for (let i = 1; i < lines.length - 1; i++) {
                    contadorFatura++;
                    const dadoslinha = lines[i].split(";");

                    let encontrouCorrespondencia = false;

                    for (let j = 0; j < dadosVendaMarcaPeriodo?.length; j++) {
                        const item = dadosVendaMarcaPeriodo[j];

                        if ((item['VRFATURA'] > 0 || item['VRFATURAPIX'] > 0) &&
                            item['CODEMPRESA'] === dadoslinha[3]) {

                            vrConcRecebidoFatura = item['VRFATURA'];
                            vrConcRecebidoFaturaPIX = item['VRFATURAPIX'];
                            CodEmpFatura = item['CODEMPRESA'];
                            NoEmpFatura = item['NOFANTASIA'];
                            vrConcFaturaTotal = Number(vrConcRecebidoFatura) + Number(vrConcRecebidoFaturaPIX);
                            encontrouCorrespondencia = true;
                            break;
                        }
                    }

                    if (!encontrouCorrespondencia) {
                        console.log(`Não encontrou correspondência para CODEMPRESA: ${dadoslinha[3]} - Usando dados da última correspondência encontrada`);
                    }

                    const vrFatTotalArq = Number(dadoslinha[5].replace(/\./g, "").replace(",", "."));

                    let QtdDiverg = 0;
                    let obsdiverg = '';
                    let statusColor = '';

                    if (vrFatTotalArq === vrConcFaturaTotal) {
                        QtdDiverg = 0;
                        obsdiverg = 'SEM DIVERGENCIA';
                        statusColor = 'blue';
                    } else if (vrFatTotalArq > vrConcFaturaTotal) {
                        QtdDiverg = parseFloat(vrFatTotalArq) - parseFloat(vrConcFaturaTotal.toFixed(2));
                        obsdiverg = 'FATURA COM DIVERGENCIA - RECEBIDO A MENOR';
                        statusColor = 'red';
                    } else {
                        QtdDiverg = vrConcFaturaTotal - vrFatTotalArq;
                        obsdiverg = 'FATURA COM DIVERGENCIA - ARQUIVO A MENOR';
                        statusColor = 'red';
                    }

                    dataRetornoFat.push({
                        id: contadorFatura,
                        contador: contadorFatura,
                        data: dadoslinha[0],
                        codEstabelecimento: dadoslinha[3],
                        empresa: NoEmpFatura,
                        valorRecebido: vrConcFaturaTotal.toFixed(2),
                        valorArquivo: Number(dadoslinha[5].replace(/\./g, "").replace(",", ".")).toFixed(2),
                        valorDivergente: QtdDiverg.toFixed(0),
                        observacao: obsdiverg,
                        statusColor: statusColor
                    });
                }

                setTableData(dataRetornoFat);
                setShowTable(true);
                setLoading(false);

                toast.current.show({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: `Arquivo processado com ${dataRetornoFat.length} registros`,
                    life: 3000
                });

            } catch (error) {
                console.error("Erro ao processar arquivo:", error);
                setLoading(false);
                toast.current.show({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Erro ao processar o arquivo',
                    life: 3000
                });
            }
        };

        reader.onerror = function (evt) {
            console.error("Erro ao ler o arquivo", evt);
            setLoading(false);
            toast.current.show({
                severity: 'error',
                summary: 'Erro',
                detail: 'Erro ao ler o arquivo',
                life: 3000
            });
        };
    };


    const onUpload = (event) => {
        const file = event.files[0];
        if (file) {
            processFile(file);
        }
    };


    const contadorTemplate = (rowData) => {
        return <span style={{ textAlign: 'center' }}>{rowData.contador}</span>;
    };

    const dataTemplate = (rowData) => {
        return <span style={{ textAlign: 'center' }}>{rowData.data}</span>;
    };

    const codEstabelecimentoTemplate = (rowData) => {
        return <span style={{ textAlign: 'center' }}>{rowData.codEstabelecimento}</span>;
    };

    const empresaTemplate = (rowData) => {
        return <span style={{ textAlign: 'center' }}>{rowData.empresa}</span>;
    };

    const valorRecebidoTemplate = (rowData) => {
        return <span style={{ textAlign: 'right' }}>{mascaraValor(rowData.valorRecebido)}</span>;
    };

    const valorArquivoTemplate = (rowData) => {
        return <span style={{ textAlign: 'right' }}>{mascaraValor(rowData.valorArquivo)}</span>;
    };

    const valorDivergenteTemplate = (rowData) => {
        return (
            <span style={{
                textAlign: 'right',
                color: rowData.statusColor,
                fontWeight: 'bold'
            }}>
                {rowData.valorDivergente}
            </span>
        );
    };

    const observacaoTemplate = (rowData) => {
        return (
            <span style={{
                textAlign: 'center',
                color: rowData.statusColor,
                fontWeight: 'bold'
            }}>
                {rowData.observacao}
            </span>
        );
    };

    const colunasListaFatura = [
        {
          field: 'contador',
          header: 'Nº',
          body: row => <th style={{}}>  {row.contador} </th>,
          sortable: true,
    
        },
        {
          field: 'data',
          header: 'Data',
          body: row => <th style={{}}>  {row.data} </th>,
          sortable: true,
    
        },
        {
          field: 'codEstabelecimento',
          header: 'Cod. Estabelecimento',
          body: row => <th style={{}}>  {row.codEstabelecimento} </th>,
          sortable: true,
        },
        {
          field: 'empresa',
          header: 'Empresa',
          body: row => <th style={{}}>  {row.empresa}</th>,
          sortable: true,
        },
        {
          field: 'valorRecebido',
          header: 'Valor Recebido',
          body: row => <th style={{}}> {formatMoeda(row.valorRecebido)} </th>,
          sortable: true,
        },
        {
          field: 'valorArquivo',
          header: 'Valor Arquivo',
          body: row => <th style={{}}> {formatMoeda(row.valorArquivo)} </th>,
          footer: <p>Total Lançamentos</p>,
          sortable: true,
        },
        {
          field: 'valorDivergente',
          header: 'Valor Divergente',
          body: row => <th style={{}}> {formatMoeda(row.valorDivergente)} </th>,
          sortable: true,
        },
        {
          field: 'observacao',
          header: 'Observação',
          body: row => <th style={{color: row.statusColor}}> {row.observacao} </th>,
          sortable: true,
        },
    ]

    const customUpload = (event) => {
        onUpload(event);
        fileUploadRef.current.clear();
    };

    const handleClickVoltar = () => {
        setActionArquivo(false);
        setActionMain(true);
    };

    return (
        <Fragment>
            <Toast ref={toast} />

            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "2rem",
                padding: "1rem",
                backgroundColor: "transparent"
            }}>
                <h1>Selecione o Arquivo para a Importação</h1>

                <div style={{ marginBottom: "2rem", width: "100%", display: "flex", justifyContent: "space-between" }}>
                

                    <div>

                        <FileUpload
                            ref={fileUploadRef}
                            mode="basic"
                            name="file"
                            accept=".txt,.csv"
                            customUpload={true}
                            uploadHandler={customUpload}
                            auto={true}
                            chooseLabel="Escolher Arquivo"
                            className="p-d-block"
                            disabled={loading}
                        />
                    </div>
                    <div>

                        <ButtonType 
                            textButton={'Voltar'}
                            cor={"danger"}
                            onClickButtonType={handleClickVoltar}
                            Icon={IoMdReturnLeft}
                        />
                    </div>
                </div>

                <div style={{ marginTop: "1rem", marginBottom: "1rem", width: '100%' }}>
                    <HeaderTable
                        globalFilterValue={globalFilterValue}
                        onGlobalFilterChange={onGlobalFilterChange}
                        handlePrint={handlePrint}
                        exportToExcel={exportToExcel}
                        exportToPDF={exportToPDF}
                    />
                </div>
                {loading && (
                    <div style={{ marginBottom: "2rem" }}>
                        <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
                        <p>Processando arquivo...</p>
                    </div>
                )}

                {showTable && (
                    <Fragment>

                        <div style={{ width: "100%", marginTop: "2rem" }} ref={dataTableRef}>
                            <DataTable
                                value={tableData}
                                paginator={false}
                                rows={tableData.length}
                                size="small"
                                className="p-datatable-sm"
                                showGridlines
                                stripedRows
                                emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
                            >
                                {colunasListaFatura.map(coluna => (
                                    <Column
                                        key={coluna.field}
                                        field={coluna.field}
                                        header={coluna.header}

                                        body={coluna.body}
                                        footer={coluna.footer}
                                        sortable={coluna.sortable}
                                        headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                                        footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                                        bodyStyle={{ fontSize: '0.8rem', }}

                                    />
                                ))}
                                {/* <Column
                                    field="contador"
                                    header="#"
                                    body={contadorTemplate}
                                    style={{ width: '5%', textAlign: 'center', fontSize: '12px' }}
                                />
                                <Column
                                    field="data"
                                    header="Data"
                                    body={dataTemplate}
                                    style={{ width: '10%', textAlign: 'center', fontSize: '12px' }}
                                />
                                <Column
                                    field="codEstabelecimento"
                                    header="Cod. Estabelecimento"
                                    body={codEstabelecimentoTemplate}
                                    style={{ width: '15%', textAlign: 'center', fontSize: '12px' }}
                                />
                                <Column
                                    field="empresa"
                                    header="Empresa"
                                    body={empresaTemplate}
                                    style={{ width: '20%', textAlign: 'center', fontSize: '12px' }}
                                />
                                <Column
                                    field="valorRecebido"
                                    header="Valor Recebido"
                                    body={valorRecebidoTemplate}
                                    style={{ width: '10%', textAlign: 'right', fontSize: '12px' }}
                                />
                                <Column
                                    field="valorArquivo"
                                    header="Valor Arquivo"
                                    body={valorArquivoTemplate}
                                    style={{ width: '10%', textAlign: 'right', fontSize: '12px' }}
                                />
                                <Column
                                    field="valorDivergente"
                                    header="Valor Divergente"
                                    body={valorDivergenteTemplate}
                                    style={{ width: '10%', textAlign: 'right', fontSize: '12px' }}
                                />
                                <Column
                                    field="observacao"
                                    header="Obs"
                                    body={observacaoTemplate}
                                    style={{ width: '20%', textAlign: 'center', fontSize: '12px' }}
                                /> */}
                            </DataTable>
                        </div>
                    </Fragment>
                )}
            </div>
        </Fragment>
    );
}