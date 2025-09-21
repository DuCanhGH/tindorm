import { getReceivedMergeRequests, getSentMergeRequests } from "$lib/server/functions";
import { error } from "@sveltejs/kit";

export const load = async () => {
  const [left, right] = await Promise.all([getSentMergeRequests(), getReceivedMergeRequests()]);
  if (!left.ok) {
    error(left.code, left.message);
  }
  if (!right.ok) {
    error(right.code, right.message);
  }
  return { sent: left.data, received: right.data };
  // return {
  //     candidates: [
  //         { id: "u1", name: "Alex", age: 27, location: "San Francisco, CA", bio: "Hiking, coffee, and spontaneous weekend trips.", image: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=800&auto=format&fit=crop" },
  //         { id: "u2", name: "Sam", age: 24, location: "Austin, TX", bio: "Runner. Learner. Tacos enthusiast.", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop" },
  //         { id: "u3", name: "Riley", age: 29, location: "Seattle, WA", bio: "Music festivals and board games.", image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=800&auto=format&fit=crop" }
  //     ],
  //     rejects: [
  //         { id: "u4", name: "Jordan", age: 27, location: "San Francisco, CA", bio: "Crimnal", image: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=800&auto=format&fit=crop" },
  //     ]
  // };
};
