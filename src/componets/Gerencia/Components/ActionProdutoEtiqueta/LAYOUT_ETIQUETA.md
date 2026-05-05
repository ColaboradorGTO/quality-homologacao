# 📋 Documentação do Layout de Etiquetas ZPL

## 🎯 **Visão Geral**
Este documento explica o layout e funcionamento das etiquetas de produtos geradas em formato ZPL (Zebra Programming Language) no sistema.

---

## 📐 **Configuração da Página ZPL**

### **Comandos de Inicialização**
```zpl
^XA          // Início do comando ZPL
^MD10        // Densidade de mídia - 10 dots por mm
^FWN         // Orientação normal do campo
^PW850       // Largura da página - 850 dots (~10.6cm)
^LL320       // Altura da linha - 320 dots (~4cm)  
^CI28        // Codificação UTF-8 para caracteres especiais
```

### **Comandos de Finalização**
```zpl
^XZ          // Fim do comando ZPL
```

---

## 🏗️ **Estrutura do Layout da Etiqueta**

### **📊 Dimensões e Layout**
- **Largura Total**: 850 dots (~10.6cm)
- **Altura Total**: 320 dots (~4cm)
- **Etiquetas por Página**: 3 horizontalmente
- **Espaçamento Entre Etiquetas**: 280 dots (~3.5cm)

### **🎯 Offset Horizontal**
```javascript
let offsetDireita = 55; // Move todo layout 55 dots (6.9mm) para a direita
```

---

## 📍 **Posicionamento dos Elementos**

### **1. 📝 Descrição do Produto**
```zpl
^FO${positionDefault},120^A0N,20,30^FB255,4,2,L,0^FD${descricaoProd}^FS
```
- **Posição Y**: 120 dots
- **Fonte**: A0N, altura 20, largura 30
- **Campo de Bloco**: 255 dots de largura, máximo 4 linhas
- **Alinhamento**: Esquerda

### **2. 🎨 Estilo do Produto**
```zpl
^FO${positionDefault},205^A0N,20,25^FB255,3,2,L,0^FD${estiloProd}^FS
```
- **Posição Y**: 205 dots
- **Fonte**: A0N, altura 20, largura 25
- **Campo de Bloco**: 255 dots de largura, máximo 3 linhas

### **3. 📍 Local de Exposição**
```zpl
^FO${positionDefault},245^A0N,20,25^FB255,3,2,L,0^FD${localExpProd}^FS
```
- **Posição Y**: 245 dots
- **Fonte**: A0N, altura 20, largura 25

### **4. 📦 Área do Tamanho**

#### **4.1 Borda do Tamanho**
```zpl
^FO${positionDefault},285^GB${widthBorder},50,3^FS
```
- **Posição Y**: 285 dots
- **Largura da Borda**: 
  - 75 dots se tamanho > 3 caracteres
  - 50 dots se tamanho ≤ 3 caracteres
- **Altura**: 50 dots
- **Espessura**: 3 dots

#### **4.2 Label "TAM"**
```zpl
^FO${positionDefault},265^A0N,22^FDTAM^FS
```
- **Posição Y**: 265 dots
- **Fonte**: A0N, altura 22

#### **4.3 Valor do Tamanho**
```zpl
^FO${positionTamanho},300^A0N,22^FD${tamanhoProd}^FS
```
- **Posição Y**: 300 dots
- **Posição X**: `offsetDireita + 10 + (contador * 280)`

### **5. 💰 Preço de Venda**
```zpl
^FO${positionPrice},300^A0,${fontSizePrice}^FD${precoVenda}^FS
```

#### **📏 Cálculo Dinâmico de Posição**
```javascript
let priceLength = precoVenda.length;
let ajustePositionPrice = priceLength > 7 ? (priceLength - 7) * 15 : 0;
let ajusteFontSizePrice = priceLength <= 11 ? 0 : 5;
let fontSizePrice = 35 - ajusteFontSizePrice;
let positionPrice = offsetDireita + 135 + (contador * 280) - ajustePositionPrice;
```

**Lógica de Ajuste:**
- **Preço > 7 caracteres**: Move 15 dots para esquerda por caractere extra
- **Preço > 11 caracteres**: Reduz fonte em 5 pontos
- **Fonte Base**: 35, reduzida conforme necessário

### **6. 📊 Código de Barras EAN13**

#### **6.1 Configuração do Código de Barras**
```zpl
^BY1.6,3,500                    // Configuração: largura 1.6, proporção 3:1, altura 500
^FO${positionCodBars},340       // Posição
^BEN,55,Y,N                     // EAN13, altura 55, mostrar texto, sem checksum
^FD${codBarras}^FS              // Dados do código
```

- **Posição Y**: 340 dots
- **Posição X**: `offsetDireita + 30 + (contador * 280)`
- **Altura**: 55 dots
- **Tipo**: EAN13
- **Validação**: Verificação obrigatória com `isValidEAN13()`

---

## 🔢 **Cálculo de Posições**

### **📐 Fórmulas de Posicionamento**

```javascript
// Offset base para mover layout para direita
let offsetDireita = 55;

// Posições base para cada etiqueta (3 por página)
let positionDefault = offsetDireita + (contador * 280);
let positionTamanho = offsetDireita + 10 + (contador * 280);
let positionCodBars = offsetDireita + 30 + (contador * 280);

// Posição do preço com ajuste dinâmico
let positionPrice = offsetDireita + 135 + (contador * 280) - ajustePositionPrice;
```

### **📊 Distribuição Horizontal**
- **Etiqueta 1**: X = 55 + (0 * 280) = 55
- **Etiqueta 2**: X = 55 + (1 * 280) = 335  
- **Etiqueta 3**: X = 55 + (2 * 280) = 615

---

## 🧹 **Processamento de Dados**

### **✨ Normalização de Texto**
```javascript
// Remove acentos e caracteres especiais para ZPL
descricaoProd = descricaoProd?.toString()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "") || '';
```

### **🔍 Validações Obrigatórias**
1. **Código de Barras**: Validação EAN13 obrigatória
2. **Dados Vazios**: Tratamento de campos null/undefined
3. **Quantidade**: Conversão para inteiro com fallback para 1

---

## 📄 **Controle de Páginas**

### **🔄 Lógica de Paginação**
```javascript
if (contador === 3) {
  dataLabelsZPLToPrint += endPageLabel;  // Finaliza página atual
  
  if (abrirMaisUmaPagina) {
    dataLabelsZPLToPrint += startPageLabel;  // Inicia nova página
  }
  
  contador = 0;  // Reset contador
}
```

- **3 etiquetas por página**
- **Quebra automática** quando necessário
- **Controle inteligente** da última página

---

## ⚠️ **Considerações Importantes**

### **🎯 Limitações ZPL**
- Não suporta acentos nativamente (normalização necessária)
- Coordenadas em dots (1 dot ≈ 0.125mm em 203dpi)
- Comandos case-sensitive

### **🔧 Ajustes de Layout**
- **`offsetDireita`**: Controla margem esquerda de todo layout
- **Posição Y**: Valores fixos para cada elemento
- **Espaçamento**: 280 dots entre etiquetas (3.5cm)

### **📱 Responsividade**
- Ajuste automático de fonte do preço
- Borda dinâmica baseada no tamanho
- Posicionamento relativo do preço

---

## 🛠️ **Manutenção e Ajustes**

### **Para Mover Layout Horizontalmente:**
```javascript
let offsetDireita = 55; // Aumente para mover mais à direita
```

### **Para Ajustar Espaçamento Entre Etiquetas:**
```javascript
let positionDefault = offsetDireita + (contador * 280); // Altere 280
```

### **Para Modificar Posições Verticais:**
Altere os valores Y nos comandos `^FO`:
- Descrição: 120
- Estilo: 205  
- Local: 245
- Tamanho: 265-300
- Código: 340

---

## 📚 **Referências ZPL**

- **^FO**: Field Origin (posicionamento)
- **^A0**: Font (tipo e tamanho)
- **^FB**: Field Block (área de texto)
- **^GB**: Graphic Box (bordas/linhas)
- **^BY**: Bar Code Field Default
- **^BE**: Bar Code EAN-13

---

*Última atualização: Maio 2026*