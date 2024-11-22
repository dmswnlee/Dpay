import { useBreakpointValue } from '@chakra-ui/react';

interface BreakpointValues<T> {
	base: T;
	md?: T;
	lg?: T;
}

export const useResponsiveOverlay = (widthValues: BreakpointValues<string>, heightValues: BreakpointValues<string>) => {
	const overlayWidth = useBreakpointValue(widthValues);
	const overlayHeight = useBreakpointValue(heightValues);

	return { overlayWidth, overlayHeight };
};
