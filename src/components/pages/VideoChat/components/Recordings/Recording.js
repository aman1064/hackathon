import React from "react";
import GetAppIcon from '@material-ui/icons/GetApp';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';


const Recording = ({recording, playVideoHandler, downloadHandler}) => {
    return (
        <li>
            <span>{recording.createdAt}</span>
            <span onClick={playVideoHandler}>
                <PlayArrowIcon/>
            </span>
            <span onClick={downloadHandler}>
                <GetAppIcon/>
            </span>
            <a href={recording.url} target="_blank" rel="noopener noreferrer"><OpenInNewIcon/></a>
        </li>

    )
}

export default Recording;