<script lang="ts">
	import { review } from "./form.remote";
	let formEl: HTMLFormElement;
	let rating = 0;
</script>

<!-- Dark background matching the official agreement style -->
<div class="min-h-screen bg-gradient-to-br from-zinc-900 via-neutral-900 to-black p-4">
	<div class="max-w-2xl mx-auto">
		<!-- Header section matching the official agreement -->
		<div class="mb-8">
			<div class="flex items-center gap-3 mb-4">
				<div class="w-8 h-8 bg-amber-600/20 rounded-lg flex items-center justify-center">
					<span class="text-amber-400 text-lg">🏠</span>
				</div>
				<h1 class="text-2xl font-bold text-white">Roommate Review</h1>
			</div>
			<div class="flex justify-between text-sm text-zinc-400">
				<span>Published: {new Date().toLocaleDateString('en-US', { 
					month: 'numeric', 
					day: 'numeric', 
					year: 'numeric',
					hour: 'numeric',
					minute: '2-digit',
					hour12: true
				})}</span>
				<span>0 reviews submitted</span>
			</div>
		</div>

		<!-- Main form container -->
		<form
			{...review}
			bind:this={formEl}
			class="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-6 space-y-8"
		>
			<!-- Rating Section -->
			<div class="space-y-4">
				<div class="flex items-center gap-2">
					<div class="w-2 h-2 bg-amber-400 rounded-full"></div>
					<h3 class="text-lg font-semibold text-white">Rating</h3>
				</div>
				
				<div class="pl-4">
					<label class="block">
						<span class="block text-sm text-zinc-300 mb-3">How would you rate your roommate?</span>
						<div class="flex gap-2">
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
									class="text-3xl cursor-pointer transition-all duration-200 hover:scale-110"
									class:text-amber-400={rating >= star}
									class:text-zinc-600={rating < star}
									class:drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]={rating >= star}
								>
									★
								</label>
							{/each}
						</div>
						{#if rating > 0}
							<div class="mt-2 text-xs text-zinc-400">
								{rating} out of 5 stars
							</div>
						{/if}
					</label>
				</div>
			</div>

			<!-- Review Section -->
			<div class="space-y-4">
				<div class="flex items-center gap-2">
					<div class="w-2 h-2 bg-amber-400 rounded-full"></div>
					<h3 class="text-lg font-semibold text-white">Review Details</h3>
				</div>
				
				<div class="pl-4 space-y-4">
					<label class="block">
						<span class="block text-sm text-zinc-300 mb-2">Share your experience</span>
						<textarea
							name="review"
							required
							rows="4"
							placeholder="Describe your roommate experience, living habits, cleanliness, respect for shared spaces, etc..."
							class="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-600/50 rounded-xl 
							       text-white placeholder-zinc-500 resize-none
							       focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400/50
							       transition-all duration-200"
						></textarea>
					</label>

					<!-- Roommate Verification -->
					<div class="bg-zinc-900/30 border border-zinc-600/30 rounded-xl p-4">
						<label class="flex items-start gap-3">
							<input
								name="isRoomMate"
								type="checkbox"
								class="mt-1 h-4 w-4 bg-zinc-800 border-zinc-600 rounded 
								       text-amber-400 focus:ring-amber-400/50 focus:ring-2"
								required
							/>
							<div>
								<span class="text-white font-medium">Roommate Verification</span>
								<p class="text-sm text-zinc-400 mt-1">
									I confirm that I am currently or was previously a roommate of the person I'm reviewing.
								</p>
							</div>
						</label>
					</div>
				</div>
			</div>

			<!-- Additional Information -->
			<div class="space-y-4">
				<div class="flex items-center gap-2">
					<div class="w-2 h-2 bg-amber-400 rounded-full"></div>
					<h3 class="text-lg font-semibold text-white">Additional Notes</h3>
				</div>
				
				<div class="pl-4">
					<div class="bg-zinc-900/20 border border-zinc-600/20 rounded-xl p-4">
						<p class="text-sm text-zinc-400 leading-relaxed">
							Your review will help future roommates make informed decisions. Please be honest and respectful in your feedback.
							All reviews are moderated and verified before publication.
						</p>
					</div>
				</div>
			</div>

			<!-- Submit Section -->
			<div class="pt-4 border-t border-zinc-700/50">
				<button
					type="submit"
					class="w-full py-3 px-6 bg-amber-500 hover:bg-amber-400 
					       text-black font-semibold rounded-xl
					       transform transition-all duration-200 
					       hover:scale-[1.02] hover:shadow-lg hover:shadow-amber-500/25
					       focus:outline-none focus:ring-4 focus:ring-amber-400/30
					       active:scale-[0.98]"
				>
					Submit Roommate Review
				</button>
			</div>

			<!-- Debug Output (styled to match the theme) -->
			{#if rating > 0}
				<div class="pt-4 border-t border-zinc-700/30">
					<div class="bg-zinc-900/20 rounded-lg p-3">
						<p class="text-xs text-zinc-500 text-center">
							Debug: Selected rating - {rating} star{rating === 1 ? '' : 's'}
						</p>
					</div>
				</div>
			{/if}
		</form>
	</div>
</div>

<style>
	/* Custom scrollbar for textarea */
	textarea::-webkit-scrollbar {
		width: 6px;
	}
	
	textarea::-webkit-scrollbar-track {
		background: rgba(39, 39, 42, 0.5);
		border-radius: 3px;
	}
	
	textarea::-webkit-scrollbar-thumb {
		background: rgba(113, 113, 122, 0.5);
		border-radius: 3px;
	}
	
	textarea::-webkit-scrollbar-thumb:hover {
		background: rgba(161, 161, 170, 0.7);
	}

	/* Enhanced star glow effect */
	label[for^="star"]:hover {
		filter: drop-shadow(0 0 12px rgba(251, 191, 36, 0.6));
	}

	/* Smooth transitions for all interactive elements */
	input, textarea, button {
		transition-property: all;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 200ms;
	}
</style>