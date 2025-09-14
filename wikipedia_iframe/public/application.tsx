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

const WikipediaIframe = () => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <iframe
        src="https://en.wikipedia.org/wiki/Main_Page"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '4px',
        }}
        title="Wikipedia"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </div>
  );
};

const WikipediaApp = ({ basename, history }: { basename: string; history: History }) => {
  return (
    <Router history={history}>
      <EuiPage restrictWidth={false}>
        <EuiPageBody restrictWidth={false}>
          <EuiPageHeader>
            <EuiPageHeaderSection>
              <EuiTitle size="l">
                <h1>Wikipedia Iframe Plugin</h1>
              </EuiTitle>
            </EuiPageHeaderSection>
          </EuiPageHeader>
          <EuiPageContent hasBorder={false} hasShadow={false} paddingSize="none" color="transparent" borderRadius="none">
            <EuiPageContentBody restrictWidth={false}>
              <WikipediaIframe />
            </EuiPageContentBody>
          </EuiPageContent>
        </EuiPageBody>
      </EuiPage>
    </Router>
  );
};

export const renderApp = (context: AppMountContext, { element, history }: AppMountParameters) => {
  ReactDOM.render(<WikipediaApp basename={context.core.http.basePath.get()} history={history} />, element);
  
  return () => {
    ReactDOM.unmountComponentAtNode(element);
  };
};