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

import { Plugin, CoreSetup } from 'opensearch-dashboards/public';

export class WikipediaIframePlugin implements Plugin<WikipediaIframePluginSetup, WikipediaIframePluginStart> {
  public setup(core: CoreSetup, deps: {}) {
    core.application.register({
      id: 'wikipediaIframe',
      title: 'Wikipedia',
      category: {
        id: 'opensearchDashboards',
        label: 'OpenSearch Dashboards',
        order: 1000,
      },
      order: 9000,
      euiIconType: 'globe',
      async mount(context, params) {
        const { renderApp } = await import('./application');
        return renderApp(context, params);
      },
    });

    return {
      getGreeting() {
        return 'Hello from Wikipedia Iframe Plugin!';
      },
    };
  }

  public start() {}
  public stop() {}
}

export type WikipediaIframePluginSetup = ReturnType<WikipediaIframePlugin['setup']>;
export type WikipediaIframePluginStart = ReturnType<WikipediaIframePlugin['start']>;