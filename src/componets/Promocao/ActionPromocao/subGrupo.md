<!-- 
    1 - LEVE N: A CADA 2, UM POR R$ X SUBGRUPO
    SUBGRUPO: 196
    FUNCIONANDO
<!-- 
    Sobram 2 promoções com aviso — as mesmas, sem alteração na carga

273 — tipo 4 "todos por R$ X"
VLPRECOPRODUTO = 10,00, APARTIRDEQTD = 1. O destino agora é só o subgrupo 1115 (836 produtos), e 56 deles estão abaixo de R$ 10,00 — o menor é R$ 7,99. Nesses, a promoção encarece o item em vez de dar desconto.
Correção: baixar VLPRECOPRODUTO para menos de 7,99, ou tirar do destino os produtos abaixo do preço fixo.

292 — tipo 23 "acima de R$ Y: a cada N, um com R$ X"
APARTIRDEQTD = 0 e APARTIRDOVLR = 0,00, subgrupo 186.

APARTIRDEQTD = 0 num tipo "a cada N" faz o seletor devolver zero: a promoção dispara e nunca dá desconto a ninguém. Precisa ser o intervalo pretendido (≥ 1, ex. 3).
APARTIRDOVLR = 0,00 faz qualquer venda passar do gatilho. O subgrupo 186 vai de R$ 9,99 a R$ 339,99; um valor coerente para "a cada 3" seria em torno de R$ 30,00.

Foi o mesmo erro da 293, que já foi corrigido nesta carga — falta aplicar o mesmo na 292.

 -->