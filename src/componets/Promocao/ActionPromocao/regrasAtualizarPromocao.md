# Regras de Negócio - Atualização de Promoção

Este documento descreve as principais regras de negócio implementadas no processo de atualização de uma promoção no sistema.

---

## 1. Seleção de Mecânica

- É obrigatório selecionar uma mecânica para atualizar a promoção.
- A mecânica define como a promoção será aplicada (por pares, todos os produtos, menos na primeira, em um produto, etc).
- Algumas validações específicas são feitas conforme o tipo de mecânica e aplicação de destino.

## 2. Empresas Vinculadas

- É obrigatório selecionar pelo menos uma empresa para a promoção.
- Por padrão, as empresas já vinculadas à promoção são carregadas e selecionadas.
- O usuário pode adicionar ou remover empresas conforme necessário.
- Não é permitido cadastrar mais de 3 promoções ativas para a mesma empresa.

## 3. Descrição da Promoção

- É obrigatório preencher a descrição da promoção.
- A descrição deve ter entre **20 e 200 caracteres**.

## 4. Produtos Origem e Destino

- Os produtos podem ser informados manualmente ou via upload de arquivo (.csv, .xls, .xlsx).
- Para algumas mecânicas, os produtos de origem e destino devem ser iguais:
  - **Por pares** ou **menos na primeira**: produtos de origem e destino devem ser idênticos.
  - **Por todos os produtos**: quantidade de produtos de origem e destino deve ser igual.
  - **Em um produto**: apenas um produto pode ser enviado tanto na origem quanto no destino, e eles devem ser iguais.

## 5. Validações de Promoção Ativa

- Não é permitido cadastrar uma promoção se já existir:
  - Uma promoção ativa com a mesma aplicação de destino na empresa.
  - Uma promoção por pares e em um produto ao mesmo tempo.
  - Um desconto ativo com o mesmo tipo de desconto na empresa.
  - Mais de 3 promoções ativas para a mesma empresa.
  - Promoção por pares já existente.
  - Promoção menos na primeira já existente.
- Produtos destino não podem estar vinculados a outra promoção ativa.

## 6. Datas

- A data de início e fim da promoção são obrigatórias.
- A data final é sempre enviada com o horário "23:59:59".

## 7. Status

- O status da promoção pode ser "ATIVO" ou "INATIVO".

- Lembrando que a promoção será ativada ou desativada de acordo com a data de início e fim.

- O status "ativo" ou "inativo" serve apenas para exibição ao usuário, se as datas estiverem dentro do prazo, o PDV continuará aplicando os descontos da promoção.

## 8. Outras Regras

- Todos os campos obrigatórios devem ser preenchidos para permitir a atualização.
- Caso alguma regra seja violada, o sistema exibe uma mensagem de erro ou alerta ao usuário.
