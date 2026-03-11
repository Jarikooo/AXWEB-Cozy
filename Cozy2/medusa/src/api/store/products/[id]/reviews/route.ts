import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import ReviewsModuleService from "../../../../../modules/reviews/service";
import { REVIEWS_MODULE } from "../../../../../modules/reviews";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
    const { id } = req.params; // Product ID

    if (!id) {
        res.status(400).json({ error: "Product ID is missing." });
        return;
    }

    try {
        const reviewsModule: ReviewsModuleService = req.scope.resolve(REVIEWS_MODULE);

        // Strictly fetch reviews matching the ID
        const reviews = await reviewsModule.listReviews({
            product_id: id,
        });

        res.status(200).json({ reviews });
    } catch (error: any) {
        console.error("[GET Reviews Error]:", error);
        res.status(500).json({ error: "Failed to fetch reviews." });
    }
}
