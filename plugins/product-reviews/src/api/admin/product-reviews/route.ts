import type { AuthenticatedMedusaRequest, MedusaResponse } from '@medusajs/framework';

export const GET = async (req: AuthenticatedMedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve('query');

  // Process the filters to handle date range and search
  const filters: any = { ...req.filterableFields };

  // Handle date range filters
  if (filters.created_at_gte || filters.created_at_lte) {
    filters.created_at = {};
    if (filters.created_at_gte) {
      filters.created_at.$gte = filters.created_at_gte;
      delete filters.created_at_gte;
    }
    if (filters.created_at_lte) {
      filters.created_at.$lte = filters.created_at_lte;
      delete filters.created_at_lte;
    }
  }

  // Handle search query - search in content and customer name
  if (filters.q) {
    const searchTerm = filters.q;
    delete filters.q;
    filters.$or = [
      { content: { $like: `%${searchTerm}%` } },
      { name: { $like: `%${searchTerm}%` } },
      { email: { $like: `%${searchTerm}%` } }
    ];
  }

  const { data: product_reviews, metadata = { count: 0, skip: 0, take: 0 } } = await query.graph({
    entity: 'product_review',
    fields: req.queryConfig.fields,
    filters,
    pagination: req.queryConfig.pagination,
  });

  res.status(200).json({ product_reviews, count: metadata.count, offset: metadata.skip, limit: metadata.take });
};
