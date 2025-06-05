import { getStockColor, getValidityColor, formatDate, getValidityMessage } from '../../utils/productColors'

const ProductTable = ({ products }) => {
  return (
    <table className="min-w-full">
      <thead>
        {/* ...existing code... */}
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.name}</td>
            <td 
              className={`font-semibold ${getStockColor(
                product.stock,
                product.min_stock,
                product.notify_low_stock
              )}`}
              title={product.notify_low_stock ? `Mínimo: ${product.min_stock}` : ''}
            >
              {product.stock}
            </td>
            <td 
              className={`font-semibold ${getValidityColor(
                product.expiry_date,
                product.notify_before_expiry,
                product.days_before_expiry_notification
              )}`}
              title={getValidityMessage(
                product.expiry_date,
                product.days_before_expiry_notification
              )}
            >
              {formatDate(product.expiry_date)}
            </td>
            {/* ...existing code... */}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ProductTable