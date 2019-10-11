import * as Sentry from "@sentry/browser";
import { isDevMode } from "./utils";

export function initSentry() {
    if (!isDevMode)
        Sentry.init({
            dsn: "https://afe8c574860d4ad7b0dfc4c1cf736dcf@sentry.io/1776318"
        });
}
