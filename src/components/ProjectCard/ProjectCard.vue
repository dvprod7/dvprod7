<template>
  <div class="relative bg-black/40 text-white p-4 rounded-lg">
    <img :src="project.image" alt="" class="absolute inset-0 w-full h-full object-cover opacity-50 rounded-lg z-0" />
    <div class="relative z-10">
      <h3 class="text-lg font-bold">{{ project.title }}</h3>
      <div class="flex gap-2 my-2">
        <span v-for="(tag, i) in project.tags" :key="i" class="bg-yellow-400 text-black text-xs px-2 py-1 rounded">
          {{ tag }}
        </span>
      </div>
      <p class="text-sm mb-4">{{ project.description }}</p>
      <div style="display: flex;flex-direction: column;">
        <button @click="viewProject" class="ui-btn">View Project</button>
        <a :href="project.codeUrl" class="ui-btn">View Code</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { defineProps } from 'vue'

const props = defineProps({
  project: {
    type: Object,
    required: true
  }
})

const router = useRouter()

function viewProject() {
  console.log('Clic en proyecto:', props.project.id) // 👈🏼 DEBUG
  router.push(`/project/${props.project.id}`)
}
</script>