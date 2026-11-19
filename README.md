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

**Cuidados:** mantenha o arquivo e a senha em locais separados; sem a senha não há recuperação. O arquivo de backup não é sincronizado automaticamente. O armazenamento normal das chaves no navegador continua sendo `localStorage`, que não deve ser tratado como cofre seguro. O backup migra credenciais, configurações dos provedores e o checkpoint de uma tarefa em andamento; não migra o histórico completo do chat nem o progresso geral do curso.


## 🤝 Orquestração multi-IA e continuidade de tarefas

A geração de questões usa modo automático, revisão final ativada e checkpoint a cada etapa. Quando uma resposta textual atinge o limite de saída, o Datrics tenta continuar com outro provedor conectado, enviando o trecho já produzido e uma instrução explícita para continuar sem repetir. Para JSON de questões, aproveita objetos completos que chegaram antes do corte e a próxima etapa gera somente a quantidade restante, incluindo os enunciados anteriores na lista anti-repetição.

O gerador salva localmente um checkpoint após cada lote, com tema, parâmetros, questões concluídas, etapa, cards e relatório de revisão. Se a página for fechada ou a API falhar, abra **IA → Criar questões** e use **Retomar trabalho salvo**. Por segurança, o checkpoint não contém API Keys; a chave precisa continuar configurada no navegador. O backup criptografado das APIs também leva o checkpoint e as preferências de orquestração, permitindo migrar o trabalho em andamento com as credenciais. O arquivo de backup aceita até 5 MB para acomodar checkpoints maiores.

A revisão final envia as questões a outro provedor conectado quando houver um disponível; se só houver um provedor configurado, ele fará a revisão sem independência entre modelos. O relatório é anexado à aula e apresenta os pontos sinalizados. A revisão é uma checagem automatizada, não uma garantia de correção factual. Os provedores podem ter limites de contexto, cotas e indisponibilidades; a continuidade não é ilimitada e depende de haver outro provedor conectado e funcional.

## 🔎 Web Search e RAG personalizado do Datrics

No chat do Datrics, use **Web Search** para anexar resultados externos à pergunta. A implementação atual consulta o DuckDuckGo Instant Answer e a API de busca da Wikipédia; os links retornados são enviados como contexto para que o modelo possa citá-los. É uma pesquisa leve de apoio, não um mecanismo de busca geral completo. A disponibilidade depende de CORS/rede do navegador.

Use **+ Documentos** para importar arquivos `.txt`, `.md`, `.csv`, `.json`, `.pdf` (com texto selecionável) e `.docx`. O Datrics extrai o texto, divide em trechos com sobreposição e mantém um índice lexical local no `localStorage`. A cada pergunta, recupera os trechos com maior correspondência e os inclui no contexto da IA. Os arquivos não são enviados integralmente: somente os trechos recuperados são enviados ao provedor de IA quando você faz uma pergunta. O índice fica neste navegador; use **Limpar docs** para removê-lo.

**Limitações:** a recuperação atual é lexical (palavras-chave), não usa embeddings/vetores semânticos; PDFs escaneados/imagens exigem OCR e não são extraídos; o índice tem limite de armazenamento do navegador. A pesquisa externa está disponível no chat de estudo, não no gerador de lotes. Para busca web abrangente, produção multiusuário, embeddings e armazenamento persistente compartilhado, será necessário um backend com proxy de busca e banco vetorial. Não importe documentos confidenciais sem avaliar as políticas do provedor de IA configurado.


## Roteamento e verificação de disponibilidade das APIs

O roteador agora faz uma chamada de teste curta em paralelo para as chaves configuradas antes de montar a fila de provedores. Resultados positivos ficam em cache por 90 segundos; erros de cota entram em cooldown por 10 minutos e outras falhas por 2 minutos. Provedores indisponíveis são pulados, sem repetir o mesmo provedor na mesma solicitação. A revisão técnica escolhe um provedor elegível diferente do gerador quando existir.

**Limitação importante:** não existe uma API universal para consultar o saldo exato de tokens/créditos de todos os provedores. O teste confirma que a chave/modelo consegue realizar uma chamada real naquele momento; a resposta de uso/cota de cada serviço continua sendo a fonte definitiva. A chamada de teste consome uma quantidade pequena de tokens e é contabilizada no uso quando a API retorna metadados.

O relatório da revisão continua salvo em `aiReview` para auditoria, mas não é exibido dentro da aula/card do aluno.
