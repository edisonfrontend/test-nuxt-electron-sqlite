<template>
  <div class="px-4 py-6 sm:px-0">
    <div class="sm:flex sm:items-center mb-6">
      <div class="sm:flex-auto">
        <h1 class="text-3xl font-bold text-gray-900">Order Management</h1>
        <p class="mt-2 text-sm text-gray-700">View and manage all orders</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white shadow rounded-lg p-4 mb-6">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label class="block text-sm font-medium text-gray-700">Date From</label>
          <input
            v-model="filters.dateFrom"
            type="date"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Date To</label>
          <input
            v-model="filters.dateTo"
            type="date"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
        <div class="flex items-end">
          <button
            @click="applyFilters"
            class="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="order in orders" :key="order.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{{ order.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ order.product_name || 'N/A' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.quantity }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${{ (order.unit_price || 0).toFixed(2) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              ${{ ((order.unit_price || 0) * order.quantity).toFixed(2) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ formatDate(order.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="deleteOrder(order.id)"
                class="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="orders.length === 0">
            <td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500">No orders found</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Summary -->
    <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
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
                <dd class="text-lg font-medium text-gray-900">{{ summary.totalOrders }}</dd>
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
                <dt class="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                <dd class="text-lg font-medium text-gray-900">${{ summary.totalRevenue.toFixed(2) }}</dd>
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
                <dt class="text-sm font-medium text-gray-500 truncate">Total Items</dt>
                <dd class="text-lg font-medium text-gray-900">{{ summary.totalItems }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const orders = ref([])
const filters = ref({
  dateFrom: '',
  dateTo: ''
})

const summary = ref({
  totalOrders: 0,
  totalRevenue: 0,
  totalItems: 0
})

function formatDate(dateString) {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

async function loadOrders() {
  try {
    const params = new URLSearchParams()
    if (filters.value.dateFrom) params.append('dateFrom', filters.value.dateFrom)
    if (filters.value.dateTo) params.append('dateTo', filters.value.dateTo)
    
    const queryString = params.toString()
    const url = queryString ? `/api/orders?${queryString}` : '/api/orders'
    const data = await $fetch(url)
    orders.value = data || []
    calculateSummary()
  } catch (error) {
    console.error('Failed to load orders:', error)
    orders.value = []
  }
}

function calculateSummary() {
  summary.value.totalOrders = orders.value.length
  summary.value.totalRevenue = orders.value.reduce((sum, order) => {
    return sum + ((order.unit_price || 0) * order.quantity)
  }, 0)
  summary.value.totalItems = orders.value.reduce((sum, order) => sum + order.quantity, 0)
}

function applyFilters() {
  loadOrders()
}

async function deleteOrder(id) {
  if (!confirm('Are you sure you want to delete this order?')) return
  
  try {
    await $fetch(`/api/orders/${id}`, {
      method: 'DELETE'
    })
    await loadOrders()
  } catch (error) {
    console.error('Failed to delete order:', error)
    alert(error.data?.error || 'Failed to delete order')
  }
}

onMounted(() => {
  loadOrders()
})
</script>
