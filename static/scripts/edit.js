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
    this.required = !this.required;
  }
  toJSON() {
    return {
      type: "Question",
      question: this.question,
      required: this.required
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
    return {
      type: "MultipleChoiceQuestion",
      question: this.question,
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
        <button onclick="saveShortAnswer(${id});">Save Question</button>
      </section>
    `;
  }
  toJSON() {
    return {
      type: "ShortAnswerQuestion",
      question: this.question
    }
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
        <button onclick="saveParagraphQuestion(${id});">Save Question</button>
      </section>
    `;
  }
  toJSON() {
    return {
      type: "ParagraphQuestion",
      question: this.question
    }
  }
}

class DropdownQuestion extends MultipleChoiceQuestion {
  constructor() {
    super();
  }
  toHTML(id) {
    let lis = "";
    for (let i = 0; i < this.options.length; i++) {
      lis += `<li class="multi-q-option"><span class="material-symbols-outlined">arrow_drop_down</span><span contenteditable id="multi-q-${id}-option-${i}">${this.options[i]}</span></li>`;
    }
    return `
      <section class="MultipleChoiceQuestion" id="MultipleChoiceQuestion-${id}">
        <h2 contenteditable class="q-heading" id="mcq-heading-${id}">${this.question}</h2>
        <ul class="multi-q-options" id="multi-q-${id}-options">${lis}</ul>
        <button class="save-data" onclick="saveMultipleChoiceQuestion(${id}, ${this.options.length});">Save Question</button>
      </section>
    `;
  }
  toJSON() {
    return {
      type: "DropdownQuestion",
      question: this.question,
      options: this.options
    }
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
    case "Text":
      addition = new Text();
      break;
    case "Image":
      addition = new Image();
      break;
    case "DropdownQuestion":
      addition = new DropdownQuestion();
      break;
    default: // Error!
      window.location.replace(`https://m00gle.repl.co/error?err=Invalid%20%23q-dropdown%20value%3A%20${ctype}&app=forms`)
      break;
  }
  form.add(addition);
  $("#content").innerHTML += form.get(formIndex).toHTML(formIndex);
  formIndex++;
}

function getJSONData() {
  $("#json").innerText = JSON.stringify(form.toJSON());
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
  i.edit($(`#img-url-${id}`).value);
  $(`#img-cont-${id}`).setAttribute("src", $(`#img-url-${id}`).value);
}

function saveTextData(id) {
  let t = form.get(id); // Nice, right?
  t.editTitle($(`#txt-title-${id}`).innerText);
  t.editDescription($(`#txt-desc-${id}`).innerText);
}

function saveShortAnswer(id) {
  let q = form.get(id);
  q.editQuestion($(`#saq-heading-${id}`).innerText);
}

function saveParagraphQuestion(id) {
  let q = form.get(id);
  q.editQuestion($(`#pgq-heading-${id}`).innerText);
}
