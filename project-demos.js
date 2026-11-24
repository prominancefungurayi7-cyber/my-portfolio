const projectDemoDialog = document.querySelector('#project-demo');
const projectDemoTitle = projectDemoDialog.querySelector('h2');
const projectDemoVideo = projectDemoDialog.querySelector('video');

document.querySelectorAll('.project-card[data-demo]').forEach(card => {
  const title = card.querySelector('h3').textContent.trim();
  let links = card.querySelector('.project-links');
  if (!links) {
    links = document.createElement('div');
    links.className = 'project-links';
    card.querySelector('.project-body').append(links);
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'project-link';
  button.setAttribute('aria-label', 'Watch demo of ' + title);
  button.setAttribute('aria-haspopup', 'dialog');
  button.innerHTML = '<i class="fas fa-circle-play" aria-hidden="true"></i> Watch Demo';
  button.addEventListener('click', () => {
    projectDemoTitle.textContent = title + ' demo';
    projectDemoVideo.src = card.dataset.demo;
    projectDemoDialog.showModal();
  });
  links.append(button);
});

projectDemoDialog.addEventListener('close', () => {
  projectDemoVideo.pause();
  projectDemoVideo.removeAttribute('src');
  projectDemoVideo.load();
});
