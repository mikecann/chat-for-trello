import * as React from "react";
import { observer, inject } from "mobx-react";
import { Menu, Grid, Image, Header } from "semantic-ui-react";
import { Socials } from "../../components/Socials";
import { Link } from "react-router-dom";
import { SidebarPremiumButton } from "./SidebarPremiumButton";

interface Props {
    location: Location;
}

@observer
export class Sidebar extends React.Component<Props, {}> {
    handleItemClick = () => {};

    render() {
        const location = this.props.location.pathname;

        return (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={{ marginTop: 10 }}>
                    <Grid verticalAlign="middle">
                        <Grid.Row>
                            <Grid.Column width={5}>
                                <Image
                                    src="images/logo-128x128.png"
                                    floated="right"
                                    width={64}
                                    style={{ marginLeft: 0 }}
                                />
                            </Grid.Column>
                            <Grid.Column width={11} style={{ padding: 0 }}>
                                <Header inverted as="h2" style={{ marginBottom: 0 }}>
                                    Chat for Trello
                                </Header>
                                <Header.Subheader style={{ color: "#67c7ff" }}>
                                    by Mike Cann (<Socials small />)
                                </Header.Subheader>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>

                <div style={{ marginTop: 20 }}>
                    <Menu pointing vertical size="huge">
                        <Menu.Item
                            as={Link}
                            to="/general"
                            name="general"
                            active={location === "/" || location === "/general"}
                            onClick={this.handleItemClick}
                        />
                        {/* <Menu.Item
                            as={Link}
                            to="/lists"
                            name="lists"
                            active={location === "/lists"}
                            onClick={this.handleItemClick}
                        /> */}
                        <Menu.Item
                            as={Link}
                            to="/logging"
                            name="logging"
                            active={location === "/logging"}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            as={Link}
                            to="/errors"
                            name="errors"
                            active={location === "/errors"}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            as={Link}
                            to="/suggest"
                            name="suggest"
                            active={location === "/suggest"}
                            onClick={this.handleItemClick}
                        />
                        <Menu.Item
                            as={Link}
                            to="/privacy"
                            name="privacy"
                            active={location === "/privacy"}
                            onClick={this.handleItemClick}
                        />
                    </Menu>
                </div>

                <div style={{ flex: 1 }} />

                <SidebarPremiumButton />
            </div>
        );
    }
}
