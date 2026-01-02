<template>
  <div class="px-4 py-6 sm:px-0">
    <div class="sm:flex sm:items-center mb-6">
      <div class="sm:flex-auto">
        <h1 class="text-3xl font-bold text-gray-900">Inventory Management</h1>
        <p class="mt-2 text-sm text-gray-700">Manage your product inventory</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          @click="showAddModal = true"
          class="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Add Product
        </button>
      </div>
    </div>

    <!-- Products Table -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="product in products" :key="product.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ product.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${{ product.price.toFixed(2) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <span :class="getStockClass(product.stock)">
                {{ product.stock }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusClass(product.stock)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ product.stock === 0 ? 'Out of Stock' : product.stock < 10 ? 'Low Stock' : 'In Stock' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="editProduct(product)"
                class="text-blue-600 hover:text-blue-900 mr-4"
              >
                Edit
              </button>
              <button
                @click="deleteProduct(product.id)"
                class="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="products.length === 0">
            <td colspan="6" class="px-6 py-4 text-center text-sm text-gray-500">No products found</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || editingProduct" class="fixed z-10 inset-0 overflow-y-auto" @click.self="closeModal">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
              {{ editingProduct ? 'Edit Product' : 'Add Product' }}
            </h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <input
                  v-model="productForm.name"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Product name"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Price</label>
                <input
                  v-model.number="productForm.price"
                  type="number"
                  step="0.01"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Stock</label>
                <input
                  v-model.number="productForm.stock"
                  type="number"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="saveProduct"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Save
            </button>
            <button
              @click="closeModal"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const products = ref([])
const showAddModal = ref(false)
const editingProduct = ref(null)

const productForm = ref({
  name: '',
  price: 0,
  stock: 0
})

function getStockClass(stock) {
  if (stock === 0) return 'text-red-600 font-semibold'
  if (stock < 10) return 'text-yellow-600 font-semibold'
  return 'text-gray-500'
}

function getStatusClass(stock) {
  if (stock === 0) return 'bg-red-100 text-red-800'
  if (stock < 10) return 'bg-yellow-100 text-yellow-800'
  return 'bg-green-100 text-green-800'
}

async function loadProducts() {
  try {
    const data = await $fetch('/api/product')
    products.value = data || []
  } catch (error) {
    console.error('Failed to load products:', error)
    products.value = []
  }
}

function editProduct(product) {
  editingProduct.value = product
  productForm.value = {
    name: product.name,
    price: product.price,
    stock: product.stock
  }
}

function closeModal() {
  showAddModal.value = false
  editingProduct.value = null
  productForm.value = { name: '', price: 0, stock: 0 }
}

async function saveProduct() {
  try {
    if (editingProduct.value) {
      await $fetch(`/api/product/${editingProduct.value.id}`, {
        method: 'PUT',
        body: productForm.value
      })
    } else {
      await $fetch('/api/product', {
        method: 'POST',
        body: productForm.value
      })
    }
    await loadProducts()
    closeModal()
  } catch (error) {
    console.error('Failed to save product:', error)
    alert(error.data?.error || 'Failed to save product')
  }
}

async function deleteProduct(id) {
  if (!confirm('Are you sure you want to delete this product?')) return
  
  try {
    await $fetch(`/api/product/${id}`, {
      method: 'DELETE'
    })
    await loadProducts()
  } catch (error) {
    console.error('Failed to delete product:', error)
    alert(error.data?.error || 'Failed to delete product')
  }
}

onMounted(() => {
  loadProducts()
})
</script>
