import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import ReviewsModuleService from "../../../modules/reviews/service";
import { REVIEWS_MODULE } from "../../../modules/reviews";

export async function POST(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
    const { product_id, rating, title, content } = req.body as {
        product_id: string;
        rating: number;
        title: string;
        content: string;
    };

    // Ensure user is authenticated via store actor
    // This provides our core security against Slop spoofing
    const customerId = req.auth_context?.actor_id;

    if (!customerId) {
        res.status(401).json({ error: "Unauthorized: You must be logged in to leave a review." });
        return;
    }

    if (!product_id || !rating || rating < 1 || rating > 5) {
        res.status(400).json({ error: "Invalid review parameters." });
        return;
    }

    try {
        const reviewsModule: ReviewsModuleService = req.scope.resolve(REVIEWS_MODULE);

        // Verify if customer already reviewed this product
        const existingReviews = await reviewsModule.listReviews({
            product_id: product_id,
            customer_id: customerId
        });

        if (existingReviews.length > 0) {
            res.status(400).json({ error: "You have already reviewed this product." });
            return;
        }

        // Medusa generated service plural methods often return an array. We destructure to get the created review.
        const [review] = await reviewsModule.createReviews([{
            product_id: product_id,
            customer_id: customerId,
            rating: rating,
            title: title || "",
            content: content || "",
        }]);

        // Use core remote linking to securely attach the review to the product
        const remoteLink = req.scope.resolve(ContainerRegistrationKeys.REMOTE_LINK);
        await remoteLink.create({
            [REVIEWS_MODULE]: {
                id: review.id,
            },
            [Modules.PRODUCT]: {
                id: product_id,
            },
        });

        res.status(200).json({ review });
    } catch (error: any) {
        console.error("[POST Review Error]:", error);
        res.status(500).json({ error: error.message ? `Backend Error: ${error.message}` : "Failed to submit review." });
    }
}
