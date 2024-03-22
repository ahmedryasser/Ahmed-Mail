import React from "react";
import Button from "@material-ui/core/Button";
import NewContactIcon from "@material-ui/icons/ContactMail";
import NewMessageIcon from "@material-ui/icons/Email";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

const Toolbar = ({ state }) => (

  <div>
    <IconButton style={{height: 50}} onClick={() => state.toggleMailboxList()}>
      <MenuIcon />
    </IconButton>
    <Button variant="contained" color="primary" size="small" style={{ marginRight:10 }}
      onClick={ () => state.showComposeMessage("new") } >
      <NewMessageIcon style={{ marginRight:10 }} />Compose
    </Button>
  </div>

);

export default Toolbar;
