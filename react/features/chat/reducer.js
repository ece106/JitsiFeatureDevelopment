// @flow

import { ReducerRegistry } from '../base/redux';

import {
    ADD_MESSAGE,
    CLEAR_MESSAGES,
    SET_PRIVATE_MESSAGE_RECIPIENT,
    TOGGLE_CHAT,
    TOGGLE_CENSOR
} from './actionTypes';

const DEFAULT_STATE = {
    isOpen: false,
    lastReadMessage: undefined,
    messages: [],
    privateMessageRecipient: undefined,
    isChatCensored: true
};

ReducerRegistry.register('features/chat', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
    case ADD_MESSAGE: {
        const newMessage = {
            displayName: action.displayName,
            error: action.error,
            id: action.id,
            messageType: action.messageType,
            message: action.message,
            privateMessage: action.privateMessage,
            recipient: action.recipient,
            timestamp: action.timestamp
        };

        // React native, unlike web, needs a reverse sorted message list.
        const messages = navigator.product === 'ReactNative'
            ? [
                newMessage,
                ...state.messages
            ]
            : [
                ...state.messages,
                newMessage
            ];

        return {
            ...state,
            lastReadMessage:
                action.hasRead ? newMessage : state.lastReadMessage,
            messages
        };
    }

    case CLEAR_MESSAGES:
        return {
            ...state,
            lastReadMessage: undefined,
            messages: []
        };

    case SET_PRIVATE_MESSAGE_RECIPIENT:
        return {
            ...state,
            isOpen: Boolean(action.participant) || state.isOpen,
            privateMessageRecipient: action.participant
        };

    case TOGGLE_CHAT:
        return {
            ...state,
            isOpen: !state.isOpen,
            lastReadMessage: state.messages[
                navigator.product === 'ReactNative' ? 0 : state.messages.length - 1],
            privateMessageRecipient: state.isOpen ? undefined : state.privateMessageRecipient
        };

    case TOGGLE_CENSOR:
        return {
            ...state,
            isChatCensored: !state.isChatCensored
        };
    }

    return state;
});
