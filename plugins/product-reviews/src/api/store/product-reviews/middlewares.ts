import { type MiddlewareRoute, validateAndTransformBody, validateAndTransformQuery } from '@medusajs/framework';
import { createFindParams, createOperatorMap } from '@medusajs/medusa/api/utils/validators';
import { z } from 'zod';
import { ProductReview } from '../../../modules/product-review/types/common';
import { QueryConfig } from '@medusajs/types';

const reviewStatuses = z.enum(['pending', 'approved', 'flagged'])

export const listStoreProductReviewsQuerySchema = createFindParams({
  offset: 0,
  limit: 50,
}).merge(
  z.object({
    id: z.union([z.string(), z.array(z.string())]).optional(),
    status: z.union([reviewStatuses, z.array(reviewStatuses)]).optional(),
    product_id: z.union([z.string(), z.array(z.string())]).optional(),
    order_id: z.union([z.string(), z.array(z.string())]).optional(),
    rating: z.union([z.number().max(5).min(1), z.array(z.number().max(5).min(1))]).optional(),
    created_at: createOperatorMap().optional(),
    updated_at: createOperatorMap().optional(),
  }),
);

export const upsertProductReviewsSchema = z.object({
  reviews: z.array(
    z.object({
      order_id: z.string(),
      order_line_item_id: z.string(),
      rating: z.number().max(5).min(1),
      content: z.string(),
      images: z.array(z.object({ url: z.string() })),
    }),
  ),
});

export type UpsertProductReviewsSchema = z.infer<typeof upsertProductReviewsSchema>;

export const defaultStoreProductReviewFields = [
  'id',
  'status',
  'product_id',
  'variant_id',  // Added to include variant_id by default
  'name',
  'rating',
  'content',
  'created_at',
  'updated_at',
  'response.*',
  'images.*'
  // Removed variant relation fields - link not working yet
];

export const allowedStoreProductReviewFields = [
  'id',
  'status',
  'product_id',
  'variant_id',  // Allow variant_id in queries
  'name',
  'rating',
  'content',
  'created_at',
  'updated_at',
  'response',
  'images',
  'product.*'
  // Note: variant.* removed as relation isn't set up yet - using variant_sku enrichment instead
];

export const defaultStoreReviewsQueryConfig: QueryConfig<ProductReview> = {
  allowed: [...allowedStoreProductReviewFields],
  defaults: [...defaultStoreProductReviewFields],
  defaultLimit: 50,
  isList: true,
};

export const storeProductReviewRoutesMiddlewares: MiddlewareRoute[] = [
  {
    matcher: '/store/product-reviews',
    method: 'GET',
    middlewares: [validateAndTransformQuery(listStoreProductReviewsQuerySchema, defaultStoreReviewsQueryConfig)],
  },
  {
    matcher: '/store/product-reviews',
    method: 'POST',
    middlewares: [validateAndTransformBody(upsertProductReviewsSchema)],
  },
];
