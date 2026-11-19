# 📚 Databricks Academy — Apostila Interativa

Uma plataforma web interativa e responsiva focada no estudo de **Databricks**, arquitetura **Lakehouse**, **Delta Lake**, **PySpark**, **Spark SQL**, **Auto Loader**, **Unity Catalog** e **Workflows**.

O projeto funciona como uma Single Page Application (SPA) estática, com armazenamento local no navegador (`localStorage`), editor visual completo e integração com Inteligência Artificial (**Datrics**) para tutoria e geração dinâmica de exercícios.

🔗 **Acesse online:** [Databricks Academy](https://rehkkj.github.io/apostila-databricks/)

## ✨ Funcionalidades Principais

* **📖 Trilha de Aprendizagem Modular:** Conteúdo dividido em módulos temáticos com tempo estimado de leitura e navegação fluida entre aulas.
* **📝 Exercícios Práticos com Feedback:** Questões de múltipla escolha com correção imediata, explicações detalhadas e acompanhamento de progresso.
* **📊 Painel de Desempenho:** Métricas em tempo real sobre conclusão geral, taxa de acerto e identificação automática dos módulos com maior índice de erro.
* **🤖 Assistente de Estudos com IA (Datrics):**
  * Chat contextualizado com o conteúdo da aula atual ou de toda a apostila.
  * **Gerador de Questões:** Criação de lotes de exercícios personalizados por tema, nível de dificuldade, tipo (conceitual, código, cenário) e linguagem (SQL/PySpark).
  * Perfil do estudante no canto superior direito, com nome e foto salvos localmente.
  * Janela do tutor redimensionável, arrastável e com fundo translúcido; área de conversa ampliada e sem painel de consumo de tokens.
* **🛠️ Editor Completo Integrado (`#admin`):**
  * Criação, edição, reordenação e exclusão de módulos, aulas e questões.
  * Personalização visual avançada: temas claro/escuro, 14 paletas predefinidas, cores customizáveis, tipografia, bordas, efeitos de fundo animados e cursores personalizados.
* **💾 Backup e Portabilidade:** Exportação e importação completa do conteúdo, progresso e configurações em formato `.json`.

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
* **Google Gemini API:** Motor de inteligência artificial para tutoria e geração estruturada de exercícios em JSON.
