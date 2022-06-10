import * as React from "react";
import ILinksProps from "./ILinksProps";
import styles from '../QuickLinks.module.scss';
import {Toggle} from 'office-ui-fabric-react';

export default function ILinks(props: ILinksProps) {

    const filteredLinkItems = 
                            props.searchTxt ? 
                                (props.linksItems ? props.linksItems.filter(item => item.title.toLowerCase().indexOf(props.searchTxt) >= 0) : []) 
                            : props.linksItems;

	return (
        <div className={styles.linkCntnr}>
            {filteredLinkItems.map((linkItem: any) => {
                return(
                    <>
                        {props.editEnabled ?
                            <div className={styles.toggleNdTxt} key={linkItem.id}>
                            {props.editEnabled &&
                                <Toggle 
                                    className={linkItem.checked ? styles.toggleBtnChk : styles.toggleBtnUnChk} 
                                    checked={linkItem.checked} 
                                    onChange={(ev, checked) => props.linkChkHander(ev, checked, linkItem.id)}
                                />
                            }
                            <a 
                                className={linkItem.checked ? styles.linkChk : styles.linkUnChk}
                                key={linkItem.id} 
                                target='_blank'
                                data-interception="off"
                                href={linkItem.url}>
                                {linkItem.title}
                            </a>
                        </div>
                        :
                        <>
                            {linkItem.checked &&
                                <div className={styles.toggleNdTxt} key={linkItem.id}>
                                    <a 
                                        className={styles.linkChk}
                                        key={linkItem.id} 
                                        target='_blank'
                                        data-interception="off"
                                        href={linkItem.url}>
                                        {linkItem.title}
                                    </a>
                                </div>
                            }
                        </>
                        }
                    </>
                    
                );
            })}
        </div>
	);
}
