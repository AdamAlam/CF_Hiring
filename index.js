let links = [
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
      links.map(link => `<a href="${link.url}">${link.name}</a>`).join(''),
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
  // return new Response()
  let url = request.url
  if (url.substr(url.length - 5) == 'links') {
    return new Response(JSON.stringify(links), {
      headers: { 'content-type': 'application/json;charset=UTF-8' },
    })
  } else {
    const res = await fetch('https://static-links-page.signalnerve.workers.dev')
    let this_html = new HTMLRewriter()
      .on('div[id="links"]', new LinksTransformer())
      .transform(res)
    this_html = new HTMLRewriter()
      .on("div[id='profile']", new RemoveDisplayNone())
      .transform(this_html)
    this_html = new HTMLRewriter()
      .on("img[id='avatar']", new ImageTransformer())
      .transform(this_html)
    this_html = new HTMLRewriter()
      .on("h1[id='name']", new NameTransformer())
      .transform(this_html)
    return this_html
  }
}
