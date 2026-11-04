import { defineConfig } from 'vite'

const [owner, repo] = (process.env.GITHUB_REPOSITORY || '').split('/')
const rootSite = repo?.toLowerCase() === owner.toLowerCase() + '.github.io'
export default defineConfig({ base: repo && !rootSite ? '/' + repo + '/' : '/' })
