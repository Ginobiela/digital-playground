import './style.css'
import { projects, contact } from './content.js'

for (const [i, project] of projects.entries()) {
  const card = document.createElement('article')
  card.innerHTML = `<div class="art ${project.art}" aria-hidden="true"><small>EST. / 0${i + 1}</small><i></i></div><div class="copy"><small>${project.category}</small><h3></h3><p></p></div>`
  const title = card.querySelector('h3')
  if (project.url) {
    const link = document.createElement('a')
    link.href = project.url
    link.textContent = project.title + ' ↗'
    title.append(link)
  } else title.textContent = project.title
  card.querySelector('p').textContent = project.description
  document.querySelector('#cards').append(card)
}
for (const [label, url] of [['GitHub', contact.github], ['Correo', contact.email && 'mailto:' + contact.email]]) {
  if (!url) continue
  const link = document.createElement('a')
  link.href = url
  link.textContent = label + ' ↗'
  document.querySelector('#links').append(link)
}
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add('appear')
      observer.unobserve(entry.target)
    }
  })
  document.querySelectorAll('#proyectos, .notes').forEach(section => observer.observe(section))
}
import('./scene.js').then(({ startScene }) => startScene(document.querySelector('#escena')))
