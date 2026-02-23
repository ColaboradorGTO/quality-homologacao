import React, { Fragment, useEffect, useState } from "react"
import { InputFieldModal } from "../../../Buttons/InputFieldModal"
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal";
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../Modais/FooterModal/footerModal";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputFieldCheckBox } from "../../../Inputs/InputChekBox";
import Select from 'react-select';
import { post, put } from "../../../../api/funcRequest";
import Swal from 'sweetalert2';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";


export const ActionEditarEstabelecimentoModal = ({ show, handleClose, dadosListaCaixa }) => {
  const { register, handleSubmit, errors } = useForm();
  const navigate = useNavigate();
  const [rowClick, setRowClick] = useState(true);
  const [selectedCaixa, setSelectedCaixa] = useState('');
  const [selectedCaixaLimpar, setSelectedCaixaLimpar] = useState('');
  const [statusAtualizado, setStatusAtualizado] = useState('');
  const [atualizacao, setAtualizacao] = useState('');
  const [horaAtualizado, setHoraAtualizado] = useState('');
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [ipUsuario, setIpUsuario] = useState('');

  useEffect(() => {
    const usuarioArmazenado = localStorage.getItem('usuario');

    if (usuarioArmazenado) {
      try {
        const parsedUsuario = JSON.parse(usuarioArmazenado);
        setUsuarioLogado(parsedUsuario);;
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
    const response = await fetch('http://ipwho.is/')
    if (response.data) {
      setIpUsuario(response.data);
    }
    return response.data;
  }

  const colunasCaixa = [
    {
      field: 'IDCAIXAWEB',
      header: 'ID',
      body: row => row.IDCAIXAWEB,
      sortable: true,

    },
    {
      field: 'DSCAIXA',
      header: 'CAIXA',
      body: row => row.DSCAIXA,
      sortable: true,

    },
    {
      field: 'IDCAIXAWEB',
      header: 'Atualizar',
      body: (row) => {
        return (
          <div className="custom-control custom-checkbox">
            <InputFieldCheckBox
              value={selectedCaixa === row.IDCAIXAWEB}
              id={row.IDCAIXAWEB}
              onChange={(e) => setSelectedCaixa(e.target.checked ? row.IDCAIXAWEB : null)}
            />
          </div>
        )
      },
      sortable: true,

    },
    {
      field: 'IDCAIXAWEB',
      header: 'Limpar e Atualizar',
      body: (row) => {
        return (
          <div className="custom-control custom-checkbox">
            <InputFieldCheckBox
              id={row.IDCAIXAWEB}
              value={selectedCaixaLimpar === row.IDCAIXAWEB}
              onChange={(e) => setSelectedCaixaLimpar(e.target.checked ? row.IDCAIXAWEB : null)}

            />
          </div>
        )
      },
      sortable: true,
    },


  ]

  const atualizacaoDiario = [
    { value: "True", label: "SIM" },
    { value: "False", label: "NÃO" }
  ]
  const status = [
    { value: "True", label: "Aberta" },
    { value: "False", label: "Fechada" }
  ]

  const atualizarDiariaEmpresa = async () => {
    const postData = {
      IDEMPRESA: dadosListaCaixa[0]?.IDEMPRESA,
      HORAATUALIZA: horaAtualizado,
      STATUALIZADIARIO: atualizacaoDiario,
      STLOJAABERTA: statusAtualizado,
    }

    const postDataSTCaixa = {
      STATUALIZA: selectedCaixa,
      STATUALIZA: selectedCaixaLimpar,
    }

    let textFuncao = 'INFORMATICA/EDIÇÃO DE ATUALIZAÇÃO DIÁRIA DOS PDVs DA EMPRESA';

    const postDataEditarCaixa = {
      IDFUNCIONARIO: usuarioLogado.IDFUNCIONARIO,
      PATHFUNCAO: textFuncao,
      DADOS: {
        IDEMPRESA: dadosListaCaixa[0]?.IDEMPRESA,
        HORAATUALIZA: horaAtualizado,
        STATUALIZADIARIO: atualizacaoDiario,
        STLOJAABERTA: statusAtualizado,
      },
      IP: ipUsuario
    }

    const response = await put('/atualizaEmpresaDiario/:id', postData)
    const responseSTCaixa = await put('/atualizaStatusCaixa', postDataSTCaixa)
    const responseEditarCaixa = await post('/logWeb', postDataEditarCaixa)
      ('/logWeb', postDataEditarCaixa)
      .then(response => {
        handleClose()
        console.log(response, "dados atualizados com sucesso")
      })
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Relatório atualizado com sucesso!',
      showConfirmButton: false,
      timer: 1500
    })


      .catch(error => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Erro ao atualizar Relatório!',
          showConfirmButton: false,
          timer: 1500
        });

        console.log(error)
      })

    return response.data;
  }
  return (

    <Fragment>

      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        className="modal fade"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"

      >

        <HeaderModal
          title={"Dados de Empresa"}
          subTitle={"Atualização Diária dos PDVs da Empresa"}
          handleClose={handleClose}
        />


        <Modal.Body>
          <form onSubmit={handleSubmit(atualizarDiariaEmpresa)}>
            <div className="form-group">

              <div className="row">
                <div className="col-sm-6 col-xl-6">
                  <InputFieldModal
                    type="text"
                    className="form-control input"
                    readOnly={false}
                    value={dadosListaCaixa && dadosListaCaixa[0]?.NOFANTASIA}
                    onChangeModal
                    label="Empresa"
                  />

                </div>
                <div className="col-sm-6 col-xl-3">
                  <label className="form-label" htmlFor="statualizadiario">Atualizar Status Loja</label>

                  <Select
                    className="basic-single"
                    classNamePrefix={"select"}
                    options={status.map((item) => ({
                      value: item.value,
                      label: item.label

                    }))}
                    defaultValue={statusAtualizado}
                    onChange={(e) => setStatusAtualizado(e.target.value)}
                  // isSearchable
                  />
                </div>
                <div className="col-sm-6 col-xl-3">
                  <label className="form-label" htmlFor="statualizadiario">Atualizar PDVs Diário</label>
                  <Select
                    className="basic-single"
                    classNamePrefix={"select"}
                    options={atualizacaoDiario.map((item) => ({
                      value: item.value,
                      label: item.label

                    }))}
                    defaultValue={atualizacao}
                    onChange={(e) => setAtualizacao(e.target.value)}
                  // isSearchable
                  />
                </div>
                <div className="col-sm-6 col-xl-2">
                  <InputFieldModal
                    type="time"
                    className="form-control input"
                    readOnly={false}
                    value={horaAtualizado}
                    onChangeModal={(e) => setHoraAtualizado(e.target.value)}
                    label="Horário"
                  />
                </div>
              </div>
            </div>

          </form>

          <div className="card">

            <DataTable
              value={dadosListaCaixa}
              sortField="DSCAIXA"
              sortOrder={-1}
              paginator={true}
              rows={10}
              rowsPerPageOptions={[5, 10, 20, 50]}
              showGridlines
              stripedRows
            >
              {colunasCaixa.map(coluna => (
                <Column
                  key={coluna.field}
                  field={coluna.field}
                  header={coluna.header}
                  body={coluna.body}
                  footer={coluna.footer}
                  sortable={coluna.sortable}
                  headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9' }}
                />
              ))}
            </DataTable>

          </div>


        </Modal.Body>
        <FooterModal
          ButtonTypeCadastrar={ButtonTypeModal}
          textButtonCadastrar={"Atualizar"}
          onClickButtonCadastrar
          corCadastrar="success"

          ButtonTypeFechar={ButtonTypeModal}
          textButtonFechar={"Fechar"}
          onClickButtonFechar={handleClose}
          corFechar="secondary"

        />
      </Modal>

    </Fragment>
  )
}                      
