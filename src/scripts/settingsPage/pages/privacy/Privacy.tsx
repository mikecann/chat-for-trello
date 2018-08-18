import * as React from "react";
import { observer, inject } from "mobx-react";
import { Segment } from "semantic-ui-react";
import { Page } from "../../components/Page";
import { ILogger } from "../../../lib/logging/types";
import marked = require("marked");

interface Props {
    logger?: ILogger;
    location: Location;
}

const content = `
# Chat for Trello Privacy Policy

This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from ChatForTrello (the “Site”).

### PERSONAL INFORMATION WE COLLECT

When you visit the Site, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. Additionally, as you browse the Site, we collect information about the individual web pages or products that you view, what websites or search terms referred you to the Site, and information about how you interact with the Site. We refer to this automatically-collected information as “Device Information.”

We collect Device Information using the following technologies:

    
+ “Log files” track actions occurring on the Site, and collect data including your IP address, browser type, Internet service provider, referring/exit pages, and date/time stamps.
+ “Web beacons,” “tags,” and “pixels” are electronic files used to record information about how you browse the Site.

When we talk about “Personal Information” in this Privacy Policy, we are talking both about Device Information and Order Information.

### SHARING YOUR PERSONAL INFORMATION

We may share your Personal Information to comply with applicable laws and regulations, to respond to a subpoena, search warrant or other lawful request for information we receive, or to otherwise protect our rights.

### DO NOT TRACK

Please note that we do not alter our Site’s data collection and use practices when we see a Do Not Track signal from your browser.

### YOUR RIGHTS

If you are a European resident, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted. If you would like to exercise this right, please contact us through the contact information below.

Additionally, if you are a European resident we note that we are processing your information in order to fulfill contracts we might have with you (for example if you make an order through the Site), or otherwise to pursue our legitimate business interests listed above.  Additionally, please note that your information will be transferred outside of Europe, including to Canada and the United States.

### DATA RETENTION

We will maintain your information for our records unless and until you ask us to delete this information.

### CHANGES

We may update this privacy policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal or regulatory reasons.

### CONTACT US

For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at mike@cannstudios.com or by mail using the details provided below:

21 Ashworth Way, Newport, SHR, TF107EG, United Kingdom
`;

@inject("logger")
@observer
export class Privacy extends React.Component<Props, {}> {
    rawMarkup() {
        var rawMarkup = marked(content, { sanitize: true });
        return { __html: rawMarkup };
    }

    render() {
        return (
            <Page location={this.props.location}>
                <Segment>
                    <div dangerouslySetInnerHTML={this.rawMarkup()} />
                </Segment>
            </Page>
        );
    }
}
