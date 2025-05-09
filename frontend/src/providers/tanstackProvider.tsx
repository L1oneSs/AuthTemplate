'use client';

import { PropsWithChildren } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


export const TanstackProvider = ({ children }: PropsWithChildren) => {
	const queryCLient = new QueryClient();
	return (
		<QueryClientProvider client={queryCLient}>
			{children}
		</QueryClientProvider>
	);
};