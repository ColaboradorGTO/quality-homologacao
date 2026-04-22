  ## LINK VERCEL
  https://quality-web.vercel.app/

  ## LINK HOMOLOGAÇÃO ABA PROMOÇÃO
  http://164.152.245.77:8000/quality/concentrador_homologacao/dashboardinformatica.html
 

  ## Regras Para Cadastro de Promoções:

  ## Validações iniciais de campos obrigatórios
  1.  mecânica deve ser selecionada.
  3.  se você selecionar uma Marca e Selecionar todas as empresas, será enviado para todas empresa daquela marca / bandeira especifíco.
  4.  se você selecionar todas as empresas sem selecionar nenhuma marca / bandeira o cadastro da promoção será em todas as lojas
  5.  descrição deve ter entre 20 e 200 caracteres.

  ## Validações de promoções ativas
  6. verifica se existem promoções ativas.
  7. se já existe uma promoção ativa com a mesma aplicação de destino na empresa Selecionada não será cadastrado uma nova.

  8.verifica se o produto destino já está vinculado a uma promoção ativa.
  9.se aplicação destino for por pares e já existir uma promoção ativa com a aplicação destino em um produto, não poderá cadastrar juntas.
  10.se aplicação destino for por pares ou menos na primeira, os produtos de origem e   destino devem ser iguais.   
  11.se aplicação destino for em um produto, pode ser enviado  apenas um produto e tem que ser o mesmo, tanto na origem quanto no destino.
  12.verificar se já existe uma promoção ativa com a mesma mecânica e aplicação destino.
  13.verificar se já existe uma promoção ativa com a mesma empresa e mecânica.
  14.verificar se já existem 2 promoções ativas na empresa selecionada.
  14 se aplicação destinos for por todos os produtos, os produtos origem e destino precisam ser o mesmos. 

  

  



# Cadastro de Promoções - Regras de Negócio

Este documento descreve as regras de negócio implementadas no hook `useCreatePromocaoAtiva` para garantir a integridade e unicidade das promoções cadastradas no sistema.

---

## 1. Validações Iniciais Obrigatórias

- **Mecânica:**  
  Deve estar selecionada.  
  Se não, exibe erro: “Selecione uma mecânica!”

- **Empresa:**  
  Deve estar selecionada (pode ser múltipla).  
  Se não, exibe erro: “Selecione uma empresa!”

- **Descrição:**  
  Deve ter entre 20 e 200 caracteres.  
  Se não, exibe erro: “Descrição deve ter entre 20 e 200 caracteres!”

---

## 2. Validação de Produtos

- **Produtos de Origem e Destino:**  
  Devem ser informados via campo ou arquivo.  
  São convertidos para array antes do envio.

---

## 3. Regras de Promoções Ativas

- **Busca promoções ativas** para a empresa e data fim.
- **Verifica se já existe aplicação de destino ativa** para a mesma empresa e aplicação (`TPAPARTIRDE`).  
  Se sim, bloqueia o cadastro.
- **Verifica se algum produto destino já está em promoção ativa.**  
  Se sim, bloqueia o cadastro.
- **Não permite cadastrar promoção por pares e em um produto ao mesmo tempo.**
- **Não permite cadastrar promoção com o mesmo tipo de desconto já ativo na empresa.**
- **Não permite mais de 3 promoções ativas na mesma empresa.**
- **Não permite mais de uma promoção ativa com aplicação destino por pares.**
- **Não permite mais de uma promoção ativa com aplicação destino menos na primeira.**

---

## 4. Regras Específicas por Aplicação de Destino

- **Por Pares ou Menos na Primeira (`aplicacaoDestinoSelecionada == 0 || 3`):**
  - Produtos de origem e destino devem ser iguais (mesmo array e ordem).
  - Se não, bloqueia o cadastro.

- **Por Todos os Produtos (`aplicacaoDestinoSelecionada == 1`):**
  - Quantidade de produtos de origem e destino deve ser igual.
  - Se não, bloqueia o cadastro.

- **Em Um Produto (`aplicacaoDestinoSelecionada == 4`):**
  - Apenas um produto na origem e no destino.
  - Produto de origem e destino deve ser o mesmo.
  - Se não, bloqueia o cadastro.

---

## 5. Conversão de Valores

- **Valor monetário (`precoProduto`):**  
  Deve ser convertido para número no padrão americano (ex: `49,99` → `49.99`) antes do envio.

---

## 6. Envio dos Dados

- Se todas as validações forem aprovadas, os dados são enviados via POST para `/criar-promocoes-ativas`.
- Exibe mensagem de sucesso ou erro conforme o resultado.

---

## Resumo

O cadastro só será realizado se:
- Todos os campos obrigatórios estiverem preenchidos corretamente.
- Não houver conflitos com promoções já ativas conforme as regras acima.
- Os produtos de origem e destino respeitarem as regras da mecânica selecionada.
- O valor monetário estiver no formato correto.

Essas regras garantem a integridade e unicidade das promoções cadastradas no sistema do PDV.


<!--  

  //  TPAPARTIRDE = 0 // aplicação destino por pares
  //  TPAPARTIRDE = 1 // aplicação destino em todos os produtos
  //  TPAPARTIRDE = 2 // aplicação destino no ultimo após entrada da promoção
  //  TPAPARTIRDE = 3 // aplicação destino menos na primeira
  //  TPAPARTIRDE = 4 // aplicação destino em 1(um) produto

  // TABELAS RESUMOPROMOCAOMARKETING
  // TPAPLICADOA = 1->APLICADO A VALOR 
  // 2-> APLICADO A QUANTIDADE
  // TPFATORPROMO = USADO PARA O PDV IDENTIFICAR A PROMOCAO
  // 	TPFATORPROMO = 0 // por valor final
  //  TPFATORPROMO = 1 // por valor desconto
  // 	TPFATORPROMO = 2 // por percentual desconto
  
  pegando por base as regras acima, da mecânica de promoção, o que será feito é o seguinte:
  TPAPLICADOA = 1->APLICADO A VALOR // 2-> APLICADO A QUANTIDADE será ou no valor ou na quantidade
  depois o usuario irá escolher 
  TPAPARTIRDE = 0 aplicação destino por pares, se o usuario escolher
  TPAPARTIRDE = 1 aplicação destino em todos os produtos, se o usuario escolher
  TPAPARTIRDE = 2 aplicação destino no ultimo após entrada da promoção, se o usuario escolher
  TPAPARTIRDE = 3 aplicação destino menos na primeira, se o usuario escolher
  TPAPARTIRDE = 4 aplicação destino em um produto 


  preciso mapear uma promoção
  TPAPLICADOA = 1 -> APLICADO A VALOR
  TPFATORPROMO = 0 por valor final
  TPAPARTIRDE = 4 aplicação destino em um produto 
-->

<!--

ESTA PROMOÇÃO NÃO FUNCIONOU PROMOÇÃO POR EM UM PRODUTO // QUANTIDADE VALOR // VALOR FINAL COM OUTRAS PROMOÇÕES


-->

<!-- 
/* 
  o usuario seleciona o subGrupo ai ele traz todos os produtos, deste subgrupo
  se o usuario não selecionar nem um produto,  IDSUBGRUPOEMDESTINO: subGrupoProdutoDestino, IDSUBGRUPOEMORIGEM: subGrupoProdutoOrigem,
  e o IDPRODUTOEMDESTINO: null, IDPRODUTOEMORIGEM: null, IDPRODUTO: null,
  se o usuario selecionar o subgrupo e selecionar os produtos, deste subGrupo
  IDSUBGRUPOEMDESTINO: -1, IDSUBGRUPOEMORIGEM: -1,
  IDPRODUTOEMDESTINO: produtoSelecionadoEstProdDestino, IDPRODUTOEMORIGEM: produtoSelecionadoEstProdOrigem, IDPRODUTO: produtoSelecionadoEstProdDestino,
  se tem produto ele pricisa esta no destino e na origem o mesmo, produto.
   
  precisar verificar se o produto selecionado já existe em outra promoção ativa, se sim, não permitir cadastrar a promoção, com este produto
  se for por subgGrupo, verificar se o subgrupo selecionado, já existe em outra promoção ativa, se sim, não permitir cadastrar a promoção, com este subgrupo
  estas verificações precisam ser feitas no detalhe destino e origem

  O usuario pode selecionar o subGrupo e não selecionar os produtos,
  neste caso o IDPRODUTO: null, IDPRODUTOEMORIGEM: null, IDPRODUTO: null, IDSUBGRUPOEMDESTINO: subGrupoProdutoDestino, IDSUBGRUPOEMORIGEM: subGrupoProdutoOrigem,
  ou usuario pode selecionar o subGrupo e selecionar os produtos, se o produto pertencer ao subgrupo, neste caso o 
  IDPRODUTOEMORIGEM: produtoSelecionadoEstProdOrigem, IDPRODUTO: produtoSelecionadoEstProdDestino, IDSUBGRUPOEMDESTINO: -1, IDSUBGRUPOEMORIGEM: -1
  mais o usuario pode selecionar. vários subgrupos e vários produtos, neste caso se o usuario selecionar 2 subgrupos e selecionar diversoso produtos
  mais os produtos selecionados pertencem a apenas um dos subgrupos, neste caso o IDPRODUTOEMORIGEM: produtoSelecionadoEstProdOrigem, IDPRODUTO: produtoSelecionadoEstProdDestino, IDSUBGRUPOEMDESTINO: -1, IDSUBGRUPOEMORIGEM: -1 do subGrupo que os produtos selecionados pertencem, 
  e o outro subgrupo selecionado que não tem produto selecionado, fica com IDPRODUTOEMORIGEM: null, IDPRODUTO: null, IDSUBGRUPOEMDESTINO: subGrupoProdutoDestino, IDSUBGRUPOEMORIGEM: subGrupoProdutoOrigem

  para verificar se o produtos selecionados pertencem ao subgrupo, eles vem estes aqui   
  console.log(produtoSelecionadoEstProdDestino, 'produtoSelecionadoEstProdDestino');
  console.log(produtoSelecionadoEstProdOrigem, 'produtoSelecionadoEstProdOrigem');
  que tras os retorno que contem as informações abaixo
  IDPRODUTO: "11797"
  IDSUBGRUPO: 138


  15516
  15515

  31592
   31597
    31596

    NOVOS
    15518
    15517

    31593
    31594
    31595
*/


/*
os campos IDSUBGRUPOEMDESTINO, IDSUBGRUPOEMORIGEM,  IDPRODUTODESTINO IDPRODUTOORIGEM e IDPRODUTO
permite arrays de objetos e null ?
exemplo de um payload no post,

por que a seguinte lógica poderá acontecer
 O usuario pode selecionar o subGrupo e não selecionar os produtos,
  neste caso o IDPRODUTO: null, IDPRODUTOEMORIGEM: null, IDPRODUTO: null, IDSUBGRUPOEMDESTINO: subGrupoProdutoDestino, IDSUBGRUPOEMORIGEM: subGrupoProdutoOrigem,
  ou usuario pode selecionar o subGrupo e selecionar os produtos, se o produto pertencer ao subgrupo, neste caso o 
  IDPRODUTOEMORIGEM: produtoSelecionadoEstProdOrigem, IDPRODUTO: produtoSelecionadoEstProdDestino, IDSUBGRUPOEMDESTINO: -1, IDSUBGRUPOEMORIGEM: -1
  mais o usuario pode selecionar. vários subgrupos e vários produtos, neste caso se o usuario selecionar 2 subgrupos e selecionar diversoso produtos
  mais os produtos selecionados pertencem a apenas um dos subgrupos, neste caso o IDPRODUTOEMORIGEM: produtoSelecionadoEstProdOrigem, IDPRODUTO: produtoSelecionadoEstProdDestino, IDSUBGRUPOEMDESTINO: -1, IDSUBGRUPOEMORIGEM: -1 do subGrupo que os produtos selecionados pertencem, 
  e o outro subgrupo selecionado que não tem produto selecionado, fica com IDPRODUTOEMORIGEM: null, IDPRODUTO: null, IDSUBGRUPOEMDESTINO: subGrupoProdutoDestino, IDSUBGRUPOEMORIGEM: subGrupoProdutoOrigem

  NÃO ALTERE NADA APENAS EXPLIQUE SE É POSSIVEL ENVIAR DESTA FORMA SENÃO ME MOSTRE COMO ADEQUEAR O MEU CÓDIGO E O PAYLOAD DA MANEIRA CORRETA.

  Vamos montar uma estratégia, mais assertiva, neste caso preciso da seguinte lógica primeiro salvar o ResumoPromoção
  com o IDRESUMOPROMOCAOMARKETING
  e depois salvando os detalhes da promoção, onde o IDRESUMOPROMOCAOMARKETING é a chave para relacionar os detalhes com o resumo,
  e assim enviando os objetos de detalhes um a um por que eles podem ser varios objetos detalhes
  mandando o objeto de destino e origem seprados, dentro de um array de objetos
*/
 -->