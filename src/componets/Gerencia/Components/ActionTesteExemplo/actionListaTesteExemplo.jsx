import React, { Fragment, useEffect, useState } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { CiEdit } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { GrFormView } from "react-icons/gr";
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputField } from "../../../Buttons/Input";
import { AiOutlineSearch } from "react-icons/ai";
import { InputSearch } from "../../../Buttons/InputSearch";

export const ActionListaTesteExemplo = ({ dadosEmpresas }) => {
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState('');

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

  const dados = dadosEmpresas.map((item, index) => {
    return {
      IDEMPRESA: item.IDEMPRESA,
      NOFANTASIA: item.NOFANTASIA,
      EEMAILPRINCIPAL: item.EEMAILPRINCIPAL,
      NUTELGERENCIA: item.NUTELGERENCIA,
    };
  });

  const colunaListaEmpresas = [
    { field: 'IDEMPRESA', header: 'ID', body: row => row.IDEMPRESA, sortable: true },
    { field: 'NOFANTASIA', header: 'Empresa ', body: row => row.NOFANTASIA, sortable: true },
    { field: 'EEMAILPRINCIPAL', header: 'Email ', body: row => row.EEMAILPRINCIPAL, sortable: true },
    { field: 'NUTELGERENCIA', header: 'Telefone ', body: row => row.NUTELGERENCIA, sortable: true },
    {
      field: 'IDEMPRESA', header: 'Opções', body: row => {
        if (row.IDEMPRESA !== usuarioLogado?.IDEMPRESA) {
          return (
            <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
              <ButtonTable
                titleButton={"Detalhar"}
                onClickButton={() => handleClickDetalhar(row)}
                Icon={GrFormView}
                iconSize={18}
                iconColor={"#fff"}
                cor={"success"}
              />
            </div>
          )
        } else {
          return (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ marginRight: "20px" }}>
                <ButtonTable
                  titleButton={"Editar"}
                  onClickButton={() => handleClickDetalhar(row)}
                  Icon={CiEdit}
                  iconSize={18}
                  iconColor={"#fff"}
                  cor={"primary"}
                />
              </div>
              <div>
                <ButtonTable
                  titleButton={"Detalhar"}
                  onClickButton={() => handleClickDetalhar(row)}
                  Icon={GrFormView}
                  iconSize={18}
                  iconColor={"#fff"}
                  cor={"success"}
                />
              </div>
            </div>
          )
        }
      },
      sortable: true,
    },
  ];

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const header = (
    <div className="table-header">
      <InputSearch
        value={globalFilterValue}
        onChange={onGlobalFilterChange}
        placeholder="Pesquisar"
      />
    </div>
  );

  return (
    <Fragment>
      <DataTable
        value={dados}
        paginator
        rows={10}
        rowsPerPageOptions={[10, 20, 30, 50, 100]}
        header={header}
        globalFilter={globalFilterValue}
        emptyMessage="Nenhum resultado encontrado"
        showGridlines
        stripedRows
      >
        {colunaListaEmpresas.map(coluna => (
          <Column
            key={coluna.field}
            field={coluna.field}
            header={coluna.header}
            body={coluna.body}
            sortable={coluna.sortable}
          />
        ))}
      </DataTable>
    </Fragment>
  );
};
