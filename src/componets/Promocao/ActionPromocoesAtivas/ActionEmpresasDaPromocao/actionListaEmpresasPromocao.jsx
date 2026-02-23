import React, { Fragment, useEffect, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../Tables/headerTable";
import { post, put } from "../../../../api/funcRequest";
import Swal from "sweetalert2";
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCheck } from "react-icons/fa";

export const ActionListaEmpresasPromocao = ({
  dadosEmpresasPromocoes,
  refetchEmpresasPromocoes,
}) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const dataTableRef = useRef();
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [ipUsuario, setIpUsuario] = useState('');
  const [dadosTabelaEmpresasPromocao, setDadosTabelaEmpresasPromocao] = useState([]);
  const navigate = useNavigate();
  
  
  useEffect(() => {
    const usuarioArmazenado = localStorage.getItem('usuario');

    if (usuarioArmazenado) {
      try {
        const parsedUsuario = JSON.parse(usuarioArmazenado);
        setUsuarioLogado(parsedUsuario);
      } catch (error) {
        console.error('Erro ao parsear o usuário do localStorage:', error);
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    getIPUsuario();
  }, [usuarioLogado]);

  const getIPUsuario = async () => {
    try {
      const response = await axios.get('https://api64.ipify.org?format=json');
      if (response.data && response.data.ip) {
        setIpUsuario(response.data.ip);
      }
      return response.data;
    } catch (error) {
      console.error('Erro ao obter o IP do usuário:', error);
      return null;
    }
  }

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista Empresas'
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['ID Empresa', 'Empresa']],
      body: dados.map(item => [
        item.IDEMPRESA,
        item.NOFANTASIA,
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('lista_empresas.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['ID Empresa', 'Empresa'];
    worksheet['!cols'] = [
      { wpx: 50, caption: 'ID Empresa' },
      { wpx: 200, caption: 'Empresa' },
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista Empresas');
    XLSX.writeFile(workbook, 'lista_empresas.xlsx');
  };

  useEffect(() => {
    if(Array.isArray(dadosEmpresasPromocoes) && dadosEmpresasPromocoes.length > 0) {
      const dadosEmpresas = dadosEmpresasPromocoes.map((item, index) => ({
          contador: index + 1,
          IDEMPRESA: item.IDEMPRESA,
          NOFANTASIA: item.NOFANTASIA,
          IDRESUMOPROMOCAOMARKETING: item.IDRESUMOPROMOCAOMARKETING,
          IDEMPRESAPROMOCAOMARKETING: item.IDEMPRESAPROMOCAOMARKETING,
          STATIVO: item.STATIVO,
       
      })) || [];
      setDadosTabelaEmpresasPromocao(dadosEmpresas);
    }
  }, [dadosEmpresasPromocoes])

  const dados = Array.isArray(dadosEmpresasPromocoes) ? dadosEmpresasPromocoes.map((item, index) => {
    let contador = index + 1;
    return {
      contador,
      IDEMPRESA: item.IDEMPRESA,
      NOFANTASIA: item.NOFANTASIA,
      IDRESUMOPROMOCAOMARKETING: item.IDRESUMOPROMOCAOMARKETING,
      IDEMPRESAPROMOCAOMARKETING: item.IDEMPRESAPROMOCAOMARKETING,
      STATIVO: item.STATIVO,
    };
  }) : [];

  const colunaListaEmpresas = [
    {
      field: 'contador',
      header: 'Nº',
      body: row => <th>{row.contador}</th>,
      sortable: true,
    },
    {
      field: 'NOFANTASIA',
      header: 'Empresa ',
      body: row => <th>{row.NOFANTASIA}</th>,
      sortable: true,
    },
    {
      field: 'IDEMPRESA',
      header: 'ID Empresa',
      body: row => {
        if (row.STATIVO === 'True') {
          return (
            <ButtonTable
              titleButton={"Desativar Empresa"}
              cor={"danger"}
              Icon={IoMdClose}
              iconSize={22}
              onClickButton={() => handleDesativarOrigem(row)}
              width="40px"
              height="40px"
              disabledBTN={row.STATIVO === 'False'}
            />
          );
        } else {
          return (
            <ButtonTable
              titleButton={"Ativar Empresa"}
              cor={"success"}
              Icon={FaCheck}
              iconSize={22}
              onClickButton={() => handleAtivarOrigem(row)}
              width="40px"
              height="40px"
              disabledBTN={row.STATIVO === 'True'}
            />
          );
        }
      },
      sortable: true,
      width: "5%"
    },
  ]

  const handleDesativarOrigem = async (row) => {

    Swal.fire({
      title: `Tem Certeza que Deseja Desativar a Empresa da Promoção?`,
      text: 'Você não poderá reverter a ação!',
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'OK',
      customClass: {
        container: 'custom-swal',
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger',
        loader: 'custom-loader'
      },
      buttonsStyling: false
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const putData = {
            STATIVO: 'False',
            IDRESUMOPROMOCAOMARKETING: row.IDRESUMOPROMOCAOMARKETING,
            IDEMPRESA: row.IDEMPRESA,
            IDEMPRESAPROMOCAOMARKETING: row.IDEMPRESAPROMOCAOMARKETING  
          }
          const response = await put('/desativar-empresa-promocao', putData)
          const textDados = JSON.stringify(putData)
          let textoFuncao = 'PROMOÇÃO/DESATIVAR EMPRESA PROMOÇÃO ORIGEM';
          const postData = {
            IDFUNCIONARIO: String(usuarioLogado?.id),
            PATHFUNCAO: textoFuncao,
            DADOS: textDados,
            IP: ipUsuario
          }

          const responsePost = await post('/log-web', postData)

          Swal.fire({
            title: 'Sucesso',
            text: `Empresa Desativado com Sucesso`,
            icon: 'success',
            customClass: {
              container: 'custom-swal',
            }
          });
          // handleClose()
          refetchEmpresasPromocoes();
          setDadosTabelaEmpresasPromocao((prev) =>
            prev.map((item) =>
              item.IDEMPRESAPROMOCAOMARKETING === row.IDEMPRESAPROMOCAOMARKETING
                ? { ...item, STATIVO: 'False' }
                : item
            )
          );
         
          return responsePost;
        } catch (error) {
          const putData = {
            STATIVO: 'False',
            IDRESUMOPROMOCAOMARKETING: row.IDRESUMOPROMOCAOMARKETING,
            IDEMPRESA: row.IDEMPRESA,
            IDEMPRESAPROMOCAOMARKETING: row.IDEMPRESAPROMOCAOMARKETING  
          }
          const textDados = JSON.stringify(putData)
          let textoFuncao = 'PROMOÇÃO/ERRO AO DESATIVAR EMPRESA PROMOÇÃO ORIGEM';

          const postData = {
            IDFUNCIONARIO: String(usuarioLogado?.id),
            PATHFUNCAO: textoFuncao,
            DADOS: textDados,
            IP: ipUsuario
          }

          const responsePost = await post('/log-web', postData)
          Swal.fire({
            title: 'Erro',
            text: `Erro ao Desativar Empresa da Promoção`,
            icon: 'error',
            customClass: {
              container: 'custom-swal',
            }
          });

          return responsePost.data;
        }
      }
    })
  }

  const handleAtivarOrigem = async (row) => {
    Swal.fire({
      title: `Tem Certeza que Deseja Ativar a Empresa da Promoção?`,
      text: 'Você não poderá reverter a ação!',
      icon: 'warning',
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'OK',
      customClass: {
        container: 'custom-swal',
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-danger',
        loader: 'custom-loader'
      },
      buttonsStyling: false
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const putData = {
            STATIVO: 'True',
            IDRESUMOPROMOCAOMARKETING: row.IDRESUMOPROMOCAOMARKETING,
            IDEMPRESA: row.IDEMPRESA,
            IDEMPRESAPROMOCAOMARKETING: row.IDEMPRESAPROMOCAOMARKETING
          }
          const response = await put('/desativar-empresa-promocao', putData)
          const textDados = JSON.stringify(putData)
          let textoFuncao = 'PROMOÇÃO/ATIVAR EMPRESA NA PROMOÇÃO ';
          const postData = {
            IDFUNCIONARIO: String(usuarioLogado?.id),
            PATHFUNCAO: textoFuncao,
            DADOS: textDados,
            IP: ipUsuario
          }

          const responsePost = await post('/log-web', postData)

          Swal.fire({
            title: 'Sucesso',
            text: `Empresa Ativado com Sucesso`,
            icon: 'success',
            customClass: {
              container: 'custom-swal',
            }
          });
          // handleClose()
          refetchEmpresasPromocoes();
          setDadosTabelaEmpresasPromocao((prev) =>
            prev.map((item) =>
              item.IDEMPRESAPROMOCAOMARKETING === row.IDEMPRESAPROMOCAOMARKETING
                ? { ...item, STATIVO: 'True' }
                : item
            )
          );
          return responsePost;
        } catch (error) {
          const putData = {
            STATIVO: 'True',
            IDRESUMOPROMOCAOMARKETING: row.IDRESUMOPROMOCAOMARKETING,
            IDEMPRESA: row.IDEMPRESA,
            IDEMPRESAPROMOCAOMARKETING: row.IDEMPRESAPROMOCAOMARKETING
          }
          const textDados = JSON.stringify(putData)
          let textoFuncao = 'PROMOÇÃO/ERRO AO ATIVAR EMPRESA NA PROMOÇÃO ';

          const postData = {
            IDFUNCIONARIO: String(usuarioLogado?.id),
            PATHFUNCAO: textoFuncao,
            DADOS: textDados,
            IP: ipUsuario
          }
          const responsePost = await post('/log-web', postData)
          Swal.fire({
            title: 'Erro',
            text: `Erro ao Ativar Empresa da Promoção`,
            icon: 'error',
            customClass: {
              container: 'custom-swal',
            }
          });
          return responsePost.data;
        }
      }
    })
  }



  return (
    <Fragment>

      <div className="panel">
        <div className="panel-hdr mb-4">
          <h2>Lista de Empresas da Promoção</h2>

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
        <div className="card custom-swal" ref={dataTableRef}>
          <DataTable
            title="Lista de Empresas"
            value={dadosTabelaEmpresasPromocao}
            size="small"
            dataKey="IDPRODUTO"
            globalFilter={globalFilterValue}
            sortOrder={-1}
            paginator={true}
            rows={100}
            // rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            className="custom-swal"
            showGridlines
            stripedRows
            emptyMessage={
              <div className="dataTables_empty">Nenhum resultado encontrado</div>
            }
          >
            {colunaListaEmpresas.map((coluna, index) => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}
                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '1rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }}
                bodyStyle={{ fontSize: '1rem', border: '1px solid #e9e9e9' }}
              />
            ))}
          </DataTable>
        </div>
      </div>

    </Fragment>
  );
}