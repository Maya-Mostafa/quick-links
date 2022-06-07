
import { WebPartContext } from "@microsoft/sp-webpart-base";
import {SPHttpClient, ISPHttpClientOptions} from "@microsoft/sp-http";

export const getListItems = async (context: WebPartContext, listUrl: string, listName: string, profilePropName: string) =>{
    
    const myUserProfileProps = await getmyUserProfileProps(context);
    const myPropsIds = getMyPropIds(myUserProfileProps, profilePropName);
    // console.log("myPropsIds", myPropsIds);

    const listData: any = [];
    const responseUrl = `${listUrl}/_api/web/Lists/GetByTitle('${listName}')/items?$top=500&$orderby=Title`;
    
    try{
      const response = await context.spHttpClient.get(responseUrl, SPHttpClient.configurations.v1);
      if(response.ok){
        const responseResults = await response.json();
        responseResults.value.map((item: any)=>{
          listData.push({
            id: item.Id,
            title: item.Title,
            url: item.Url,
            checked: !myPropsIds.has(item.Id.toString()),
            pending: false
          });
        });
      }else{
        console.log("List Error: " + listUrl + listName + response.statusText);
        return [];
      }
    }catch(error){
      console.log("List Error: " + listUrl + listName + error);
    }
    // console.log("listData", listData);

    return listData;
};

const getmyUserProfileProps = async (context: WebPartContext) => {
    const responseUrl = `${context.pageContext.web.absoluteUrl}/_api/SP.UserProfiles.PeopleManager/GetMyProperties` ;
    
    try{
        const response = await context.spHttpClient.get(responseUrl, SPHttpClient.configurations.v1);
        if (response.ok){
            const responseResults = await response.json();
            return responseResults.UserProfileProperties;
        }else{
            console.log("User Profile props Error: " + response.statusText);
        }
    }catch(error){
        console.log("User Profile props Response Error: " + error);
    }
};

const getMyPropIds = (myUserProfileProps: any, profilePropName: string) => {
    for (let userProp of myUserProfileProps){
        if (userProp.Key === profilePropName){
            return new Set(userProp.Value.split('|'));
        }
    }
};

const getUpdatedProfileIds = (listItems: any) =>{
    let updatedProfileValues = [];
    for (let listItem of listItems){
        if (!listItem.checked)
            updatedProfileValues.push(listItem.id.toString()) ;
    }
    return updatedProfileValues;
};

export const updateMyUserProfile = async (context: WebPartContext, listItems: any, profilePropName: string) =>{
    const updatedIds = getUpdatedProfileIds(listItems);

    const responseUrl = `${context.pageContext.web.absoluteUrl}/_api/SP.UserProfiles.PeopleManager/SetMultiValuedProfileProperty` ;

    let userData = {
        'accountName': "i:0#.f|membership|" + context.pageContext.user.email,
        'propertyName': profilePropName,
        'propertyValues': updatedIds
    },
    spOptions: ISPHttpClientOptions = {
        headers:{
            "Accept": "application/json;odata=nometadata", 
            "Content-Type": "application/json;odata=nometadata",
            "odata-version": "",
        },
        body: JSON.stringify(userData)
    };

    const _data = await context.spHttpClient.post(responseUrl, SPHttpClient.configurations.v1, spOptions);
    if (_data.ok){
        console.log('User Profile property '+profilePropName+' is updated!');
    }
};

