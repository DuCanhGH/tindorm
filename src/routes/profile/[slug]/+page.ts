import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params }) => {
  const profile = await getProfile(params.slug);
  const reviews = await getReviews(params.slug);
  return { profile, reviews, userId: params.slug, canReview: canReview(params.slug) };

};

const getProfile = (id: string) => {
    return {
        name: "Alex",
        age: 27,
        gender: "Male",
        race: "Asian",
        location: "San Francisco, CA",
        inbox: [
          { id: "m1", name: "Jordan", message: "Hey, how are you?" },
          { id: "m2", name: "Taylor", message: "I'm good, thanks!" },
          { id: "m3", name: "Casey", message: "What are you up to?" }
        ],

        bio: "Hiking, coffee, and spontaneous weekend trips.",
        preferences: "Kind, curious, and loves live music.",
        interests: ["Hiking", "Photography", "Live Music", "Board Games"],
        images: [
          "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=1470&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1470&auto=format&fit=crop"
        ]
    }
}
const canReview = (id: string) => {
    return true;
}

const getReviews = (id: string) => {
    return [
        { id: "r1", user: "Jordan", rating: 5, text: "Super friendly and easy to talk to!" },
        { id: "r2", user: "Taylor", rating: 4, text: "Great conversation, would meet again." },
        { id: "r3", user: "Casey", rating: 5, text: "Fun, kind, and thoughtful. Highly recommend." }
    ]
}
