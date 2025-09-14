/*
 * SPDX-License-Identifier: Apache-2.0
 */

class AiToolsServerPlugin {
  setup() {
    return {};
  }

  start() {
    return {};
  }

  stop() {}
}

const plugin = () => new AiToolsServerPlugin();

module.exports = { plugin };
