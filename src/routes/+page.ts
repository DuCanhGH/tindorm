import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params }) => {
  return {
    profiles: [
    {
      id: "1",
      name: "Alex",
      age: 27,
      bio: "Coffee addict. Weekend hiker. Amateur photographer.",
      image: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=1470&auto=format&fit=crop",
    },
    {
      id: "2",
      name: "Sam",
      age: 24,
      bio: "Runner. Learner. Looking for the best tacos in town.",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1470&auto=format&fit=crop",
    },
    {
      id: "3",
      name: "Riley",
      age: 29,
      bio: "Music festivals and board games.",
      image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=1470&auto=format&fit=crop",
    },
  ]
  }
};
