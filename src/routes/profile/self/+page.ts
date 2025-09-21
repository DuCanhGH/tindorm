 import type { PageLoad } from "./$types";

 export const load: PageLoad = async () => {
    return {
        name: "Alex",
        age: 27,
        location: "San Francisco, CA",
        bio: "Hiking, coffee, and spontaneous weekend trips.",
        inbox: [{id: "1", name: "John"}, {id: "2", name: "Jane"}],
        dateOfBirth: "1990-01-01",
        gender: "Male",
        race: "Asian",
        preferences: "I'm looking for a woman who is kind, intelligent, and has a good sense of humor.",
        interests: ["Hiking", "Photography", "Live Music", "Board Games"],
        images: [
          "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?q=80&w=1470&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1470&auto=format&fit=crop"
        ]
    }
 }
 
 
 