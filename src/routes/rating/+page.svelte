<script lang="ts">
	import { review } from "./form.remote";
	let formEl: HTMLFormElement;
	let rating = 0;
</script>

<form
	{...review}
	bind:this={formEl}
	class="max-w-md mx-auto p-6 rounded-2xl
	       bg-gradient-to-br from-black via-zinc-900 to-neutral-900
	       shadow-[0_0_50px_rgba(255,215,0,0.06)]
	       border border-yellow-500/20 backdrop-blur-md
	       text-white space-y-6"
>
	<!-- Header -->
	<h2
		class="text-3xl font-bold text-yellow-400 text-center tracking-wide"
		style="text-shadow: 0 0 2px rgba(255, 215, 0, 0.3);"
	>
		Rate My Buddy
	</h2>

	<!-- Star Rating -->
	<label class="block">
		<span class="block text-base font-semibold text-yellow-300 mb-2">Your Rating</span>
		<div class="flex justify-center gap-1.5">
			{#each [1, 2, 3, 4, 5] as star}
				<input
					type="radio"
					id="star{star}"
					name="star"
					value="{star}"
					bind:group={rating}
					class="hidden"
					required
				/>
				<label
					for="star{star}"
					class="text-4xl cursor-pointer transition transform duration-200 ease-in-out select-none hover:scale-110"
					class:text-yellow-400={rating >= star}
					class:text-yellow-100={rating < star}
					style="text-shadow: 0 0 6px rgba(255, 215, 0, 0.4);"
					title="{star} star{star > 1 ? 's' : ''}"
				>
					★
				</label>
			{/each}
		</div>
	</label>

	<!-- Review Text -->
	<label class="block">
		<span class="block text-sm font-semibold text-yellow-300 mb-1.5">Your Review</span>
		<textarea
			name="review"
			required
			rows="3"
			placeholder="Write your thoughts here..."
			class="w-full px-3 py-2 rounded-lg bg-black/60 text-yellow-100 placeholder-yellow-100/50
			       border border-yellow-500/30 focus:outline-none focus:ring-2 focus:ring-yellow-400
			       shadow-inner resize-none transition duration-300 ease-in-out"
		></textarea>
	</label>

	<!-- Roommate Checkbox -->
	<label class="flex items-center gap-2 mt-1">
		<input
			name="isRoomMate"
			type="checkbox"
			class="form-checkbox h-4 w-4 rounded bg-black border-yellow-400/50 text-yellow-400
			       focus:ring-2 focus:ring-yellow-300 transition"
			required
		/>
		<span class="text-yellow-200 text-sm">Yes, I’m their roommate</span>
	</label>

	<!-- Submit Button -->
	<button
		type="submit"
		class="w-full py-2.5 px-5 rounded-xl bg-yellow-400 text-black font-medium text-base tracking-wide
		       hover:bg-yellow-300 active:scale-95 transition-all duration-300 shadow-md
		       hover:shadow-yellow-400/40 focus:outline-none focus:ring-4 focus:ring-yellow-200"
	>
		Submit Review
	</button>

	<!-- Debug Output -->
	<p class="text-center text-xs text-yellow-300/70 italic">
		Selected rating: {rating} star{rating === 1 ? '' : 's'}
	</p>
</form>
