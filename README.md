# 📚 Databricks Academy — Apostila Interativa

Uma plataforma web interativa e responsiva focada no estudo de **Databricks**, arquitetura **Lakehouse**, **Delta Lake**, **PySpark**, **Spark SQL**, **Auto Loader**, **Unity Catalog** e **Workflows**.

O projeto funciona como uma Single Page Application (SPA) estática, com armazenamento local no navegador (`localStorage`), editor visual completo e integração com Inteligência Artificial (**Datrics**) para tutoria e geração dinâmica de exercícios.

🔗 **Acesse online:** [Databricks Academy](https://rehkkj.github.io/DataBricks-Academy/)

## ✨ Funcionalidades Principais

* **📖 Trilha de Aprendizagem Modular:** Conteúdo dividido em módulos temáticos com tempo estimado de leitura e navegação fluida entre aulas.
* **📝 Exercícios Práticos com Feedback:** Questões de múltipla escolha com correção imediata, explicações detalhadas e acompanhamento de progresso.
* **📊 Painel de Desempenho:** Métricas em tempo real sobre conclusão geral, taxa de acerto e identificação automática dos módulos com maior índice de erro.
* **🤖 Assistente de Estudos com IA (Datrics):**
  * Chat contextualizado com o conteúdo da aula atual ou de toda a apostila.
  * **Criação inteligente de conteúdo:** pedidos de módulo geram um módulo com várias aulas, cards explicativos e questões; pedidos de aulas geram somente aulas/cards; pedidos de questões geram somente exercícios.
  * **Gerador de Questões:** Criação de lotes de exercícios personalizados por tema, nível de dificuldade, tipo (conceitual, código, cenário) e linguagem (SQL/PySpark). As alternativas são validadas como textos completos e o gabarito é alinhado ao texto da resposta correta.
  * Perfil do estudante no canto superior direito, com nome e foto salvos localmente.
  * Janela do tutor redimensionável, arrastável e com fundo translúcido; área de conversa ampliada e sem painel de consumo de tokens.
* **🛠️ Editor Completo Integrado (`#admin`):**
  * Criação, edição, reordenação e exclusão de módulos, aulas e questões.
  * Personalização visual avançada: temas claro/escuro, 14 paletas predefinidas, cores customizáveis, tipografia, bordas, efeitos de fundo animados e cursores personalizados.
* **💾 Backup e Portabilidade:** Exportação e importação do conteúdo, progresso e configurações em formato `.json`.
* **🔐 Backup criptografado das APIs:** exportação de todas as chaves de provedores em arquivo protegido por AES-256-GCM e senha do usuário; importação no novo aparelho restaura automaticamente as conexões e a configuração de fallback.

## 📁 Estrutura do Projeto

```text
apostila-databricks/
├── index.html              # Ponto de entrada principal (versão de desenvolvimento/direta)
├── build.mjs               # Script de empacotamento e minificação
├── package.json            # Metadados e scripts do projeto
├── README.md               # Documentação do projeto
├── src/                    # Código-fonte modularizado
│   ├── index.dist.html     # Template HTML para build de produção
│   ├── css/
│   │   └── styles.css      # Estilos globais, temas, animações e responsividade
│   └── js/
│       ├── 00-fonts.js     # Lista e configuração de tipografias
│       ├── 05-perf.js      # Otimizações de performance e detecção de hardware
│       ├── 10-config.js    # Configurações padrão, paletas e gerenciamento de estado
│       ├── 20-content.js   # Conteúdo base e questões padrão da apostila
│       ├── 30-app.js       # Roteamento, renderização da interface e painel Editor
│       ├── 40-ai.js        # Integração com a API de IA, chat Datrics e gerador
│       └── 90-main.js      # Inicialização da aplicação
└── dist/                   # Arquivos otimizados e minificados para produção
    ├── index.html
    └── assets/
        ├── app.custom.js
        └── styles.custom.css
```

## 🛠️ Tecnologias Utilizadas

* **HTML5 & CSS3:** Variáveis CSS dinâmicas (`color-mix`, temas claro/escuro), Grid/Flexbox e animações puras em CSS.
* **JavaScript (ES6+):** Arquitetura modular sem dependência de frameworks externos, manipulação de DOM, `localStorage` e integração via `Fetch API`.
* **APIs de IA com modalidade gratuita:** Google Gemini, Groq, OpenRouter Free, Cloudflare Workers AI, NVIDIA NIM, Cohere Trial, Z.AI Flash, Aion Labs Free, Typhoon e ModelScope API Inference. Cada provedor possui chave, modelos e cotas próprios. Mistral e SambaNova foram removidas por não atenderem ao critério de uso sem pagamento nesta versão. OpenAI API e DeepSeek API oficiais não foram incluídas como gratuitas.

O tutorial completo de cada provedor está dentro da página **IA → Tutorial**. Ele inclui criação de chave, seleção de modelo, limites e configuração de fallback. A NVIDIA NIM inclui um seletor com vários endpoints de chat; confirme sempre a etiqueta Free Endpoint no catálogo oficial, pois modelos e cotas mudam.

Atualização: os arquivos-fonte ficam em `src/`; a versão pronta para abrir está em `dist/`. Para recompilar após alterações, execute `npm install` e `npm run build`.


## 🔐 Migrar as API Keys entre aparelhos

No gerador de IA, use a seção **Backup seguro das APIs**. A exportação criptografa as chaves com AES-256-GCM; a chave de criptografia é derivada da senha escolhida por PBKDF2-SHA-256 (310.000 iterações). A senha nunca é incluída no arquivo. No novo dispositivo, selecione o arquivo `.json` criptografado, informe a senha e importe. O processo exige navegador moderno e contexto seguro (HTTPS ou localhost).

**Cuidados:** mantenha o arquivo e a senha em locais separados; sem a senha não há recuperação. O arquivo de backup não é sincronizado automaticamente. O armazenamento normal das chaves no navegador continua sendo `localStorage`, que não deve ser tratado como cofre seguro. O backup migra credenciais e configurações dos provedores, não o histórico do chat nem o progresso do curso.
