import * as React from "react";
import { storiesOf } from "@storybook/react";
import { SidebarPremiumButton } from "./SidebarPremiumButton";
import { AuthStore } from "../../auth/AuthStore";
import { MembershipStore } from "../../membership/MembershipStore";
import { SessionStore } from "../../session/SessionStore";
import StoryRouter from "storybook-react-router";

storiesOf("SidebarPremiumButton", module)
    .addDecorator(StoryRouter())
    .add("Default", () => {
        const auth: Partial<AuthStore> = {
            isAuthenticating: false
        };
        const membership: Partial<MembershipStore> = {};
        const session: Partial<SessionStore> = {};
        return (
            <div style={{ width: 400 }}>
                <SidebarPremiumButton
                    auth={auth as any}
                    membership={membership as any}
                    session={session as any}
                />
            </div>
        );
    });
