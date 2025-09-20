<script lang="ts">
	import { review } from "./form.remote";
</script>

<form {...review}>
	<label>
		Rating
		<input name="star" type="number" min="0" max="5" step="1" placeholder="Rate from 0 to 5" autocomplete="off" required>
	</label>
	<label>
		Your review
		<input name="review" type="text" autocomplete="off" required>
	</label>
    <label>
        Are you his/her room mate
        <input name="isRoomMate" type="checkbox" />
    </label>
	<button>Rate my Buddy</button>
</form>