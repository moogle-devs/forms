const $ = (q) => document.querySelector(q);
let formIndex = 0;

class Question {
  constructor() {
    this.question = "Question";
    this.required = false;
    this.init();
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
  init() {
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

function addQuestion() {
  form.add(new MultipleChoiceQuestion());
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
