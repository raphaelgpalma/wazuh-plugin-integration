# wazuh-plugin-integration

 📋 Relatório Completo - Como Configurar e Executar o Wazuh Dashboard

  🎯 Resumo Executivo

  Este relatório documenta todos os passos necessários para configurar e executar o
  Wazuh Dashboard a partir do código fonte, incluindo a resolução do problema crítico
  de conectividade com OpenSearch.

  ---
  📋 Pré-requisitos do Sistema

  Software Necessário:

  - Node.js 18.19.0 (versão específica)
  - NVM (Node Version Manager)
  - Yarn (gerenciador de pacotes)
  - Sistema operacional: Linux (testado no Ubuntu)

  ---
  ⚙️ Configuração Inicial

  1. Preparação do Ambiente

  # Instalar NVM (se não estiver instalado)
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

  # Carregar NVM no terminal atual
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

  # Instalar e usar Node.js 18.19.0 (versão exigida pelo projeto)
  nvm install 18.19.0
  nvm use 18.19.0

  2. Instalação de Dependências

  # Navegar para o diretório do projeto
  cd /caminho/para/wazuh-dashboard

  # Instalar dependências
  yarn install

  # Executar bootstrap para configurar workspaces
  yarn osd bootstrap

  ---
  🔧 Configuração Crítica

  Problema Principal Identificado:

  O arquivo de configuração vem com a porta padrão 9200 para OpenSearch, mas o
  servidor OpenSearch snapshot roda na porta 9201.

  Arquivo a Modificar:

  config/opensearch_dashboards.yml

  Configurações Necessárias:

  # Linha 26 - CORRIGIR A PORTA
  opensearch.hosts: ["http://localhost:9201"]  # ← MUDANÇA CRÍTICA: 9200 → 9201

  # Linha 29 - Manter desabilitado para desenvolvimento
  opensearch.ssl.verificationMode: none

  ---
  🚀 Processo de Execução

  1. Iniciar OpenSearch (Terminal 1)

  # Configurar Node.js
  export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  nvm use 18.19.0

  # Iniciar OpenSearch snapshot
  yarn opensearch snapshot

  ✅ Aguardar pela mensagem:
  info [o.o.n.Node] [ubuntu] started
  info [o.o.h.AbstractHttpServerTransport] [ubuntu] publish_address {127.0.0.1:9201}

  2. Iniciar Dashboard (Terminal 2)

  # Configurar Node.js
  export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
  nvm use 18.19.0

  # Iniciar Dashboard
  yarn start

  ✅ Aguardar pelas mensagens de sucesso:
  "Starting saved objects migrations"
  "Server running at http://localhost:5603/[basepath]"
  "http server running at http://localhost:5603/[basepath]"

  ---
  🌐 Acesso ao Dashboard

  URLs de Acesso:

  1. URL Principal: http://localhost:5601
    - Redireciona automaticamente para o basepath correto
  2. URL Direta: http://localhost:5601/[basepath]
    - Acesso direto via proxy
  3. URL Servidor: http://localhost:5603/[basepath]
    - Acesso direto ao servidor HTTP principal

  Nota: [basepath] é gerado dinamicamente (ex: /fmg, /nwz)

  ---
  🔍 Verificação de Funcionamento

  Testes de Validação:

  # 1. Testar redirecionamento
  curl -I http://localhost:5601
  # Esperado: HTTP/1.1 302 Found com location: /[basepath]

  # 2. Testar OpenSearch
  curl -s http://localhost:9201/_cluster/health | jq .status
  # Esperado: "green"

  # 3. Testar Dashboard
  curl -I http://localhost:5601/[basepath]
  # Esperado: HTTP/1.1 302 Found com osd-name: ubuntu

  ---
  ❌ Problemas Comuns e Soluções

  1. Erro: "EADDRINUSE: address already in use"

  # Matar processos na porta 5601
  lsof -ti:5601 | xargs -r kill -9

  2. Erro: "socket hang up" (repetitivo)

  Causa: Porta incorreta no arquivo de configuração
  Solução: Verificar se opensearch.hosts aponta para 9201 (não 9200)

  3. Dashboard não responde via HTTP

  Causa: Múltiplas instâncias conflitantes
  Solução:
  # Finalizar todos os processos Dashboard
  pkill -f "opensearch_dashboards"
  lsof -ti:5601 | xargs -r kill -9

  # Reiniciar com instância única
  yarn start

  4. NVM não encontrado

  # Carregar NVM na sessão atual
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

  ---
  📊 Indicadores de Sucesso

  Logs que Confirmam Funcionamento:

  OpenSearch:
  - ✅ [o.o.n.Node] [ubuntu] started
  - ✅ publish_address {127.0.0.1:9201}
  - ✅ Cluster status: "green"

  Dashboard:
  - ✅ basepath proxy server running at http://localhost:5601/[basepath]
  - ✅ Starting saved objects migrations
  - ✅ Server running at http://localhost:5603/[basepath]
  - ✅ http server running at http://localhost:5603/[basepath]

  HTTP Responses:
  - ✅ HTTP/1.1 302 Found com redirecionamentos
  - ✅ Header osd-name: ubuntu presente
  - ✅ Redirecionamento para /[basepath]/app/home

  ---
  🔄 Processo Completo (Resumo)

  Checklist de Execução:

  1. ✅ Instalar Node.js 18.19.0 via NVM
  2. ✅ Executar yarn install e yarn osd bootstrap
  3. ✅ Corrigir porta no opensearch_dashboards.yml (9200 → 9201)
  4. ✅ Iniciar OpenSearch: yarn opensearch snapshot
  5. ✅ Aguardar OpenSearch estar "started" e "green"
  6. ✅ Iniciar Dashboard: yarn start
  7. ✅ Aguardar mensagens de servidor HTTP funcionando
  8. ✅ Validar acesso via curl -I http://localhost:5601

  ---
  ⚠️ Pontos Críticos

  🔥 Problema Mais Importante:

  - A configuração padrão tem porta INCORRETA
  - SEMPRE verificar que opensearch.hosts usa porta 9201
  - OpenSearch snapshot roda em 9201, não 9200

  🎯 Solução Definitiva:

  # config/opensearch_dashboards.yml - LINHA 26
  opensearch.hosts: ["http://localhost:9201"]  # ← OBRIGATÓRIO!

  ---
  🏆 Resultado Final

  Seguindo todos esses passos, o Wazuh Dashboard ficará 100% funcional com:
  - ✅ Interface web acessível
  - ✅ OpenSearch integrado
  - ✅ Todos os plugins carregados
  - ✅ Sistema completo de desenvolvimento pronto

  URLs de acesso funcionais: http://localhost:5601 (redirecionamento automático)

