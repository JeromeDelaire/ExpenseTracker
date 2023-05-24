<template>
  <div class="historic-bloc-container">
    <div class="historic-bloc-header">
      <h1>Revenues</h1>
      {{ balances }}
      <div>
        <button type="button" @click="balancesChartStore.displayedYear--" :disabled="!balancesChartStore.hasPreviousYear">&lt;&lt; {{ balancesChartStore.displayedYear - 1 }}</button>
        <button type="button" @click="balancesChartStore.displayedYear++" :disabled="!balancesChartStore.hasNextYear">{{ balancesChartStore.displayedYear + 1 }} >></button>
      </div>
    </div>
    <div class="historic-bar-container">
      <Bar class="historic-bar" id="my-chart-id" :options="chartOptions" :data="chartData" />
    </div>
  </div>
</template>

<script setup>
import { useBalancesChartStore } from '../stores/balancesChart'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { computed } from 'vue'

const balancesChartStore = useBalancesChartStore()
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const chartData = computed(() => {
  var balancesMap = balancesChartStore.balances
  var labels = []
  var balancesArray = []
  var backgroundArray = []
  var borderArray = []

  balancesMap.forEach(function (value, key) {
    labels.push(key)
    balancesArray.push(value)
    if (value > 0) {
      backgroundArray.push('#00800020')
      borderArray.push('#008000')
    } else {
      backgroundArray.push('#ff000020')
      borderArray.push('#ff000020')
    }
  })

  return {
    labels: labels,
    datasets: [
      {
        data: balancesArray,
        backgroundColor: backgroundArray,
        borderColor: borderArray,
        borderWidth: 1,
        maxBarThickness: '20',
        borderRadius: 10
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: {
        display: false
      }
    }
  },
  plugins: {
    legend: {
      display: false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../css/custom.scss';

.historic-bloc-container {
  display: flex;
  flex-direction: column;
  background-color: white;
  width: 100%;
  height: 100%;
  align-items: center;
  border-radius: 20px;
}

.historic-bloc-header {
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 20px;
  justify-content: space-between;
}

.range-text {
  color: gray;
}

.historic-bar-container {
  width: 100%;
  padding: 0px 20px;
  height: 100%;
}

@media only screen and (min-width: 1024px) {
  h1 {
    font-size: 30px;
    font-weight: 700;
  }
}

@media only screen and (max-width: 1024px) {
  h1 {
    font-size: 20px;
    font-weight: 700;
  }
}
</style>
