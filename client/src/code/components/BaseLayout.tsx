import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Toolbar from "./Toolbar";
import MailboxList from "./MailboxList";
import MessageList from "./MessageList";
import ContactList from "./ContactList";
import WelcomeView from "./WelcomeView";
import ContactView from "./ContactView";
import MessageView from "./MessageView";
import { createState } from "../state";
import { Height } from "@material-ui/icons";


class BaseLayout extends Component {

    //calls the state function we created in state.ts

  state = createState(this);

  render() {
    return (
     <div className="appContainer">
      <Dialog open={ this.state.pleaseWaitVisible } disableBackdropClick={ true } disableEscapeKeyDown={ true }
        transitionDuration={ 0 }>
        <DialogTitle style={{ textAlign:"center" }}>Please Wait</DialogTitle>
        <DialogContent><DialogContentText>...Contacting server...</DialogContentText></DialogContent>
      </Dialog>
       <div className="toolbar"><Toolbar state={ this.state } /></div>
               <Drawer open={this.state.mailBoxVisible}><div className="mailboxList"><MailboxList state={ this.state } /></div></Drawer>
       
       <div className="centerArea">
        <div className="messageList"><MessageList state={ this.state } /></div>
        <div className="centerViews">
          { this.state.currentView === "welcome" && <WelcomeView /> }
          { (this.state.currentView === "message" || this.state.currentView === "compose") &&
            <MessageView state={ this.state } />
          }
          { (this.state.currentView === "contact" || this.state.currentView === "contactAdd") &&
            <ContactView state={ this.state } />
          }
        </div>
       </div>
       <div className="contactList"><ContactList state={ this.state } /></div>
     </div>
    );
  } 
} 
export default BaseLayout;
