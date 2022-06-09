import * as React from 'react';
import styles from './QuickLinks.module.scss';
import { IQuickLinksProps } from './IQuickLinksProps';
import ILinks from './ILinks/ILinks';
import { getListItems, updateMyUserProfile } from '../Services/DataRequests';
import { TextField, PrimaryButton, DefaultButton, ActionButton } from 'office-ui-fabric-react';

export default function QuickLinks (props: IQuickLinksProps) {

  const [quickLinks, setQuickLinks] = React.useState([]);
  const [searchTxt, setSearchTxt] = React.useState('');
  const [editEnabled, setEditEnabled] = React.useState(false);

  const editText = editEnabled ? props.okTxt : props.editTxt;
  
  const editHander = () =>{
    setEditEnabled(prev => !prev);
    if (editEnabled){
        updateHandler();
    }
  };

  React.useEffect(()=>{
    getListItems(props.context, props.linksListUrl, props.linksListName, props.userProfileProp).then(results => {
      setQuickLinks(results);
    });
  }, []);

  const linkChkHander = (ev: React.MouseEvent<HTMLElement>, checked: boolean, itemId: string) => {
    setQuickLinks(prevState => {
      return prevState.map(prevItem => {
        const updatedItem = {...prevItem};
        if (updatedItem.id === itemId){
          updatedItem.checked = !updatedItem.checked;
          updatedItem.pending = true;
        }
        return {...updatedItem};
      });
    });
  };

  const updateHandler = () => {
    updateMyUserProfile(props.context, quickLinks, props.userProfileProp);
  };
  const discardHandler = () => {
    setEditEnabled(prev => !prev);
    setQuickLinks(prev => {
      const origLinks = prev.map(item => {
        if (item.pending) {
          item.checked = !item.checked;
          item.pending = false;
        }
        return item;
      });
      return [...origLinks];
    });
  };

  return (
		<div className={styles.quickLinks}>
			<div className={styles.linksHdrOps}>
				<TextField
					onChange={(_: any, text: string) => setSearchTxt(text)}
					className={styles.linksHdrTxt}
					label={props.wpTitle}
					underlined
					placeholder='Search'
          value={searchTxt}
				/>
				<div className={styles.linksHdrBtn}>
          <ActionButton onClick={editHander} iconProps={{iconName: editEnabled ? 'Save' : 'Edit'}}>{editText}</ActionButton>
          {editEnabled &&
            <ActionButton onClick={discardHandler} iconProps={{iconName: 'Unsubscribe'}}>{props.cancelTxt}</ActionButton>
          }
				</div>
			</div>

			<ILinks
				linksTitle={props.wpTitle}
				linksEditText='Edit'
				linksItems={quickLinks}
				linkChkHander={linkChkHander}
				updateHandler={updateHandler}
				editEnabled={editEnabled}
        searchTxt = {searchTxt}
			/>
		</div>
  );
  
}
