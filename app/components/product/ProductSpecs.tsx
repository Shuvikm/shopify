/**
 * @file ProductSpecs.tsx
 * @description Renders the product_specs Metaobject as a specification table.
 *
 * Shopify Admin Setup Required:
 * 1. Settings → Custom data → Metaobjects → Add definition
 *    Type: "product_specs" (handle: product_specs)
 *    Fields: any number of single-line text fields
 *    (e.g. Material, Weight, Dimensions, Country of Origin, etc.)
 * 2. Link the metaobject to a product:
 *    Product admin → Metafields → product_specs → pick the metaobject entry
 *
 * This component handles graceful fallback when no metaobject is linked.
 */
import type {MetaobjectField} from '~/graphql/ProductQuery';

interface ProductSpecsProps {
  /** Fields from metafield.reference.fields */
  fields: MetaobjectField[];
  title?: string;
}

/**
 * Human-readable key formatter.
 * e.g. "country_of_origin" → "Country of Origin"
 */
function formatKey(key: string): string {
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function ProductSpecs({fields, title = 'Product Specifications'}: ProductSpecsProps) {
  if (!fields.length) return null;

  return (
    <section className="mt-10" aria-labelledby="product-specs-heading">
      <h2
        id="product-specs-heading"
        className="text-lg font-semibold text-neutral-900 mb-4"
      >
        {title}
      </h2>
      <div className="rounded-xl border border-neutral-100 overflow-hidden">
        <table className="w-full text-sm" aria-label={title}>
          <tbody>
            {fields.map((field, idx) => (
              <tr
                key={field.key}
                className={idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}
              >
                <th
                  scope="row"
                  className="px-5 py-3 text-left font-medium text-neutral-500 w-40 whitespace-nowrap"
                >
                  {formatKey(field.key)}
                </th>
                <td className="px-5 py-3 text-neutral-800 font-medium">
                  {field.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
