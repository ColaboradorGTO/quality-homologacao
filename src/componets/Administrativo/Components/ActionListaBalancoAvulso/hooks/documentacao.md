## 🚀 Funcionalidade

Verifica se o usuário tem permissão para confirmar o Balanço Avulso.

Abre um modal de confirmação utilizando SweetAlert2.

Monta os dados necessários (det e putData) para envio ao backend.

Faz uma requisição POST para criar o detalhe do Balanço Avulso.

Registra logs de todas as ações via endpoint /log-web.

Captura e salva automaticamente:

Data atual

IP do usuário (via ipwho.is)

## 📑 Estrutura do Hook
## Parâmetros

dadosBalancoAvulso → Lista de itens do balanço que serão confirmados.

usuarioLogado → Objeto do usuário logado, usado para obter id e registrar logs.

optionsModulos → Lista de permissões do usuário (valida se pode confirmar balanço).

Retorno

enviarConfirmacao(IDRESUMOPEDIDIO) → Função que dispara o fluxo de confirmação.

loading → Estado de carregamento (boolean).

## 🔒 Permissões

O usuário só poderá confirmar o balanço se no optionsModulos[0]?.CRIAR !== 'False'.
Caso contrário, será exibida a mensagem:

"Você não tem permissão para confirmar o Balanço Avulso!"

## 📤 Estrutura enviada para /criar-detalhe-balanco-avulso

Exemplo do corpo da requisição putData:
{
  "IDEMPRESA": 1,
  "DSRESUMOBALANCO": "LOJA BALANCO",
  "DTABERTURA": "2025-09-02",
  "DTFECHAMENTO": "",
  "QTDTOTALITENS": 0,
  "QTDTOTALSOBRA": 0,
  "QTDTOTALFALTA": 0,
  "TXTOBSERVACAO": "",
  "STATIVO": "True",
  "det": [
    {
      "NUMEROCOLETOR": "123",
      "IDPRODUTO": 456,
      "CODIGODEBARRAS": "789123456",
      "DSPRODUTO": "Produto Teste",
      "TOTALCONTAGEMATUAL": 0,
      "TOTALCONTAGEMGERAL": 10,
      "PRECOCUSTO": 5.5,
      "PRECOVENDA": 8.0,
      "STCANCELADO": "False",
      "DSCOLETOR": "Coletor 1"
    }
  ],
  "INSBALANCO": 1
}

## ⚠️ Tratamento de Erros

Se não houver permissão → Modal de erro.

Se falhar ao enviar os dados para o SAP → Modal de erro.

Todos os erros são registrados no log (/log-web).

## 📌 Observação:
Este hook é altamente acoplado às regras de negócio do Balanço Avulso e deve ser reutilizado somente neste contexto.

## flowchart TD

A[🟢 Usuário clica em Confirmar Balanço] --> B{Usuário tem permissão?}

B -- Não --> C[❌ Exibe modal: "Você não tem permissão"]
B -- Sim --> D[🔔 Exibe modal de confirmação (SweetAlert2)]

D -- Cancelar --> E[🚪 Fluxo encerrado]
D -- Confirmar --> F[🛠 Monta dados det e putData]

F --> G[📤 POST /criar-detalhe-balanco-avulso]
G -->|Sucesso| H[📒 POST /log-web → Confirmação registrada]
G -->|Erro| I[📒 POST /log-web → Erro registrado]

H --> J[✅ Exibe modal: "Confirmação realizada com sucesso"]
I --> K[❌ Exibe modal: "Erro ao subir pedido para o SAP"]
