<script lang="ts">
  import ProfileCard from "$components/ProfileCard.svelte";
  import UserHeader from "$components/UserHeader.svelte";
  import ReviewSection from "$components/ReviewSection.svelte";
  import { notify } from "$lib/store/notify";
  import type { PageProps } from "./$types";
  import { sendMergeRequest } from "./$fn.remote";
  type Profile = {
    name: string;
    age: number;
    gender: string;
    race: string;

    location: string;
    bio: string;
    interests: string[];
    preferences: string;
    images: string[];
  };

  type Review = { id: string; user: string; rating: number; text: string };

  let { data, params }: PageProps = $props();
  let profile = data.profile as Profile;
  let reviews = data.reviews as Review[];
  let canReview = data.canReview as boolean;
  let userId = data.userId as string;
</script>

<UserHeader />

<div class="mx-auto my-8 grid w-full max-w-6xl grid-cols-1 gap-8 px-4 md:grid-cols-2">
  <!-- Left: Tinder-style profile card -->
  <ProfileCard {profile} />

  <!-- Right: Read-only profile details (single pane) -->
  <div class="flex h-[70vh] flex-col rounded-2xl bg-white p-4 shadow">
    <div class="min-h-0 flex-1 space-y-6 overflow-y-auto rounded-xl border border-gray-100 p-4">
      <!-- About -->
      <section>
        <h2 class="mb-2 text-sm font-semibold text-gray-600">About</h2>
        <div class="grid grid-cols-1 gap-3">
          <div>
            <p class="text-xs font-medium text-gray-600">Name</p>
            <p class="text-gray-900">{profile.name}</p>
          </div>
          <div>
            <p class="text-xs font-medium text-gray-600">Gender</p>
            <p class="text-gray-900">{profile.gender}</p>
          </div>
          <div>
            <p class="text-xs font-medium text-gray-600">Race</p>
            <p class="text-gray-900">{profile.race}</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-xs font-medium text-gray-600">Age</p>
              <p class="text-gray-900">{profile.age}</p>
              <p class="text-xs font-medium text-gray-600">Location</p>
              <p class="text-gray-900">{profile.location}</p>
              <p class="text-xs font-medium text-gray-600">Bio</p>
              <p class="text-gray-900">{profile.bio}</p>
            </div>
          </div>
        </div>
      </section>

      <hr class="border-gray-100" />

      <!-- Interests -->
      <section>
        <h2 class="mb-2 text-sm font-semibold text-gray-600">Interests</h2>
        <div class="flex flex-wrap gap-2">
          {#each profile.interests as tag}
            <span class="rounded-full bg-pink-50 px-3 py-1 text-sm text-pink-600 ring-1 ring-pink-200">{tag}</span>
          {/each}
        </div>
      </section>

      <hr class="border-gray-100" />

      <!-- Preferences -->
      <section>
        <h2 class="mb-2 text-sm font-semibold text-gray-600">Preferences</h2>
        <p class="leading-relaxed text-gray-800">{profile.preferences}</p>
      </section>
    </div>

    <!-- Bottom CTA -->
    <div>
      <form
        class="mt-4 flex justify-end"
        {...sendMergeRequest.enhance(async ({ form, submit }) => {
          try {
            await submit();
            form.reset();
            notify.push("Match request sent", "success");
          } catch {
            notify.push("Could not send request", "error");
          }
        })}
      >
        <input name="toUser" type="hidden" value={params.slug} />
        <button type="submit" class="rounded-full bg-red-500 px-5 py-2 text-white shadow transition hover:bg-red-600"> Request match </button>
      </form>
      <a href = "/rating" class="rounded-full bg-red-500 px-5 py-2 text-white shadow transition hover:bg-red-600">Add Review</a>
    </div> 
  </div>
  <ReviewSection {reviews} />
</div>
