// React imports.
import React from "react";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Person from "@material-ui/icons/Person";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import NewContactIcon from "@material-ui/icons/ContactMail"

const ContactList = ({ state }) => (

  <List>

    {state.contacts.map(value => {
      return (
        <>
        <ListItem key={ value } button onClick={ () => state.showContact(value._id, value.name, value.email) }>
          <ListItemAvatar>
            <Avatar>
              <Person />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={ `${value.name}` } />
        </ListItem>
        
        </>
        
      );
    })}
        <Button variant="contained" color="primary" size="small" style={{ margin:10 }}
          onClick={ state.showAddContact } >
          <NewContactIcon style={{ marginRight:10 }} />Add Contact
        </Button>
  </List>

); 


export default ContactList;
