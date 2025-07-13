import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

/**
 * Common focus styles used across form components
 */
export const focusStyles = "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";

/**
 * Common invalid state styles for form validation
 */
export const invalidStyles = "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive";

/**
 * Common disabled styles
 */
export const disabledStyles = "disabled:cursor-not-allowed disabled:opacity-50";

/**
 * Common dark mode input background
 */
export const darkInputBg = "dark:bg-input/30";

/**
 * Common shadow utility
 */
export const shadowUtility = "shadow-xs";

/**
 * Common transition for form elements
 */
export const formTransition = "transition-[color,box-shadow]";

/**
 * Common card padding
 */
export const cardPadding = "px-6";

/**
 * Common base styles for form inputs
 */
export const formBaseStyles = cn(
	"border-input bg-background ring-offset-background placeholder:text-muted-foreground",
	"flex w-full min-w-0 rounded-md border px-3 py-2 text-sm outline-none",
	focusStyles,
	invalidStyles,
	disabledStyles,
	formTransition
);

/**
 * Common base styles for interactive elements (buttons, badges, etc.)
 */
export const interactiveBaseStyles = cn(
	"inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none transition-all",
	focusStyles,
	invalidStyles,
	disabledStyles,
	"[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0"
);

/**
 * Svelte Attachment to handle click outside of an element.
 * @param callback - The function to call when the click is outside the element.
 * @returns Svelte Attachment
 */
export function clickOutside(callback: () => void) {
  return (element: Element) => {
		const handleClick = (event: Event) => {
			// Don't trigger if clicking on an input, textarea, or select
			const target = event.target as HTMLElement;
			if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
				return;
			}
			
			if (!element.contains(<Node>event.target)) {
				callback();
			}
		};

		document.addEventListener('click', handleClick, true);

		return () => {
			document.removeEventListener('click', handleClick, true);
		};
	}
}