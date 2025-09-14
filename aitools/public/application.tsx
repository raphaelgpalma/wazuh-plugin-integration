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

import { History } from 'history';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, withRouter, RouteComponentProps, Redirect } from 'react-router-dom';

import {
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiPageHeader,
  EuiPageHeaderSection,
  EuiPageSideBar,
  EuiTitle,
  EuiSideNav,
} from '@elastic/eui';

import { AppMountContext, AppMountParameters } from 'opensearch-dashboards/public';

const AiToolsIframe = () => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <iframe
        src="http://4.201.194.247:3000"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '4px',
        }}
        title="AI Tools"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </div>
  );
};

const AiToolsApp = ({ basename, history }: { basename: string; history: History }) => {
  return (
    <Router history={history}>
      <EuiPage restrictWidth={false}>
        <EuiPageBody restrictWidth={false}>
          <EuiPageHeader>
            <EuiPageHeaderSection>
              <EuiTitle size="l">
                <h1>AI Tools Plugin</h1>
              </EuiTitle>
            </EuiPageHeaderSection>
          </EuiPageHeader>
          <EuiPageContent hasBorder={false} hasShadow={false} paddingSize="none" color="transparent" borderRadius="none">
            <EuiPageContentBody restrictWidth={false}>
              <AiToolsIframe />
            </EuiPageContentBody>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    </Router>
  );
};

export const renderApp = (context: AppMountContext, { element, history }: AppMountParameters) => {
  ReactDOM.render(<AiToolsApp basename={context.core.http.basePath.get()} history={history} />, element);
  
  return () => {
    ReactDOM.unmountComponentAtNode(element);
  };
};