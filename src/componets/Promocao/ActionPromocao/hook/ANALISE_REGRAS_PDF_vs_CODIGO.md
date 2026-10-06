# Análise: Guia de Cadastro de Promoções (PDF) vs Código (`useCreatePromocaoAtiva.jsx` / `actionPesquisaPromocao.jsx`)

Comparação entre as regras descritas em `Guia_Cadastro_Promocoes.pdf` (motor do PDV, catálogo de 30 tipos e carga do Quality PDV) e as validações que já existem no código das três rotinas de cadastro:

- `onSubmit` → cadastro **por Produto** (`POST /criar-promocoes-ativas`)
- `onSubmitEstrutura` → cadastro **por Estrutura/Subgrupo** (`POST /criar-promocoes-ativas-subGrupo`)
- `onSubmitEstruturaProduto` → cadastro **por Estrutura + Produto** (`POST /criar-promocoes-ativas-subGrupo-produto`)

Legenda: ✅ Implementada · ⚠️ Parcial/diferente do guia · ❌ Pendente (não existe)

> **Correção do usuário (22/09/2026):** o PDF descreve um estado-alvo em que só `NUTIPOPROMOCAO` importaria. Na realidade, **hoje existem dois motores rodando em paralelo**: o motor legado (produção), que lê `TPAPARTIRDE`/`TPAPLICADOA`/`TPFATORPROMO`, e o motor novo (em homologação), que já lê `NUTIPOPROMOCAO`. Nenhum dos dois foi desligado — ver **seção 0** para o funcionamento de cada um, e a **seção 6**, que confirma (com as imagens anexadas) que `optionsMecanicaCompleta` já foi desenhada para alimentar os dois motores ao mesmo tempo.

---

## 0. Como o sistema decide a mecânica hoje: motor legado + motor novo em paralelo

### 0.1 Motor legado (produção atual do PDV)

O PDV lê hoje a combinação de três campos para montar a mecânica da promoção:

```
TPAPARTIRDE (aplicação destino)
  0 = aplicação destino por pares
  1 = aplicação destino em todos os produtos
  2 = aplicação destino no último após entrada da promoção ("a cada N")
  3 = aplicação destino menos na primeira
  4 = aplicação destino em 1 (um) produto

TPAPLICADOA (mecânica: quantidade ou valor) — tabela RESUMOPROMOCAOMARKETING
  1 = aplicado a valor
  2 = aplicado a quantidade

TPFATORPROMO (usado pelo PDV para identificar o tipo de benefício)
  0 = por valor final
  1 = por valor desconto
  2 = por percentual desconto
```

No código, esses três campos vêm dos estados `aplicacaoDestinoSelecionada` (`TPAPARTIRDE`), `mecanicaSelecionada` (`TPAPLICADOA`) e `tipoDescontoSelecionado` (`TPFATORPROMO`).

### 0.2 Motor novo (em homologação, também funcionando hoje)

Em paralelo, o novo motor (documentado no `Guia_Cadastro_Promocoes.pdf`) lê **`NUTIPOPROMOCAO`**, um número de 1 a 30 que já embute sozinho a combinação início/quem-recebe/benefício (catálogo dos 30 tipos, página 3–8 do guia). No código, esse valor vem do estado `tipoPromocao`.

### 0.3 `optionsMecanicaCompleta` alimenta os dois motores ao mesmo tempo — por desenho, não coincidência

Em [mecanica.jsx:183-454](../../../../mecanica.jsx#L183-L454), cada uma das 30 mecânicas tem **dois grupos de campos**:

- `value` (1–30, códigos `Q-xxx`/`V-xxx`) → identifica a mecânica no **motor novo**. Vira `NUTIPOPROMOCAO`.
- `aplicacaoDestino` + `mecanica` + `tipoDesconto` → replica exatamente a mecânica equivalente do **motor legado** (mesma combinação usada em `optionsMecanicaCompletaAnterior`). Viram `TPAPARTIRDE` + `TPAPLICADOA` + `TPFATORPROMO`.

E o handler que lê a seleção do usuário já propaga os dois grupos a partir do mesmo item selecionado:

```js
// actionPesquisaPromocao.jsx
const handleChangeMecanica = useCallback((selectedValue) => {
  setTipoPromocao(selectedValue.value)                 // → NUTIPOPROMOCAO (motor novo)
  setMecanicaSelecionada(selectedValue.MECANICA);       // → TPAPLICADOA (motor legado)
  setMecanicaSelecionadaEdicao(selectedValue.label)
  setAplicacaoDestinoSelecionada(selectedValue.APLICAODESTINO); // → TPAPARTIRDE (motor legado)
  setTipoDescontoSelecionado(selectedValue.TIPODESCONTO);       // → TPFATORPROMO (motor legado)
}, []);
```

Isso explica por que a seção 6 encontrou 100% de correspondência: a tabela foi construída para que **escolher uma mecânica nova sempre envie também a mecânica legada correta**, garantindo que o motor de produção continue funcionando enquanto o motor novo é homologado em paralelo.

**Consequência prática para a checagem de regras:** a partir de agora, toda validação de mecânica deve ser feita **nos dois sentidos**:
1. O trio `TPAPARTIRDE`/`TPAPLICADOA`/`TPFATORPROMO` enviado corresponde à mecânica escolhida? (garante o motor legado/produção)
2. O `NUTIPOPROMOCAO` enviado corresponde à mesma mecânica escolhida? (garante que o cadastro também sirva para homologar o motor novo)

---

## 1. `NUTIPOPROMOCAO` não é enviado em 2 dos 3 fluxos — impacto revisto

| Fluxo | Envia `TPAPARTIRDE`/`TPAPLICADOA`/`TPFATORPROMO` (motor legado)? | Envia `NUTIPOPROMOCAO` (motor novo)? |
|---|---|---|
| `onSubmit` (Por Produto) | ✅ Sim | ✅ Sim (`NUTIPOPROMOCAO: tipoPromocao`, linha ~1108) |
| `onSubmitEstrutura` (Por Estrutura) | ✅ Sim, e é o que decide a mecânica no motor legado | ❌ **Não existe no `postData`** |
| `onSubmitEstruturaProduto` (Estrutura+Produto) | ✅ Sim, e é o que decide a mecânica no motor legado | ❌ **Não existe no `postData`** |

**Impacto revisado:** como o motor legado continua sendo o motor de produção e recebe corretamente `TPAPARTIRDE`/`TPAPLICADOA`/`TPFATORPROMO` nos três fluxos (confirmado na seção 6), **nenhum dos três fluxos está quebrado em produção**. O gap real é outro: as promoções cadastradas por `onSubmitEstrutura` e `onSubmitEstruturaProduto` **nunca chegam ao motor novo** (não enviam `NUTIPOPROMOCAO`), então esses dois fluxos ficam de fora da homologação do motor novo — só `onSubmit` (Por Produto) está sendo testado nos dois motores hoje.

**Pendente (agora com prioridade de homologação, não de produção):** incluir `NUTIPOPROMOCAO: tipoPromocao` no `postData` de `onSubmitEstrutura` e `onSubmitEstruturaProduto`, para que os três fluxos sejam validados igualmente pelo motor novo.

---

## 2. Regras de campo a campo (guia, página 2–3)

| Regra do guia | Status | Onde está / o que falta |
|---|---|---|
| `NUTIPOPROMOCAO` entre 1 e 30 | ❌ Pendente | Não há validação de range antes do submit em nenhum dos 3 fluxos. `tipoPromocao` vem do `select` de mecânica, mas nada impede um valor vazio/0/fora da tabela chegar ao POST. |
| `TPAPLICADOA` precisa ser 1 ou 2 | ⚠️ Parcial | `onSubmit`/`onSubmitEstrutura`/`onSubmitEstruturaProduto` só checam `if (!mecanicaSelecionada)` (bloqueia `0`/`null`/`undefined`), mas não garantem que o valor seja exatamente `1` ou `2`. |
| `DTHORAINICIO`/`DTHORAFIM` obrigatórias, formato `AAAA-MM-DD HH:MM:SS`, fim depois do início | ⚠️ Parcial | `DTHORAFIM` recebe `dataFim + ' 23:59:59'` (formato ok). `DTHORAINICIO` é enviado como `dataInicio` **sem sufixo de hora** — se o input for `type="date"`, o valor não tem `HH:MM:SS` e a carga falharia pela regra do guia. Não há validação de "fim depois do início" em nenhum dos 3 fluxos. |
| Preencher só o campo de início do tipo (`APARTIRDEQTD` 1–15 / `APARTIRDOVLR` 16–30, +N nos 22–24) | ❌ Pendente | O `useEffect` da tela ([actionPesquisaPromocao.jsx:237-256](../actionPesquisaPromocao.jsx#L237-L256)) zera campos de **benefício** conforme `tipoDescontoSelecionado` (0/1/2), mas não existe lógica que zere `APARTIRDEQTD` quando o tipo é 16–30, nem `APARTIRDOVLR` quando o tipo é 1–15, baseada no `NUTIPOPROMOCAO`/`tipoPromocao` real (1–30). A regra especial dos tipos 7–9 e 22–24 ("0 nunca dá desconto") também não é validada. |
| Preencher só o campo de benefício do tipo; os outros dois zerados | ✅ Implementada | `useEffect` em [actionPesquisaPromocao.jsx:237-250](../actionPesquisaPromocao.jsx#L237-L250) zera `vrDesconto`/`valorInicio`/`porcentoDesconto`/`precoProduto` conforme `tipoDescontoSelecionado` (0 = preço final, 1 = valor, 2 = percentual). Também há `readOnly` nos inputs de benefício não aplicáveis. |
| Preço final/desconto em R$ **menor que o preço do destino mais barato** | ❌ Pendente | Nenhuma validação compara `VLPRECOPRODUTO`/`FATORPROMOVLR` com o preço dos produtos de destino selecionados. É o erro nº1 listado na página 9 do guia. |
| Percentual entre **0 e 100** (100 = brinde) | ⚠️ Parcial/divergente | `handlePorcentoDesconto` ([actionPesquisaPromocao.jsx:278-285](../actionPesquisaPromocao.jsx#L278-L285)) usa `Math.min(Number(value), 99)` — **limita a 99**, enquanto o guia permite até **100** (brinde). |
| Decimais com ponto (vírgula vira 0 no PDV) | ✅ Implementada | Os handlers de `qtdInicio`, `valorInicio`, `vrDesconto`, `precoProduto` já fazem `valor.replace(/,/g, '.')` antes de salvar no estado. |
| Pelo menos 1 linha de origem e 1 de destino | ⚠️ Parcial | Existe validação indireta (comparação de tamanhos/igualdade de arrays) para os casos `aplicacaoDestinoSelecionada` 0/1/3/4, mas **não há uma checagem explícita e genérica** de "produtosOrigem.length === 0 ou produtosDestino.length === 0 → erro", cobrindo os demais tipos (ex.: "a cada N", "do 2º em diante"). |
| Código do produto idêntico ao da carga da loja (com sufixo de tamanho) / produto inexistente nunca participa | ❌ Pendente | Não há chamada de validação que confira se os IDs de produto informados existem na carga de produtos da loja antes de enviar o POST. É o erro nº3 da página 9. |
| Se a peça de origem também deve ganhar desconto, o produto precisa constar no destino também | ❌ Pendente | Não há validação nesse sentido; hoje o código só garante paridade de tamanho/igualdade de arrays para tipos específicos (pares/menos-na-primeira/um produto), não a regra geral "origem quer desconto → precisa estar no destino". |
| Destinos que não se repetem em outra promoção vigente | ✅ Implementada | Bloco `existeProduto` em `onSubmit` ([hook:889-909](hook/useCreatePromocaoAtiva.jsx#L889-L909)) e equivalente em `onSubmitEstruturaProduto` ([hook:1660-1682](hook/useCreatePromocaoAtiva.jsx#L1660-L1682)) comparam os produtos de destino com os já vinculados a promoções ativas. `onSubmitEstrutura` faz o equivalente por **subgrupo** (`conflitosDestino`/`conflitosOrigem`, linhas ~1315-1350). |

---

## 3. Checklist "Antes de publicar uma promoção" (página 9-10 do guia)

| # | Regra do guia | Status |
|---|---|---|
| 1 | `NUTIPOPROMOCAO` 1–30 e `TPAPLICADOA` 1 ou 2 | ❌ Pendente (ver seção 1 e 2) |
| 2 | Início/fim no formato certo, fim depois do início | ⚠️ Parcial (formato de `DTHORAINICIO` duvidoso; sem checagem fim > início) |
| 3 | Só o campo de início do tipo preenchido (+N nos 22–24) | ❌ Pendente |
| 4 | Só o campo de benefício do tipo preenchido | ✅ Implementada |
| 5 | Preço/desconto menor que o destino mais barato; percentual 0–100 | ❌ Pendente (comparação de preço) / ⚠️ Parcial (percentual limitado a 99) |
| 6 | Decimais com ponto | ✅ Implementada |
| 7 | Ao menos 1 origem e 1 destino existentes na carga da loja | ⚠️ Parcial (existência na carga não é validada) |
| 8 | Produto de origem que também deve ganhar desconto precisa estar no destino | ❌ Pendente |
| 9 | Destinos não repetidos em outra promoção vigente | ✅ Implementada |

---

## 4. Regras de negócio existentes no código que **não vêm do PDF** (regras específicas do concentrador)

Essas validações já existem em `onSubmit`/`onSubmitEstrutura`/`onSubmitEstruturaProduto` e usam os campos do **motor legado** (`TPAPARTIRDE`/`TPFATORPROMO` — ver seção 0), que é o motor de produção hoje. Elas continuam válidas como regra de negócio do concentrador (evitar conflito comercial), e não são substituídas por `NUTIPOPROMOCAO`, que serve para homologar o motor novo em paralelo:

- Empresa já tem uma promoção ativa com a mesma "aplicação destino" (`existeAplicaoDestino`).
- Limite de 3 promoções ativas por empresa (`promocoesValidasNaEmpresaSelecionada.length >= 3`).
- Já existe promoção ativa "por pares" (`promocaoPorParesAtiva`, `TPAPARTIRDE == 0`).
- Já existe promoção ativa "menos na primeira" (`promocaoPorMenosNaPrimeira`) — **⚠️ bug**: a condição é `promo.TPAPARTIRDE == 3 && promo.TPAPARTIRDE == 0`, que nunca é verdadeira (o mesmo campo não pode ser `3` e `0` ao mesmo tempo). Checagem morta.
- "Pares e em um produto" não podem coexistir (`promocaoPorParesEmUmProduto`) — **⚠️ bug**: mesma falha, `promo.TPAPARTIRDE == 0 && promo.TPAPARTIRDE == 4` nunca é verdadeira.
- Tipo de desconto (`TPFATORPROMO`) já ativo na mesma empresa (`descontoAtivoPromocaoPorEmpresa`).
- Para `aplicacaoDestinoSelecionada` 0/3 (pares / menos-na-primeira): origem e destino devem ser idênticos.
- Para `aplicacaoDestinoSelecionada` 1 (todos): quantidade de origem e destino deve ser igual.
- Para `aplicacaoDestinoSelecionada` 4 (um produto): só 1 produto em cada lado, e devem ser o mesmo produto.
- Descrição limitada a 80 caracteres.
- Empresa e mecânica obrigatórias.
- Limite de 10.000 produtos por promoção e envio em lotes de 1.000 (`LIMITE_MAXIMO_PRODUTOS`/`TAMANHO_LOTE_PRODUTOS`).
- Validação de estrutura da planilha de upload (título "Produtos da Promoção" na linha 1, cabeçalho "ID" na linha 2).

---

## 5. Resumo executivo

| Categoria | Qtde regras do PDF | Já implementadas | Pendentes/parciais |
|---|---|---|---|
| Campos principais (seção 2 do guia) | 9 | 2 (✅) | 5 ⚠️ parcial + 2 ❌ pendente |
| Checklist "antes de publicar" | 9 | 3 (✅) | 4 ⚠️ parcial + 2 ❌ pendente |

**Prioridades sugeridas:**
1. Enviar `NUTIPOPROMOCAO` em `onSubmitEstrutura` e `onSubmitEstruturaProduto` (hoje ausente) — não é risco de produção (motor legado funciona nos três fluxos), mas impede a homologação do motor novo nesses dois fluxos.
2. Validar `NUTIPOPROMOCAO` no range 1–30 antes de qualquer submit.
3. Corrigir `handlePorcentoDesconto` para permitir até 100 (não 99).
4. Corrigir/format `DTHORAINICIO` para incluir `HH:MM:SS` e validar `dataFim > dataInicio`.
5. Corrigir os dois checks mortos (`promocaoPorMenosNaPrimeira`, `promocaoPorParesEmUmProduto`) que nunca disparam por causa do `&&` comparando o mesmo campo a dois valores.
6. Validar preço final/desconto contra o preço do produto de destino mais barato.
7. Validar existência dos produtos de origem/destino na carga da loja antes do cadastro.

---

## 6. Verificação de `optionsMecanicaCompleta` (mecanica.jsx) vs mapeamento legado (imagens anexadas)

As imagens `Screenshot_3.png`/`Screenshot_4.png` mostram, para cada um dos 30 códigos do guia (`Q-xxx` = por Quantidade, `V-xxx` = por Valor), qual é o **`value` correspondente no sistema antigo** (`optionsMecanicaCompletaAnterior`), na forma `aplicação-destino // mecânica // tipo-desconto`.

Decodificando as imagens: `mecanica.jsx` já tem exatamente essa correspondência representada em dois arrays diferentes:

- `optionsMecanicaCompletaAnterior` → sistema antigo, valores 1–30, com os campos `aplicacaoDestino` (0=Pares, 1=Todos, 2=Último após entrada/A cada N, 3=Menos na primeira, 4=Em um produto), `mecanica` (1=Valor, 2=Quantidade) e `tipoDesconto` (0=Valor Final, 1=Valor Desconto, 2=Percentual).
- `optionsMecanicaCompleta` → catálogo novo (os 30 tipos do PDF, códigos `Q-PAR-PF`...`V-UM-PC`), que **também** tem `aplicacaoDestino`/`mecanica`/`tipoDesconto` preenchidos.

Comparando os 30 registros de `optionsMecanicaCompleta` com o trio `(aplicacaoDestino, mecanica, tipoDesconto)` indicado nas imagens (via `optionsMecanicaCompletaAnterior`):

| Nº img | Código | `value` legado esperado (imagem) | Combo esperado (destino, mecânica, desconto) | Combo em `optionsMecanicaCompleta` | Confere? |
|---|---|---|---|---|---|
| 1 | Q-PAR-PF | 11 | (0,2,0) | (0,2,0) | ✅ |
| 2 | Q-PAR-RS | 6 | (0,2,1) | (0,2,1) | ✅ |
| 3 | Q-PAR-PC | 1 | (0,2,2) | (0,2,2) | ✅ |
| 4 | Q-TOD-PF | 12 | (1,2,0) | (1,2,0) | ✅ |
| 5 | Q-TOD-RS | 7 | (1,2,1) | (1,2,1) | ✅ |
| 6 | Q-TOD-PC | 2 | (1,2,2) | (1,2,2) | ✅ |
| 7 | Q-CAD-PF | 13 | (2,2,0) | (2,2,0) | ✅ |
| 8 | Q-CAD-RS | 8 | (2,2,1) | (2,2,1) | ✅ |
| 9 | Q-CAD-PC | 3 | (2,2,2) | (2,2,2) | ✅ |
| 10 | Q-MPR-PF | 14 | (3,2,0) | (3,2,0) | ✅ |
| 11 | Q-MPR-RS | 9 | (3,2,1) | (3,2,1) | ✅ |
| 12 | Q-MPR-PC | 4 | (3,2,2) | (3,2,2) | ✅ |
| 13 | Q-UM-PF | 15 | (4,2,0) | (4,2,0) | ✅ |
| 14 | Q-UM-RS | 10 | (4,2,1) | (4,2,1) | ✅ |
| 15 | Q-UM-PC | 5 | (4,2,2) | (4,2,2) | ✅ |
| 16 | V-PAR-PF | 26 | (0,1,0) | (0,1,0) | ✅ |
| 17 | V-PAR-RS | 21 | (0,1,1) | (0,1,1) | ✅ |
| 18 | V-PAR-PC | 16 | (0,1,2) | (0,1,2) | ✅ |
| 19 | V-TOD-PF | 27 | (1,1,0) | (1,1,0) | ✅ |
| 20 | V-TOD-RS | 22 | (1,1,1) | (1,1,1) | ✅ |
| 21 | V-TOD-PC | 17 | (1,1,2) | (1,1,2) | ✅ |
| 22 | V-CAD-PF | 28 | (2,1,0) | (2,1,0) | ✅ |
| 23 | V-CAD-RS | 23 | (2,1,1) | (2,1,1) | ✅ |
| 24 | V-CAD-PC | 18 | (2,1,2) | (2,1,2) | ✅ |
| 25 | V-MPR-PF | 29 | (3,1,0) | (3,1,0) | ✅ |
| 26 | V-MPR-RS | 24 | (3,1,1) | (3,1,1) | ✅ |
| 27 | V-MPR-PC | 19 | (3,1,2) | (3,1,2) | ✅ |
| 28 | V-UM-PF | 30 | (4,1,0) | (4,1,0) | ✅ |
| 29 | V-UM-RS | 25 | (4,1,1) | (4,1,1) | ✅ |
| 30 | V-UM-PC | 20 | (4,1,2) | (4,1,2) | ✅ |

**Resultado: 30 de 30 mecânicas conferem.** Todos os registros de `optionsMecanicaCompleta` (values 1–30, arquivo [mecanica.jsx](../../../../mecanica.jsx#L183-L454)) já usam exatamente o mesmo trio `aplicacaoDestino`/`mecanica`/`tipoDesconto` que o sistema antigo (`optionsMecanicaCompletaAnterior`) usa para produzir o comportamento mostrado nas imagens. Não foi encontrada nenhuma mecânica nova com combinação divergente da legada — o que confirma, na prática, o desenho descrito na **seção 0.3**: a tabela nova replica de propósito a mecânica legada.

**Conclusão prática:** como `mecanicaSelecionada`/`aplicacaoDestinoSelecionada`/`tipoDescontoSelecionado` são estados compartilhados pelos três fluxos e vêm sempre do mesmo item de `optionsMecanicaCompleta`, **os três `postData` (`onSubmit`, `onSubmitEstrutura`, `onSubmitEstruturaProduto`) enviam corretamente o trio do motor legado**, ou seja, o motor de produção funciona hoje nos três fluxos. O que falta, conforme a seção 1, é só o envio de `NUTIPOPROMOCAO` nos dois fluxos que ainda não o enviam, para que o motor novo também os enxergue durante a homologação.

---

*Documento gerado a partir de `Guia_Cadastro_Promocoes.pdf` (validado em 18/09/2026), da leitura completa de `useCreatePromocaoAtiva.jsx`/`actionPesquisaPromocao.jsx` em 22/09/2026, e atualizado na mesma data com a verificação de `mecanica.jsx` contra `Screenshot_3.png`/`Screenshot_4.png`.*
