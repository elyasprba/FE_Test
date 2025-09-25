"use client";

import { unstableSetRender } from "antd";
import { createRoot, Root } from "react-dom/client";

unstableSetRender((node, container) => {
    const el = container as Element & { _reactRoot?: Root };

    el._reactRoot ||= createRoot(el);
    const root = el._reactRoot;
    root.render(node);

    return async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
        root.unmount();
    };
});

export default function AntdPatch() {
    return null;
}
