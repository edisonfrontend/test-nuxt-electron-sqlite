<template>
  <div class="px-4 py-6 sm:px-0">
    <div class="border-4 border-dashed border-gray-200 rounded-lg p-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <!-- Quick Stats -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.totalProducts }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.totalOrders }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Low Stock Items</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.lowStockItems }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Products -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Recent Products</h2>
          <div class="overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="product in recentProducts" :key="product.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ product.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${{ product.price.toFixed(2) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span :class="product.stock < 10 ? 'text-red-600 font-semibold' : 'text-gray-500'">
                      {{ product.stock }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      @click="buyProduct(product)"
                      :disabled="product.stock <= 0"
                      class="text-blue-600 hover:text-blue-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      Buy
                    </button>
                  </td>
                </tr>
                <tr v-if="recentProducts.length === 0">
                  <td colspan="4" class="px-6 py-4 text-center text-sm text-gray-500">No products found</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const stats = ref({
  totalProducts: 0,
  totalOrders: 0,
  lowStockItems: 0
})

const recentProducts = ref([])

async function loadStats() {
  try {
    const [productsData, ordersData] = await Promise.all([
      $fetch('/api/product'),
      $fetch('/api/orders')
    ])
    
    stats.value.totalProducts = productsData?.length || 0
    stats.value.totalOrders = ordersData?.length || 0
    stats.value.lowStockItems = productsData?.filter(p => p.stock < 10).length || 0
    recentProducts.value = (productsData || []).slice(0, 5)
  } catch (error) {
    console.error('Failed to load stats:', error)
  }
}

async function buyProduct(product) {
  try {
    if (product.stock <= 0) {
      alert('Out of stock!')
      return
    }
    await $fetch('/api/orders', {
      method: 'POST',
      body: { product_id: product.id, quantity: 1 }
    })
    await loadStats()
  } catch (error) {
    console.error('Failed to buy product:', error)
    alert(error.data?.error || 'Failed to buy product')
  }
}

onMounted(() => {
  loadStats()
})
</script>