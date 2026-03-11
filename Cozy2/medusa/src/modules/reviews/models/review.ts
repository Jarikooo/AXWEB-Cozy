import { model } from "@medusajs/framework/utils"

export const Review = model.define("review", {
    id: model.id().primaryKey(),
    product_id: model.text(),
    customer_id: model.text(),
    rating: model.number(),
    title: model.text(),
    content: model.text(),
})
