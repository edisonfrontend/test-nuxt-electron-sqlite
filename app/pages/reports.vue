<template>
  <div class="px-4 py-6 sm:px-0">
    <div class="sm:flex sm:items-center mb-6">
      <div class="sm:flex-auto">
        <h1 class="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p class="mt-2 text-sm text-gray-700">View detailed reports and analytics</p>
      </div>
      <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
        <button
          @click="exportReport"
          class="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
        >
          Export Report
        </button>
      </div>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-8">
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
                <dt class="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                <dd class="text-lg font-medium text-gray-900">${{ reportData.totalRevenue.toFixed(2) }}</dd>
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
                <dd class="text-lg font-medium text-gray-900">{{ reportData.totalOrders }}</dd>
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                <dd class="text-lg font-medium text-gray-900">{{ reportData.totalProducts }}</dd>
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Avg Order Value</dt>
                <dd class="text-lg font-medium text-gray-900">${{ reportData.avgOrderValue.toFixed(2) }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Top Products -->
    <div class="bg-white shadow rounded-lg mb-8">
      <div class="px-4 py-5 sm:p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Top Selling Products</h2>
        <div class="overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity Sold</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="product in reportData.topProducts" :key="product.product_id">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ product.product_name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ product.total_quantity }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${{ product.total_revenue.toFixed(2) }}</td>
              </tr>
              <tr v-if="reportData.topProducts.length === 0">
                <td colspan="3" class="px-6 py-4 text-center text-sm text-gray-500">No data available</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Sales by Date -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Sales by Date</h2>
        <div class="overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(sales, date) in reportData.salesByDate" :key="date">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ date }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ sales.orders }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${{ sales.revenue.toFixed(2) }}</td>
              </tr>
              <tr v-if="Object.keys(reportData.salesByDate).length === 0">
                <td colspan="3" class="px-6 py-4 text-center text-sm text-gray-500">No data available</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const reportData = ref({
  totalRevenue: 0,
  totalOrders: 0,
  totalProducts: 0,
  avgOrderValue: 0,
  topProducts: [],
  salesByDate: {}
})

async function loadReport() {
  try {
    const data = await $fetch('/api/reports')
    reportData.value = data || {
      totalRevenue: 0,
      totalOrders: 0,
      totalProducts: 0,
      avgOrderValue: 0,
      topProducts: [],
      salesByDate: {}
    }
  } catch (error) {
    console.error('Failed to load report:', error)
  }
}

function exportReport() {
  const dataStr = JSON.stringify(reportData.value, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `report-${new Date().toISOString().split('T')[0]}.json`
  link.click()
  URL.revokeObjectURL(url)
}

onMounted(() => {
  loadReport()
})
</script>
