export class Emojis {
  constructor(name, images) {
    this.name = name;
    this.images = images;
  }

  getImagePath(key) {
    return `./img/${this.name}/${this.images[key]}`;
  }

  static empty() {
    return new Emojis('', {});
  }
}

export class EmojisCache {
  constructor() {
    this.cache = {};
  }

  async get(name) {
    if (name in this.cache) {
      return this.cache[name];
    }
    return await fetch(`./img/${name}/setting.json`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Emoji set "${name}" is not found`);
        }
        return res.json();
      })
      .then(json => {
        this.cache[name] = new Emojis(name, json);
        return this.cache[name];
      })
      .catch(() => Emojis.empty());
  }
}

export class StyleSelector {
  constructor(type) {
    this.type = type;
    this.elem = document.getElementById(`${type}-style`);
    this.current = '';
    this.styles = {};
  }

  async fetch(name) {
    const url = `./css/${this.type}/${name}.css`;
    return await fetch(url)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Style for ${this.type} "${name}" not found`);
        }
        return res.text();
      })
      .then(text => {
        this.styles[name] = text;
        return true;
      })
      .catch(() => false);
  }

  async select(name) {
    if (name === this.current) {
      return true;
    }
    if (name in this.styles === false && await this.fetch(name) === false) {
      return false;
    }

    this.elem.textContent = this.styles[name];
    this.current = name;
    return true;
  }
}

export class Page {
  constructor() {
    this.elem = document.createElement('div');
    this.elem.classList.add('markdown-body');
    this.file = 'a';
    this.markdown = '';
    this.emojis = Emojis.empty();
  }
}
