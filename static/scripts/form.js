const $ = (q) => document.querySelector(q);

class FormContent {
  constructor() {
    // empty
  }
}

class Question extends FormContent {
  constructor(question) {
    super();
    this.question = question;
    this.required = false;
  }
}

class MultipleChoiceQuestion extends Question {
  constructor(question, options) {
    super(question);
    this.options = options;
  }
  toHTML(id) {
    let lis = "";
    for (let i = 0; i < this.options.length; i++) {
      lis += `<li contenteditable class="multi-q-option" id="multi-q-${id}-option-${i}">${this.options[i]}</li>`;
    }
    return `
      <section class="MultipleChoiceQuestion" id="MultipleChoiceQuestion-${id}">
        <h2 contenteditable class="q-heading" id="mcq-heading-${id}">${this.question}</h2>
        <ul class="multi-q-options" id="multi-q-${id}-options">${lis}</ul>
        <button class="save-data" onclick="saveMultipleChoiceQuestion(${id}, ${this.options.length});">Save Question</button>
      </section>
    `;
  }
  editOption(index, option) {
    this.options[index] = option;
  }
}

class ShortAnswerQuestion extends Question {
  constructor() {
    super();
  }
  toHTML(id) {
    return `
      <section class="ShortAnswerQuestion" id="ShortAnswerQuestion-${id}">
        <h2 contenteditable class="q-heading" id="saq-heading-${id}">${this.question}</h2>
        <input disabled placeholder="Short answer text" />
      </section>
    `;
  }
}

class ParagraphQuestion extends ShortAnswerQuestion {
  constructor() {
    super();
  }
  toHTML(id) {
    return `
      <section class="ParagraphQuestion" id="ParagraphQuestion-${id}">
        <h2 contenteditable class="q-heading" id="pgq-heading-${id}">${this.question}</h2>
        <input disabled placeholder="Long answer text" />
      </section>
    `;
  }
}

class Image extends FormContent {
  constructor() {
    super();
    this.url = "";
    this.alt = "Failed to load image";
  }
  toHTML(id) {
    return `
      <section class="Image" id="Image-${id}">
        <img src="${this.url}" alt="${this.alt}" id="img-cont-${id}"/>
        <input placeholder="Image URL" id="img-url-${id}" value="${this.url}" />
        <button onclick="saveImage(${id})">Save Image</button>
      </section>
    `;
  }
  edit(url) {
    this.url = url;
  }
  toJSON() {
    return {
      type: "Image",
      url: this.url,
      alt: this.alt
    }
  }
}

class Text extends FormContent {
  constructor() {
    super();
    this.title = "Untitled";
    this.description = "";
  }
  editTitle(title) {
    this.title = title;
  }
  editDescription(description) {
    this.description = description;
  }
  toJSON() {
    return {
      type: "Text",
      title: this.title,
      description: this.description
    }
  }
  toHTML(id) {
    return `
      <section class="Text" id="Text-${id}">
        <h2 class="txt-title" id="txt-title-${id}" contenteditable>${this.title}</h2>
        <input class="txt-desc" id="txt-desc-${id}" />
        <button class="save-data" onclick="saveTextData(${id});">Save Content</button>
      </section>
    `;
  }
}

class Form {
  constructor(title) {
    this.title = title;
    this.description = "";
    this.content = [];
  }
  editTitle(title) {
    this.title = title;
  }
  editDescription(description) {
    this.description = description;
  }
  add(data) {
    this.content.push(data);
  }
  get(index) {
    return this.content[index];
  }
  toJSON() {
    let jsonData = {
      title: this.title,
      description: this.description,
      content: []
    }
    for (let i = 0; i < this.content.length; i++) {
      jsonData.content.push(this.content[i].toJSON());
    }
    return jsonData;
  }
}

function parseJSON(json) {
  json = JSON.parse(json);
}
