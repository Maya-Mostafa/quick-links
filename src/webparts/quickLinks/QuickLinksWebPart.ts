import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'QuickLinksWebPartStrings';
import QuickLinks from './components/QuickLinks';
import { IQuickLinksProps } from './components/IQuickLinksProps';

export interface IQuickLinksWebPartProps {
  linksListUrl: string;
  linksListName: string;
  userProfileProp: string;
  wpTitle: string;
  editTxt: string;
  okTxt: string;
  cancelTxt: string;
}

export default class QuickLinksWebPart extends BaseClientSideWebPart<IQuickLinksWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IQuickLinksProps> = React.createElement(
      QuickLinks,
      {
        context: this.context,
        linksListUrl: this.properties.linksListUrl,
        linksListName: this.properties.linksListName,
        userProfileProp: this.properties.userProfileProp,
        wpTitle: this.properties.wpTitle,
        editTxt: this.properties.editTxt,
        okTxt: this.properties.okTxt,
        cancelTxt: this.properties.cancelTxt
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('wpTitle', {
                  label: 'Links Title',
                  value: this.properties.wpTitle,
                  description: 'e.g. Peel Applications or Peel Links'
                }),
                PropertyPaneTextField('editTxt', {
                  label: 'Edit Button Text',
                  value: this.properties.editTxt,
                }),
                PropertyPaneTextField('okTxt', {
                  label: 'Ok/Apply Button Text',
                  value: this.properties.okTxt,
                }),
                PropertyPaneTextField('cancelTxt', {
                  label: 'Cancel/Discard Button Text',
                  value: this.properties.cancelTxt,
                }),
                PropertyPaneTextField('linksListUrl', {
                  label: 'Links List URL',
                  value: this.properties.linksListUrl,
                  description : 'e.g. https://pdsb1.sharepoint.com/MySite'
                }),
                PropertyPaneTextField('linksListName', {
                  label: 'Links List Name',
                  value: this.properties.linksListName,
                  description : 'e.g. PeelApplications or PeelLinks'
                }),
                PropertyPaneTextField('userProfileProp', {
                  label: 'User Profile Property Name',
                  value: this.properties.userProfileProp,
                  description: 'Use PDSBMyApps for Peel applications, and PDSBPeelLinks for Peel links'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
