import type { RequestEvent } from "@sveltejs/kit";
import { form, getRequestEvent } from "$app/server";
import z from "zod";
import { db } from "$lib/server/db";
import { user, userRating } from "$lib/server/db/schema";

// export const review = form(z.object({ }), () => {
//   const { params } = getRequestEvent();
// //   params.slug;
//   rateRoomMate: async ({ request, locals }) => {
//     const formData = await request.formData();
//     const star = formData.get('star');
//     const review = formData.get('review');
//     const isRoomMate = formData.get('isRoomMate') === 'on';

//     try {
//       // Your database logic here
//       await userRating.insert(userRating).values({
//         userId: params.slug,
//         reviewerId: locals.user?.id, // get reviewerId
//         star: star,
//         review: review,
//         isRoommate: isRoomMate
//       });

//       return {
//         success: true,
//         message: 'Roommate rated successfully!',
//         data: {
//           rating: star,
//           review: review,
//           isRoommate: isRoomMate
//         }
//       };

//     } catch (error) {
//       return {
//         success: false,
//         error: 'Failed to submit rating'
//       };
//     }
//   }

// });

// Define the Zod schema for your form
const ratingSchema = z.object({
  star: z.string(), // optionally: z.coerce.number().min(0).max(5)
  review: z.string(),
  isRoomMate: z.string().optional(), // checkbox will be 'on' or undefined
});

// Create form handler
export const review = form(ratingSchema, async () => {
  const { params, request, locals } = getRequestEvent();

  const formData = await request.formData();
  const star = formData.get("star");
  const review = formData.get("review");
  const isRoomMate = formData.get("isRoomMate") === "on";

  try {
    await db.insert(userRating).values({
      userId: "", // Who is being rated
      reviewerId: locals.user?.id, // Who is rating
      star: Number(star), // make sure to coerce to number
      review: review!.toString(),
      isRoommate: isRoomMate,
    });

    return {
      ok: true,
      message: "Roommate rated successfully!",
      data: {
        rating: star,
        review,
        isRoommate: isRoomMate,
      },
    };
  } catch (error) {
    console.error("Rating error:", error);
    return {
      ok: false,
      error: "Failed to submit rating",
    };
  }
});
