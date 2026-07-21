import { useEffect } from "react";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";

export default function BackHandler() {

    useEffect(() => {

        // Only run on Android
        if (!Capacitor.isNativePlatform()) return;

        const listener = App.addListener("backButton", ({ canGoBack }) => {

            if (canGoBack) {
                window.history.back();
            } else {
                App.exitApp();
            }

        });

        return () => {
            listener.then(l => l.remove());
        };

    }, []);

    return null;
}