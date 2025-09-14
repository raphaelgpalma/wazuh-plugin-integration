/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Any modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

import { PluginInitializerContext, CoreSetup, CoreStart, Plugin } from 'opensearch-dashboards/server';

export class WikipediaIframeServerPlugin implements Plugin<WikipediaIframeServerPluginSetup, WikipediaIframeServerPluginStart> {
  constructor(initializerContext: PluginInitializerContext) {}

  public setup(core: CoreSetup) {
    return {};
  }

  public start(core: CoreStart) {
    return {};
  }

  public stop() {}
}

export type WikipediaIframeServerPluginSetup = ReturnType<WikipediaIframeServerPlugin['setup']>;
export type WikipediaIframeServerPluginStart = ReturnType<WikipediaIframeServerPlugin['start']>;