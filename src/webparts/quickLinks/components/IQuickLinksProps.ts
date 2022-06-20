import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IQuickLinksProps {
  context: WebPartContext;
  linksListUrl: string;
  linksListName: string;
  userProfileProp: string;
  wpTitle: string;
  editTxt: string;
  okTxt: string;
  cancelTxt: string;
  targetAudience: any;
}
