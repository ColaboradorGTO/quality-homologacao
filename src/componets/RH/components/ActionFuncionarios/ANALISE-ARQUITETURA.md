# Diagnóstico de Arquitetura — Módulo RH / Funcionários

> Análise gerada em 2026-08-19. Nenhum arquivo de código foi alterado nesta etapa — este documento é o diagnóstico e o plano de refatoração proposto, para aprovação antes de qualquer mudança.

**Escopo analisado:**
- `web/src/pages/DashBoardRecursosHumanos.jsx`
- `web/src/componets/RH/components/ActionFuncionarios/**` (14 arquivos: pesquisa, lista, os 3 sub-módulos de ação — Cadastrar, Editar, Desconto — e os hooks `useCriarFuncionario`, `useEditarFuncionario`, `useDescontoFuncionario`, `useDesligarFuncionario`, `useAtivarFuncionario`)

Este escopo foi escolhido deliberadamente restrito ao módulo RH. Existem módulos "ActionFuncionarios" quase idênticos duplicados em `Informatica/` e `Comercial/`, mas eles ficaram fora desta rodada de análise.

---

## FASE 1 — Estrutura e fluxo atual

```
DashBoardRecursosHumanos.jsx (shell: sidebar, header, footer, controle de qual "Action" mostrar)
  └─ ActionPesquisaFuncionarios.jsx (filtros + useQuery direto no componente, sem hook próprio)
       └─ ActionListaFuncionarios.jsx (516 linhas: tabela, export PDF/Excel, 2 modais, 2 hooks de ação)
            ├─ useDesligarFuncionario.jsx  (hook de ação inline — 1 função, chama PUT direto)
            ├─ useAtivarFuncionario.jsx    (hook de ação inline — quase idêntico ao anterior)
            ├─ ActionEditarFuncionario.jsx (modal) → formularioEditar.jsx → useEditarFuncionario.jsx
            └─ ActionEditarDescontoFuncionarioModal.jsx (modal) → formularioEditar.jsx → useDescontoFuncionario.jsx
       └─ ActionCadastrarFuncionarioModal.jsx (modal) → formularioCadastrar.jsx → useCriarFuncionario.jsx
```

**Fluxo de dados real:** Página → Componente → Hook (estado + regra de negócio + chamada HTTP direta) → `funcRequest` (`get`/`post`/`put`) → API.

Não existe camada `services/` separada — os hooks fazem tudo (chamada HTTP, montagem de payload, log de auditoria, alertas). Isso é **consistente com o padrão documentado no `CLAUDE.md`** do projeto ("Fetch de dados usa react-query direto dentro dos componentes de Action"), ou seja, não é um desvio local deste módulo — é o padrão adotado no repositório inteiro.

Cada hook duplica sua própria função `getIPUsuario()` (chama `ifconfig.me` e, em fallback, `ipify.org`) — copiada e colada em pelo menos 4 dos 5 hooks lidos, com a ordem dos provedores de IP variando entre cópias.

---

## FASE 2 — Componentes problemáticos

| Arquivo | Linhas | Problema | Por quê é problema |
|---|---|---|---|
| `hooks/useCriarFuncionario.jsx` | 465 | 25 states; faz criação **e** atualização (busca por CPF e decide `isUpdate`), autenticação de exceção de desconto, geração de log de auditoria — tudo num hook só | Testar isoladamente exige mockar 3 fluxos de negócio diferentes; qualquer mudança em um afeta o resto |
| `hooks/useEditarFuncionario.jsx` | 355 | ~90% idêntico ao anterior, mas com payload divergente para o mesmo endpoint PUT | Duas fontes de verdade para "atualizar funcionário" |
| `actionListaFuncionarios.jsx` | 516 | Tabela + export PDF + export Excel + tradução de códigos (STATIVO/STCONVENIO/DSTIPO) repetida 3x + busca por ID + 2 modais + 2 hooks de ação | Componente de apresentação carregando regra de negócio e I/O |
| `ActionCadastrar/formularioCadastrar.jsx` / `ActionEditar/formularioEditar.jsx` | 575 / 590 | JSX quase idêntico entre os dois, com pequenas divergências de campo (`valorDescontoFuncionario` vs `descontoConvenioFuncionario`) | Duplicação de UI que só existe porque os hooks por trás também são duplicados |

---

## FASE 4/5 — Achados (Clean Code + React), por prioridade

### 🔴 CRÍTICO

**1. Bug real: `textoFuncao` fora de escopo no `catch`**
`hooks/useDesligarFuncionario.jsx:106` e `hooks/useAtivarFuncionario.jsx:106` referenciam `textoFuncao` dentro do `catch`, mas essa variável só existe dentro do bloco `try` (declarada com `let`, linha ~74). Se `PUT /inativarFuncionarioRH` falhar, o próprio tratamento de erro lança `ReferenceError`, e:
- o usuário nunca vê o Swal de "Erro ao Atualizar";
- o log de auditoria de erro nunca é gravado;
- a falha original fica mascarada por uma segunda exceção não tratada.

Hoje, se desligar/ativar/inativar um funcionário falhar no backend, o app quebra silenciosamente em vez de avisar o usuário.

**2. Bug real: `setIsLoading(true)` chamando setter que não existe**
`hooks/useCriarFuncionario.jsx:174` e `hooks/useEditarFuncionario.jsx:149`, dentro de `loginConfirmacao` (fluxo de autorização de exceção de desconto). Nenhum dos dois hooks declara `isLoading`/`setIsLoading`. Toda autorização bem-sucedida termina em `ReferenceError` não tratado no console.

**3. Segurança: senha de funcionário previsível e logada em texto puro**
Em `hooks/useCriarFuncionario.jsx:261`, `PWSENHA: cpfSemMascara.substring(0,5)` — os 5 primeiros dígitos do próprio CPF, altamente previsível. Essa senha em texto puro:
- volta na resposta de `GET /funcionarios-loja` e pré-popula `senha`/`repitaSenha` em `ActionEditar/formularioEditar.jsx` (campos `type="password"`, mas valor visível via DevTools);
- é serializada inteira em `JSON.stringify(putData)` e enviada para `/log-web` como `DADOS` — fica gravada em texto claro no log de auditoria toda vez que um funcionário é criado/editado.

Não é só "código feio" — é dado sensível de autenticação trafegando e sendo persistido em claro. Requer alinhamento com quem é dono da API do backend antes de corrigir, pois mexe em contrato existente.

### 🟠 ALTO

**4. `maximoDesconto` calculado e nunca usado**
`hooks/useCriarFuncionario.jsx:184-194` e `hooks/useEditarFuncionario.jsx:158-168` calculam um limite dinâmico de desconto (10/15/20%) baseado em dias desde `2024-08-01`, mas a validação real logo abaixo é hardcoded: `parseFloat(valorDesconto) > 50`. A variável `maximoDesconto` morre sem uso — parece regra de negócio implementada pela metade e abandonada.

**5. Criar/Editar duplicados com payloads divergentes**
`useCriarFuncionario` já contém sua própria branch de "isUpdate" (busca por CPF, decide entre `POST /criarFuncionariosLojaRH` e `PUT /funcionarioLojaRH/:id`). O `putData` montado ali (linha 277) **não inclui `MOTIVODESC`**, enquanto o `putData` de `useEditarFuncionario` (linha 211) inclui `MOTIVODESC: ''`. Duas telas diferentes escrevendo no mesmo registro com formatos de payload diferentes é risco de inconsistência de dados dependendo de por onde o usuário editou.

**6. `getIPUsuario` copiado em 5+ lugares** (inclusive fora deste módulo, em `useCadastrarProdutoAvulso` de Cadastro), com ordem de provedores de IP diferente entre cópias.

**7. Duas rotas de "desativar" um funcionário, pouco claras**
`useAtivarFuncionario.handleAtivarFuncionario(row, false)` e `useDesligarFuncionario.handleDesligarFuncionario(row)` batem no **mesmo endpoint** (`PUT /inativarFuncionarioRH`) com payloads quase iguais (diferença: `DATA_DEMISSAO` preenchida ou `''`). "Inativar" vs "Desligar" parecem conceitos de negócio diferentes, mas a implementação deixa isso implícito e frágil.

### 🟡 MÉDIO

- `console.log(usuarioLogado?.id, 'usuarioLogado?.id')` esquecido em `DashBoardRecursosHumanos.jsx:58`.
- `DashBoardRecursosHumanos.jsx:85-92` usa `.map().reduce()` só para extrair `ID` do primeiro item de `menuFilho` — dá para simplificar.
- States tipados de forma inconsistente: `funcaoSelecionada`, `situacaoSelecionada`, `tipoSelecionado`, `localizacaoSelcionada` (sic) começam como `''` mas são tratados como objeto `{value, label}` no resto do código — força `?.` defensivo espalhado.
- `isChecked` e `categoriaContratacao` guardam a mesma informação (CLT/PJ) de duas formas sincronizadas manualmente em vários handlers/efeitos — dá para derivar uma da outra.
- Em `actionListaFuncionarios.jsx`, a tradução de código→label (`STLOJA`, `STCONVENIO`, `DSTIPO`, `STATIVO`) é reimplementada 3 vezes: colunas da tabela, `exportToPDF`, `exportToExcel` — com pequenas diferenças de texto entre elas.
- Dois arquivos de schema Yup quase idênticos (`ActionCadastrar/schamaValidarFuncionario.js` e `ActionEditar/schamaValidarFuncionario.js`) usam nomes de campo diferentes para o mesmo conceito de desconto (`valorDescontoFuncionario` vs `descontoConvenioFuncionario`) — risco de quebra silenciosa se alguém tentar unificar os formulários sem notar.

### 🟢 BAIXO

- Bloco de JSON comentado (payload de exemplo) no fim de `useCriarFuncionario.jsx:444-465`.
- Bloco de JSX comentado em `ActionEditar/formularioEditar.jsx:401-410`.
- `Funcoes`, `Parceiro`, `situacao`, `localizacao`, `Departamentos` retornados pelos hooks são só repasse de imports estáticos de JSON (`tipoFuncao.json`, `parceiro.json`) — não precisam sair do hook, o formulário pode importar direto.

---

## FASE 6 — Estrutura de pastas: revisão da recomendação inicial

A recomendação original desta análise era manter tudo dentro da própria pasta do módulo (`ActionFuncionarios/services/`, `ActionFuncionarios/utils/`), sem camada compartilhada, para não fugir do padrão do `CLAUDE.md`. **Essa recomendação foi revista a pedido explícito do usuário**: para o que é genuinamente duplicado entre hooks (e, no futuro, entre módulos — RH, Informática e Comercial têm cópias do mesmo `ActionFuncionarios`), foi criada uma camada compartilhada em `web/src/services/` (fora do módulo), decisão tomada conscientemente contra o padrão documentado no `CLAUDE.md`. Local vs. compartilhado passou a depender de onde a lógica é reaproveitada: específico de uma tela → fica no módulo (`ActionFuncionarios/services/funcionarioService.js`); copiado entre hooks/módulos → vai para `src/services/`.

---

## FASE 8 — Plano de refatoração incremental proposto

| Etapa | Objetivo | Arquivos | Risco | Status |
|---|---|---|---|---|
| **1** | Corrigir os 2 bugs críticos (`textoFuncao`, `setIsLoading`) | `useDesligarFuncionario.jsx`, `useAtivarFuncionario.jsx`, `useCriarFuncionario.jsx`, `useEditarFuncionario.jsx` | Baixo | ✅ Concluída — corrigida como parte da Etapa 2 |
| **2** | Extrair `getIPUsuario` e o `post('/log-web', ...)` de auditoria para um serviço único compartilhado (`src/services/geoIp.js`, `src/services/auditLog.js`), usado pelos 5 hooks do módulo | os 5 hooks de `ActionFuncionarios/hooks/` | Baixo | ✅ Concluída. Efeito colateral do build: `ipUsuario`/`setIpUsuario` (state morto, nunca lido por nenhum componente) foi removido dos 5 hooks. A ordem de provedor de IP (`ifconfig.me` → `ipify.org`) foi unificada — `useDescontoFuncionario`, `useDesligarFuncionario` e `useAtivarFuncionario` tentavam `ipwho.is` primeiro antes disso |
| **2b** | Extrair o loop de "buscar todas as páginas" para `src/services/paginatedFetch.js`, reaproveitável fora do RH (o mesmo padrão existe em Cadastro/Produtos Avulso) | `ActionFuncionarios/services/funcionarioService.js` | Baixo | ✅ Concluída |
| **3** | Unificar o `putData` de atualização de funcionário (Criar-como-Update vs Editar) num único helper de payload | `hooks/useFuncionarioForm.js` | Médio — depende de confirmar qual payload é o "correto" (com ou sem `MOTIVODESC`) | Decisão tomada: **mantido separado por `modo` dentro de `onSubmit`** (não unificado). Os hooks `useCriarFuncionario`/`useEditarFuncionario` foram fundidos num único `useFuncionarioForm({ modo, ... })` (ver Etapa 9), mas o conteúdo dos 3 payloads (postData do criar, putData do criar-como-update, putData do editar) foi preservado exatamente como estava, dentro de um `if (modo === 'criar') {...} else {...}` — a pendência de negócio sobre qual payload é o "correto" continua em aberto |
| **5** | Extrair export PDF/Excel/print/busca (`HeaderTable` + `exportToPDF`/`exportToExcel`/`handlePrint`) para `src/hooks/useExportarTabela.jsx`, e o gate de permissão "Acesso Negado" (repetido em 16+ arquivos do projeto) para `src/utils/permissao.js` (`executarComPermissao`) | `actionListaFuncionarios.jsx` | Baixo | ✅ Concluída. Corrigido de brinde: a exportação PDF usava `item.DTDEMISSAO` (campo que não existe nos dados mapeados — sempre vinha vazio); Excel usava `item.DATA_DEMISSAO` (campo correto). Unifiquei os dois exports numa única definição de colunas usando o campo correto, então agora a coluna "DT Desl." aparece preenchida também no PDF, o que não acontecia antes |
| **6** | Consolidar `handleEdit`/`handleDesconto` (mesmo endpoint, mesma estrutura, só o setter/modal mudava) num hook `useFuncionarioModal()` reutilizado 2x; extrair a coluna "Opções" (60+ linhas de JSX com botões repetidos) para `AcoesFuncionarioColuna.jsx` | `actionListaFuncionarios.jsx`, novo `hooks/useFuncionarioModal.jsx`, novo `AcoesFuncionarioColuna.jsx` | Baixo | ✅ Concluída. Avaliei unificar `formatarDataBR` (local) com `dataFormatada` (util compartilhado) — decidi **não** unificar: `dataFormatada` é usado em 76 lugares no projeto e não trata a string literal `"null"`/`"undefined"` nem data inválida do jeito que `formatarDataBR` trata; mudar o util compartilhado por causa desta tela era risco desproporcional. Deixei `formatarDataBR` local, com comentário explicando por que não usa o util compartilhado. Também notei (sem alterar) que a coluna "Desc %" tem uma condição `row.PERC == 'False'` que nunca é verdadeira (`PERC` é number) — cor sempre azul; não fazia parte do escopo desta rodada |
| **4** | Unificar os 2 schemas Yup (nome de campo de desconto) | `schemaValidarFuncionario.js` | Baixo/Médio | ✅ Concluída (ver Etapa 9) — schema único `getSchemaFuncionario(modo)`, campo de desconto padronizado como `descontoConvenioFuncionario` nos dois modos |
| **5** | Dividir `actionListaFuncionarios.jsx`: extrair export PDF/Excel e tradução de labels para utils dedicados | `actionListaFuncionarios.jsx` | Baixo | Componente menor, tradução de labels em um único lugar |
| **6** | Esclarecer/consolidar Ativar vs Inativar vs Desligar (decisão de negócio) | `useAtivarFuncionario.jsx`, `useDesligarFuncionario.jsx` | Médio — depende de definição de negócio do time | Elimina ambiguidade dos 2 caminhos para o mesmo endpoint |
| **7** | Limpeza cosmética (código comentado, `console.log`, states `''` → `null`) | vários | Baixo | Legibilidade |
| **9** | Unificar Criar e Editar de funcionário num único hook (`useFuncionarioForm`) e num único componente de formulário (`FormularioFuncionario`), parametrizados por `modo: 'criar' \| 'editar'` | `hooks/useFuncionarioForm.js` (novo), `FormularioFuncionario.jsx` (novo), `schemaValidarFuncionario.js` (novo), `ActionCadastrar/actionCadastrarFuncionario.jsx`, `ActionEditar/actionEditarFuncionario.jsx` | Médio | ✅ Concluída. Apagados: `hooks/useCriarFuncionario.jsx`, `hooks/useEditarFuncionario.jsx`, `ActionCadastrar/formularioCadastrar.jsx`, `ActionEditar/formularioEditar.jsx`, `ActionCadastrar/schamaValidarFuncionario.js`, `ActionEditar/schamaValidarFuncionario.js`. Os wrappers de modal continuam com a mesma API externa (nenhuma mudança em `actionListaFuncionarios.jsx`/`actionPesquisaFuncionarios.jsx`). Efeitos colaterais desta etapa: (a) corrigido o typo `valorDescronoFuncionario` (nunca batia com o schema, então a validação Yup de desconto no Criar nunca rodava) — agora usa `descontoConvenioFuncionario` nos dois modos, ativando a validação pela primeira vez no fluxo de Criar; (b) **bug novo encontrado e corrigido**: no overlay de "Exceção de Desconto" do formulário de Editar, o campo Senha estava ligado ao state `senha` (a senha do FUNCIONÁRIO, persistida como `PWSENHA`) em vez de `senhaLogin` (o que a autorização de fato lê) — a autorização de exceção de desconto no Editar sempre autenticava com senha vazia, e digitar ali sobrescrevia a senha do funcionário; corrigido para usar `senhaLogin`/`setSenhaLogin`, igual ao padrão já correto do Criar; (c) `handleChangeEmpresa` removida (código morto, nenhum `onChange` a chamava); (d) pequenas divergências puramente visuais entre os dois formulários antigos (asterisco em labels, `closeMenuOnSelect`/`isClearable` ausente em alguns Selects do Editar, `clearErrors` faltando em alguns `onChange`) foram padronizadas para o padrão mais completo já usado em outros campos do mesmo formulário — não alteram dado enviado ao backend |

Cada etapa deve ser feita separadamente, com validação antes de avançar para a próxima.
