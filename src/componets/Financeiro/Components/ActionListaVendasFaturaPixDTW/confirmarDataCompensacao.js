export function status_confirmar_DataCompensacao(ids, status) {
  if (typeof ids === 'string') {
    ids = [ids];
  }

  Swal.fire({
    title: 'Confirma a Conferência Venda data Compensação?<br>Informe a Data de Compensação',
    html: '<input type="date" id="dtcompensacao" name="DTCompensacao" class="form-control" value="" >',
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {

    if (result.value) { 
      var dtCompensacao = document.getElementById('dtcompensacao').value;
      
      var dados = ids.map(id => ({
        "IDVENDA": id,
        "STCONFERIDO": status,
        "DATA_COMPENSACAO": dtCompensacao
      }));
      

      ajaxPut("api/financeiro/venda-pix-periodo-status-conferido.xsjs", dados)
        .then(funcSucessUpdateConferidoDTCompensacao)
        .catch(funcErrorUpdateConferidoDTCompensacao);

      var textdados = JSON.stringify(dados);
      var textoFuncao = status === 'True' ? 'FINANCEIRO/CONFIRMADA CONFERENCIA DA VENDA' : 'FINANCEIRO/DESCONFIRMADO CONFERENCIA DA VENDA';
      var dadosConfirmaDep = [{
        "IDFUNCIONARIO": IDFuncionarioLogin.toString(),
        "PATHFUNCAO": textoFuncao,
        "DADOS": textdados,
        "IP": ipCliente
      }];

      ajaxPost("api/log-web.xsjs", dadosConfirmaDep)
        .then(funcSucessLog)
        .catch(funcError);
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      console.log('Ação cancelada pelo usuário.'); 
    }
  });
}