<script lang="ts">
	import { cn, type WithElementRef, type WithoutChildren, formBaseStyles, darkInputBg } from "$lib/utils.js";
	import type { HTMLTextareaAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		...restProps
	}: WithoutChildren<WithElementRef<HTMLTextareaAttributes>> = $props();
</script>

<textarea
	bind:this={ref}
	data-slot="textarea"
	class={cn(
		formBaseStyles,
		"min-h-16 px-3 py-2 text-base md:text-sm",
		darkInputBg,
		"field-sizing-content",
		className
	)}
	bind:value
	{...restProps}
></textarea>
