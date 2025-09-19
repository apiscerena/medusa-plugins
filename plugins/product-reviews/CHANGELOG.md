# Changelog

## [1.1.9] - 2025-09-19

### Fixed
- Fixed rating filter to properly handle string-to-number conversion using `z.coerce.number()`
- Ensures rating filter works correctly when receiving URL parameters

## [1.1.8] - 2025-09-19

### Fixed
- Implemented proper filter handling in admin API route
- Fixed date range filters by converting `created_at_gte/lte` to MikroORM operators
- Fixed search functionality to search across content, name, and email fields
- Added `$or` operator support for multi-field searching

## [1.1.7] - 2025-09-19

### Added
- Added official Medusa JS SDK integration alongside MedusaPluginsSDK
- Products are now fetched using official SDK for better compatibility

### Fixed
- Fixed product dropdown filter by using official Medusa SDK
- Fixed theme adaptation to use Medusa UI design tokens
- Updated all UI components to use proper dark theme tokens

### Changed
- SDK architecture now uses dual SDK approach:
  - MedusaPluginsSDK for review operations
  - Official Medusa SDK for product operations

## [1.1.6] - 1.1.0] - 2025-09-19

### Added
- Enhanced admin UI with advanced filtering capabilities:
  - Product filter dropdown
  - Status filter (Pending/Approved/Flagged)
  - Rating filter (1-5 stars)
  - Date range filters (From/To)
  - Search functionality
- Pagination system with 10 items per page
- Page number input for direct navigation
- Clear filters button

### Changed
- Redesigned admin review table with improved layout
- Migrated to Medusa UI components for consistency
- Improved table styling with proper theme integration

### Fixed
- Fixed admin module export structure
- Fixed widgets undefined error by properly compiling TypeScript to JavaScript
- Fixed module resolution issues in admin extensions

## Initial Features

- Product review management system
- Admin dashboard integration
- Review moderation (approve/flag/pending)
- Customer review submission
- Review response from merchants
- Image upload support for reviews
- Review statistics tracking
- Order verification for reviews