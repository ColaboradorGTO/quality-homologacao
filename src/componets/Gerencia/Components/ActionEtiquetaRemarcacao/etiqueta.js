// Inicio Variaveis Globais da Rotina De Etiquetas//
var acumuladorEtiquetasRemarcacao = [];
// Fim Variaveis Globais da Rotina De Etiquetas//

// Inicio Funções Globais da Rotina De Etiquetas//
function formatToDecimal(element, qtdDecimal = 2){
  let value = $(element).val().replace(/\D/g, '').padStart(3, '0');
  let firstPart = String(value).substring(0, value.length - 2);
  let lastPart = String(value).substring(value.length - 2, value.length)

  value = Number([
      firstPart,
      '.',
      lastPart
  ].join(''));

  $(element).val(maskValorEmDecimal(value, qtdDecimal));
}

function formatToNumber(element) {
  let value = Number($(element).val().replace(/\D/g, '') || 0);
  
  value = value ? maskValorEmInteiro(value) : '';

  $(element).val(value);
}

function habilitarButtonsEtiquetaRemarcacao(element){
  let value = Number($(element).val().replace(/\D/g, '') || 0);

  if (value){
      $('#btnAcumuladorImpEtiquetasRemarcacao').removeClass('d-none');
  } else{
      $('#btnAcumuladorImpEtiquetasRemarcacao').addClass('d-none');
  }

  if (acumuladorEtiquetasRemarcacao?.length){
      $('#btnDeletarAcumuladorImpEtiquetasRemarcacao, #containerQtdCopias').removeClass('d-none');
  } else {
      $('#btnDeletarAcumuladorImpEtiquetasRemarcacao, #containerQtdCopias').addClass('d-none');
  }
  
}
// Fim Funções Globais da Rotina De Etiquetas//

async function TelaEtiquetaRemarcacao() {
  try {
      animationLoadingStart('Carregando Dados...');
      
      acumuladorEtiquetasRemarcacao = [];
      
      await $.get("action_etiqueta_remarcacao.html", function (resp) {
          $('#js-page-content').html(resp);
      }).fail((error) => { throw error; });

      $('#vrEtiquetaRemarcacao').focus().val('');

      animationLoadingStop();
  } catch (error) {
      console.log(error);
      animationLoadingStop();

      msgError(error);
  }
}

async function modalQuestionQuantidadeCopiasEtiquetaRemarcacao() {
  let qtdCopias;

  await Swal.fire({
      type: 'question',
      title: 'Digite a quantidade de Cópias?',
      html: `
          <div class="text-dark fw-900">

              <div class="input-group">
                  <input type='text' min='1' id="qtdCopiasModal" class="swal2-input z-index-5 mt-0 w-50" type="text" autocomplete="off" placeholder="Digite a quantidade" style="text-align: center;" oninput="formatToNumber(this)">
              </div>

          </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Confirmar!',
      cancelButtonText: 'Não, Voltar!',
      confirmButtonColor: '#2196F3',
      cancelButtonColor: '#d33',
      onOpen: () => {
          $('#qtdCopiasModal').focus().on('keypress', (e) => {
              if (e.keyCode == 13) {
                  Swal.clickConfirm()
              }
          });
      },
      preConfirm: async () => {
          qtdCopias = Number(($('#qtdCopiasModal').val().replaceAll('.', '')).replaceAll(',', '.') || 0);

          if (!qtdCopias) {
              $('#qtdCopiasModal').focus();
              $('#swal2-validation-message').addClass('text-danger fw-700');
              return Swal.showValidationMessage('Digite a quantidade e tente novamente!');
          }
      }
  })

  return qtdCopias;

}

async function modalQuestionQuantidadeEtiquetaRemarcacao() {
  let qtdEtiqueta;

  await Swal.fire({
      type: 'question',
      title: 'Digite a quantidade de etiquetas?',
      html: `
          <div class="text-dark fw-900">

              <div class="input-group">
                  <input type='text' min='1' id="qtdEtiqueta" class="swal2-input z-index-5 mt-0 w-50" type="text" autocomplete="off" placeholder="Digite a quantidade" style="text-align: center;" oninput="formatToNumber(this)">
              </div>

          </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Confirmar!',
      cancelButtonText: 'Não, Voltar!',
      confirmButtonColor: '#2196F3',
      cancelButtonColor: '#d33',
      onOpen: () => {
          $('#qtdEtiqueta').focus().on('keypress', (e) => {
              if (e.keyCode == 13) {
                  Swal.clickConfirm()
              }
          });
      },
      preConfirm: async () => {
          qtdEtiqueta = Number(($('#qtdEtiqueta').val().replaceAll('.', '')).replaceAll(',', '.') || 0);

          if (!qtdEtiqueta) {
              $('#qtdEtiqueta').focus();
              $('#swal2-validation-message').addClass('text-danger fw-700');
              return Swal.showValidationMessage('Digite a quantidade e tente novamente!');
          }
      }
  })

  return qtdEtiqueta;

}   

function indicadorQuantidadesNoModalEtiquetas(qtdEtiquetas, qtdCopias, qtdPorPagina = 4) {
  let totalPaginas = Math.ceil(qtdEtiquetas / qtdPorPagina) * qtdCopias;
  let totalEtiquetas = qtdEtiquetas * qtdCopias; 

  return (`
      <span>Qtd. Páginas: <b>${totalPaginas} página${totalPaginas > 1 ? 's' : ''}</b></span> 
      <span>Qtd. Etiquetas:  <b>${totalEtiquetas} unidade${totalEtiquetas > 1 ? 's' : ''}</b></span>
  `);
}

async function modalPreviaEtiquetasRemarcacaoParaImprimir(labelData, qtdCopiasModal = 0) {
  let qtdCopias = Number(qtdCopiasModal) || Number($('#qtdCopias').val() || 1);
  let htmlDivPage = `<div class="etiqueta-remarcacao-page rounded" ><div class="etiqueta-remarcacao-page-number hidden-print" >numPage</div>`;
  let htmlCloseDiv = `</div>`
  let htmlLabelPages = htmlDivPage;
  let totalQtdEtiquetas = 0;
  let contador = 0;
  let arrayLabelCards = [];
  let htmlEtiquetasParaImprimir = ``;
  let lengthVrEtiqueta = 0;
  let fontSize = 1.2;
  let jsContent = 'center';
  let vrDiferencaLength = 0;
  let vrCompensacao = 0;

  $('#resultadoImpEtiquetaProd').html('');

  if (labelData?.length) {
      labelData.map(({ vrEtiqueta, qtdEtiqueta }) => {
          vrEtiqueta = maskValor(vrEtiqueta);
          lengthVrEtiqueta = vrEtiqueta.length;

          if (lengthVrEtiqueta <= 11){
              jsContent = 'center';
          } else{
              jsContent = 'flex-start';
          }

          if (lengthVrEtiqueta > 12) {
              vrDiferencaLength = lengthVrEtiqueta - 12;
          } 

          if (lengthVrEtiqueta >= 15) {
              vrDiferencaLength = lengthVrEtiqueta - 14;
          } 

          vrCompensacao = vrDiferencaLength / 10;
          fontSize = lengthVrEtiqueta <= 12 ? 1.2 : Number(fontSize - vrCompensacao).toFixed(3);

          let htmlCardEtiqueta = `
              <div class="etiqueta-remarcacao-card border-dark rounded">
                  <div class="etiqueta-remarcacao-card-body"></div>
                  <div class="preco-remarcacao" style="font-size: ${fontSize + 'em'}; justify-content: ${jsContent}">
                      <h2 style="margin: 1px !important;">${vrEtiqueta}</h2>
                  </div>
              </div>
          `;

          totalQtdEtiquetas += qtdEtiqueta;

          for (let i = 0; i < qtdEtiqueta; i++) {
              arrayLabelCards.push(htmlCardEtiqueta);
          }

      })

      arrayLabelCards.map((htmlCardEtiqueta, i) => {
          htmlLabelPages += htmlCardEtiqueta;
          contador++;

          if (contador == 4) {
              htmlLabelPages += htmlCloseDiv;

              if ((i + 1) < arrayLabelCards.length) {
                  htmlLabelPages += htmlDivPage;
              }
              contador = 0;
          }

      })

      htmlLabelPages += htmlCloseDiv;

      htmlEtiquetasParaImprimir = new Array(qtdCopias).fill(htmlLabelPages).join('').split(/(?=<div class="etiqueta-remarcacao-page )/);

      htmlEtiquetasParaImprimir = htmlEtiquetasParaImprimir.map((item, i) => item.replace('numPage', `${i + 1}`)).join('');

      $('#resultadoImpEtiquetaRemarcacao').html(htmlEtiquetasParaImprimir);
      $('#modalImpEtiquetaRemarcacao').modal('show');

      $('.modal-title-quantidade').html(indicadorQuantidadesNoModalEtiquetas(totalQtdEtiquetas, qtdCopias));

  }
}

async function validaDadosEtiquetasRemarcacao(){
  let labelData = [...acumuladorEtiquetasRemarcacao] || [];
  let qtdCopias;

  if(!labelData?.length){
      let vrEtiqueta = Number(($('#vrEtiquetaRemarcacao').val().replaceAll('.', '')).replace(',', '.'));
      let qtdEtiqueta = vrEtiqueta && await modalQuestionQuantidadeEtiquetaRemarcacao();
      
      qtdCopias = qtdEtiqueta && 1; //await modalQuestionQuantidadeCopiasEtiquetaRemarcacao();

      if (vrEtiqueta && qtdEtiqueta && qtdCopias){
          labelData.push({
              vrEtiqueta,
              qtdEtiqueta
          });
      }
  }

  labelData.length && modalPreviaEtiquetasRemarcacaoParaImprimir(labelData, qtdCopias);
}

function imprimirEtiquetasRemarcacao() {
  try{
      animationLoadingStart('Aguardando o processo de impressão, favor finalizar a impressão...', false, 1);

      let htmlEtiquetas = document.getElementById('resultadoImpEtiquetaRemarcacao').innerHTML;
      let htmlToPrint = `
      <html>
          <head>
              <meta charset="utf-8">
              <title>Impressão</title>
              <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"> 
              <style>
                  body {
                      display: flex;
                      justify-content: center;
                      font-family: 'Roboto', sans-serif !important;
                      font-size: 13px;
                      letter-spacing: -0.05px !important;
                      margin: 1px !important;
                      transform: rotate(0deg);
                      transform-origin: center;
                  }

                  @media print{

                      body {
                          display: block;
                      }

                      @page {
                              size: 6cm 2.5cm;
                              margin: -3.45cm -2.9cm;;
                              orientation: landscape;
                          }

                      .etiqueta-remarcacao-page {
                          display: flex;
                          flex-wrap: wrap;
                          align-content: flex-start;
                          margin: 0 0 0 6%;
                          width: 100%;
                          height: 95%;
                          padding: 0;
                      }

                      .etiqueta-remarcacao-page-number {
                          display: none;
                      }

                      .etiqueta-remarcacao-card {
                          width: 24% ;
                          height: 100%;
                          margin-right: 0;
                          margin-bottom: 0;
                          padding: 29% 0 0 3px !important;
                          box-sizing: border-box;
                          display: flex;
                          flex-direction: column;
                          justify-content: flex-start;
                          align-items: center;
                          page-break-after: always;
                      }

                      .preco-remarcacao{
                          font-weight: bold;
                          letter-spacing: -2px !important;
                          display: flex !important;
                          align-items: center !important;
                          width: 100% !important;
                      }

                      h2{
                          font-size: 1.31em !important;
                          margin: 0% !important;
                      }
                  }
              </style>
              <script>
                  window.onafterprint = function() {
                      window.close();
                  };

                  window.document.addEventListener('DOMContentLoaded', function() {
                      window.focus();
                      window.print();
                  });
              </script>
          </head>
          <body>
              ${htmlEtiquetas}
          </body>
      </html>
      `;

      let tela_impressao = window.open('', '', '');

      tela_impressao = tela_impressao.document;

      tela_impressao.open();
      tela_impressao.write(htmlToPrint);
      tela_impressao.close();
      
      //animationLoadingStop()

      msgSuccess('Processo de Impressão Finalizado!').then(() => {
          $('#modalImpEtiquetaRemarcacao').modal('hide');
      })
  } catch(error){
      console.log(error);
      msgError('Erro ao tentar imprimir, recarregue e tente novamante');
  } 
}

function editQtdEtiquetaRemarcacao(idArray, value) {
  acumuladorEtiquetasRemarcacao[idArray].qtdEtiqueta = value || 1;
}

function nextInputElement(event) {
  let element = $(event.target);
  let tableRow = element.closest('tr');
  let tableBody = $(tableRow).parent();
  let nextLine = tableRow.next();
  let nextInput = nextLine?.length ? nextLine.find('input') : tableBody.find('tr:first').find('input');
  let vrElement = nextInput.val();

  if (event.key === "Enter" || event.key === "Tab") {
      event.preventDefault();

      nextInput.focus();
      nextInput.value = vrElement;
  }
}

async function listarEtiquetasRemarcacao(isFocus = false) {
  let indice = 0;
  let dadosTable = [];

  acumuladorEtiquetasRemarcacao.map((etiqueta, idArray) => {

    let { vrEtiqueta, qtdEtiqueta } = etiqueta;
    indice++;

    let opcoes = `
        <div class="d-flex justify-content-center input-group w-100">
            <button class="btn btn-danger" type="button" onclick="deletarEtiquetaRemarcacaoDoAcumulador('${idArray}')" title="Excluir Etiqueta">
                <span class="fal fa-trash mr-1"></span>
            </button>
        </div>
    `;

    let inputQtdEtiqueta = `
        <div class="d-flex justify-content-center text-dark fw-900">
            <div class="input-group w-25">
                <input type='text' class="form-control text-center border-dark" " autocomplete="off" value='${qtdEtiqueta || 1}' style="text-align: center;" oninput="(formatToNumber(this), editQtdEtiquetaRemarcacao('${idArray}', this.value))" onkeydown="nextInputElement(event)" onchange="(this.value = Number(this.value) || 1)">
            </div>

        </div>
    `;

    dadosTable.push([
        indice,
        opcoes,
        maskValorEmBRL(vrEtiqueta),
        inputQtdEtiqueta
    ]);
  })

  $('#resultado').removeClass('d-none').html(`
    <div class="col-sm-12 col-xl-12">
      <table id="dt-basic-lista-etiquetas-remarcacao" class="table table-bordered table-hover table-striped w-100">
        <thead class="bg-primary-600">
            <tr>
              <th class="text-center">#</th>
              <th class="text-center">Opções</th>
              <th class="text-center">Valor</th>
              <th class="text-center">Quantidade</th>
            </tr>
        </thead>
      </table>
    </div>
  `);

  $('#dt-basic-lista-etiquetas-remarcacao').DataTable({
      data: dadosTable,
      paging: true,
      pageLength: 50,
      searching: true,
      info: true,
      deferRender: false,
      responsive: true,
      autoWidth: true,
      columnDefs: [
          {
              type: 'currency-brl',
              targets: [2],
          }
      ],
      columns: [
          { width: '5%' },
          { width: '5%' },
          { width: '45%' },
          { width: '45%' },
      ],
      language: {
          "emptyTable": "Dados não encontrados!"
      },
      initComplete: function (settings) {
          let idTable = `#${settings.nTable.id}`;

          if (isFocus) {
              $(idTable).focus();

              $('html, body').animate({
                  scrollTop: $(idTable).offset().top
              }, 1000);
          }
      }
  });
}

async function guardarNoAcumuladorImpEtiquetasRemarcacao() {
  let vrEtiqueta = Number(($('#vrEtiquetaRemarcacao').val().replaceAll('.', '')).replaceAll(',', '.'));
  let qtdEtiqueta = vrEtiqueta && await modalQuestionQuantidadeEtiquetaRemarcacao();

  if (qtdEtiqueta){

      if (!acumuladorEtiquetasRemarcacao?.length){
          acumuladorEtiquetasRemarcacao = [];
      }

      acumuladorEtiquetasRemarcacao.push({
          vrEtiqueta,
          qtdEtiqueta
      })

      $('#btnDeletarAcumuladorImpEtiquetasRemarcacao, #containerQtdCopias').removeClass('d-none');

      await listarEtiquetasRemarcacao();

      await msgSuccess('Guardado com Sucesso!', undefined, 2000);

      setTimeout(()=> $('#vrEtiquetaRemarcacao').focus().val(''), 500);
  }
}

function deletarTudoDoAcumuladorImpEtiquetasRemarcacao() {

  Swal.fire({
      type: 'question',
      title: 'Deseja Limpar as Etiquetas Guardadas?',
      text: 'Esta ação não poderá ser desfeita!',
      showCancelButton: true,
      confirmButtonText: 'Sim, Limpar!',
      cancelButtonText: 'Não, Voltar!',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#2196F3',
      preConfirm: () => {
          acumuladorEtiquetasRemarcacao = [];

      }
  })
  .then(async (resp) => {
      if(resp.value){
          $('#btnAcumuladorImpEtiquetasRemarcacao, #btnDeletarAcumuladorImpEtiquetasRemarcacao, #containerQtdCopias, #resultado').addClass('d-none');

          //await listarEtiquetasRemarcacao();

          await msgSuccess('Limpo com Sucesso!', undefined, 2000);

          setTimeout(() => $('#vrEtiquetaRemarcacao').focus().val(''), 500);
      }
  })
}

function deletarEtiquetaRemarcacaoDoAcumulador(idArray){
  acumuladorEtiquetasRemarcacao.splice(idArray, 1);

  if(acumuladorEtiquetasRemarcacao.length){
      listarEtiquetasRemarcacao(true);
  } else {
      $('#btnAcumuladorImpEtiquetasRemarcacao, #btnDeletarAcumuladorImpEtiquetasRemarcacao, #containerQtdCopias, #resultado').addClass('d-none');

      $('#vrEtiquetaRemarcacao').val('').focus();
  }
}

//?============ FIM ROTINA - IMPRESSÃO ETIQUETAS REMARCACAO ============ //