var DEFAULT_MODS = [
    { t: "Fundamentos do Databricks", l: [
        { id: "lakehouse", t: "O que é o Lakehouse", d: "8 min", h: "O Lakehouse combina a flexibilidade de um data lake com recursos de gestão, confiabilidade e desempenho associados a um data warehouse.\n\nNo Databricks, os dados podem ser armazenados em tabelas Delta sobre armazenamento em nuvem. Compute, armazenamento e governança são componentes distintos.", q: [
            { p: "Qual característica melhor descreve a arquitetura Lakehouse?", o: ["Combina armazenamento aberto de data lake com recursos de gestão e confiabilidade.", "Exige que todos os dados sejam armazenados em um banco relacional proprietário.", "Elimina a necessidade de processamento distribuído.", "Armazena apenas dados estruturados em memória."], a: 0, e: "O Lakehouse aproxima a flexibilidade do data lake dos recursos de confiabilidade e gestão de um warehouse." },
            { p: "Em uma arquitetura Databricks, o armazenamento dos dados costuma ficar:", o: ["No armazenamento de objetos em nuvem, separado do compute.", "Dentro do navegador de cada usuário.", "Somente no disco local do driver.", "Em um arquivo temporário apagado após cada consulta."], a: 0, e: "Separar armazenamento e compute permite escalar e administrar cada camada independentemente." }
        ] },
        { id: "workspace", t: "Workspace, compute e notebooks", d: "7 min", h: "O workspace organiza notebooks, arquivos, consultas e outros ativos de trabalho. Notebooks podem combinar código, texto e visualizações.\n\nCompute é o recurso que executa as cargas de trabalho. Escolha um tipo e tamanho compatíveis com a tarefa, e encerre recursos interativos quando não forem mais necessários.", q: [
            { p: "Qual é a função principal do compute?", o: ["Executar consultas e código de processamento.", "Armazenar permanentemente todas as tabelas Delta.", "Definir os usuários do provedor de nuvem.", "Substituir o catálogo de dados."], a: 0, e: "Compute fornece recursos de execução; os dados podem permanecer em armazenamento separado." }
        ] }
    ] },
    { t: "Delta Lake e SQL", l: [
        { id: "delta-lake", t: "Tabelas Delta e transações", d: "9 min", h: "Delta Lake adiciona um log transacional ao armazenamento de dados, permitindo operações como leituras consistentes, controle de concorrência e evolução de esquema.\n\nUse tabelas gerenciadas conforme as necessidades de retenção e governança. Operações de escrita devem ser planejadas para evitar sobrescritas acidentais.", q: [
            { p: "O que o log transacional do Delta Lake possibilita?", o: ["Registrar alterações e oferecer leituras consistentes da tabela.", "Executar código Python sem compute.", "Substituir todas as permissões do catálogo.", "Converter automaticamente qualquer arquivo em tabela sem configuração."], a: 0, e: "O log Delta acompanha as transações da tabela e viabiliza recursos de consistência e concorrência." },
            { p: "Qual comando grava um DataFrame como tabela Delta usando PySpark?", o: ["df.write.format(\"delta\").saveAsTable(\"catalogo.esquema.tabela\")", "df.read.format(\"delta\").saveAsTable(\"catalogo.esquema.tabela\")", "spark.stop(\"catalogo.esquema.tabela\")", "df.sql(\"CREATE DELTA TABLE\")"], a: 0, e: "O writer do DataFrame permite definir o formato Delta e salvar o resultado como tabela." }
        ] },
        { id: "spark-sql", t: "Consultas com Spark SQL", d: "8 min", h: "Spark SQL permite consultar tabelas com SQL e também pode ser usado em notebooks. Prefira selecionar as colunas necessárias e aplicar filtros que reduzam os dados processados.\n\nEm ambientes com Unity Catalog, referencie tabelas usando o formato catalogo.esquema.tabela quando aplicável.", q: [
            { p: "Como consultar somente as colunas id e nome da tabela clientes no schema vendas?", o: ["SELECT id, nome FROM catalogo.vendas.clientes", "SELECT * FROM id, nome WHERE vendas.clientes", "READ clientes COLUMNS id, nome", "SHOW id, nome IN catalogo.vendas.clientes"], a: 0, e: "A forma de três partes identifica catálogo, schema e tabela; a lista de colunas evita ler colunas desnecessárias." }
        ] }
    ] },
    { t: "Engenharia de dados", l: [
        { id: "pyspark", t: "Transformações com PySpark", d: "8 min", h: "DataFrames do PySpark representam dados distribuídos e permitem compor transformações como select, filter e withColumn.\n\nMuitas transformações são avaliadas de forma preguiçosa: o plano é executado quando uma ação, como count ou write, é chamada. Isso permite ao Spark otimizar o plano.", q: [
            { p: "Qual chamada normalmente dispara a execução de um plano de DataFrame?", o: ["df.count()", "df.select(\"coluna\")", "df.filter(\"valor > 0\")", "df.withColumn(\"nova\", expr)"], a: 0, e: "count é uma ação. select, filter e withColumn são transformações que compõem o plano." }
        ] },
        { id: "autoloader", t: "Ingestão incremental com Auto Loader", d: "8 min", h: "O Auto Loader detecta e processa arquivos novos de forma incremental, sendo útil para ingestão contínua de dados em armazenamento de objetos.\n\nA configuração normalmente define o formato de origem, o caminho dos arquivos e diretórios de checkpoint e schema para acompanhar o progresso e a evolução do esquema.", q: [
            { p: "Para que serve o Auto Loader?", o: ["Detectar e ingerir arquivos novos de forma incremental.", "Substituir o armazenamento Delta por memória.", "Criar usuários e grupos do workspace.", "Executar apenas consultas SQL interativas."], a: 0, e: "O Auto Loader oferece ingestão incremental de arquivos, com suporte a estado e evolução de esquema." }
        ] }
    ] },
    { t: "Governança e operações", l: [
        { id: "unity-catalog", t: "Governança com Unity Catalog", d: "8 min", h: "Unity Catalog centraliza a governança de dados e ativos no Databricks. A hierarquia usual é metastore, catálogo, schema e objeto, como uma tabela ou view.\n\nAplique o princípio do menor privilégio: conceda apenas as permissões necessárias e revise acessos regularmente.", q: [
            { p: "Qual é a hierarquia usual para identificar uma tabela no Unity Catalog?", o: ["catalogo.esquema.tabela", "tabela.catalogo.esquema", "workspace.cluster.tabela", "metastore.usuario.arquivo"], a: 0, e: "Uma tabela é normalmente referenciada pelo catálogo, schema e nome do objeto." }
        ] },
        { id: "workflows", t: "Workflows e jobs", d: "7 min", h: "Jobs e Workflows automatizam tarefas, podem organizar etapas dependentes e permitem configurar agenda, compute, parâmetros e notificações.\n\nTorne as tarefas idempotentes sempre que possível, monitore falhas e evite incluir credenciais diretamente em notebooks ou código.", q: [
            { p: "Qual prática ajuda a tornar um job de dados mais confiável?", o: ["Monitorar falhas e projetar tarefas idempotentes.", "Guardar senhas diretamente no notebook.", "Ignorar dependências entre tarefas.", "Executar tudo no computador pessoal do autor."], a: 0, e: "Monitoramento e idempotência facilitam recuperação e reexecução segura de tarefas." }
        ] }
    ] }
];
