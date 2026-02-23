import React, { Fragment, useEffect, useState } from "react";
import { get } from "../../../../api/funcRequest";

export const ActionRelatorioBI = ({usuarioLogado}) => {
  const [dadosBI, setDadosBI] = useState([]);

  useEffect(() => {
   
    if(usuarioLogado && usuarioLogado.IDEMPRESA) {

      getListaRelatorioBI();    
    }  
    
  }, [usuarioLogado]);

  const getListaRelatorioBI = async () => {
    if (usuarioLogado && usuarioLogado.IDEMPRESA) {
      try {
        const response = await get(`/relatorioBI?idEmpresaLogin=${usuarioLogado?.IDEMPRESA}&idRelatorio=1`);

        if (response.data) {
          setDadosBI(response.data);
        }

        return response.data;
      } catch (error) {
        console.log(error, "não foi possível pegar os dados da tabela ");
      }
    }
  };

  return (
    <Fragment>
      <div class="panel-hdr">
        <h1>Relatórios BI</h1>
      </div>

      <table class="table table-bordered table-hover table-striped w-100">
        <thead class="bg-primary-600">
          <tr>
            <th>{dadosBI.length > 0 ? dadosBI[0].DSNOME : ''}</th>
          </tr>
        </thead>
        <tbody id="resulmodalrelatoriobi">
          <tr>
            <td><iframe width="100%" height="800" frameborder="0" allowFullScreen="true" src={dadosBI.length > 0 ? dadosBI[0].LINK : ''}></iframe></td>
          </tr>
        </tbody>
      </table>
    </Fragment>
  );
};
