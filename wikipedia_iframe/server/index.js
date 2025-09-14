/*
 * SPDX-License-Identifier: Apache-2.0
 */

class WikipediaIframeServerPlugin {
  setup() {
    return {};
  }

  start() {
    return {};
  }

  stop() {}
}

const plugin = () => new WikipediaIframeServerPlugin();

module.exports = { plugin };
