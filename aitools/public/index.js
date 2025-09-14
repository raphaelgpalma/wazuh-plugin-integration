/*
 * SPDX-License-Identifier: Apache-2.0
 */

class AiToolsPublicPlugin {
  setup() {
    return {};
  }

  start() {
    return {};
  }

  stop() {}
}

const plugin = () => new AiToolsPublicPlugin();

module.exports = { plugin };
