import React from "react";
import Chip from "@material-ui/core/Chip";
import List from "@material-ui/core/List";
import Drawer from "material-ui/Drawer";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

const MailboxList = ({ state }) => (
  <List style={{display: "flex", flexDirection: "column"}}>
    <IconButton style={{height: 50}} onClick={() => state.toggleMailboxList()}>
        <MenuIcon />
      </IconButton>
    { state.mailboxes.map(value => {
      return (
        <Chip label={ `${value.name}` } onClick={ () => state.setCurrentMailbox(value.path) }
          style={{ width:128, marginBottom:10, display:"flex", flexDirection: "row"}}
          color={ state.currentMailbox === value.path ? "secondary" : "primary" } />
      );
     } ) }
  </List>
); 

    export default MailboxList;