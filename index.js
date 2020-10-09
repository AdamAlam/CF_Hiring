const links = [
  {
    name: 'Google',
    url: 'https://www.google.com',
  },
  {
    name: 'Twitch',
    url: 'https://www.twitch.tv',
  },
  {
    name: 'Github',
    url: 'https://www.github.com',
  },
]

class LinksTransformer {
  constructor(links) {
    this.links = links
  }

  async element(element) {
    element.setInnerContent(
      this.links.map(link => `<a href="${link.url}">${link.name}</a>`).join(''),
      { html: true },
    )
  }
}

class ImageTransformer {
  async element(element) {
    element.setAttribute(
      'src',
      'https://media.discordapp.net/attachments/405844066958442496/764017334523920384/IMG_3811.jpg',
    )
  }
}

class NameTransformer {
  async element(element) {
    element.setInnerContent('Adam Alam')
  }
}

class RemoveDisplayNone {
  async element(element) {
    element.removeAttribute('style')
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */

async function handleRequest(request) {
  let url = new URL(request.url)
  let path = url.pathname
  if (path === '/links' || path === '/links/') {
    return new Response(JSON.stringify(links), {
      headers: { 'content-type': 'application/json;charset=UTF-8' },
    })
  } else {
    try {
      const res = await fetch(
        'https://static-links-page.signalnerve.workers.dev',
      )
      return new HTMLRewriter()
        .on('div[id="links"]', new LinksTransformer(links))
        .on("div[id='profile']", new RemoveDisplayNone())
        .on("img[id='avatar']", new ImageTransformer())
        .on("h1[id='name']", new NameTransformer())
        .transform(res)
    } catch (err) {
      throw err
    }
  }
}
