import { InjectManager, MedusaContext, MedusaService } from '@medusajs/framework/utils';
import { Context } from '@medusajs/framework/types';
import type { EntityManager } from '@mikro-orm/postgresql';
import {
  ProductReviewModel,
  ProductReviewImageModel,
  ProductReviewResponseModel,
  ProductReviewStatsModel,
} from './models';
import { ProductReviewStats } from './types';
interface CalculatedProductReviewStats {
  product_id: string;
  review_count: number;
  average_rating: number;
  rating_count_1: number;
  rating_count_2: number;
  rating_count_3: number;
  rating_count_4: number;
  rating_count_5: number;
}

export interface ModuleOptions {
  defaultReviewStatus?: 'pending' | 'approved' | 'flagged';
}

class ProductReviewService extends MedusaService({
  ProductReview: ProductReviewModel,
  ProductReviewImage: ProductReviewImageModel,
  ProductReviewResponse: ProductReviewResponseModel,
  ProductReviewStats: ProductReviewStatsModel,
}) {
  public readonly defaultReviewStatus: string

  constructor(container, options: ModuleOptions) {
    super(container, options);

    this.defaultReviewStatus = options?.defaultReviewStatus || 'approved';
  }

  async refreshProductReviewStats(productIds: string[], sharedContext?: Context): Promise<ProductReviewStats[]> {
    // MedusaService generates methods without 'es' suffix at runtime
    const service = this as any;
    const foundStats = await service.listProductReviewStats({ product_id: productIds });

    const calculatedStats = await this.calculateProductReviewStats(
      foundStats.map((s) => s.product_id),
      sharedContext,
    );

    const toUpdate = foundStats.map((s) => ({
      ...s,
      ...calculatedStats.find((c) => c.product_id === s.product_id),
    }));

    const upsertedStats = await service.updateProductReviewStats(toUpdate);

    return upsertedStats;
  }
  calculateProductReviewStats(productIds: string[], sharedContext?: Context): Promise<CalculatedProductReviewStats[]>;
  @InjectManager()
  async calculateProductReviewStats(
    productIds: string[],
    @MedusaContext() sharedContext: Context<EntityManager> & { manager: EntityManager },
  ): Promise<CalculatedProductReviewStats[]> {
    const SQL = `SELECT
    product_id,
    COUNT(*) AS review_count,
    AVG(rating::numeric) AS average_rating,
    SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) AS rating_count_1,
    SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) AS rating_count_2,
    SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) AS rating_count_3,
    SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) AS rating_count_4,
    SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) AS rating_count_5
    FROM product_review WHERE product_id IN (${productIds.map((id) => `'${id}'`).join(', ')}) AND status = 'approved' GROUP BY product_id`;

    const productReviewStats =
      await sharedContext.manager.execute<
        {
          product_id: string;
          review_count: number;
          average_rating: string;
          rating_count_1: number;
          rating_count_2: number;
          rating_count_3: number;
          rating_count_4: number;
          rating_count_5: number;
        }[]
      >(SQL);

    return productReviewStats.map((s) => ({
      ...s,
      average_rating: parseFloat(s.average_rating),
    }));
  }
}

export default ProductReviewService;
