"use client";

import React, { createContext, useContext } from "react";
import { message } from "antd";

type MessageContextType = {
    success: (content: string) => void;
    error: (content: string) => void;
    warning: (content: string) => void;
};

const MessageContext = createContext<MessageContextType | null>(null);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [messageApi, contextHolder] = message.useMessage();

    const value: MessageContextType = {
        success: (content) => messageApi.success(content),
        error: (content) => messageApi.error(content),
        warning: (content) => messageApi.warning(content),
    };

    return (
        <MessageContext.Provider value={value}>
            {contextHolder}
            {children}
        </MessageContext.Provider>
    );
};

export const useMessageGlobal = () => {
    const ctx = useContext(MessageContext);
    if (!ctx) throw new Error("useMessageGlobal must be used inside MessageProvider");
    return ctx;
};

export default MessageProvider;