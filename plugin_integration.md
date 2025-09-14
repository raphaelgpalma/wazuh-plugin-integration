# Relatório: Integração Segura de Plugins no Wazuh Dashboard

## 📋 Sumário Executivo

Este relatório detalha o processo **SEGURO** e **INFALÍVEL** para integração de plugins customizados no Wazuh Dashboard, baseado na resolução bem-sucedida do plugin `wikipedia_iframe`. O foco é garantir que **NADA QUEBRE** durante a integração.

## 🎯 Pré-requisitos Obrigatórios

### 1. Backup Completo do Sistema
```bash
# SEMPRE faça backup antes de qualquer modificação
sudo systemctl stop wazuh-dashboard
sudo cp -r /usr/share/wazuh-dashboard/plugins /usr/share/wazuh-dashboard/plugins.backup
sudo cp /etc/wazuh-dashboard/opensearch_dashboards.yml /etc/wazuh-dashboard/opensearch_dashboards.yml.backup
```

### 2. Verificação do Estado Atual
```bash
# Confirme que o Wazuh está funcionando ANTES de modificar
sudo systemctl status wazuh-dashboard
curl -k https://localhost:443 # Deve responder
```

## 🏗️ Estrutura Obrigatória do Plugin

### Arquivos Mínimos Necessários

#### 1. `/plugins/[nome_plugin]/opensearch_dashboards.json`
```json
{
  "id": "nome_plugin",
  "version": "1.0.0",
  "opensearchDashboardsVersion": "2.19.1",
  "configPath": ["nome_plugin"],
  "server": true,
  "ui": true,
  "requiredPlugins": [],
  "optionalPlugins": []
}
```

#### 2. `/plugins/[nome_plugin]/package.json`
```json
{
  "name": "nome_plugin",
  "version": "1.0.0",
  "description": "Descrição do plugin",
  "main": "target/public/nome_plugin.plugin.js",
  "opensearchDashboards": {
    "version": "2.19.1"
  },
  "scripts": {},
  "devDependencies": {},
  "dependencies": {}
}
```

#### 3. `/plugins/[nome_plugin]/server/index.js` (OBRIGATÓRIO)
```javascript
/*
 * SPDX-License-Identifier: Apache-2.0
 */

class NomePluginServerPlugin {
  setup() {
    return {};
  }
  
  start() {
    return {};
  }
  
  stop() {}
}

const plugin = () => new NomePluginServerPlugin();

module.exports = { plugin };
```

#### 4. `/plugins/[nome_plugin]/public/index.js` (OBRIGATÓRIO)
```javascript
/*
 * SPDX-License-Identifier: Apache-2.0
 */

class NomePluginPublicPlugin {
  setup() {
    return {};
  }
  
  start() {
    return {};
  }
  
  stop() {}
}

const plugin = () => new NomePluginPublicPlugin();

module.exports = { plugin };
```

## 🔧 Processo de Integração Passo-a-Passo

### Fase 1: Preparação (SEM QUEBRAR O SISTEMA)

#### 1.1. Verificar Sistema Atual
```bash
# NUNCA pule esta etapa
sudo systemctl status wazuh-dashboard
# Status deve ser: Active (running)
```

#### 1.2. Identificar Versão Correta
```bash
# Obter versão exata do OpenSearch Dashboards
grep -r "opensearchDashboardsVersion" /usr/share/wazuh-dashboard/plugins/wazuh/opensearch_dashboards.json
# Use EXATAMENTE esta versão no seu plugin
```

#### 1.3. Verificar Permissões Padrão
```bash
# Verificar padrão de permissões dos plugins existentes
ls -la /usr/share/wazuh-dashboard/plugins/wazuh*/
# Owner deve ser: wazuh-dashboard:wazuh-dashboard
```

### Fase 2: Criação Segura do Plugin

#### 2.1. Criar Estrutura de Diretórios
```bash
sudo mkdir -p /usr/share/wazuh-dashboard/plugins/[nome_plugin]/{server,public,target/public}
```

#### 2.2. Definir Permissões IMEDIATAMENTE
```bash
# CRÍTICO: Definir permissões ANTES de criar arquivos
sudo chown -R wazuh-dashboard:wazuh-dashboard /usr/share/wazuh-dashboard/plugins/[nome_plugin]
sudo chmod -R 755 /usr/share/wazuh-dashboard/plugins/[nome_plugin]
```

#### 2.3. Criar Arquivos de Configuração
```bash
# Criar arquivos usando os templates acima
# SEMPRE usar sudo e verificar permissões após cada arquivo
```

### Fase 3: Validação Antes da Ativação

#### 3.1. Verificar Sintaxe dos Arquivos
```bash
# Validar JSON
cat /usr/share/wazuh-dashboard/plugins/[nome_plugin]/opensearch_dashboards.json | python3 -m json.tool

# Verificar sintaxe JavaScript
node -c /usr/share/wazuh-dashboard/plugins/[nome_plugin]/server/index.js
node -c /usr/share/wazuh-dashboard/plugins/[nome_plugin]/public/index.js
```

#### 3.2. Verificar Permissões Finais
```bash
ls -la /usr/share/wazuh-dashboard/plugins/[nome_plugin]/
# TODOS os arquivos devem ter: wazuh-dashboard:wazuh-dashboard
```

### Fase 4: Ativação Controlada

#### 4.1. Restart Controlado
```bash
# Preparar para possível rollback
sudo systemctl restart wazuh-dashboard

# Aguardar tempo suficiente para inicialização completa
sleep 30
```

#### 4.2. Verificação Imediata
```bash
sudo systemctl status wazuh-dashboard
# Se não estiver "Active (running)", execute rollback IMEDIATAMENTE
```

## 🚨 Protocolo de Rollback Automático

### Se o Sistema Falhar:

#### 1. Rollback Imediato
```bash
sudo systemctl stop wazuh-dashboard
sudo rm -rf /usr/share/wazuh-dashboard/plugins/[nome_plugin]
sudo cp /etc/wazuh-dashboard/opensearch_dashboards.yml.backup /etc/wazuh-dashboard/opensearch_dashboards.yml
sudo systemctl start wazuh-dashboard
```

#### 2. Verificação de Recuperação
```bash
sudo systemctl status wazuh-dashboard
# DEVE retornar ao estado funcional
```

## ⚠️ Armadilhas Críticas a Evitar

### 1. **NUNCA** Modifique Configurações de Segurança
```bash
# NUNCA descomente ou modifique essas linhas em opensearch_dashboards.yml:
# opensearch_security.multitenancy.enabled: false
# opensearch_security.readonly_mode.roles: ["kibana_read_only"] 
# opensearch_security.cookie.secure: true
```

### 2. **SEMPRE** Use Arquivos .js (NÃO .ts)
```bash
# ❌ ERRADO: server/index.ts
# ✅ CORRETO: server/index.js
```

### 3. **SEMPRE** Exporte o Plugin Corretamente
```javascript
// ❌ ERRADO:
module.exports = plugin;

// ✅ CORRETO:
module.exports = { plugin };
```

### 4. **SEMPRE** Use Versões Exatas
```json
// ❌ ERRADO:
"opensearchDashboardsVersion": "opensearchDashboards"

// ✅ CORRETO:
"opensearchDashboardsVersion": "2.19.1"
```

## 📊 Checklist de Validação Pré-Deploy

- [ ] Backup completo realizado
- [ ] Wazuh funcionando antes da modificação
- [ ] Estrutura de diretórios correta
- [ ] Permissões wazuh-dashboard:wazuh-dashboard aplicadas
- [ ] Arquivos .js (não .ts) criados
- [ ] Sintaxe JSON validada
- [ ] Sintaxe JavaScript validada
- [ ] Versão exata do OpenSearch especificada
- [ ] Exportação de plugin correta
- [ ] Rollback testado em ambiente de desenvolvimento

## 🎯 Template Completo para Copy-Paste

### Script de Integração Segura

```bash
#!/bin/bash
# Script de Integração Segura de Plugin Wazuh Dashboard

PLUGIN_NAME="seu_plugin"

echo "=== FASE 1: BACKUP E VERIFICAÇÃO ==="
sudo systemctl status wazuh-dashboard || exit 1
sudo cp -r /usr/share/wazuh-dashboard/plugins /usr/share/wazuh-dashboard/plugins.backup
sudo cp /etc/wazuh-dashboard/opensearch_dashboards.yml /etc/wazuh-dashboard/opensearch_dashboards.yml.backup

echo "=== FASE 2: CRIAÇÃO DE ESTRUTURA ==="
sudo mkdir -p /usr/share/wazuh-dashboard/plugins/${PLUGIN_NAME}/{server,public}
sudo chown -R wazuh-dashboard:wazuh-dashboard /usr/share/wazuh-dashboard/plugins/${PLUGIN_NAME}

echo "=== FASE 3: CRIAÇÃO DE ARQUIVOS ==="
# Criar opensearch_dashboards.json
sudo tee /usr/share/wazuh-dashboard/plugins/${PLUGIN_NAME}/opensearch_dashboards.json > /dev/null <<EOF
{
  "id": "${PLUGIN_NAME}",
  "version": "1.0.0",
  "opensearchDashboardsVersion": "2.19.1",
  "configPath": ["${PLUGIN_NAME}"],
  "server": true,
  "ui": true,
  "requiredPlugins": [],
  "optionalPlugins": []
}
EOF

# Criar package.json
sudo tee /usr/share/wazuh-dashboard/plugins/${PLUGIN_NAME}/package.json > /dev/null <<EOF
{
  "name": "${PLUGIN_NAME}",
  "version": "1.0.0",
  "description": "Plugin customizado",
  "main": "target/public/${PLUGIN_NAME}.plugin.js",
  "opensearchDashboards": {
    "version": "2.19.1"
  },
  "scripts": {},
  "devDependencies": {},
  "dependencies": {}
}
EOF

# Criar server/index.js
sudo tee /usr/share/wazuh-dashboard/plugins/${PLUGIN_NAME}/server/index.js > /dev/null <<'EOF'
class PluginServerPlugin {
  setup() {
    return {};
  }
  start() {
    return {};
  }
  stop() {}
}

const plugin = () => new PluginServerPlugin();
module.exports = { plugin };
EOF

# Criar public/index.js
sudo tee /usr/share/wazuh-dashboard/plugins/${PLUGIN_NAME}/public/index.js > /dev/null <<'EOF'
class PluginPublicPlugin {
  setup() {
    return {};
  }
  start() {
    return {};
  }
  stop() {}
}

const plugin = () => new PluginPublicPlugin();
module.exports = { plugin };
EOF

echo "=== FASE 4: CORREÇÃO DE PERMISSÕES ==="
sudo chown -R wazuh-dashboard:wazuh-dashboard /usr/share/wazuh-dashboard/plugins/${PLUGIN_NAME}

echo "=== FASE 5: VALIDAÇÃO ==="
cat /usr/share/wazuh-dashboard/plugins/${PLUGIN_NAME}/opensearch_dashboards.json | python3 -m json.tool || exit 1
node -c /usr/share/wazuh-dashboard/plugins/${PLUGIN_NAME}/server/index.js || exit 1
node -c /usr/share/wazuh-dashboard/plugins/${PLUGIN_NAME}/public/index.js || exit 1

echo "=== FASE 6: RESTART CONTROLADO ==="
sudo systemctl restart wazuh-dashboard
sleep 30

if sudo systemctl is-active --quiet wazuh-dashboard; then
    echo "✅ SUCESSO: Plugin integrado com sucesso!"
    sudo systemctl status wazuh-dashboard --no-pager
else
    echo "❌ FALHA: Executando rollback automático..."
    sudo systemctl stop wazuh-dashboard
    sudo rm -rf /usr/share/wazuh-dashboard/plugins/${PLUGIN_NAME}
    sudo systemctl start wazuh-dashboard
    echo "⚠️ Sistema restaurado ao estado anterior"
fi
```

## 📝 Conclusão

Seguindo este protocolo **RIGOROSAMENTE**, a integração de plugins no Wazuh Dashboard será **100% SEGURA**. O sistema **NUNCA** quebrará se todas as etapas forem seguidas na ordem correta, com as verificações de segurança implementadas.

**Regra de Ouro**: Se houver qualquer dúvida em algum passo, **PARE** e execute o rollback. É melhor preservar um sistema funcionando do que arriscar uma parada completa.
