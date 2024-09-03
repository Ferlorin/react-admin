import * as React from 'react';
import { AuthProvider } from '../types';
import { CoreAdminContext } from '../core';
import { useCanAccess, UseCanAccessResult } from './useCanAccess';
import { QueryClient } from '@tanstack/react-query';

export default {
    title: 'ra-core/auth/useCanAccess',
};

const UseCanAccess = ({
    children,
    action,
    resource,
    record,
}: {
    children: any;
    action: string;
    resource: string;
    record?: unknown;
}) => {
    const res = useCanAccess({
        action,
        resource,
        record,
        retry: false,
    });

    return children(res);
};

const StateInpector = (state: UseCanAccessResult) => (
    <div>
        <span>{state.isPending && 'LOADING'}</span>
        {state.canAccess !== undefined && (
            <span>isAccessible: {state.canAccess ? 'YES' : 'NO'}</span>
        )}
        <span>{state.error && 'ERROR'}</span>
    </div>
);

const defaultAuthProvider: AuthProvider = {
    login: () => Promise.reject('bad method'),
    logout: () => Promise.reject('bad method'),
    checkAuth: () => Promise.reject('bad method'),
    checkError: () => Promise.reject('bad method'),
    getPermissions: () => Promise.reject('bad method'),
    canAccess: ({ action }) => Promise.resolve(action === 'read'),
};

export const Basic = ({
    authProvider = defaultAuthProvider,
    queryClient,
}: {
    authProvider?: AuthProvider | null;
    queryClient?: QueryClient;
}) => (
    <CoreAdminContext
        authProvider={authProvider != null ? authProvider : undefined}
        queryClient={queryClient}
    >
        <UseCanAccess action="read" resource="test">
            {StateInpector}
        </UseCanAccess>
    </CoreAdminContext>
);