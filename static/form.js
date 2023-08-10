const $ = (q) => document.querySelector(q);
let formIndex = 0;

class FormContent {
  constructor() {
    // empty
  }
}

class Question extends FormContent {
  constructor() {
    super();
    this.question = "Question";
    this.required = false;
  }
  editQuestion(question) {
    this.question = question;
  }
  toggleRequired() {
    if(this.required) {
      this.required = false;
    }
    else {
      this.required = true;
    }
  }
}

class MultipleChoiceQuestion extends Question {
  constructor() {
    super();
    this.options = ["Option 1"];
  }
  editOption(id, optTxt) {
    this.options[id] = optTxt;
  }
  addOption() {
    this.options.push("New Option");
  }
  removeLastOption() {
    this.options.pop();
  }
  toJSON() {
    let jsonData = {
      type: "MultipleChoiceQuestion",
      required: this.required,
      options: this.options
    }
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

let form = new Form("Untitled form");

function saveFormData() {
  form.editTitle($("#form-title").innerText);
  form.editDescription($("#form-desc").innerText);
}

function addContent() {
  let ctype = $("#q-dropdown").value;
  let addition = null;
  switch(ctype) {
    case "MultipleChoiceQuestion":
      addition = new MultipleChoiceQuestion();
      break;
    case "ShortAnswerQuestion":
      addition = new ShortAnswerQuestion();
      break;
    case "ParagraphQuestion":
      addition = new ParagraphQuestion();
      break;
    case "Image":
      addition = new Image();
      break;
    default: // Error!
      window.location.replace(`https://m00gle.repl.co/error?err=Invalid%20%23q-dropdown%20value%3A%20${ctype}&app=forms`)
      break;
  }
  form.add(addition);
  $("#content").innerHTML += form.get(formIndex).toHTML(formIndex);
  formIndex++;
}

// Save functions

function saveMultipleChoiceQuestion(id, optAmt) {
  let q = form.get(id);
  q.editQuestion($(`#mcq-heading-${id}`).innerText);
  if (optAmt > q.options.length) { // Sync q.options.length & optAmt
    let dif = q.options.length - optAmt;
    for (let i = 1; i <= dif; i++) {
      q.addOption();
    }
  } else if (optAmt < q.options.length) {
    let dif = optAmt - q.options.length;
    for (let i = 1; i <= dif; i++) {
      q.removeLastOption();
    }
  }
  for (let i = 0; i < optAmt; i++) {
    q.editOption(i, $(`#multi-q-${id}-option-${i}`).innerText)
  }
}

function saveImage(id) {
  let i = form.get(id);
  i.edit($(`#img-url-${id}`).innerText);
  $(`#img-cont-${id}`).src = $(`#img-url-${id}`).innerText;
}
